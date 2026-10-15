'use strict';

/* ============================================================
   Elimu Kenya Bursary — Configuration & shared helpers
   ============================================================ */

// ---- Supabase credentials (fill in with your real project) ----
window.SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
window.SUPABASE_ANON_KEY = 'YOUR-PUBLIC-ANON-KEY';

// ---- Bursary award amounts per band ----
window.AMOUNTS = { 1: 20000, 2: 16250, 3: 12500, 4: 8750, 5: 5000 };

// ---- Processing fee per band ----
// Band 1 = 100, Band 2 = 100, Band 3 = 100, Band 4 = 150
// Rule: base 100, +50 per band from Band 4 upward, capped at Band 4.
window.FEES = { 1: 100, 2: 100, 3: 100, 4: 150, 5: 150 };

// ---- Official receiving number for Send Money ----
window.PAY_NUMBER = '0732532860';
window.PAY_NUMBER_DISPLAY = '0732 532 860';

// ---- Money formatter ----
window.money = (n) => 'KSh ' + Number(n || 0).toLocaleString('en-KE');

// ---- Minimal Supabase RPC client (no SDK needed) ----
window.rpc = async function (fn, params) {
  if (!window.SUPABASE_URL || window.SUPABASE_URL.includes('YOUR-PROJECT')) {
    throw new Error('Service is not configured. Please contact support.');
  }
  const res = await fetch(`${window.SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': window.SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + window.SUPABASE_ANON_KEY
    },
    body: JSON.stringify(params || {})
  });
  if (!res.ok) {
    let detail = '';
    try { detail = (await res.json()).message || ''; } catch {}
    throw new Error(detail || `Request failed (${res.status})`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};
