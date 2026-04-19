// ===== ROUTER =====
const routes = {
  '/home': renderHome,
  '/workout': renderWorkout,
  '/history': renderHistory,
  '/dashboard': renderDashboard,
  '/profile': renderProfile,
};

function navigate(path) {
  window.location.hash = path;
}

function router() {
  const path = window.location.hash.replace('#', '') || '/home';
  const handler = routes[path] || renderHome;

  document.querySelectorAll('.nav-link, .bottom-nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === path.replace('/', ''));
  });

  handler();
}

// ===== AUTH UI =====
function showAuth() {
  document.getElementById('auth-overlay').classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
}

function showApp() {
  document.getElementById('auth-overlay').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
}

function initAuthForm() {
  let mode = 'login';
  const form = document.getElementById('auth-form');
  const tabs = document.querySelectorAll('.auth-tab');
  const regFields = document.getElementById('register-fields');
  const submitBtn = document.getElementById('auth-submit');
  const errorEl = document.getElementById('auth-error');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      mode = tab.dataset.tab;
      tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === mode));
      regFields.classList.toggle('hidden', mode !== 'register');
      submitBtn.textContent = mode === 'login' ? 'Connexion' : 'Créer un compte';
      errorEl.classList.add('hidden');
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.classList.add('hidden');
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    try {
      submitBtn.textContent = '...';
      submitBtn.disabled = true;
      let data;
      if (mode === 'login') {
        data = await api.auth.login({ email, password });
      } else {
        const username = document.getElementById('auth-username').value;
        data = await api.auth.register({ username, email, password });
      }
      auth.save(data.token, data.user);
      showApp();
      router();
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.remove('hidden');
    } finally {
      submitBtn.textContent = mode === 'login' ? 'Connexion' : 'Créer un compte';
      submitBtn.disabled = false;
    }
  });
}

// ===== TOAST =====
function toast(msg, duration = 2500) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => el.classList.add('hidden'), duration);
}

window.toast = toast;
window.navigate = navigate;

// ===== THEME =====
function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  document.getElementById('theme-toggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

// ===== LOGOUT =====
function initLogout() {
  document.getElementById('logout-btn').addEventListener('click', () => {
    auth.logout();
    showAuth();
  });
}

// ===== AVATAR HELPER =====
function avatarHtml(user, size = 40) {
  if (user.avatar_url) {
    return `<div class="avatar" style="width:${size}px;height:${size}px"><img src="${user.avatar_url}" alt="${user.username}" /></div>`;
  }
  const initials = (user.username || '?')[0].toUpperCase();
  return `<div class="avatar" style="width:${size}px;height:${size}px;font-size:${size * 0.4}px">${initials}</div>`;
}

window.avatarHtml = avatarHtml;

function formatDuration(minutes) {
  if (!minutes) return '–';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${m}min`;
}
window.formatDuration = formatDuration;

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}
window.formatDate = formatDate;

function timeAgo(dateStr) {
  const d = new Date(dateStr);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `il y a ${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `il y a ${days}j`;
  return formatDate(dateStr);
}
window.timeAgo = timeAgo;

// ===== INIT =====
auth.init();
initAuthForm();
initTheme();
initLogout();

if (auth.isLoggedIn()) {
  showApp();
  window.addEventListener('hashchange', router);
  router();
} else {
  showAuth();
  window.addEventListener('hashchange', () => {
    if (auth.isLoggedIn()) { showApp(); router(); }
  });
}
