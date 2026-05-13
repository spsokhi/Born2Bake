/* =============================================
   Born2Bake — script.js
   ============================================= */

// ===== Cake Data =====
// Add / remove entries here to update the menu.
// file    → filename inside img/ folder
// category → matches filter-btn data-filter values
// price   → starting price in INR (500g)
// badge   → short label shown on card (empty string = no badge)
// featured → whether to show in "Chef's Picks" section
const CAKES = [
  {
    file: 'Butterfly cake.jpeg',
    category: 'birthday',
    price: 1299,
    badge: 'Fan Favourite',
    featured: true,
  },
  {
    file: 'Chocolate cake.jpeg',
    category: 'chocolate',
    price: 849,
    badge: 'Best Seller',
    featured: true,
  },
  {
    file: 'Classic pineapple cake.jpeg',
    category: 'fruit',
    price: 749,
    badge: 'Classic',
    featured: false,
  },
  {
    file: 'Couple bento cake.jpeg',
    category: 'bento',
    price: 1599,
    badge: 'Trending',
    featured: true,
  },
  {
    file: 'Fresh mix fruit cake.jpeg',
    category: 'fruit',
    price: 999,
    badge: '',
    featured: false,
  },
  {
    file: 'Rasmalai cake.jpeg',
    category: 'special',
    price: 1199,
    badge: "Chef's Special",
    featured: false,
  },
  {
    file: 'Vanilla bento cake.jpeg',
    category: 'bento',
    price: 1099,
    badge: '',
    featured: false,
  },
];

// ===== Helpers =====
function getCakeName(file) {
  return file
    .replace(/\.[^.]+$/, '')          // strip extension
    .replace(/[-_]/g, ' ')            // hyphens/underscores → spaces
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function fmtPrice(n) {
  return '₹' + n.toLocaleString('en-IN');
}

function imgSrc(file) {
  // Encode spaces for URL safety
  return 'img/' + file.split('').map(c => c === ' ' ? '%20' : c).join('');
}

// ===== Build a cake card element =====
function makeCakeCard(cake, delay) {
  const name = getCakeName(cake.file);
  const src  = imgSrc(cake.file);

  const card = document.createElement('div');
  card.className = 'cake-card reveal';
  card.dataset.category = cake.category;
  card.dataset.name = name.toLowerCase();
  card.style.transitionDelay = delay + 's';

  card.innerHTML = `
    <div class="cake-img">
      <img src="${src}" alt="${name}" loading="lazy" width="400" height="300">
      ${cake.badge ? `<span class="cake-badge">${cake.badge}</span>` : ''}
    </div>
    <div class="cake-body">
      <h3 class="cake-name">${name}</h3>
      <div class="cake-meta">
        <div>
          <span class="cake-price">${fmtPrice(cake.price)}</span>
          <span class="cake-price-sub">onwards / 500g</span>
        </div>
        <button class="btn-order"
          data-cake="${name}"
          data-price="${fmtPrice(cake.price)}">Order Now</button>
      </div>
    </div>`;

  card.querySelector('.btn-order').addEventListener('click', () => {
    openModal(name, fmtPrice(cake.price));
  });

  return card;
}

// ===== Render featured grid =====
function renderFeatured() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  CAKES.filter(c => c.featured).slice(0, 3).forEach((cake, i) => {
    grid.appendChild(makeCakeCard(cake, i * 0.08));
  });
}

// ===== Render full menu grid =====
function renderMenu() {
  const grid = document.getElementById('menu-grid');
  if (!grid) return;
  CAKES.forEach((cake, i) => {
    grid.appendChild(makeCakeCard(cake, i * 0.05));
  });
}

// ===== Filter & Search =====
let activeFilter = 'all';
let searchQuery  = '';

function applyFilters() {
  const cards = document.querySelectorAll('#menu-grid .cake-card');
  let shown = 0;
  cards.forEach(card => {
    const catOk    = activeFilter === 'all' || card.dataset.category === activeFilter;
    const searchOk = !searchQuery || card.dataset.name.includes(searchQuery);
    const visible  = catOk && searchOk;
    card.classList.toggle('hidden', !visible);
    if (visible) shown++;
  });
  const noRes = document.getElementById('no-results');
  if (noRes) noRes.style.display = shown === 0 ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      applyFilters();
    });
  });

  // Search
  const searchInput = document.getElementById('cake-search');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }
});

// ===== Loader =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('out');
    checkReveal();
  }, 1700);
});

// ===== Navbar scroll style =====
const navbar   = document.getElementById('navbar');
const backTop  = document.getElementById('back-top');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (navbar)  navbar.classList.toggle('scrolled', y > 50);
  if (backTop) backTop.classList.toggle('show', y > 420);
  updateActiveNav();
  checkReveal();
}, { passive: true });

// ===== Highlight active nav link =====
function updateActiveNav() {
  const offset = 100;
  let current  = '';
  document.querySelectorAll('section[id]').forEach(s => {
    if (window.scrollY >= s.offsetTop - offset) current = s.id;
  });
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

// ===== Hamburger menu =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', e => {
    e.stopPropagation();
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
  document.addEventListener('click', e => {
    if (navbar && !navbar.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
}

// ===== Smooth scroll (offset for fixed nav) =====
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const target = document.querySelector(a.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
});

// ===== Scroll reveal =====
function checkReveal() {
  document.querySelectorAll('.reveal').forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 72) el.classList.add('visible');
  });
}

function addRevealClasses() {
  // Section headers
  document.querySelectorAll('.section-header').forEach(el => el.classList.add('reveal'));
  // About
  const av = document.querySelector('.about-visual');
  const at = document.querySelector('.about-text');
  if (av) av.classList.add('reveal', 'from-left');
  if (at) at.classList.add('reveal', 'from-right');
  // Why cards — staggered
  document.querySelectorAll('.why-card').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i * 0.09) + 's';
  });
  // Testimonials
  document.querySelectorAll('.testimonial-card').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i * 0.12) + 's';
  });
  // Contact cards
  document.querySelectorAll('.contact-card').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i * 0.08) + 's';
  });
  // Delivery
  const dc = document.querySelector('.delivery-card');
  if (dc) dc.classList.add('reveal');
}

// ===== Back to top =====
if (backTop) {
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== Modal =====
let _cakeName = '';

function openModal(cakeName, cakePrice) {
  _cakeName = cakeName;
  const overlay = document.getElementById('modal-overlay');
  const label   = document.getElementById('modal-cake-label');
  const form    = document.getElementById('order-form');
  const success = document.getElementById('modal-success');

  if (label)   label.textContent = 'Ordering: ' + cakeName + ' — ' + cakePrice;
  if (form)    form.style.display = 'block';
  if (success) success.style.display = 'none';

  // Set delivery date min = tomorrow
  const dateEl = document.getElementById('f-date');
  if (dateEl) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm   = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd   = String(tomorrow.getDate()).padStart(2, '0');
    dateEl.min   = yyyy + '-' + mm + '-' + dd;
    dateEl.value = yyyy + '-' + mm + '-' + dd;
  }

  // Reset quantity
  const qtyEl = document.getElementById('f-qty');
  if (qtyEl) qtyEl.value = 1;

  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

const modalClose   = document.getElementById('modal-close');
const modalOverlay = document.getElementById('modal-overlay');

if (modalClose)   modalClose.addEventListener('click', closeModal);
if (modalOverlay) {
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ===== Quantity controls =====
const qtyMinus = document.getElementById('qty-minus');
const qtyPlus  = document.getElementById('qty-plus');

if (qtyMinus) qtyMinus.addEventListener('click', () => {
  const el  = document.getElementById('f-qty');
  const val = parseInt(el.value, 10) || 1;
  if (val > 1) el.value = val - 1;
});
if (qtyPlus) qtyPlus.addEventListener('click', () => {
  const el  = document.getElementById('f-qty');
  const val = parseInt(el.value, 10) || 1;
  if (val < 10) el.value = val + 1;
});

// ===== Order form submit =====
const orderForm = document.getElementById('order-form');
if (orderForm) {
  orderForm.addEventListener('submit', e => {
    e.preventDefault();

    const name    = document.getElementById('f-name').value.trim();
    const phone   = document.getElementById('f-phone').value.trim();
    const qty     = document.getElementById('f-qty').value;
    const size    = document.getElementById('f-size').value;
    const date    = document.getElementById('f-date').value;
    const address = document.getElementById('f-address').value.trim();
    const notes   = document.getElementById('f-notes').value.trim();

    const msg = [
      'Hi Born2Bake! 🎂',
      '',
      'New Order Request:',
      '• Cake: '     + _cakeName,
      '• Quantity: ' + qty,
      '• Size: '     + size,
      '• Name: '     + name,
      '• Phone: '    + phone,
      '• Delivery Date: ' + date,
      '• Address: '  + address,
      notes ? '• Notes: ' + notes : '',
    ].filter(Boolean).join('\n');

    const waLink = document.getElementById('success-wa');
    if (waLink) {
      waLink.href = 'https://wa.me/917898398844?text=' + encodeURIComponent(msg);
    }

    orderForm.style.display = 'none';
    const success = document.getElementById('modal-success');
    if (success) success.style.display = 'block';
  });
}

// ===== Init on DOM ready =====
document.addEventListener('DOMContentLoaded', () => {
  renderFeatured();
  renderMenu();
  addRevealClasses();
  checkReveal();
});
