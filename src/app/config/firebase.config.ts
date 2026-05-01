// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcICEN8M-4vW-mLi01escKDic2OQTRluk",
  authDomain: "smart-queue-711b6.firebaseapp.com",
  projectId: "smart-queue-711b6",
  storageBucket: "smart-queue-711b6.firebasestorage.app",
  messagingSenderId: "659293796682",
  appId: "1:659293796682:web:c9c4d2445839a1199ce9b3",
  measurementId: "G-PPPFS7PHJB"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);