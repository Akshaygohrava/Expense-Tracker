import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../components/firebase';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-blue-600">Welcome, {user?.displayName || 'User'}!</h1>
      <button
        onClick={() => {
          auth.signOut();
          navigate('/login');
        }}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
