// firebase/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDbuPjcSZ8LLWTIpJjbaAA6qCvIADl0QcY",
  authDomain: "virtualfittingroom-3e702.firebaseapp.com",
  projectId: "virtualfittingroom-3e702",
  storageBucket: "virtualfittingroom-3e702.appspot.com", // ✅ corrected
  messagingSenderId: "981238327479",
  appId: "1:981238327479:web:d3de923c7ba232a43c8532"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

