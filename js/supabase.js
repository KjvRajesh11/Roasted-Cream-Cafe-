/* =========================================================
   Roasted Cream – js/supabase.js
   Centralised Supabase client with graceful fallback
   ========================================================= */
'use strict';

/* ─────────────────────────────────────────────────────────
   REPLACE THESE WITH YOUR REAL VALUES
   Get them from: https://app.supabase.com → Settings → API
   ───────────────────────────────────────────────────────── */
const SUPABASE_URL = 'https://ygclfvunwvunugdqbssl.supabase.co';      // e.g. https://xyzcompany.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnY2xmdnVud3Z1bnVnZHFic3NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NjgzMzQsImV4cCI6MjA4OTU0NDMzNH0.CltKy_t-nnXDqrzwrUCSuo7L5C5oqPXYjYUYYkbeb50'; // starts with eyJ...

let _client = null;
let _configured = false;

/**
 * Returns a Supabase client instance.
 * Returns null (gracefully) if keys are not yet configured.
 */
export function getSupabaseClient() {
  if (_client) return _client;

  if (
    SUPABASE_URL === 'YOUR_SUPABASE_URL' ||
    SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY'
  ) {
    console.warn(
      '[RC] Supabase is not configured yet.\n' +
      'Orders will be saved to localStorage only.\n' +
      'See README.md → Supabase Setup.'
    );
    return null;
  }

  if (typeof window.supabase === 'undefined') {
    console.error('[RC] Supabase JS SDK not loaded — check CDN link in <head>.');
    return null;
  }

  try {
    _client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    _configured = true;
    console.info('[RC] Supabase client initialized ✓');
  } catch (err) {
    console.error('[RC] Failed to init Supabase:', err);
    return null;
  }

  return _client;
}

/** True only when keys are set and client initialized */
export function isSupabaseReady() { return _configured && _client !== null; }

/**
 * Insert a new order row.
 * Falls back to localStorage when Supabase is unavailable.
 * @param {object} orderData
 * @returns {{ data, error }}
 */
export async function insertOrder(orderData) {
  const db = getSupabaseClient();

  if (!db) {
    // Local fallback
    const orders = JSON.parse(localStorage.getItem('rc_orders') || '[]');
    orders.push({ ...orderData, _local: true, saved_at: new Date().toISOString() });
    localStorage.setItem('rc_orders', JSON.stringify(orders));
    return { data: orderData, error: null };
  }

  try {
    const { data, error } = await db
      .from('orders')
      .insert([orderData])
      .select()
      .single();
    return { data, error };
  } catch (err) {
    console.error('[RC] Supabase insert failed:', err);
    return { data: null, error: err };
  }
}

/**
 * Fetch recent orders for a given phone number (for order tracking).
 * @param {string} phone  10-digit phone number
 */
export async function fetchOrdersByPhone(phone) {
  const db = getSupabaseClient();
  if (!db) return { data: [], error: 'Not configured' };

  const { data, error } = await db
    .from('orders')
    .select('*')
    .eq('phone', phone)
    .order('created_at', { ascending: false })
    .limit(10);

  return { data: data || [], error };
}
