import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../components/Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user) return;

      try {
        const q = query(collection(db, 'expenses'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        const fetchedExpenses = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setExpenses(fetchedExpenses);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchExpenses();
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Your Expenses</h2>
      <ul className="space-y-3">
        {expenses.map((exp) => (
          <li key={exp.id} className="bg-white p-4 rounded shadow-md flex justify-between">
            <span>{exp.title}</span>
            <span className="text-gray-600">₹{exp.amount} on {exp.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
