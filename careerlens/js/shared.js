/* ── CareerLens — Shared Utilities ──────────────────────────── */

/* ── AUTH ─── */
const Auth = {
  getUsers() {
    return JSON.parse(localStorage.getItem('cl_users') || '[]');
  },
  saveUsers(users) {
    localStorage.setItem('cl_users', JSON.stringify(users));
  },
  register(name, email, password) {
    const users = this.getUsers();
    if (users.find(u => u.email === email)) {
      return { ok: false, msg: 'An account with this email already exists.' };
    }
    const user = { id: Date.now().toString(), name, email, password, createdAt: new Date().toISOString() };
    users.push(user);
    this.saveUsers(users);
    return { ok: true, user };
  },
  login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { ok: false, msg: 'Invalid email or password.' };
    localStorage.setItem('cl_session', JSON.stringify({ id: user.id, name: user.name, email: user.email }));
    return { ok: true, user };
  },
  logout() {
    localStorage.removeItem('cl_session');
    window.location.href = getBasePath() + 'index.html';
  },
  getSession() {
    const s = localStorage.getItem('cl_session');
    return s ? JSON.parse(s) : null;
  },
  requireAuth() {
    if (!this.getSession()) {
      window.location.href = getBasePath() + 'pages/login.html';
      return null;
    }
    return this.getSession();
  }
};

/* ── PATH HELPER ─── */
function getBasePath() {
  const path = window.location.pathname;
  return path.includes('/pages/') ? '../' : './';
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
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; toast.style.transition = 'all 0.3s'; setTimeout(() => toast.remove(), 300); }, duration);
}

/* ── FORM VALIDATION ─── */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function setFieldError(inputId, msgId, msg) {
  const inp = document.getElementById(inputId);
  const err = document.getElementById(msgId);
  if (inp) inp.classList.add('error');
  if (err) { err.textContent = msg; err.classList.add('show'); }
}
function clearFieldError(inputId, msgId) {
  const inp = document.getElementById(inputId);
  const err = document.getElementById(msgId);
  if (inp) inp.classList.remove('error');
  if (err) { err.textContent = ''; err.classList.remove('show'); }
}
function clearAllErrors(ids) {
  ids.forEach(([a, b]) => clearFieldError(a, b));
}

/* ── NAVBAR INIT ─── */
function initNavbar(activePage) {
  const session = Auth.getSession();
  const base = getBasePath();

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
      </div>
      <div class="nav-right">
        ${session
          ? `<span class="nav-user-name">Hi, ${session.name.split(' ')[0]}</span>
             <div class="nav-avatar" title="Logout" onclick="Auth.logout()">${session.name.charAt(0).toUpperCase()}</div>`
          : `<a class="btn btn-outline" href="${base}pages/login.html" style="padding:7px 16px;font-size:13px">Login</a>
             <a class="btn btn-accent" href="${base}pages/register.html" style="padding:7px 16px;font-size:13px">Sign Up</a>`
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
  const fontSize = size < 70 ? 16 : 22;
  return `
    <div class="score-ring-wrap" style="width:${size}px;height:${size}px">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--bg3)" stroke-width="${strokeW}"/>
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}"
          stroke-width="${strokeW}" stroke-dasharray="${fill} ${circ}"
          stroke-linecap="round" style="transform:rotate(-90deg);transform-origin:center"/>
      </svg>
      <div class="score-ring-inner">
        <span class="score-ring-num" style="font-size:${fontSize}px;color:${color}">${score}</span>
        ${label ? `<span class="score-ring-lbl">${label}</span>` : ''}
      </div>
    </div>`;
}
