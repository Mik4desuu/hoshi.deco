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
const MASCOT_DISABLED_STORAGE_KEY = 'hoshi-mascot-disabled';
const MASCOT_GREETING_SESSION_KEY = 'hoshi-mascot-greeting-seen';
const mascotElement = document.querySelector('.hoshi-mascot');
const mascotImage = document.querySelector('.hoshi-mascot__image');
const mascotButton = document.querySelector('.hoshi-mascot__button');
const mascotMessage = document.querySelector('.hoshi-mascot__message');
const mascotToggle = document.querySelector('.hoshi-mascot-toggle');

const productos = [
  {
    id: 'cartucho-game-boy',
    nombre: 'Cartucho Game Boy',
    precio: '$850',
    categoria: 'deco',
    subcategoria: 'Objetos',
    imagen: 'assets/images/cartucho game boy .jpg',
    informacion: ['Disponible en distintos personajes.'],
    destacado: true,
  },
  {
    id: 'espejo-nube',
    nombre: 'Espejo Nube',
    precio: '$590',
    categoria: 'deco',
    subcategoria: 'Espejos',
    imagen: 'assets/images/espejo nube.jpg',
    informacion: ['20 cm de diámetro.'],
    destacado: true,
  },
  {
    id: 'espejo-paint',
    nombre: 'Espejo Paint',
    precio: '$2.490',
    categoria: 'deco',
    subcategoria: 'Espejos',
    imagen: 'assets/images/espejo paint.jpg',
    informacion: ['80 × 60 cm.'],
    destacado: true,
  },
  {
    id: 'florero-lego',
    nombre: 'Florero Lego',
    precio: '$750',
    categoria: 'deco',
    subcategoria: 'Floreros',
    imagen: 'assets/images/florero lego.jpg',
    informacion: ['16 × 6,5 cm.', 'Colores personalizados.'],
    // Agregá variantes solo cuando exista una foto real para cada color.
    variantes: [],
    destacado: true,
  },
  {
    id: 'portafoto-mitsy',
    nombre: 'Portafoto Mitsy',
    precio: '$65 c/u',
    categoria: 'deco',
    subcategoria: 'Regalos',
    imagen: 'assets/images/portafoto misty.jpg',
    informacion: ['3 por $150.'],
    destacado: false,
  },
  {
    id: 'portarrollos',
    nombre: 'Portarrollos',
    precio: '$450',
    categoria: 'deco',
    subcategoria: 'Baño',
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

function getProduct(productId) {
  return productos.find(({ id }) => id === productId);
}

function getAvailableVariants(product) {
  if (!Array.isArray(product?.variantes)) {
    return [];
  }

  return product.variantes.filter((variant) => (
    variant
    && typeof variant.id === 'string'
    && typeof variant.nombre === 'string'
    && typeof variant.color === 'string'
    && typeof variant.imagen === 'string'
    && variant.imagen.trim()
    && variant.disponible === true
  ));
}

function getVariant(product, variantId) {
  return getAvailableVariants(product).find(({ id }) => id === variantId);
}

function selectionMatches(item, productId, variantId) {
  return item.id === productId && (item.variantId || null) === (variantId || null);
}

function selectionActionAttributes(productId, variantId) {
  return `data-product-id="${productId}"${variantId ? ` data-variant-id="${variantId}"` : ''}`;
}

function loadSelection() {
  try {
    const storedSelection = JSON.parse(window.localStorage.getItem(SELECTION_STORAGE_KEY) || '[]');

    if (!Array.isArray(storedSelection)) {
      return [];
    }

    return storedSelection.filter((item) => {
      const product = getProduct(item.id);
      const variantIsValid = !item.variantId || Boolean(getVariant(product, item.variantId));

      return product && variantIsValid && Number.isInteger(item.quantity) && item.quantity > 0;
    });
  } catch {
    return [];
  }
}

let selection = loadSelection();
let selectionToastTimeout;
let isSelectionOpen = false;

function createMascot() {
  if (!mascotElement || !mascotImage || !mascotButton || !mascotToggle) {
    return {
      init() {}, hide() {}, onCategory() {}, celebrate() {}, react() {},
    };
  }

  const poses = {
    peeking: 'assets/hoshi_estrella/01_se_asoma.png',
    greeting: 'assets/hoshi_estrella/02_saluda.png',
    curious: 'assets/hoshi_estrella/03_curiosa_deco.png',
    reading: 'assets/hoshi_estrella/04_lectores.png',
    reacting: 'assets/hoshi_estrella/05_reacciona_toque.png',
    celebrating: 'assets/hoshi_estrella/06_celebra_carrito.png',
    hiding: 'assets/hoshi_estrella/07_se_esconde.png',
    excited: 'assets/hoshi_estrella/09_emocionada.png',
    jumping: 'assets/hoshi_estrella/13_salta_feliz.png',
    surprised: 'assets/hoshi_estrella/14_sorprendida.png',
    approving: 'assets/hoshi_estrella/15_aprueba.png',
  };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const played = { deco: false, readers: false };
  let disabled = false;
  let timers = [];
  let activeState = 'hidden';
  let hostCard;

  try {
    disabled = window.localStorage.getItem(MASCOT_DISABLED_STORAGE_KEY) === 'true';
  } catch {
    disabled = false;
  }

  const schedule = (callback, delay) => {
    const timer = window.setTimeout(callback, delay);
    timers.push(timer);
    return timer;
  };

  const clearTimers = () => {
    timers.forEach((timer) => window.clearTimeout(timer));
    timers = [];
  };

  const updateToggle = () => {
    mascotToggle.setAttribute('aria-pressed', String(disabled));
    mascotToggle.setAttribute('aria-label', disabled ? 'Activar animaciones de la estrella' : 'Desactivar animaciones de la estrella');
    mascotToggle.innerHTML = `<span aria-hidden="true">✦</span> ${disabled ? 'Mascota off' : 'Mascota'}`;
  };

  const canAppear = () => !disabled && !reducedMotion.matches && !isSelectionOpen;

  const setPose = (pose) => {
    mascotImage.src = poses[pose];
  };

  const resetLocation = () => {
    hostCard?.classList.remove('has-hoshi-mascot');
    hostCard = undefined;
    document.body.append(mascotElement);
  };

  const hide = (immediate = false) => {
    clearTimers();
    activeState = 'hidden';
    mascotElement.dataset.mascotState = 'hidden';
    mascotElement.classList.remove('is-visible', 'hoshi-mascot--greeting', 'hoshi-mascot--cart', 'hoshi-mascot--reading', 'hoshi-mascot--deco', 'is-reacting');
    if (mascotMessage) {
      mascotMessage.hidden = true;
    }

    const finish = () => {
      mascotElement.hidden = true;
      mascotElement.setAttribute('aria-hidden', 'true');
      resetLocation();
    };

    if (immediate) {
      finish();
    } else {
      schedule(finish, 430);
    }
  };

  const place = (position, card) => {
    resetLocation();
    mascotElement.classList.remove('hoshi-mascot--greeting', 'hoshi-mascot--cart', 'hoshi-mascot--reading', 'hoshi-mascot--deco');

    if (position === 'deco' && card) {
      hostCard = card;
      hostCard.classList.add('has-hoshi-mascot');
      hostCard.append(mascotElement);
      mascotElement.classList.add('hoshi-mascot--deco');
    } else if (position === 'greeting') {
      mascotElement.classList.add('hoshi-mascot--greeting');
    } else if (position === 'cart') {
      mascotElement.classList.add('hoshi-mascot--cart');
    } else if (position === 'reading') {
      mascotElement.classList.add('hoshi-mascot--reading');
    }
  };

  const show = (state, options = {}) => {
    if (!canAppear()) {
      return false;
    }

    clearTimers();
    place(options.position, options.card);
    activeState = state;
    mascotElement.dataset.mascotState = state;
    setPose(options.pose || state);
    mascotElement.hidden = false;
    mascotElement.setAttribute('aria-hidden', 'false');
    mascotElement.classList.remove('is-reacting');
    mascotMessage.hidden = !options.message;
    if (options.message) {
      mascotMessage.textContent = options.message;
    }

    window.requestAnimationFrame(() => mascotElement.classList.add('is-visible'));
    schedule(() => hide(), options.duration || 2000);
    return true;
  };

  const greet = () => {
    if (!show('peeking', { pose: 'peeking', position: 'greeting', duration: 3400 })) {
      return;
    }
    schedule(() => {
      activeState = 'greeting';
      mascotElement.dataset.mascotState = 'greeting';
      setPose('greeting');
    }, 700);
    schedule(() => setPose('hiding'), 2470);
  };

  const showDeco = () => {
    if (played.deco || !canAppear()) {
      return;
    }
    const card = document.querySelector('#catalog-products-grid .product-card');
    if (show('curious', { pose: 'curious', position: 'deco', card, duration: 2300 })) {
      played.deco = true;
      schedule(() => setPose('hiding'), 1760);
    }
  };

  const showReaders = () => {
    if (played.readers || !canAppear()) {
      return;
    }
    if (show('reading', { pose: 'reading', position: 'reading', duration: 2300 })) {
      played.readers = true;
      schedule(() => setPose('hiding'), 1760);
    }
  };

  const react = () => {
    if (activeState === 'hidden' || disabled || reducedMotion.matches || isSelectionOpen) {
      return;
    }
    clearTimers();
    const reactions = ['reacting', 'jumping', 'surprised', 'approving', 'excited'];
    setPose(reactions[Math.floor(Math.random() * reactions.length)]);
    activeState = 'reacting';
    mascotElement.dataset.mascotState = 'reacting';
    mascotElement.classList.add('is-reacting');
    schedule(() => hide(), 1500);
  };

  const celebrate = () => {
    show('celebrating', {
      pose: 'celebrating',
      position: 'cart',
      message: '¡Qué buena elección!',
      duration: 2050,
    });
  };

  mascotButton.addEventListener('click', react);
  mascotToggle.addEventListener('click', () => {
    disabled = !disabled;
    try {
      window.localStorage.setItem(MASCOT_DISABLED_STORAGE_KEY, String(disabled));
    } catch {
      // Si no hay almacenamiento disponible, se conserva la preferencia durante esta visita.
    }
    updateToggle();
    if (disabled) {
      hide(true);
    }
  });
  reducedMotion.addEventListener?.('change', () => {
    if (reducedMotion.matches) {
      hide(true);
    }
  });

  return {
    init() {
      updateToggle();
      if (disabled || reducedMotion.matches) {
        return;
      }
      try {
        if (window.sessionStorage.getItem(MASCOT_GREETING_SESSION_KEY)) {
          return;
        }
        window.sessionStorage.setItem(MASCOT_GREETING_SESSION_KEY, 'true');
      } catch {
        // La sesión actual mantiene la protección de ejecuciones repetidas si storage no está disponible.
      }
      schedule(greet, 650);
    },
    hide,
    onCategory(category) {
      if (category === 'deco') {
        schedule(showDeco, 220);
      } else if (category === 'lectores') {
        schedule(showReaders, 220);
      }
    },
    celebrate,
  };
}

const mascot = createMascot();

function saveSelection() {
  try {
    window.localStorage.setItem(SELECTION_STORAGE_KEY, JSON.stringify(selection));
  } catch {
    // La selección sigue funcionando durante esta visita si localStorage no está disponible.
  }
}

function selectionTotalValue() {
  return selection.reduce((total, item) => {
    const product = getProduct(item.id);
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
    const product = getProduct(item.id);

    if (!product) {
      return '';
    }

    const variant = getVariant(product, item.variantId);
    const productImage = variant?.imagen || product.imagen;
    const colorDetail = variant
      ? `<p class="selection-item__variant"><span style="--variant-color: ${variant.color}" aria-hidden="true"></span>Color: ${variant.nombre}</p>`
      : '';
    const actionAttributes = selectionActionAttributes(product.id, variant?.id);

    return `
      <li class="selection-item">
        <img src="${productImage}" alt="" />
        <div class="selection-item__details">
          <h3>${product.nombre}</h3>
          <p>${product.precio}</p>
          ${colorDetail}
          <div class="selection-item__controls" aria-label="Cantidad de ${product.nombre}${variant ? `, color ${variant.nombre}` : ''}">
            <button type="button" data-selection-action="decrease" ${actionAttributes} aria-label="Quitar una unidad de ${product.nombre}${variant ? `, color ${variant.nombre}` : ''}">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-selection-action="increase" ${actionAttributes} aria-label="Agregar una unidad de ${product.nombre}${variant ? `, color ${variant.nombre}` : ''}">+</button>
          </div>
        </div>
        <button class="selection-item__remove" type="button" data-selection-action="remove" ${actionAttributes}>Eliminar</button>
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

function updateSelection(productId, variantId, amount) {
  const item = selection.find((selectionItem) => selectionMatches(selectionItem, productId, variantId));

  if (item) {
    item.quantity += amount;
  } else if (amount > 0) {
    selection.push({ id: productId, variantId: variantId || null, quantity: amount });
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

  if (isSelectionOpen) {
    mascot.hide(true);
  }
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
    const product = getProduct(item.id);
    const variant = getVariant(product, item.variantId);
    const variantNote = variant
      ? ` — ${variant.nombre}`
      : hasVariantToCoordinate(product) ? '\n  Variante/color: a coordinar' : '';
    return `• ${item.quantity} × ${product.nombre} — ${product.precio}${variantNote}`;
  });
  const message = `Hola! 💌 Quiero hacer este pedido en Hoshi:\n\n${orderLines.join('\n')}\n\nTotal: ${formatTotal(selectionTotalValue())}\n\n¿Coordinamos? ✨`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
}

const selectedVariants = new Map();

function selectedVariantFor(product) {
  const variants = getAvailableVariants(product);
  const selectedVariant = getVariant(product, selectedVariants.get(product.id));

  return selectedVariant || variants[0] || null;
}

function colorOptionsMarkup(product, selectedVariant) {
  const variants = getAvailableVariants(product);

  if (!variants.length) {
    return '';
  }

  return `
    <div class="product-card__colors" role="radiogroup" aria-label="Elegí el color de ${product.nombre}">
      ${variants.map((variant) => `
        <button
          class="product-card__color${variant.id === selectedVariant?.id ? ' is-selected' : ''}"
          type="button"
          role="radio"
          aria-checked="${String(variant.id === selectedVariant?.id)}"
          aria-label="${variant.nombre}${variant.id === selectedVariant?.id ? ', seleccionado' : ''}"
          data-select-variant="${variant.id}"
          data-product-id="${product.id}"
          style="--variant-color: ${variant.color}"
        ><span aria-hidden="true"></span></button>
      `).join('')}
    </div>
  `;
}

function productMarkup(product, type = 'catalog') {
  const variant = featuredVariants[product.id] || 'brick';
  const extraClass = type === 'featured' ? ` product-card--${variant}` : '';
  const selectedVariant = selectedVariantFor(product);
  const productImage = selectedVariant?.imagen || product.imagen;
  const information = product.informacion.length
    ? `<p class="product-card__description">${product.informacion.join('<br>')}</p>`
    : '';

  return `
    <article class="product-card${extraClass}" data-product-id="${product.id}">
      <div class="product-card__image" data-image-path="${productImage}">
        <img class="product-card__photo" src="${productImage}" alt="${product.nombre}${selectedVariant ? `, color ${selectedVariant.nombre}` : ''}" />
        <span class="product-card__shape" aria-hidden="true"></span>
      </div>
      <div class="product-card__info">
        <h3>${product.nombre}</h3>
        <p class="product-card__price">${formatPrice(product.precio)}</p>
        ${information}
        ${colorOptionsMarkup(product, selectedVariant)}
        <div class="product-card__actions">
          <button class="product-card__button product-card__button--want" type="button" data-add-product="${product.id}"${selectedVariant ? ` data-variant-id="${selectedVariant.id}"` : ''}>Lo quiero +</button>
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
  const variantButton = event.target.closest('[data-select-variant]');
  const selectionAction = event.target.closest('[data-selection-action]');

  if (variantButton) {
    const product = getProduct(variantButton.dataset.productId);
    const variant = getVariant(product, variantButton.dataset.selectVariant);

    if (variant) {
      selectedVariants.set(product.id, variant.id);
      document.querySelectorAll(`.product-card[data-product-id="${product.id}"]`).forEach((card) => {
        const image = card.querySelector('.product-card__photo');
        const addToSelectionButton = card.querySelector('[data-add-product]');

        if (image) {
          image.classList.remove('is-unavailable');
          image.classList.add('is-changing');
          window.setTimeout(() => {
            const revealImage = () => image.classList.remove('is-changing');
            image.addEventListener('load', revealImage, { once: true });
            image.addEventListener('error', revealImage, { once: true });
            image.src = variant.imagen;
            image.alt = `${product.nombre}, color ${variant.nombre}`;
          }, 40);
        }

        card.querySelector('.product-card__image')?.setAttribute('data-image-path', variant.imagen);
        addToSelectionButton?.setAttribute('data-variant-id', variant.id);
        card.querySelectorAll('[data-select-variant]').forEach((button) => {
          const isSelected = button.dataset.selectVariant === variant.id;
          button.classList.toggle('is-selected', isSelected);
          button.setAttribute('aria-checked', String(isSelected));
          button.setAttribute('aria-label', `${button.dataset.selectVariant === variant.id ? variant.nombre : getVariant(product, button.dataset.selectVariant)?.nombre}${isSelected ? ', seleccionado' : ''}`);
        });
      });
    }

    return;
  }

  if (addButton) {
    event.preventDefault();
    updateSelection(addButton.dataset.addProduct, addButton.dataset.variantId || null, 1);
    showSelectionToast();
    mascot.celebrate();
    return;
  }

  if (!selectionAction) {
    return;
  }

  const productId = selectionAction.dataset.productId;
  const variantId = selectionAction.dataset.variantId || null;

  if (selectionAction.dataset.selectionAction === 'increase') {
    updateSelection(productId, variantId, 1);
  } else if (selectionAction.dataset.selectionAction === 'decrease') {
    updateSelection(productId, variantId, -1);
  } else if (selectionAction.dataset.selectionAction === 'remove') {
    selection = selection.filter((item) => !selectionMatches(item, productId, variantId));
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
const catalogEmpty = document.querySelector('#catalog-empty');

function setCatalogCategory(category) {
  mascot.hide(true);
  const filteredProducts = category === 'todos'
    ? productos
    : productos.filter((product) => product.categoria === category);

  catalogFilters?.querySelectorAll('.catalog-filter').forEach((button) => {
    const isActive = button.dataset.category === category;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  renderProducts('#catalog-products-grid', filteredProducts, 'catalog');

  if (catalogEmpty) {
    catalogEmpty.hidden = filteredProducts.length > 0;
  }

  mascot.onCategory(category);
}

if (catalogFilters) {
  catalogFilters.addEventListener('click', (event) => {
    const filterButton = event.target.closest('.catalog-filter');

    if (!filterButton) {
      return;
    }

    setCatalogCategory(filterButton.dataset.category);
  });
}

document.querySelectorAll('[data-catalog-category]').forEach((categoryLink) => {
  categoryLink.addEventListener('click', () => {
    setCatalogCategory(categoryLink.dataset.catalogCategory);
  });
});

document.querySelector('[data-catalog-reset]')?.addEventListener('click', () => {
  setCatalogCategory('todos');
  document.querySelector('#catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

mascot.init();

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
