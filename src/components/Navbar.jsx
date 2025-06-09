import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './Firebase'; // Capital F
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center text-white">
      <Link to="/" className="text-lg font-bold">
        Expense Tracker
      </Link>
      <div className="flex gap-4 items-center">
        {user && <Link to="/add-expense">Add Expense</Link>} {/* ✅ Route fixed here */}
        {!user && <Link to="/login">Login</Link>}
        {user && (
          <button onClick={handleLogout} className="hover:underline">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
