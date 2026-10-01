// منوی موبایل
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('mobile-menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// تغییر تم روشن/تاریک
const root = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
try {
  const saved = localStorage.getItem('nemav-theme');
  if (saved) root.setAttribute('data-theme', saved);
} catch (e) {}
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    if (next === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
    try { localStorage.setItem('nemav-theme', next); } catch (e) {}
  });
}

// سال شمسی خودکار در فوتر
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Intl.DateTimeFormat('fa-IR', { year: 'numeric' }).format(new Date());