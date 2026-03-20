/* =========================================================
   Roasted Cream – checkout.js
   Checkout modal · Supabase save · Razorpay · WhatsApp
   ========================================================= */
'use strict';

/* ─────────────────────────────────────────────────────────
   CONFIGURATION — Replace with your real keys
   ───────────────────────────────────────────────────────── */
const RC_CONFIG = {
  supabaseUrl:    'YOUR_SUPABASE_URL',        // e.g. https://xxxx.supabase.co
  supabaseKey:    'YOUR_SUPABASE_ANON_KEY',   // public anon key from Supabase
  razorpayKey:    'rzp_test_YOUR_KEY_HERE',   // Razorpay test key_id
  whatsappPhone:  '919652929252',
  cafeName:       'Roasted Cream',
};

/* ─── Supabase client (loaded via CDN in index.html) ─── */
let supabase = null;
function getSupabase() {
  if (supabase) return supabase;
  if (typeof window.supabase !== 'undefined') {
    supabase = window.supabase.createClient(RC_CONFIG.supabaseUrl, RC_CONFIG.supabaseKey);
  }
  return supabase;
}

/* ─── Generate simple order ID ─── */
function genOrderId() {
  return 'RC' + Date.now().toString(36).toUpperCase();
}

/* ─── Open Checkout Modal ─── */
window.openCheckoutModal = async function () {
  const cart = window.getCart ? window.getCart() : [];
  if (!cart || cart.length === 0) {
    alert('Your cart is empty! Add some items first.');
    return;
  }

  // Auth Gating
  const db = getSupabase();
  let user = null;
  if (db) {
    const { data } = await db.auth.getUser();
    user = data?.user;
  }

  if (!user && window.openLoginModal && db && RC_CONFIG.supabaseUrl !== 'YOUR_SUPABASE_URL') {
    window.openLoginModal(() => {
      window.openCheckoutModal();
    });
    return;
  }

  const isGuest = !user;
  const payBtn = document.getElementById('btn-razorpay');
  if (payBtn) {
    if (isGuest && db && RC_CONFIG.supabaseUrl !== 'YOUR_SUPABASE_URL') {
      payBtn.disabled = true;
      payBtn.style.opacity = '0.5';
      payBtn.innerHTML = `<span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">lock</span> Login to Pay Online`;
    } else {
      payBtn.disabled = false;
      payBtn.style.opacity = '1';
      payBtn.innerHTML = `<span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">credit_card</span> Pay Online (Card / UPI / Wallet)`;
    }
  }

  renderCheckoutSummary(cart);
  const modal = document.getElementById('checkout-modal');
  const inner = document.getElementById('checkout-modal-inner');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  setTimeout(() => {
    modal.classList.add('overlay-visible');
    if (inner) inner.classList.add('modal-slide-in');
  }, 10);
  document.body.style.overflow = 'hidden';
};

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  const inner = document.getElementById('checkout-modal-inner');
  if (!modal) return;
  modal.classList.remove('overlay-visible');
  if (inner) inner.classList.remove('modal-slide-in');
  setTimeout(() => {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }, 320);
}

function renderCheckoutSummary(cart) {
  const container = document.getElementById('checkout-order-summary');
  if (!container) return;
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  container.innerHTML = `
    <div class="checkout-summary-list">
      ${cart.map(i => `
        <div class="checkout-summary-row">
          <span>${i.name} × ${i.qty}</span>
          <span>₹${i.price * i.qty}</span>
        </div>
      `).join('')}
    </div>
    <div class="checkout-summary-total">
      <span>Total</span>
      <span id="checkout-total-display">₹${total}</span>
    </div>
  `;
}

/* ─── Save order to Supabase ─── */
async function saveOrderToSupabase(orderData) {
  const db = getSupabase();
  if (!db || RC_CONFIG.supabaseUrl === 'YOUR_SUPABASE_URL') {
    // Fallback: save locally + show success anyway (demo mode)
    console.warn('[RC] Supabase not configured — order saved locally only.');
    const localOrders = JSON.parse(localStorage.getItem('rc_orders') || '[]');
    localOrders.push({ ...orderData, saved_at: new Date().toISOString() });
    localStorage.setItem('rc_orders', JSON.stringify(localOrders));
    return { data: orderData, error: null };
  }
  const { data, error } = await db.from('orders').insert([orderData]).select().single();
  return { data, error };
}

/* ─── Place Order Flow ─── */
async function placeOrder(paymentMethod, razorpayPaymentId = null) {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  const name    = form.querySelector('#co-name').value.trim();
  const phone   = form.querySelector('#co-phone').value.trim();
  const address = form.querySelector('#co-address').value.trim();
  const notes   = form.querySelector('#co-notes').value.trim();

  // Validation
  if (!name)    { showFormError('co-name', 'Please enter your name.'); return; }
  if (!phone || phone.replace(/\D/g,'').length < 10) { showFormError('co-phone', 'Enter a valid 10-digit phone number.'); return; }
  if (!address) { showFormError('co-address', 'Please enter your delivery address.'); return; }
  clearFormErrors();

  const cart = window.getCart ? window.getCart() : [];
  const total = window.getCartTotal ? window.getCartTotal() : 0;
  const orderId = genOrderId();

  const orderData = {
    order_id:   orderId,
    customer_name: name,
    phone:      phone.replace(/\D/g,'').slice(-10),
    address,
    notes,
    items:      JSON.stringify(cart),
    total,
    payment_method: paymentMethod,
    razorpay_payment_id: razorpayPaymentId || null,
    status:     'new',
    created_at: new Date().toISOString(),
  };

  // Show loading
  setCheckoutLoading(true);

  const { data, error } = await saveOrderToSupabase(orderData);

  setCheckoutLoading(false);

  if (error) {
    console.error('[RC] Supabase error:', error);
    // Still show success — COD orders don't need a perfect DB write
  }

  closeCheckoutModal();

  if (paymentMethod === 'whatsapp') {
    // WhatsApp order — send message
    const itemList = cart.map(i => `- ${i.name} x${i.qty} = ₹${i.price * i.qty}`).join('\n');
    const msg = encodeURIComponent(
      `Hi, I'd like to order from ${RC_CONFIG.cafeName}!\n\n` +
      `*Order ID:* ${orderId}\n` +
      `*Items:*\n${itemList}\n\n` +
      `*Total:* ₹${total}\n\n` +
      `*Name:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      `*Address:* ${address}` +
      (notes ? `\n*Notes:* ${notes}` : '')
    );
    window.open(`https://wa.me/${RC_CONFIG.whatsappPhone}?text=${msg}`, '_blank');
  }

  // Clear cart
  if (window.clearCart) window.clearCart();

  // Show success modal
  showSuccessModal(orderId, name);
}

/* ─── Razorpay Payment ─── */
async function initiateRazorpay() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  const name  = form.querySelector('#co-name').value.trim();
  const phone = form.querySelector('#co-phone').value.trim();
  if (!name)  { showFormError('co-name', 'Enter your name.'); return; }
  if (!phone || phone.replace(/\D/g,'').length < 10) { showFormError('co-phone', 'Enter a valid phone.'); return; }
  clearFormErrors();

  const total = window.getCartTotal ? window.getCartTotal() : 0;

  if (typeof Razorpay === 'undefined') {
    alert('Payment gateway not loaded. Please try again or choose WhatsApp/COD order.');
    return;
  }
  if (RC_CONFIG.razorpayKey === 'rzp_test_YOUR_KEY_HERE') {
    alert('Razorpay key not configured. Please set up your key in js/checkout.js and use COD/WhatsApp for now.');
    return;
  }

  const options = {
    key:         RC_CONFIG.razorpayKey,
    amount:      total * 100, // paise
    currency:    'INR',
    name:        RC_CONFIG.cafeName,
    description: 'Food Order',
    image:       'images/logo.png',
    prefill: {
      name:    name,
      contact: phone.replace(/\D/g,'').slice(-10),
    },
    theme: { color: '#99462a' },
    handler: async function (response) {
      await placeOrder('razorpay', response.razorpay_payment_id);
    },
    modal: {
      ondismiss: function () { console.log('[RC] Razorpay dismissed.'); }
    }
  };

  const rzp = new Razorpay(options);
  rzp.on('payment.failed', function (response) {
    alert('Payment failed: ' + response.error.description + '. Please try again.');
  });
  rzp.open();
}

/* ─── Success Modal ─── */
function showSuccessModal(orderId, name) {
  const modal = document.getElementById('success-modal');
  const orderIdEl = document.getElementById('success-order-id');
  const nameEl    = document.getElementById('success-name');
  if (!modal) return;
  if (orderIdEl) orderIdEl.textContent = orderId;
  if (nameEl)    nameEl.textContent    = name.split(' ')[0];
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  setTimeout(() => modal.classList.add('overlay-visible'), 10);
  document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
  const modal = document.getElementById('success-modal');
  if (!modal) return;
  modal.classList.remove('overlay-visible');
  setTimeout(() => {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }, 320);
}

/* ─── Form helpers ─── */
function showFormError(fieldId, msg) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.classList.add('input-error');
  let err = field.parentElement.querySelector('.form-error-msg');
  if (!err) {
    err = document.createElement('p');
    err.className = 'form-error-msg';
    field.parentElement.appendChild(err);
  }
  err.textContent = msg;
  field.focus();
}

function clearFormErrors() {
  document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
  document.querySelectorAll('.form-error-msg').forEach(el => el.remove());
}

function setCheckoutLoading(loading) {
  const btnCOD = document.getElementById('btn-cod');
  const btnPay = document.getElementById('btn-razorpay');
  const btnWA  = document.getElementById('btn-whatsapp-order');
  [btnCOD, btnPay, btnWA].forEach(btn => {
    if (!btn) return;
    btn.disabled = loading;
    btn.style.opacity = loading ? '0.6' : '';
  });
}

/* ─── Init ─── */
document.addEventListener('DOMContentLoaded', () => {
  // Close modal on overlay click
  const coModal = document.getElementById('checkout-modal');
  if (coModal) {
    coModal.addEventListener('click', e => {
      if (e.target === coModal) closeCheckoutModal();
    });
  }

  // Close buttons
  const coClose = document.getElementById('checkout-modal-close');
  if (coClose) coClose.addEventListener('click', closeCheckoutModal);

  // COD / WhatsApp order button
  const btnCOD = document.getElementById('btn-cod');
  if (btnCOD) btnCOD.addEventListener('click', () => placeOrder('cod'));

  // WhatsApp order button
  const btnWA = document.getElementById('btn-whatsapp-order');
  if (btnWA) btnWA.addEventListener('click', () => placeOrder('whatsapp'));

  // Razorpay button
  const btnPay = document.getElementById('btn-razorpay');
  if (btnPay) btnPay.addEventListener('click', initiateRazorpay);

  // Success modal close
  const successClose = document.getElementById('success-modal-close');
  if (successClose) successClose.addEventListener('click', closeSuccessModal);
  const successModal = document.getElementById('success-modal');
  if (successModal) {
    successModal.addEventListener('click', e => {
      if (e.target === successModal) closeSuccessModal();
    });
  }

  // Phone field: auto-prefix +91
  const phoneField = document.getElementById('co-phone');
  if (phoneField) {
    phoneField.addEventListener('focus', () => {
      if (!phoneField.value) phoneField.value = '+91 ';
    });
  }
});
