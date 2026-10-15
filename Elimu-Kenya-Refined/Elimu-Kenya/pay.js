'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('payForm');
  const msg = document.getElementById('payMsg');
  const success = document.getElementById('paySuccess');
  const copyBtn = document.getElementById('copyNumber');
  const payNumber = document.getElementById('payNumber');

  payNumber.textContent = window.PAY_NUMBER_DISPLAY;

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.PAY_NUMBER);
      copyBtn.textContent = 'Copied ✓';
      setTimeout(() => { copyBtn.textContent = 'Copy number'; }, 1800);
    } catch {
      copyBtn.textContent = 'Copy failed — copy manually';
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = 'Submitting…';
    msg.className = 'msg';

    const fd = new FormData(form);
    const ref = (fd.get('ref') || '').trim().toUpperCase();
    const raw = (fd.get('message') || '').trim();
    const phone = (fd.get('phone') || '').trim();

    const match = raw.match(/\b[A-Z0-9]{10}\b/i);
    const code = match ? match[0].toUpperCase() : null;

    if (!code) {
      msg.textContent = 'Could not find a valid M-Pesa confirmation code in the message. Please paste the full SMS.';
      msg.className = 'msg error';
      return;
    }

    try {
      await window.rpc('submit_payment', { p_ref: ref, p_code: code, p_phone: phone });
      form.hidden = true;
      success.hidden = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      msg.textContent = 'Error: ' + err.message;
      msg.className = 'msg error';
    }
  });
});
