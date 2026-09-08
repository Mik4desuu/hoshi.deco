const menuToggle = document.querySelector('.menu-toggle');
const mainNavigation = document.querySelector('.main-nav');
const menuToggleLabel = menuToggle?.querySelector('.sr-only');

if (menuToggle && mainNavigation && menuToggleLabel) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';

    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggleLabel.textContent = isOpen ? 'Abrir menú' : 'Cerrar menú';
    mainNavigation.classList.toggle('is-open', !isOpen);
  });

  mainNavigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggleLabel.textContent = 'Abrir menú';
      mainNavigation.classList.remove('is-open');
    }
  });
}
