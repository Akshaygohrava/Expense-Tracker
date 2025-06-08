import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

const Navbar = () => {
  const [user] = useAuthState(auth);

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <div className="font-bold text-lg">
        <Link to="/">Expense Tracker</Link>
      </div>
      <div className="space-x-4">
        {user && (
          <>
            <Link to="/add">Add Expense</Link>
            <span>{user.displayName}</span>
            <button onClick={() => auth.signOut()} className="ml-2 underline">Logout</button>
          </>
        )}
        {!user && <Link to="/login">Login</Link>}
      </div>
    </nav>
  );
};

export default Navbar;
