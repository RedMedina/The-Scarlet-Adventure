import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAq8QR_Nj1whCJG7x3OCIES3rQQPZ-iut4",
  authDomain: "scarletadventure-c1352.firebaseapp.com",
  projectId: "scarletadventure-c1352",
  storageBucket: "scarletadventure-c1352.appspot.com",
  messagingSenderId: "596707749632",
  appId: "1:596707749632:web:afe90d464f3ebf123dcde5",
  measurementId: "G-X59E767PR5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);