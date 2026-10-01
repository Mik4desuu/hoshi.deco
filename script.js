const menuToggle = document.querySelector('.menu-toggle');
const mainNavigation = document.querySelector('.main-nav');
const menuToggleLabel = menuToggle?.querySelector('.sr-only');
const scrollStar = document.querySelector('.scroll-star');
const selectionToggle = document.querySelector('.selection-toggle');
const selectionCount = document.querySelector('.selection-toggle__count');
const selectionPanel = document.querySelector('.selection-panel');
const selectionBackdrop = document.querySelector('.selection-backdrop');
const selectionClose = document.querySelector('.selection-panel__close');
const selectionItems = document.querySelector('.selection-items');
const selectionEmpty = document.querySelector('.selection-panel__empty');
const selectionSummary = document.querySelector('.selection-panel__summary');
const selectionSubtotal = document.querySelector('.selection-subtotal');
const selectionTotal = document.querySelector('.selection-total');
const selectionWhatsApp = document.querySelector('.selection-whatsapp');
const selectionToast = document.querySelector('.selection-toast');
// Reemplazá este valor por el número real de Hoshi.deco, incluyendo el código de país y sin + ni espacios.
const WHATSAPP_NUMBER = '59800000000';
const SELECTION_STORAGE_KEY = 'hoshi-selection';

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
const priceValue = (price) => Number(price.replace(/[^\d]/g, ''));
const formatTotal = (total) => `$${total.toLocaleString('es-UY')}`;

function loadSelection() {
  try {
    const storedSelection = JSON.parse(window.localStorage.getItem(SELECTION_STORAGE_KEY) || '[]');

    if (!Array.isArray(storedSelection)) {
      return [];
    }

    return storedSelection.filter((item) => (
      productos.some((product) => product.id === item.id)
      && Number.isInteger(item.quantity)
      && item.quantity > 0
    ));
  } catch {
    return [];
  }
}

let selection = loadSelection();
let selectionToastTimeout;
let isSelectionOpen = false;

function saveSelection() {
  try {
    window.localStorage.setItem(SELECTION_STORAGE_KEY, JSON.stringify(selection));
  } catch {
    // La selección sigue funcionando durante esta visita si localStorage no está disponible.
  }
}

function selectionTotalValue() {
  return selection.reduce((total, item) => {
    const product = productos.find(({ id }) => id === item.id);
    return product ? total + priceValue(product.precio) * item.quantity : total;
  }, 0);
}

function hasVariantToCoordinate(product) {
  return product.informacion.some((info) => /distintos personajes|colores personalizados/i.test(info));
}

function renderSelection() {
  const itemCount = selection.reduce((total, item) => total + item.quantity, 0);
  const total = selectionTotalValue();

  if (selectionCount) {
    selectionCount.textContent = itemCount;
  }

  if (selectionToggle) {
    selectionToggle.setAttribute('aria-label', `Abrir selección: ${itemCount} ${itemCount === 1 ? 'cosa' : 'cosas'}`);
  }

  if (!selectionItems || !selectionEmpty || !selectionSummary || !selectionSubtotal || !selectionTotal) {
    return;
  }

  selectionItems.innerHTML = selection.map((item) => {
    const product = productos.find(({ id }) => id === item.id);

    if (!product) {
      return '';
    }

    return `
      <li class="selection-item">
        <img src="${product.imagen}" alt="" />
        <div class="selection-item__details">
          <h3>${product.nombre}</h3>
          <p>${product.precio}</p>
          <div class="selection-item__controls" aria-label="Cantidad de ${product.nombre}">
            <button type="button" data-selection-action="decrease" data-product-id="${product.id}" aria-label="Quitar una unidad de ${product.nombre}">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-selection-action="increase" data-product-id="${product.id}" aria-label="Agregar una unidad de ${product.nombre}">+</button>
          </div>
        </div>
        <button class="selection-item__remove" type="button" data-selection-action="remove" data-product-id="${product.id}">Eliminar</button>
      </li>
    `;
  }).join('');

  const isEmpty = selection.length === 0;
  selectionEmpty.hidden = !isEmpty;
  selectionItems.hidden = isEmpty;
  selectionSummary.hidden = isEmpty;
  selectionSubtotal.textContent = formatTotal(total);
  selectionTotal.textContent = formatTotal(total);
}

function updateSelection(productId, amount) {
  const item = selection.find(({ id }) => id === productId);

  if (item) {
    item.quantity += amount;
  } else if (amount > 0) {
    selection.push({ id: productId, quantity: amount });
  }

  selection = selection.filter(({ quantity }) => quantity > 0);
  saveSelection();
  renderSelection();
}

function showSelectionToast() {
  if (!selectionToast) {
    return;
  }

  window.clearTimeout(selectionToastTimeout);
  selectionToast.hidden = false;

  selectionToastTimeout = window.setTimeout(() => {
    selectionToast.hidden = true;
  }, 1800);
}

function renderSelectionVisibility() {
  if (selectionPanel) {
    selectionPanel.hidden = !isSelectionOpen;
  }

  if (selectionBackdrop) {
    selectionBackdrop.hidden = !isSelectionOpen;
  }

  selectionToggle?.setAttribute('aria-expanded', String(isSelectionOpen));
  document.body.classList.toggle('is-selection-open', isSelectionOpen);
}

function openSelection(trigger) {
  if (trigger !== selectionToggle) {
    return;
  }

  isSelectionOpen = true;
  renderSelectionVisibility();
}

function closeSelection() {
  isSelectionOpen = false;
  renderSelectionVisibility();
}

function sendSelectionToWhatsApp() {
  const orderLines = selection.map((item) => {
    const product = productos.find(({ id }) => id === item.id);
    const variantNote = hasVariantToCoordinate(product) ? '\n  Variante/color: a coordinar' : '';
    return `• ${item.quantity} × ${product.nombre} — ${product.precio}${variantNote}`;
  });
  const message = `Hola! 💌 Quiero hacer este pedido en Hoshi:\n\n${orderLines.join('\n')}\n\nTotal: ${formatTotal(selectionTotalValue())}\n\n¿Coordinamos? ✨`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
}

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
          <button class="product-card__button product-card__button--want" type="button" data-add-product="${product.id}">Lo quiero +</button>
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
renderSelection();
renderSelectionVisibility();

document.addEventListener('click', (event) => {
  const addButton = event.target.closest('[data-add-product]');
  const selectionAction = event.target.closest('[data-selection-action]');

  if (addButton) {
    event.preventDefault();
    updateSelection(addButton.dataset.addProduct, 1);
    showSelectionToast();
    return;
  }

  if (!selectionAction) {
    return;
  }

  const productId = selectionAction.dataset.productId;

  if (selectionAction.dataset.selectionAction === 'increase') {
    updateSelection(productId, 1);
  } else if (selectionAction.dataset.selectionAction === 'decrease') {
    updateSelection(productId, -1);
  } else if (selectionAction.dataset.selectionAction === 'remove') {
    selection = selection.filter(({ id }) => id !== productId);
    saveSelection();
    renderSelection();
  }
});

selectionToggle?.addEventListener('click', (event) => {
  event.preventDefault();
  openSelection(event.currentTarget);
});
selectionClose?.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  closeSelection();
});

selectionBackdrop?.addEventListener('click', (event) => {
  if (event.target === selectionBackdrop) {
    closeSelection();
  }
});
selectionWhatsApp?.addEventListener('click', sendSelectionToWhatsApp);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && isSelectionOpen) {
    closeSelection();
  }
});

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

if (scrollStar) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let animationFrame;
  let currentPosition = 0;
  let targetPosition = 0;
  let currentRotation = 0;
  let targetRotation = 0;

  const setStarPosition = () => {
    scrollStar.style.setProperty('--scroll-star-y', `${currentPosition}px`);
    scrollStar.style.setProperty('--scroll-star-rotation', `${currentRotation}deg`);
  };

  const updateTargetPosition = (isInitialPosition = false) => {
    const maximumScroll = Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      1,
    );
    const scrollProgress = Math.min(Math.max(window.scrollY / maximumScroll, 0), 1);

    targetPosition = window.innerHeight * (0.13 + scrollProgress * 0.63);
    targetRotation = -5 + scrollProgress * 10;

    if (isInitialPosition) {
      currentPosition = targetPosition;
      currentRotation = targetRotation;
      setStarPosition();
      return;
    }

    if (!animationFrame) {
      animationFrame = window.requestAnimationFrame(animateStar);
    }
  };

  const animateStar = () => {
    currentPosition += (targetPosition - currentPosition) * 0.1;
    currentRotation += (targetRotation - currentRotation) * 0.1;
    setStarPosition();

    if (
      Math.abs(targetPosition - currentPosition) > 0.2
      || Math.abs(targetRotation - currentRotation) > 0.05
    ) {
      animationFrame = window.requestAnimationFrame(animateStar);
    } else {
      currentPosition = targetPosition;
      currentRotation = targetRotation;
      setStarPosition();
      animationFrame = undefined;
    }
  };

  const enableStarMotion = () => {
    updateTargetPosition(true);
    window.addEventListener('scroll', updateTargetPosition, { passive: true });
    window.addEventListener('resize', updateTargetPosition);

    if ('ResizeObserver' in window) {
      new ResizeObserver(() => updateTargetPosition()).observe(document.body);
    }
  };

  if (!reducedMotion.matches) {
    enableStarMotion();
  }
}
