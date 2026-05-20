/* ── CareerLens — Shared Utilities ──────────────────────────── */

/* ── AUTH HELPERS ─── */
const Auth = {
  logout(authService) {
    authService.signOut().then(() => {
      localStorage.removeItem('cl_analysis');
      localStorage.removeItem('cl_selected_role');
      window.location.href = getBasePath() + 'index.html';
    });
  }
};

/* ── PATH HELPER ─── */
function getBasePath() {
  const path = window.location.pathname;
  return path.includes('/pages/') ? '../' : './';
}

/* ── AVATAR COLOR HELPER ─── */
function getAvatarColor(char) {
  const colors = {
    'A': '#f44336', 'B': '#e91e63', 'C': '#9c27b0', 'D': '#673ab7',
    'E': '#3f51b5', 'F': '#2196f3', 'G': '#2E7D32', 'H': '#009688',
    'I': '#00bcd4', 'J': '#009688', 'K': '#4caf50', 'L': '#8bc34a',
    'M': '#cddc39', 'N': '#ffeb3b', 'O': '#ffc107', 'P': '#ff9800',
    'Q': '#ff5722', 'R': '#795548', 'S': '#9e9e9e', 'T': '#607d8b',
    'U': '#000000', 'V': '#558b2f', 'W': '#ad1457', 'X': '#6a1b9a',
    'Y': '#283593', 'Z': '#0277bd'
  };
  return colors[char.toUpperCase()] || '#c8502a'; 
}

/* ── TOAST ─── */
function showToast(msg, type = 'default', duration = 3000) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => { 
    toast.style.opacity = '0'; 
    toast.style.transform = 'translateX(100%)'; 
    toast.style.transition = 'all 0.3s'; 
    setTimeout(() => toast.remove(), 300); 
  }, duration);
}

/* ── NAVBAR INIT ─── */
function initNavbar(activePage, user = null) {
  const base = getBasePath();
  // Ensure we have the user from localStorage if not passed
  const storedUser = JSON.parse(localStorage.getItem('cl_user'));
  const finalUser = user || storedUser;

  let firstChar = 'U';
  let avatarBg = '#c8502a';
  let displayName = 'User';

  if (finalUser) {
    // Backend returns 'name', not 'displayName'
    displayName = finalUser.name || finalUser.email.split('@')[0];
    firstChar = displayName.charAt(0).toUpperCase();
    avatarBg = getAvatarColor(firstChar);
  }

  const navHtml = `
    <nav class="navbar">
      <a class="nav-brand" href="${base}index.html">
        <div class="nav-brand-dot"></div>CareerLens
      </a>
      <div class="nav-links">
        <a class="nav-link ${activePage === 'home' ? 'active' : ''}" href="${base}index.html">Home</a>
        <a class="nav-link ${activePage === 'analyze' ? 'active' : ''}" href="${base}pages/analyze.html">Analyze</a>
        <a class="nav-link ${activePage === 'skills' ? 'active' : ''}" href="${base}pages/skills.html">Skills</a>
        <a class="nav-link ${activePage === 'roles' ? 'active' : ''}" href="${base}pages/roles.html">Roles</a>
        <a class="nav-link ${activePage === 'roadmap' ? 'active' : ''}" href="${base}pages/roadmap.html">Roadmap</a>
        <a class="nav-link ${activePage === 'history' ? 'active' : ''}" href="${base}pages/history.html">History</a>
      </div>
      <div class="nav-right">
        ${user
          ? `<span class="nav-user-name">Hi, ${displayName.split(' ')[0]}</span>
             <div class="nav-avatar" title="Logout" id="logoutBtn" 
                  style="background-color: ${avatarBg}; color: white; cursor: pointer;">
                ${firstChar}
             </div>`
          : `<a class="btn btn-outline" href="${base}pages/login.html">Login</a>
             <a class="btn btn-accent" href="${base}pages/register.html">Sign Up</a>`
        }
      </div>
    </nav>`;

  const placeholder = document.getElementById('navbarPlaceholder');
  if (placeholder) placeholder.outerHTML = navHtml;
}

/* ── ANALYSIS STORE ─── */
const AnalysisStore = {
  save(data) { localStorage.setItem('cl_analysis', JSON.stringify(data)); },
  get() { const d = localStorage.getItem('cl_analysis'); return d ? JSON.parse(d) : null; },
  clear() { localStorage.removeItem('cl_analysis'); },
  setSelectedRole(role) { localStorage.setItem('cl_selected_role', JSON.stringify(role)); },
  getSelectedRole() { const r = localStorage.getItem('cl_selected_role'); return r ? JSON.parse(r) : null; }
};

/* ── SCORE RING HTML ─── */
function scoreRingHTML(score, size, strokeW, color, label) {
  const r = (size / 2) - strokeW;
  const circ = 2 * Math.PI * r;
  const fill = circ * (score / 100);
  const cx = size / 2, cy = size / 2;
  return `<div class="score-ring-wrap" style="width:${size}px;height:${size}px">
      <svg width="${size}" height="${size}"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--bg3)" stroke-width="${strokeW}"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${strokeW}" stroke-dasharray="${fill} ${circ}" stroke-linecap="round" style="transform:rotate(-90deg);transform-origin:center"/></svg>
      <div class="score-ring-inner"><span class="score-ring-num" style="color:${color}">${score}</span>${label ? `<span class="score-ring-lbl">${label}</span>` : ''}</div></div>`;
}
// ===== HISTORY STORAGE =====

// Save analysis result
function saveToHistory(data) {
  let history = JSON.parse(localStorage.getItem("resume_history")) || [];

  history.push({
    id: Date.now(),
    date: new Date().toLocaleString(),
    data: data
  });

  localStorage.setItem("resume_history", JSON.stringify(history));
}

// Get history
function getHistory() {
  return JSON.parse(localStorage.getItem("resume_history")) || [];
}

// Clear history
function clearHistory() {
  localStorage.removeItem("resume_history");
}