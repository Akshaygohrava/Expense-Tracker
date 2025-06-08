// src/components/PrivateRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from './firebase';

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(undefined); // use undefined for loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
