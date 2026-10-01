// ===== ماژول منوی موبایل =====
(function() {
  'use strict';
  
  document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.getElementById('mobile-menu');
    
    if (!toggle || !menu) return;
    
    const setMenu = (open) => {
      menu.classList.toggle('open', open);
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    
    toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
    
    document.addEventListener('click', (e) => {
      if (!menu.classList.contains('open')) return;
      if (menu.contains(e.target) || toggle.contains(e.target)) return;
      setMenu(false);
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false);
    });
    
    menu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => setMenu(false));
    });
  });
})();

// ===== ماژول تغییر تم =====
(function() {
  'use strict';
  
  document.addEventListener('DOMContentLoaded', function() {
    const root = document.documentElement;
    const themeBtn = document.getElementById('theme-toggle');
    
    try {
      const saved = localStorage.getItem('nemav-theme');
      if (saved) root.setAttribute('data-theme', saved);
    } catch (e) {}
    
    if (!themeBtn) return;
    
    themeBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      if (next === 'light') root.setAttribute('data-theme', 'light');
      else root.removeAttribute('data-theme');
      try { localStorage.setItem('nemav-theme', next); } catch (e) {}
    });
  });
})();

// ===== ماژول dropdown اختصاصی =====
(function() {
  'use strict';
  
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.custom-select').forEach((cs) => {
      const trigger = cs.querySelector('.cs-trigger');
      const dropdown = cs.querySelector('.cs-dropdown');
      const options = cs.querySelectorAll('.cs-option');
      const hidden = cs.querySelector('input[type=hidden]');
      const label = cs.querySelector('.cs-label');
      
      if (!trigger || !dropdown || !hidden || !label) return;
      
      let focusIdx = -1;
      
      const open = () => {
        trigger.classList.add('open');
        dropdown.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        focusIdx = -1;
      };
      
      const close = () => {
        trigger.classList.remove('open');
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      };
      
      const select = (opt) => {
        options.forEach(o => {
          o.classList.remove('selected');
          o.removeAttribute('aria-selected');
        });
        opt.classList.add('selected');
        opt.setAttribute('aria-selected', 'true');
        label.textContent = opt.textContent;
        hidden.value = opt.dataset.value;
        close();
        trigger.focus();
      };
      
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.contains('open') ? close() : open();
      });
      
      options.forEach(opt => {
        opt.addEventListener('click', (e) => {
          e.stopPropagation();
          select(opt);
        });
      });
      
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          dropdown.classList.contains('open') ? close() : open();
        }
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (!dropdown.classList.contains('open')) open();
          focusIdx = Math.min(focusIdx + 1, options.length - 1);
          options.forEach((o, i) => o.classList.toggle('focused', i === focusIdx));
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          focusIdx = Math.max(focusIdx - 1, 0);
          options.forEach((o, i) => o.classList.toggle('focused', i === focusIdx));
        }
        if (e.key === 'Enter' && focusIdx >= 0) select(options[focusIdx]);
      });
      
      document.addEventListener('click', (e) => {
        if (!cs.contains(e.target)) close();
      });
    });
  });
})();

// ===== ماژول فرم تماس =====
(function() {
  'use strict';
  
  document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    const successBox = document.getElementById('form-success');
    const submitBtn = document.getElementById('contact-submit');
    const csrf = contactForm.querySelector('[name=csrfmiddlewaretoken]').value;
    
    const setError = (field, msg) => {
      const el = contactForm.querySelector(`[data-error-for="${field}"]`);
      if (el) el.textContent = msg || '';
    };
    
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      ['name', 'phone', 'message', 'project_type'].forEach(f => setError(f, ''));
      submitBtn.disabled = true;
      
      try {
        const res = await fetch('/api/contact/', {
          method: 'POST',
          headers: { 'X-CSRFToken': csrf },
          body: new FormData(contactForm),
        });
        const data = await res.json();
        
        if (res.ok && data.ok) {
          contactForm.style.display = 'none';
          successBox.classList.add('show');
        } else if (res.status === 429) {
          setError('name', data.error || 'تعداد درخواست‌ها زیاد است؛ کمی صبر کنید.');
        } else if (data.errors) {
          Object.entries(data.errors).forEach(([k, v]) => setError(k, Array.isArray(v) ? v[0] : v));
        }
      } catch (err) {
        setError('name', 'ارتباط برقرار نشد؛ دوباره تلاش کنید.');
      } finally {
        submitBtn.disabled = false;
      }
    });
    
    const sendAgainBtn = document.getElementById('send-again');
    if (sendAgainBtn) {
      sendAgainBtn.addEventListener('click', () => {
        successBox.classList.remove('show');
        contactForm.style.display = '';
        contactForm.reset();
      });
    }
  });
})();

// ===== ماژول سال شمسی خودکار =====
(function() {
  'use strict';
  
  document.addEventListener('DOMContentLoaded', function() {
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Intl.DateTimeFormat('fa-IR', { year: 'numeric' }).format(new Date());
  });
})();