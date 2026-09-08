const menuToggle = document.querySelector('.menu-toggle');
const mainNavigation = document.querySelector('.main-nav');
const menuToggleLabel = menuToggle?.querySelector('.sr-only');
// Reemplazá este valor por el número real de Hoshi.deco, incluyendo el código de país y sin + ni espacios.
const WHATSAPP_NUMBER = '59800000000';

const productos = [
  {
    id: 'florero-brick',
    nombre: 'Florero Brick',
    precio: 850,
    categoria: 'Floreros',
    imagen: 'assets/images/florero-brick.jpg',
    colores: ['Rojo', 'Azul', 'Rosa'],
    descripcion: 'Un florero con silueta de bloque para flores con actitud.',
    destacado: true,
    nuevo: false,
  },
  {
    id: 'portarrollos-pop',
    nombre: 'Portarrollos Pop',
    precio: 990,
    categoria: 'Baño',
    imagen: 'assets/images/portarrollos-pop.jpg',
    colores: ['Amarillo', 'Azul', 'Verde'],
    descripcion: 'El detalle inesperado para hacer del baño un lugar más divertido.',
    destacado: true,
    nuevo: true,
  },
  {
    id: 'tapa-luz-wave',
    nombre: 'Tapa de luz Wave',
    precio: 590,
    categoria: 'Objetos',
    imagen: 'assets/images/tapa-luz-wave.jpg',
    colores: ['Crema', 'Rojo', 'Rosa'],
    descripcion: 'Una ola de color para los rincones que suelen pasar desapercibidos.',
    destacado: true,
    nuevo: false,
  },
  {
    id: 'espejo-paint',
    nombre: 'Espejo Paint',
    precio: 2490,
    categoria: 'Espejos',
    imagen: 'assets/images/espejo-paint.jpg',
    colores: ['Azul', 'Verde', 'Amarillo'],
    descripcion: 'Un espejo que también funciona como una pequeña pieza de arte.',
    destacado: true,
    nuevo: true,
  },
  {
    id: 'florero-twist',
    nombre: 'Florero Twist',
    precio: 1190,
    categoria: 'Floreros',
    imagen: 'assets/images/florero-twist.jpg',
    colores: ['Rosa', 'Crema', 'Verde'],
    descripcion: 'Curvas, color y un lugar perfecto para tus flores favoritas.',
    destacado: false,
    nuevo: true,
  },
  {
    id: 'jabonera-bubble',
    nombre: 'Jabonera Bubble',
    precio: 690,
    categoria: 'Baño',
    imagen: 'assets/images/jabonera-bubble.jpg',
    colores: ['Azul', 'Rosa', 'Amarillo'],
    descripcion: 'Una jabonera con burbujas para darle onda a la rutina.',
    destacado: false,
    nuevo: true,
  },
  {
    id: 'portavelas-disco',
    nombre: 'Portavelas Disco',
    precio: 780,
    categoria: 'Objetos',
    imagen: 'assets/images/portavelas-disco.jpg',
    colores: ['Rojo', 'Amarillo', 'Crema'],
    descripcion: 'Para encender una luz suave, colorida y muy Hoshi.',
    destacado: false,
    nuevo: false,
  },
  {
    id: 'espejo-splash',
    nombre: 'Espejo Splash',
    precio: 2790,
    categoria: 'Espejos',
    imagen: 'assets/images/espejo-splash.jpg',
    colores: ['Verde', 'Azul', 'Rosa'],
    descripcion: 'Un marco irregular para reflejar tu lado más colorido.',
    destacado: false,
    nuevo: false,
  },
  {
    id: 'porta-lapices-happy',
    nombre: 'Portalápices Happy',
    precio: 640,
    categoria: 'Regalos',
    imagen: 'assets/images/porta-lapices-happy.jpg',
    colores: ['Amarillo', 'Rojo', 'Azul'],
    descripcion: 'Un regalo pequeño y expresivo para escritorios con personalidad.',
    destacado: false,
    nuevo: true,
  },
  {
    id: 'bandeja-zigzag',
    nombre: 'Bandeja Zigzag',
    precio: 1350,
    categoria: 'Objetos',
    imagen: 'assets/images/bandeja-zigzag.jpg',
    colores: ['Crema', 'Verde', 'Rojo'],
    descripcion: 'Una bandeja para ordenar, servir o simplemente decorar.',
    destacado: false,
    nuevo: false,
  },
];

const featuredVariants = {
  'florero-brick': 'brick',
  'portarrollos-pop': 'pop',
  'tapa-luz-wave': 'wave',
  'espejo-paint': 'paint',
};

const formatPrice = (price) => `$${price.toLocaleString('es-UY')} UYU`;
const whatsappLink = (productName) => {
  const message = `Hola! Quería consultar por ${productName} ✨`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

function productMarkup(product, type = 'catalog') {
  const colors = product.colores.join(', ');
  const variant = featuredVariants[product.id] || 'brick';
  const extraClass = type === 'featured' ? ` product-card--${variant}` : '';
  const description = type === 'catalog' ? `<p class="product-card__description">${product.descripcion}</p>` : '';

  return `
    <article class="product-card${extraClass}" data-product-id="${product.id}">
      <div class="product-card__image" data-image-path="${product.imagen}">
        <span class="product-card__image-label">Foto ${product.nombre}</span>
        <img class="product-card__photo" src="${product.imagen}" alt="${product.nombre}" />
        <span class="product-card__shape" aria-hidden="true"></span>
      </div>
      <div class="product-card__info">
        <p class="product-card__category">${product.categoria}</p>
        <h3>${product.nombre}</h3>
        <p class="product-card__price">${formatPrice(product.precio)}</p>
        <p class="product-card__colors"><strong>Colores:</strong> ${colors}</p>
        ${description}
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
renderProducts('#new-products-grid', productos.filter((product) => product.nuevo), 'new');
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
