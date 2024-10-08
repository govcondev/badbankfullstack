import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBzr3gdv0ARK7YIpigzOYHeRakjziYQfos",
    authDomain: "cd ",
    projectId: "bad-bank-600d5",
    storageBucket: "bad-bank-600d5.appspot.com",
    messagingSenderId: "254755495979",
    appId: "1:254755495979:web:745af128fea9e651d18a6e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("Firebase initialized successfully:", app);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);
console.log("Firebase Auth object:", auth);