// Shared small script: year and mobile nav toggle
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile nav toggle
const toggleBtn = document.querySelector('.nav-toggle');
const menu = document.getElementById('nav-menu');

if (toggleBtn && menu) {
  const setOpen = (open) => {
    menu.dataset.open = String(open);
    toggleBtn.setAttribute('aria-expanded', String(open));
  };

  setOpen(false);

  toggleBtn.addEventListener('click', () => {
    const isOpen = menu.dataset.open === 'true';
    setOpen(!isOpen);
  });

  // close when a nav link is clicked
  menu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => setOpen(false));
  });
}
