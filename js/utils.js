/* =========================================================
   Roasted Cream – js/utils.js
   Shared helpers: formatPrice · showToast · debounce · etc.
   ========================================================= */
'use strict';

/* ─── Currency Formatter ─── */
/**
 * Format a number as Indian Rupees
 * @param {number} amount
 * @param {boolean} showSymbol  default true
 * @returns {string}  e.g. "₹149"
 */
export function formatPrice(amount, showSymbol = true) {
  const num = Number(amount);
  return showSymbol ? `₹${num.toLocaleString('en-IN')}` : num.toLocaleString('en-IN');
}

/* ─── Toast Notification ─── */
let _toastTimer = null;

/**
 * Display a brief toast message at the bottom-right.
 * @param {string} message   HTML or text
 * @param {'success'|'error'|'info'} type
 * @param {number} duration  ms — default 2600
 */
export function showToast(message, type = 'success', duration = 2600) {
  let toast = document.getElementById('rc-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'rc-toast';
    toast.className = 'cart-toast';
    document.body.appendChild(toast);
  }

  // Icon per type
  const icons = {
    success: 'check_circle',
    error:   'error',
    info:    'info',
  };
  const icon = icons[type] || icons.success;

  toast.innerHTML =
    `<span class="material-symbols-outlined" ` +
    `style="font-variation-settings:'FILL' 1;font-size:1.1rem">${icon}</span>` +
    `<span>${message}</span>`;

  if (type === 'error') {
    toast.style.background = 'var(--error)';
  } else if (type === 'info') {
    toast.style.background = 'var(--on-surface-variant)';
  } else {
    toast.style.background = 'var(--primary-container)';
  }

  toast.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    toast.style.background = '';
  }, duration);
}

/* ─── Debounce ─── */
/**
 * Returns a debounced version of fn that delays invocation by wait ms.
 * @param {Function} fn
 * @param {number} wait  ms
 */
export function debounce(fn, wait = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

/* ─── Cart Total (pure, no DOM) ─── */
/**
 * Calculate total from a cart array.
 * @param {Array<{price: number, qty: number}>} cartItems
 * @returns {number}
 */
export function calcCartTotal(cartItems) {
  return cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
}

/* ─── Cart Item Count ─── */
/**
 * @param {Array<{qty: number}>} cartItems
 * @returns {number}
 */
export function calcCartCount(cartItems) {
  return cartItems.reduce((sum, item) => sum + item.qty, 0);
}

/* ─── Generate unique order ID ─── */
/**
 * Returns a readable order ID like "RC1A2B3C"
 * @returns {string}
 */
export function generateOrderId() {
  return 'RC' + Date.now().toString(36).toUpperCase().slice(-6);
}

/* ─── Phone normaliser ─── */
/**
 * Strips all non-digits and returns last 10
 * @param {string} raw
 * @returns {string}
 */
export function normalisePhone(raw) {
  return String(raw).replace(/\D/g, '').slice(-10);
}

/* ─── Escape HTML to prevent XSS in innerHTML ─── */
/**
 * @param {string} str
 * @returns {string}
 */
export function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ─── Smooth scroll to element ─── */
/**
 * @param {string} selector  CSS selector or id (#menu)
 * @param {number} offset    px from top (for fixed navbar)
 */
export function scrollTo(selector, offset = 72) {
  const el = document.querySelector(selector);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

/* ─── Local storage with try/catch ─── */
export const storage = {
  get(key, fallback = null) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { console.warn('[RC] localStorage full'); return false; }
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch { /* noop */ }
  },
};
