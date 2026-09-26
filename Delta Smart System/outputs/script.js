(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('open');
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 12);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('is-visible'));

  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#form-status');
  form.addEventListener('submit', event => {
    event.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      const label = field.closest('label');
      const error = label.querySelector('.field-error');
      let message = '';
      if (!field.value.trim()) message = 'Please complete this field.';
      else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) message = 'Enter a valid email address.';
      error.textContent = message;
      label.classList.toggle('has-error', Boolean(message));
      field.setAttribute('aria-invalid', String(Boolean(message)));
      if (message) valid = false;
    });
    if (!valid) {
      status.textContent = 'Please review the required fields above.';
      status.classList.remove('form-success');
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }
    status.textContent = 'Your details are valid. Connect an email service or backend to enable delivery.';
    status.classList.add('form-success');
  });
  form.querySelectorAll('input,textarea').forEach(field => field.addEventListener('input', () => {
    const error = field.closest('label').querySelector('.field-error');
    if (error && field.value.trim()) { error.textContent = ''; field.closest('label').classList.remove('has-error'); field.setAttribute('aria-invalid', 'false'); }
  }));
})();
