import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// ==========================
// AUTH STATE OBSERVER
// ==========================
// Automatically redirects users if they are already logged in
onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  if (user) {
    if (path.includes("register.html") || path.includes("login.html")) {
      window.location.href = "analyze.html";
    }
  }
});

// ==========================
// REGISTER FUNCTION
// ==========================
window.doRegister = async function () {
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm').value;

  if (!email || password.length < 6 || password !== confirm) {
    alert("Please ensure email is valid, passwords match and are at least 6 characters.");
    return;
  }

  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    // Save additional user info to Firestore
    await setDoc(doc(db, "users", res.user.uid), {
      fullName: firstName + " " + lastName,
      email: email,
      createdAt: new Date()
    });

    alert("Registration successful!");
    window.location.href = "analyze.html";

  } catch (error) {
    alert("Registration Error: " + error.message);
  }
};

// ==========================
// LOGIN FUNCTION
// ==========================
window.doLogin = async function () {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "analyze.html";
  } catch (error) {
    let msg = "Login failed.";
    if (error.code === 'auth/invalid-credential') {
      msg = "Invalid email or password.";
    }
    alert("Login Error: " + msg);
  }
};

// ==========================
// GOOGLE LOGIN
// ==========================
window.doGoogleLogin = async function () {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    window.location.href = "analyze.html";
  } catch (error) {
    alert("Google Login Error: " + error.message);
  }
};

// ==========================
// LOGOUT
// ==========================
window.doLogout = async function () {
  try {
    await signOut(auth);
    window.location.href = "login.html";
  } catch (error) {
    console.error("Logout Error:", error);
  }
};

// ==========================
// UI HELPERS (PASSWORD TOGGLE)
// ==========================
window.togglePw = (id, btn) => {
  const inp = document.getElementById(id);
  if (inp) {
    inp.type = inp.type === 'password' ? 'text' : 'password';
    btn.style.opacity = inp.type === 'text' ? '1' : '0.5';
  }
};
