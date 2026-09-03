export const ROUTES = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'dashboard', label: 'Dashboard', href: '/dashboard.html' },
  { key: 'heatmap', label: 'Heatmap', href: '/heatmap.html' }
];

export function initHamburger() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  if (!toggle || !menu) return;

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('hidden', !open);
  }

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    setOpen(!open);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      setOpen(false);
    }
  });
}
