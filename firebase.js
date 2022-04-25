import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Replace the following with your app's Firebase project configuration
const firebaseApp = initializeApp({
    apiKey: "AIzaSyDmW7yR3jOGy6ioPCgq2n4mFTWsnXzywhI",
    authDomain: "test02-143ae.firebaseapp.com",
    //databaseURL: "https://test02-143ae-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "test02-143ae",
    storageBucket: "test02-143ae.appspot.com",
    messagingSenderId: "818328131154",
    appId: "1:818328131154:web:609906a0ea23def7abf18b"
})
export const db = getFirestore();
export const auth = getAuth()