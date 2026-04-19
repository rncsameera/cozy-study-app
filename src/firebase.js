import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCaW3nkK0vxc9Tc4ILAf0efs-cjJlkl8o8",
  authDomain: "focusdiva-514a6.firebaseapp.com",
  projectId: "focusdiva-514a6",
  storageBucket: "focusdiva-514a6.firebasestorage.app",
  messagingSenderId: "183581089247",
  appId: "1:183581089247:web:da463e68631d2b9ff9f86a"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)