import { signInWithOtp, verifyOtp, signInWithGoogle, getSupabaseClient } from './supabase.js';
import { showToast } from './utils.js';

let authCallback = null;
let currentPhone = '';

export function openLoginModal(onSuccess = null) {
  authCallback = onSuccess;
  const modal = document.getElementById('login-modal');
  const inner = document.getElementById('login-modal-inner');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  setTimeout(() => {
    modal.classList.add('overlay-visible');
    if (inner) {
      inner.classList.replace('scale-95', 'scale-100');
      inner.classList.replace('opacity-0', 'opacity-100');
    }
  }, 10);
  document.body.style.overflow = 'hidden';
  resetAuthForms();
}

export function closeLoginModal() {
  const modal = document.getElementById('login-modal');
  const inner = document.getElementById('login-modal-inner');
  if (!modal) return;
  modal.classList.remove('overlay-visible');
  if (inner) {
    inner.classList.replace('scale-100', 'scale-95');
    inner.classList.replace('opacity-100', 'opacity-0');
  }
  setTimeout(() => {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }, 320);
}

function handleLoginSuccess() {
  closeLoginModal();
  updateHeaderAuthUI();
  if (authCallback) {
    authCallback();
    authCallback = null;
  }
}

function resetAuthForms() {
  const phoneForm = document.getElementById('login-phone-form');
  const otpForm = document.getElementById('login-otp-form');
  if (phoneForm) phoneForm.classList.remove('hidden');
  if (otpForm) {
    otpForm.classList.add('hidden');
    otpForm.classList.remove('flex');
  }
  const pi = document.getElementById('login-phone-input');
  const oi = document.getElementById('login-otp-input');
  if (pi) pi.value = '';
  if (oi) oi.value = '';
}

export async function updateHeaderAuthUI() {
  const btns = document.querySelectorAll('.header-auth-trigger');
  
  const db = getSupabaseClient();
  let user = null;
  if (db) {
    const { data } = await db.auth.getUser();
    user = data?.user;
  }
  
  btns.forEach(btn => {
    if (user) {
      const phone = user.phone ? user.phone.replace('+91', '') : '';
      const display = phone || user.email?.split('@')[0] || 'User';
      btn.innerHTML = `<span class="material-symbols-outlined text-xl" style="font-variation-settings:'FILL' 1">person</span>Hi, ${display}`;
      btn.onclick = async () => {
        if (confirm('Do you want to logout?')) {
          await db.auth.signOut();
          window.location.reload();
        }
      };
    } else {
      btn.innerHTML = `<span class="material-symbols-outlined text-xl" style="font-variation-settings:'FILL' 0">person</span>Login`;
      btn.onclick = () => openLoginModal();
    }
  });
}

// Event Listeners setup
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('login-modal');
  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeLoginModal();
    });
  }
  
  const closeBtn = document.getElementById('login-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeLoginModal);
  
  const guestBtn = document.getElementById('btn-continue-guest');
  if (guestBtn) guestBtn.addEventListener('click', () => {
    closeLoginModal();
    if (authCallback) {
      authCallback();
      authCallback = null;
    }
  });

  // Tab switching
  const tabPhone = document.getElementById('tab-phone');
  const tabGoogle = document.getElementById('tab-google');
  const secPhone = document.getElementById('login-phone-section');
  const secGoogle = document.getElementById('login-google-section');

  if (tabPhone && tabGoogle) {
    tabPhone.addEventListener('click', () => {
      tabPhone.classList.replace('text-on-surface-variant', 'text-primary-container');
      tabPhone.classList.add('bg-surface', 'shadow');
      tabGoogle.classList.remove('bg-surface', 'shadow', 'text-primary-container');
      tabGoogle.classList.add('text-on-surface-variant');
      secPhone.classList.remove('hidden');
      secGoogle.classList.add('hidden');
      secGoogle.classList.remove('flex');
    });

    tabGoogle.addEventListener('click', () => {
      tabGoogle.classList.replace('text-on-surface-variant', 'text-primary-container');
      tabGoogle.classList.add('bg-surface', 'shadow');
      tabPhone.classList.remove('bg-surface', 'shadow', 'text-primary-container');
      tabPhone.classList.add('text-on-surface-variant');
      secPhone.classList.add('hidden');
      secGoogle.classList.remove('hidden');
      secGoogle.classList.add('flex', 'flex-col');
    });
  }

  // Forms
  const phoneForm = document.getElementById('login-phone-form');
  const otpForm = document.getElementById('login-otp-form');
  const phoneInput = document.getElementById('login-phone-input');
  const otpInput = document.getElementById('login-otp-input');
  const sendBtn = document.getElementById('btn-send-otp');
  const verifyBtn = document.getElementById('btn-verify-otp');
  const changeBtn = document.getElementById('btn-change-phone');

  if (phoneForm) {
    phoneForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const num = phoneInput.value.replace(/\D/g, '');
      if (num.length < 10) {
        showToast('Enter a valid 10-digit number', 'error');
        return;
      }
      currentPhone = '+91' + num.slice(-10);
      sendBtn.disabled = true;
      sendBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[1.2rem]">progress_activity</span> Sending...';
      
      const { error } = await signInWithOtp(currentPhone);
      
      sendBtn.disabled = false;
      sendBtn.innerHTML = 'Send OTP';

      if (error && error.message.indexOf('Local') === -1) {
        showToast(error.message, 'error');
      } else {
        showToast('OTP sent via SMS', 'success');
        phoneForm.classList.add('hidden');
        otpForm.classList.remove('hidden');
        otpForm.classList.add('flex');
        document.getElementById('otp-phone-display').textContent = '+91 ' + num.slice(-10);
        setTimeout(() => otpInput.focus(), 100);
      }
    });

    otpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const otp = otpInput.value.trim();
      if (otp.length < 4) {
        showToast('Enter complete OTP', 'error');
        return;
      }
      verifyBtn.disabled = true;
      verifyBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[1.2rem]">progress_activity</span> Verifying...';
      
      const { error } = await verifyOtp(currentPhone, otp);
      
      verifyBtn.disabled = false;
      verifyBtn.innerHTML = 'Verify & Continue';

      if (error && error.message.indexOf('Local') === -1) {
        showToast(error.message, 'error');
      } else {
        showToast('Welcome back!', 'success');
        handleLoginSuccess();
      }
    });

    changeBtn.addEventListener('click', resetAuthForms);
  }

  if (document.getElementById('btn-google-login')) {
    document.getElementById('btn-google-login').addEventListener('click', async () => {
      const { error } = await signInWithGoogle();
      if (error) showToast(error.message, 'error');
    });
  }

  // Initial header check
  updateHeaderAuthUI();
});

// Make globally accessible for other scripts like checkout.js
window.openLoginModal = openLoginModal;
