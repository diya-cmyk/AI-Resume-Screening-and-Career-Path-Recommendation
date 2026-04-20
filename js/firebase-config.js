import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCjgjnLpPmq4qLNjltGpwXJXDxAaOl92ps",
  authDomain: "ai-resume-screen-13644.firebaseapp.com",
  projectId: "ai-resume-screen-13644",
  storageBucket: "ai-resume-screen-13644.firebasestorage.app",
  messagingSenderId: "504519693008",
  appId: "1:504519693008:web:e93f2534c972b0970584d5",
  measurementId: "G-RXZ3W69SNP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);