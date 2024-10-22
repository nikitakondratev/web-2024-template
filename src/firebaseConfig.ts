import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

    apiKey: "AIzaSyAtlzXzPSd4A1Bd8-vie4OyXQgJX4Y8t24",
  
    authDomain: "nikita-s-project.firebaseapp.com",
  
    projectId: "nikita-s-project",
  
    storageBucket: "nikita-s-project.appspot.com",
  
    messagingSenderId: "920629962356",
  
    appId: "1:920629962356:web:aaa713335d32c15cd9d321",
  
    measurementId: "G-4GPGWP61FZ"
  
  };
  

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
