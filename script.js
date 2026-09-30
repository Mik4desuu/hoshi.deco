const menuToggle = document.querySelector('.menu-toggle');
const mainNavigation = document.querySelector('.main-nav');
const menuToggleLabel = menuToggle?.querySelector('.sr-only');
// Reemplazá este valor por el número real de Hoshi.deco, incluyendo el código de país y sin + ni espacios.
const WHATSAPP_NUMBER = '59800000000';

const productos = [
  {
    id: 'cartucho-game-boy',
    nombre: 'Cartucho Game Boy',
    precio: '$850',
    categoria: 'Objetos',
    imagen: 'assets/images/cartucho game boy .jpg',
    informacion: ['Disponible en distintos personajes.'],
    destacado: true,
  },
  {
    id: 'espejo-nube',
    nombre: 'Espejo Nube',
    precio: '$590',
    categoria: 'Espejos',
    imagen: 'assets/images/espejo nube.jpg',
    informacion: ['20 cm de diámetro.'],
    destacado: true,
  },
  {
    id: 'espejo-paint',
    nombre: 'Espejo Paint',
    precio: '$2.490',
    categoria: 'Espejos',
    imagen: 'assets/images/espejo paint.jpg',
    informacion: ['80 × 60 cm.'],
    destacado: true,
  },
  {
    id: 'florero-lego',
    nombre: 'Florero Lego',
    precio: '$750',
    categoria: 'Floreros',
    imagen: 'assets/images/florero lego.jpg',
    informacion: ['16 × 6,5 cm.', 'Colores personalizados.'],
    destacado: true,
  },
  {
    id: 'portafoto-mitsy',
    nombre: 'Portafoto Mitsy',
    precio: '$65 c/u',
    categoria: 'Regalos',
    imagen: 'assets/images/portafoto misty.jpg',
    informacion: ['3 por $150.'],
    destacado: false,
  },
  {
    id: 'portarrollos',
    nombre: 'Portarrollos',
    precio: '$450',
    categoria: 'Baño',
    imagen: 'assets/images/portarrollo .jpg',
    informacion: [],
    destacado: false,
  },
];

const featuredVariants = {
  'cartucho-game-boy': 'brick',
  'espejo-nube': 'pop',
  'espejo-paint': 'wave',
  'florero-lego': 'paint',
};

const formatPrice = (price) => price;
const whatsappLink = (productName) => {
  const message = `Hola! Quería consultar por ${productName} ✨`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

function productMarkup(product, type = 'catalog') {
  const variant = featuredVariants[product.id] || 'brick';
  const extraClass = type === 'featured' ? ` product-card--${variant}` : '';
  const information = product.informacion.length
    ? `<p class="product-card__description">${product.informacion.join('<br>')}</p>`
    : '';

  return `
    <article class="product-card${extraClass}" data-product-id="${product.id}">
      <div class="product-card__image" data-image-path="${product.imagen}">
        <img class="product-card__photo" src="${product.imagen}" alt="${product.nombre}" />
        <span class="product-card__shape" aria-hidden="true"></span>
      </div>
      <div class="product-card__info">
        <h3>${product.nombre}</h3>
        <p class="product-card__price">${formatPrice(product.precio)}</p>
        ${information}
        <div class="product-card__actions">
          <a class="product-card__button" href="#catalogo">Ver producto <span aria-hidden="true">→</span></a>
          <a
            class="product-card__button product-card__button--want"
            href="${whatsappLink(product.nombre)}"
            target="_blank"
            rel="noreferrer"
          >
            Lo quiero <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </article>
  `;
}

function renderProducts(selector, products, type) {
  const container = document.querySelector(selector);

  if (container) {
    container.innerHTML = products.map((product) => productMarkup(product, type)).join('');

    container.querySelectorAll('.product-card__photo').forEach((image) => {
      image.addEventListener('error', () => image.classList.add('is-unavailable'));
    });
  }
}

renderProducts('#featured-products-grid', productos.filter((product) => product.destacado), 'featured');
renderProducts('#catalog-products-grid', productos, 'catalog');

const catalogFilters = document.querySelector('.catalog-filters');

if (catalogFilters) {
  catalogFilters.addEventListener('click', (event) => {
    const filterButton = event.target.closest('.catalog-filter');

    if (!filterButton) {
      return;
    }

    const selectedCategory = filterButton.dataset.category;
    const filteredProducts = selectedCategory === 'todos'
      ? productos
      : productos.filter(
        (product) => product.categoria.toLocaleLowerCase('es-UY') === selectedCategory,
      );

    catalogFilters.querySelectorAll('.catalog-filter').forEach((button) => {
      const isActive = button === filterButton;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    renderProducts('#catalog-products-grid', filteredProducts, 'catalog');
  });
}

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
