/* =========================================================
   Roasted Cream – main.js
   Smooth scroll · mobile menu · scroll-spy · menu filter · animations
   Note: Add-to-cart is handled by cart.js
   ========================================================= */

'use strict';

/* ─── DOM references ─── */
const navbar        = document.getElementById('navbar');
const menuToggle    = document.getElementById('menu-toggle');
const mobileMenu    = document.getElementById('mobile-menu');
const hamburgerIcon = document.getElementById('hamburger-icon');
const filterBtns    = document.querySelectorAll('.filter-tab');
const menuCards     = document.querySelectorAll('#menu-grid .menu-card');

/* ─── 1. Navbar scroll-triggered style ─── */
function handleScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

/* ─── 2. Mobile menu toggle ─── */
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('mobile-menu-open');
    if (isOpen) {
      mobileMenu.classList.remove('mobile-menu-open');
      mobileMenu.classList.add('mobile-menu-closed');
      hamburgerIcon.textContent = 'menu';
      menuToggle.setAttribute('aria-expanded', 'false');
    } else {
      mobileMenu.classList.remove('mobile-menu-closed');
      mobileMenu.classList.add('mobile-menu-open');
      hamburgerIcon.textContent = 'close';
      menuToggle.setAttribute('aria-expanded', 'true');
    }
  });
}

/* Close mobile menu when a link is clicked */
if (mobileMenu) {
  mobileMenu.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', () => {
      mobileMenu.classList.remove('mobile-menu-open');
      mobileMenu.classList.add('mobile-menu-closed');
      if (hamburgerIcon) hamburgerIcon.textContent = 'menu';
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ─── 3. Smooth scroll for anchor links ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─── 4. Menu category filter ─── */
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active-tab'));
    btn.classList.add('active-tab');
    const filter = btn.dataset.filter;
    menuCards.forEach(card => {
      const category = card.dataset.category;
      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden-item');
      } else {
        card.classList.add('hidden-item');
      }
    });
  });
});

/* ─── 5. Scroll-triggered fade-up animations ─── */
function initIntersectionObserver() {
  const targets = document.querySelectorAll(
    '#about .grid > *, #menu .menu-card, .feature-card, .review-card, .location-info-card'
  );
  targets.forEach(el => el.classList.add('fade-up'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const siblings = [...(entry.target.parentElement?.children || [])];
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${Math.min(idx * 80, 400)}ms`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));
}

/* ─── 6. Update WhatsApp FAB to include cart summary when cart has items ─── */
function updateWhatsappFab() {
  const fab = document.getElementById('whatsapp-fab');
  if (!fab || !window.getCart) return;
  const cart = window.getCart();
  if (cart.length > 0) {
    const items = cart.map(i => `${i.name} x${i.qty}`).join(', ');
    const total = window.getCartTotal ? window.getCartTotal() : 0;
    const msg = encodeURIComponent(
      `Hi, I want to order from Roasted Cream!\n\nItems: ${items}\nTotal: ₹${total}\n\nPlease confirm my order.`
    );
    fab.href = `https://wa.me/919652929252?text=${msg}`;
  } else {
    fab.href = 'https://wa.me/919652929252?text=Hi%2C%20I%20want%20to%20order%20from%20Roasted%20Cream%20website!';
  }
}

/* ─── 7. Init ─── */
document.addEventListener('DOMContentLoaded', () => {
  initIntersectionObserver();

  // Update WhatsApp FAB every time storage changes (cart updates)
  window.addEventListener('storage', updateWhatsappFab);

  // Also patch saveCart to call updateWhatsappFab
  // (cart.js fires before main.js's DOMContentLoaded, so override after)
  const origAddToCart = window.addToCart;
  if (origAddToCart) {
    window.addToCart = function (...args) {
      origAddToCart(...args);
      updateWhatsappFab();
    };
  }
});
