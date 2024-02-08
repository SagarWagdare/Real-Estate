// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-38814.firebaseapp.com",
  projectId: "mern-estate-38814",
  storageBucket: "mern-estate-38814.appspot.com",
  messagingSenderId: "261178221213",
  appId: "1:261178221213:web:be5701c9e4371d5e232a74"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);