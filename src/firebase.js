import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBEHF2KXWerPVcXq772W91ltlrJaW8yijU",
  authDomain: "momolivechat.firebaseapp.com",
  projectId: "momolivechat",
  storageBucket: "momolivechat.appspot.com",
  messagingSenderId: "304227167530",
  appId: "1:304227167530:web:5cabf447aa5622d5b48253",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
