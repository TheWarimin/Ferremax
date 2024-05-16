import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADQUqNNm5nfhOwO8D0xx2cpXEsb9VUFOk",
  authDomain: "ferremax-3ee9e.firebaseapp.com",
  projectId: "ferremax-3ee9e",
  storageBucket: "ferremax-3ee9e.appspot.com",
  messagingSenderId: "61256704702",
  appId: "1:61256704702:web:b31d6e508508898d8df4ef",
  measurementId: "G-HX0E3QTCJJ"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);