// ==========================
// CONFIGURATION
// ==========================
const API_BASE_URL = 'https://resume-backend-q39r.onrender.com/api';

// ==========================
// AUTH STATE CHECKER
// ==========================
// Replaces onAuthStateChanged. Checks localStorage for a JWT token.
function checkAuthState() {
    const token = localStorage.getItem('cl_token');
    const user = JSON.parse(localStorage.getItem('cl_user'));
    const path = window.location.pathname;

    if (token && user) {
        // If logged in and trying to access login/register, go to analyze
        if (path.includes("register.html") || path.includes("login.html")) {
            window.location.href = getBasePath() + "pages/analyze.html";
        }
    } else {
        // If not logged in and trying to access protected pages
        const protectedPages = ["analyze.html", "history.html", "roadmap.html", "skills.html"];
        if (protectedPages.some(p => path.includes(p))) {
            window.location.href = getBasePath() + "pages/login.html";
        }
    }
    return user;
}

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
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: `${firstName} ${lastName}`,
                email: email,
                password: password
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Registration successful!");
            // Store token and user info
            localStorage.setItem('cl_token', result.token);
            localStorage.setItem('cl_user', JSON.stringify(result.user));
            window.location.href = "analyze.html";
        } else {
            throw new Error(result.error || "Registration failed");
        }
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
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            // Save JWT and User Data to localStorage
            localStorage.setItem('cl_token', result.token);
            localStorage.setItem('cl_user', JSON.stringify(result.user));
            window.location.href = "analyze.html";
        } else {
            throw new Error(result.error || "Invalid email or password");
        }
    } catch (error) {
        alert("Login Error: " + error.message);
    }
};

// ==========================
// LOGOUT
// ==========================
window.doLogout = function () {
    localStorage.removeItem('cl_token');
    localStorage.removeItem('cl_user');
    localStorage.removeItem('cl_analysis');
    window.location.href = getBasePath() + "pages/login.html";
};

// Initialize UI
const currentUser = checkAuthState();
document.addEventListener('DOMContentLoaded', () => {
    // Only init navbar if placeholder exists
    if(document.getElementById('navbarPlaceholder')) {
        initNavbar(getCurrentPageName(), currentUser);
    }
    
    // Add logout listener to avatar if present
    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn) logoutBtn.onclick = window.doLogout;
});

function getCurrentPageName() {
    const path = window.location.pathname;
    if (path.includes('analyze')) return 'analyze';
    if (path.includes('history')) return 'history';
    if (path.includes('skills')) return 'skills';
    if (path.includes('roles')) return 'roles';
    if (path.includes('roadmap')) return 'roadmap';
    return 'home';
}