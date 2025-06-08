import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../components/Firebase';

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user) return;

      const q = query(
        collection(db, 'expenses'),
        where('userId', '==', user.uid)
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setExpenses(data);
    };

    fetchExpenses();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <ul className="space-y-2">
        {expenses.map(exp => (
          <li key={exp.id} className="bg-white shadow rounded p-4">
            <div className="flex justify-between">
              <span className="font-medium">{exp.title}</span>
              <span>₹{exp.amount}</span>
            </div>
            <div className="text-sm text-gray-500">{exp.date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
