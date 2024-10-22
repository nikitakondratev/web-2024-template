import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaNdPrtYYZO3Mo9gmNTQFwqI8fSdn-jKTuWA",
    authDomain: "your-app-43gh9.firebaseapp.com",
    projectId: "your-app-43gh9",
    storageBucket: "your-app-43gh9.appspot.com",
    messagingSenderId: "783999999999",
    appId: "1:783553619737:web:dff6fce9589deaf34",
    measurementId: "G-JL7GNDPV6V"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
