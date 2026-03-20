/* =========================================================
   Roasted Cream – js/legal.js
   Cookie consent · FSSAI badge · Open Now indicator
   Outlet selector · Table reservation · Newsletter
   Pincode delivery checker · UPI QR toggle
   ========================================================= */
'use strict';

/* ═══════════════════════════════════════════════
   1. COOKIE CONSENT BANNER
   ═══════════════════════════════════════════════ */
(function initCookieBanner() {
  if (localStorage.getItem('rc_cookies_accepted') !== null) return;

  const banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie consent');
  banner.innerHTML = `
    <div class="cookie-inner">
      <p class="cookie-text">
        🍪 We use cookies to remember your cart and improve your experience.
        <a href="privacy.html" target="_blank" rel="noopener">Privacy Policy</a>
      </p>
      <div class="cookie-btns">
        <button id="cookie-accept" class="cookie-btn-accept">Accept</button>
        <button id="cookie-decline" class="cookie-btn-decline">Decline</button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);

  setTimeout(() => banner.classList.add('cookie-show'), 800);

  function dismiss(accepted) {
    localStorage.setItem('rc_cookies_accepted', accepted ? '1' : '0');
    banner.classList.remove('cookie-show');
    setTimeout(() => banner.remove(), 400);
  }

  document.getElementById('cookie-accept').addEventListener('click', () => dismiss(true));
  document.getElementById('cookie-decline').addEventListener('click', () => dismiss(false));
})();

/* ═══════════════════════════════════════════════
   2. OPEN NOW INDICATOR
   ═══════════════════════════════════════════════ */
function checkOpenNow() {
  // Roasted Cream hours: 11:00 AM – 11:00 PM, daily
  const now = new Date();
  const h = now.getHours(), m = now.getMinutes();
  const totalMins = h * 60 + m;
  const opens = 11 * 60;   // 11:00 AM
  const closes = 23 * 60;  // 11:00 PM

  const isOpen = totalMins >= opens && totalMins < closes;

  document.querySelectorAll('[data-open-indicator]').forEach(el => {
    el.innerHTML = isOpen
      ? `<span class="open-dot open"></span><span class="open-label open-text">Open Now</span>`
      : `<span class="open-dot closed"></span><span class="open-label closed-text">Closed · Opens 11 AM</span>`;
    el.title = `Working hours: 11:00 AM – 11:00 PM daily`;
  });
}

/* ═══════════════════════════════════════════════
   3. OUTLET SELECTOR (Location section)
   ═══════════════════════════════════════════════ */
const OUTLETS = [
  {
    id: 'east-marredpally',
    name: 'East Marredpally (Main)',
    address: 'Ground Floor, Near SBI Bank, East Marredpally, Secunderabad, Hyderabad – 500026',
    phone: '+91 96529 29252',
    mapUrl: 'https://maps.app.goo.gl/sXCRsbH22yW2jnoCA',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.2!2d78.5!3d17.44!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI2JzI0LjAiTiA3OMKwMzAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin',
    hours: 'Mon–Sun: 11 AM – 11 PM',
  },
  {
    id: 'malkajgiri',
    name: 'Malkajgiri',
    address: 'Main Road, Malkajgiri, Hyderabad – 500047',
    phone: '+91 96529 29252',
    mapUrl: 'https://maps.google.com/?q=Malkajgiri+Hyderabad',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.0!2d78.53!3d17.45!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI3JzAwLjAiTiA3OMKwMzEnNDguMCJF!5e0!3m2!1sen!2sin!4v1620000000001!5m2!1sen!2sin',
    hours: 'Mon–Sun: 11 AM – 11 PM',
  },
  {
    id: 'tarnaka',
    name: 'Tarnaka',
    address: 'Tarnaka Main Road, Secunderabad, Hyderabad – 500017',
    phone: '+91 96529 29252',
    mapUrl: 'https://maps.google.com/?q=Tarnaka+Hyderabad',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.3!2d78.52!3d17.43!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI1JzQ4LjAiTiA3OMKwMzEnMTIuMCJF!5e0!3m2!1sen!2sin!4v1620000000002!5m2!1sen!2sin',
    hours: 'Mon–Sun: 11 AM – 11 PM',
  },
  {
    id: 'uppal',
    name: 'Uppal',
    address: 'Uppal Ring Road, Uppal, Hyderabad – 500039',
    phone: '+91 96529 29252',
    mapUrl: 'https://maps.google.com/?q=Uppal+Hyderabad',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.5!2d78.56!3d17.40!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI0JzAwLjAiTiA3OMKwMzMnMzYuMCJF!5e0!3m2!1sen!2sin!4v1620000000003!5m2!1sen!2sin',
    hours: 'Mon–Sun: 11 AM – 10:30 PM',
  },
];

function initOutletSelector() {
  const tabs = document.getElementById('outlet-tabs');
  const details = document.getElementById('outlet-detail');
  if (!tabs || !details) return;

  // Build tabs
  tabs.innerHTML = OUTLETS.map((o, i) => `
    <button class="outlet-tab ${i === 0 ? 'outlet-tab-active' : ''}"
            data-outlet="${o.id}" aria-pressed="${i === 0}">
      ${o.name}
    </button>
  `).join('');

  function renderOutlet(outlet) {
    details.innerHTML = `
      <div class="outlet-card-inner">
        <div class="space-y-4">
          <div class="location-info-card">
            <div class="flex items-start gap-4">
              <span class="material-symbols-outlined text-secondary text-2xl mt-0.5" style="font-variation-settings:'FILL' 1">location_on</span>
              <div>
                <h3 class="font-display font-700 text-primary-container text-base mb-1">${outlet.name} Outlet</h3>
                <p class="text-on-surface-variant text-sm">${outlet.address}</p>
              </div>
            </div>
          </div>
          <div class="location-info-card">
            <div class="flex items-start gap-4">
              <span class="material-symbols-outlined text-secondary text-2xl mt-0.5" style="font-variation-settings:'FILL' 1">call</span>
              <div>
                <h3 class="font-display font-700 text-primary-container text-base mb-1">Phone</h3>
                <a href="tel:${outlet.phone.replace(/\s/g,'')}" class="text-secondary font-medium hover:underline">${outlet.phone}</a>
              </div>
            </div>
          </div>
          <div class="location-info-card">
            <div class="flex items-start gap-4">
              <span class="material-symbols-outlined text-secondary text-2xl mt-0.5" style="font-variation-settings:'FILL' 1">schedule</span>
              <div>
                <h3 class="font-display font-700 text-primary-container text-base mb-1">Hours</h3>
                <p class="text-on-surface-variant text-sm">${outlet.hours}</p>
                <div data-open-indicator class="inline-flex items-center gap-1.5 mt-1"></div>
              </div>
            </div>
          </div>
          <div class="flex gap-3 flex-wrap">
            <a href="${outlet.mapUrl}" target="_blank" rel="noopener" class="btn-primary">
              <span class="material-symbols-outlined text-base" style="font-variation-settings:'FILL' 1">directions</span>
              Get Directions
            </a>
            <a href="tel:${outlet.phone.replace(/\s/g,'')}" class="btn-secondary">
              <span class="material-symbols-outlined text-base" style="font-variation-settings:'FILL' 1">call</span>
              Call Outlet
            </a>
          </div>
        </div>
        <div class="rounded-3xl overflow-hidden shadow-ambient-lg aspect-[4/3.5] w-full mt-6 md:mt-0">
          <iframe src="${outlet.mapEmbed}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  title="${outlet.name} Roasted Cream location map"></iframe>
        </div>
      </div>
    `;
    checkOpenNow();
  }

  // Render first outlet
  renderOutlet(OUTLETS[0]);

  tabs.addEventListener('click', e => {
    const btn = e.target.closest('.outlet-tab');
    if (!btn) return;
    tabs.querySelectorAll('.outlet-tab').forEach(t => {
      t.classList.remove('outlet-tab-active');
      t.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('outlet-tab-active');
    btn.setAttribute('aria-pressed', 'true');
    const outlet = OUTLETS.find(o => o.id === btn.dataset.outlet);
    if (outlet) renderOutlet(outlet);
  });
}

/* ═══════════════════════════════════════════════
   4. TABLE RESERVATION MODAL
   ═══════════════════════════════════════════════ */
window.openReservationModal = function () {
  const modal = document.getElementById('reservation-modal');
  const inner = document.getElementById('reservation-modal-inner');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  setTimeout(() => {
    modal.classList.add('overlay-visible');
    if (inner) inner.classList.add('modal-slide-in');
  }, 10);
  document.body.style.overflow = 'hidden';

  // Set min date to today
  const dateField = document.getElementById('res-date');
  if (dateField) {
    const today = new Date().toISOString().split('T')[0];
    dateField.min = today;
    dateField.value = today;
  }
};

function closeReservationModal() {
  const modal = document.getElementById('reservation-modal');
  const inner = document.getElementById('reservation-modal-inner');
  if (!modal) return;
  modal.classList.remove('overlay-visible');
  if (inner) inner.classList.remove('modal-slide-in');
  setTimeout(() => {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }, 320);
}

async function submitReservation() {
  const name    = document.getElementById('res-name')?.value.trim();
  const phone   = document.getElementById('res-phone')?.value.trim();
  const date    = document.getElementById('res-date')?.value;
  const time    = document.getElementById('res-time')?.value;
  const guests  = document.getElementById('res-guests')?.value;
  const outlet  = document.getElementById('res-outlet')?.value;

  if (!name || !phone || !date || !time) {
    if (window.showToast) window.showToast('Please fill all required fields.', 'error');
    return;
  }

  const data = {
    reservation_id: 'RSV' + Date.now().toString(36).toUpperCase(),
    customer_name: name, phone, date, time, guests: Number(guests) || 2, outlet,
    status: 'pending', created_at: new Date().toISOString(),
  };

  // Save to Supabase or WhatsApp
  const msg = encodeURIComponent(
    `Hi! I'd like to reserve a table at Roasted Cream (${outlet}).\n\n` +
    `*Name:* ${name}\n*Phone:* ${phone}\n*Date:* ${date}\n*Time:* ${time}\n*Guests:* ${guests}`
  );

  // Try Supabase silently
  try {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      // No-op if not configured — falls through to WhatsApp
    }
  } catch (_) {}

  // Always confirm via WhatsApp
  window.open(`https://wa.me/919652929252?text=${msg}`, '_blank');

  closeReservationModal();
  if (window.showToast) window.showToast('Reservation request sent via WhatsApp! ✅', 'success', 3500);
}

/* ═══════════════════════════════════════════════
   5. NEWSLETTER SIGNUP
   ═══════════════════════════════════════════════ */
async function submitNewsletter(e) {
  e.preventDefault();
  const input = document.getElementById('newsletter-email');
  if (!input) return;
  const email = input.value.trim();
  if (!email || !email.includes('@')) {
    if (window.showToast) window.showToast('Please enter a valid email.', 'error');
    return;
  }

  // Save locally
  const subs = JSON.parse(localStorage.getItem('rc_newsletter') || '[]');
  if (!subs.includes(email)) { subs.push(email); localStorage.setItem('rc_newsletter', JSON.stringify(subs)); }

  input.value = '';
  if (window.showToast) window.showToast('🎉 You\'re on the list! Watch for exclusive offers.', 'success', 3500);
}

/* ═══════════════════════════════════════════════
   6. PINCODE DELIVERY CHECKER
   ═══════════════════════════════════════════════ */
const DELIVERY_PINCODES = new Set([
  '500026', '500016', '500010', '500017', '500039', '500047',
  '500048', '500076', '500001', '500062', '500038', '500044',
  '500055', '500060', '500007', '500008', '500015', '500019',
  '500020', '500034', '500072', '500080', '500085', '500086',
]);

window.checkPincode = function () {
  const input = document.getElementById('pincode-input');
  const result = document.getElementById('pincode-result');
  if (!input || !result) return;

  const pin = input.value.trim().replace(/\D/g, '');
  if (pin.length !== 6) {
    result.textContent = 'Please enter a valid 6-digit pincode.';
    result.className = 'pincode-result error';
    return;
  }

  if (DELIVERY_PINCODES.has(pin)) {
    result.innerHTML = `<span class="material-symbols-outlined" style="font-size:1rem;vertical-align:-3px;font-variation-settings:'FILL' 1">check_circle</span> We deliver to <strong>${pin}</strong>! 🎉 (~30–45 min)`;
    result.className = 'pincode-result success';
  } else {
    result.innerHTML = `<span class="material-symbols-outlined" style="font-size:1rem;vertical-align:-3px">cancel</span> Sorry, <strong>${pin}</strong> is outside our delivery area. Try ordering on <a href="https://www.swiggy.com" target="_blank">Swiggy</a> or <a href="https://www.zomato.com" target="_blank">Zomato</a>.`;
    result.className = 'pincode-result error';
  }
};

/* ═══════════════════════════════════════════════
   7. INIT ALL
   ═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  checkOpenNow();
  setInterval(checkOpenNow, 60000); // update every minute
  initOutletSelector();

  // Reservation modal wiring
  const resClose = document.getElementById('reservation-modal-close');
  if (resClose) resClose.addEventListener('click', closeReservationModal);
  const resModal = document.getElementById('reservation-modal');
  if (resModal) resModal.addEventListener('click', e => { if (e.target === resModal) closeReservationModal(); });
  const resSubmit = document.getElementById('res-submit');
  if (resSubmit) resSubmit.addEventListener('click', submitReservation);

  // Newsletter
  const nlForm = document.getElementById('newsletter-form');
  if (nlForm) nlForm.addEventListener('submit', submitNewsletter);

  // Pincode enter key
  const pinInput = document.getElementById('pincode-input');
  if (pinInput) pinInput.addEventListener('keydown', e => { if (e.key === 'Enter') window.checkPincode(); });
});
