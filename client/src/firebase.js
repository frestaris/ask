// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ask-mern.firebaseapp.com",
  projectId: "ask-mern",
  storageBucket: "ask-mern.firebasestorage.app",
  messagingSenderId: "1090234608817",
  appId: "1:1090234608817:web:c19d46520f490a4fe8c690",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
