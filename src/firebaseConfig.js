import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// 1. AJOUT : On importe l'outil pour la base de données
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyD7uyAlx7XptcYR-UPkeL-UXxr4F9Onn4c",
    authDomain: "mini-projet-d0d8c.firebaseapp.com",
    databaseURL: "https://mini-projet-d0d8c-default-rtdb.firebaseio.com",
    projectId: "mini-projet-d0d8c",
    storageBucket: "mini-projet-d0d8c.firebasestorage.app",
    messagingSenderId: "305706004595",
    appId: "1:305706004595:web:6ac85e2bdcdfe3c0c33a06",
    measurementId: "G-WT5MTRT9PY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getDatabase(app);