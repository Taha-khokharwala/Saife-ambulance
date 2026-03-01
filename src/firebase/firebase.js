// firebase.js

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyClg2x3gpUvBoL5112-a1iZmFESPAzJVLk",
  authDomain: "fir-82731.firebaseapp.com",
  projectId: "fir-82731",
  storageBucket: "fir-82731.firebasestorage.app",
  messagingSenderId: "129523832521",
  appId: "1:129523832521:web:cd732aea5231c176fb1f18",
  measurementId: "G-9N6SN2F8LX",
  databaseURL: "https://fir-82731-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);

// ✅ Initialize Realtime Database
const database = getDatabase(app);

export { database };