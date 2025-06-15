import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './Firebase'; // Capital F
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // 👈 Mobile menu toggle
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
    <nav className="bg-blue-600 p-4 text-white">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="text-lg font-bold">
          Expense Tracker
        </Link>

        {/* Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden sm:flex gap-4 items-center">
          {user && <Link to="/">Dashboard</Link>}
          {user && <Link to="/add-expense">Add Expense</Link>}
          {!user && <Link to="/login">Login</Link>}
          {user && (
            <button onClick={handleLogout} className="hover:underline">
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="sm:hidden mt-2 px-4 space-y-2">
          {user && (
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block"
            >
              Dashboard
            </Link>
          )}
          {user && (
            <Link
              to="/add-expense"
              onClick={() => setIsOpen(false)}
              className="block"
            >
              Add Expense
            </Link>
          )}
          {!user && (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block"
            >
              Login
            </Link>
          )}
          {user && (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="block w-full text-left hover:underline"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
