/* =========================================================
   Roasted Cream – cart.js
   Cart state · localStorage · Drawer UI · Badge counter
   ========================================================= */
'use strict';

/* ─── State ─── */
let cart = JSON.parse(localStorage.getItem('rc_cart') || '[]');

/* ─── Persist ─── */
function saveCart() {
  localStorage.setItem('rc_cart', JSON.stringify(cart));
  renderCartBadge();
  renderCartDrawer();
}

/* ─── Helpers ─── */
function getTotal() {
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}
function getCount() {
  return cart.reduce((sum, i) => sum + i.qty, 0);
}

/* ─── Add item ─── */
window.addToCart = function (name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price: Number(price), qty: 1 });
  }
  saveCart();
  showCartAddedToast(name);
  // pulse the cart icon
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.classList.remove('cart-badge-pop');
    void badge.offsetWidth;
    badge.classList.add('cart-badge-pop');
  }
};

/* ─── Remove item ─── */
window.removeFromCart = function (name) {
  cart = cart.filter(i => i.name !== name);
  saveCart();
};

/* ─── Change quantity ─── */
window.changeQty = function (name, delta) {
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.name !== name);
  saveCart();
};

/* ─── Clear cart ─── */
window.clearCart = function () {
  cart = [];
  saveCart();
};

/* ─── Get cart snapshot ─── */
window.getCart = function () { return cart; };
window.getCartTotal = getTotal;
window.getCartCount = getCount;

/* ─── Badge ─── */
function renderCartBadge() {
  const badges = document.querySelectorAll('.cart-count-badge');
  const count = getCount();
  badges.forEach(b => {
    b.textContent = count;
    b.style.display = count > 0 ? 'flex' : 'none';
  });
}

/* ─── Toast notification ─── */
function showCartAddedToast(name) {
  let toast = document.getElementById('cart-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.className = 'cart-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;font-size:1.1rem">check_circle</span> <span>${name} added to cart!</span>`;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ─── Build Cart Drawer HTML ─── */
function renderCartDrawer() {
  const list = document.getElementById('cart-items-list');
  const subtotalEl = document.getElementById('cart-subtotal');
  const emptyState = document.getElementById('cart-empty');
  const cartFooter = document.getElementById('cart-footer');
  if (!list) return;

  if (cart.length === 0) {
    list.innerHTML = '';
    if (emptyState) emptyState.style.display = 'flex';
    if (cartFooter) cartFooter.style.display = 'none';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (cartFooter) cartFooter.style.display = 'block';

  list.innerHTML = cart.map(item => `
    <div class="cart-item" data-name="${escHtml(item.name)}">
      <div class="cart-item-info">
        <p class="cart-item-name">${escHtml(item.name)}</p>
        <p class="cart-item-price">₹${item.price} each</p>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="changeQty('${escHtml(item.name)}', -1)" aria-label="Decrease quantity">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty('${escHtml(item.name)}', 1)" aria-label="Increase quantity">+</button>
      </div>
      <div class="cart-item-right">
        <p class="cart-item-total">₹${item.price * item.qty}</p>
        <button class="cart-remove-btn" onclick="removeFromCart('${escHtml(item.name)}')" aria-label="Remove item">
          <span class="material-symbols-outlined" style="font-size:1.1rem">delete</span>
        </button>
      </div>
    </div>
  `).join('');

  if (subtotalEl) subtotalEl.textContent = `₹${getTotal()}`;
}

function escHtml(str) {
  return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

/* ─── Drawer open/close ─── */
function openCartDrawer() {
  const overlay = document.getElementById('cart-overlay');
  const drawer = document.getElementById('cart-drawer');
  if (!overlay || !drawer) return;
  renderCartDrawer();
  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  setTimeout(() => {
    overlay.classList.add('overlay-visible');
    drawer.classList.add('drawer-open');
  }, 10);
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  const overlay = document.getElementById('cart-overlay');
  const drawer = document.getElementById('cart-drawer');
  if (!overlay || !drawer) return;
  overlay.classList.remove('overlay-visible');
  drawer.classList.remove('drawer-open');
  setTimeout(() => {
    overlay.classList.remove('flex');
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }, 320);
}

/* ─── Wire up Add to Cart buttons on page ─── */
function wireMenuButtons() {
  document.querySelectorAll('[data-item-name]').forEach(btn => {
    btn.addEventListener('click', function () {
      const name = this.dataset.itemName;
      const price = parseInt(this.dataset.itemPrice, 10);
      addToCart(name, price);
    });
  });
}

/* ─── Init ─── */
document.addEventListener('DOMContentLoaded', () => {
  renderCartBadge();

  // Cart button(s) open drawer
  document.querySelectorAll('[data-open-cart]').forEach(btn => {
    btn.addEventListener('click', openCartDrawer);
  });

  // Close drawer
  const closeBtn = document.getElementById('cart-drawer-close');
  if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);

  const overlay = document.getElementById('cart-overlay');
  if (overlay) {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeCartDrawer();
    });
  }

  // Checkout button in drawer
  const checkoutBtn = document.getElementById('cart-checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      closeCartDrawer();
      setTimeout(() => window.openCheckoutModal && window.openCheckoutModal(), 350);
    });
  }

  wireMenuButtons();
});
