// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA5jbKY9x8nDsoTc-SohCJCTJony-n7xM4",
  authDomain: "expense-tracker-c1ebc.firebaseapp.com",
  projectId: "expense-tracker-c1ebc",
  storageBucket: "expense-tracker-c1ebc.firebasestorage.app",
  messagingSenderId: "341632837172",
  appId: "1:341632837172:web:10e36c7b7a41027ce70c61",
  measurementId: "G-EP1VMP70MM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };

