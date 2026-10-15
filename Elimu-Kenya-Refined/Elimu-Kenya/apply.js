'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('applyForm');
  const msg = document.getElementById('applyMsg');
  const bandSelect = document.getElementById('band');
  const bandInfo = document.getElementById('bandInfo');

  const paymentStep = document.getElementById('paymentStep');
  const payNumber = document.getElementById('payNumber');
  const payRefDisplay = document.getElementById('payRefDisplay');
  const payFeeDisplay = document.getElementById('payFeeDisplay');
  const copyBtn = document.getElementById('copyNumber');
  const mpesaMessage = document.getElementById('mpesaMessage');
  const confirmPayment = document.getElementById('confirmPayment');
  const payStepMsg = document.getElementById('payStepMsg');
  const celebration = document.getElementById('celebration');
  const celebrateRef = document.getElementById('celebrateRef');

  let currentRef = null;

  // Show amount + fee preview when band changes
  bandSelect.addEventListener('change', () => {
    const b = parseInt(bandSelect.value, 10);
    if (window.AMOUNTS[b] && window.FEES[b]) {
      bandInfo.textContent =
        `Award: ${window.money(window.AMOUNTS[b])} · Processing fee: ${window.money(window.FEES[b])}`;
    } else {
      bandInfo.textContent = '';
    }
  });

  // Step 1: submit application details → get reference + fee
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = 'Submitting your details…';
    msg.className = 'msg';

    const fd = new FormData(form);
    const payload = {};
    fd.forEach((v, k) => { payload[k] = v; });

    try {
      const res = await window.rpc('submit_application', { p: payload });
      if (!res || !res.ref) throw new Error('Could not create application. Please try again.');

      currentRef = res.ref;
      payRefDisplay.textContent = res.ref;
      payFeeDisplay.textContent = window.money(res.fee);
      payNumber.textContent = window.PAY_NUMBER_DISPLAY;

      form.hidden = true;
      paymentStep.hidden = false;
      paymentStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      msg.textContent = 'Error: ' + err.message;
      msg.className = 'msg error';
    }
  });

  // Copy the Send Money number
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.PAY_NUMBER);
      copyBtn.textContent = 'Copied ✓';
      setTimeout(() => { copyBtn.textContent = 'Copy number'; }, 1800);
    } catch {
      copyBtn.textContent = 'Copy failed — copy manually';
    }
  });

  // Step 2: paste M-Pesa message → confirm payment → celebration
  confirmPayment.addEventListener('click', async () => {
    const raw = (mpesaMessage.value || '').trim();
    if (!raw) {
      payStepMsg.textContent = 'Please paste your M-Pesa confirmation message.';
      payStepMsg.className = 'msg error';
      return;
    }

    // Extract the 10-character M-Pesa code (e.g. QJ12AB34CD)
    const match = raw.match(/\b[A-Z0-9]{10}\b/i);
    const code = match ? match[0].toUpperCase() : null;

    if (!code) {
      payStepMsg.textContent = 'Could not find a valid M-Pesa confirmation code in the message. Please paste the full SMS.';
      payStepMsg.className = 'msg error';
      return;
    }

    payStepMsg.textContent = 'Verifying your payment…';
    payStepMsg.className = 'msg';

    try {
      // Phone is optional here; reuse the applicant phone
      const phone = (form.elements['phone'] && form.elements['phone'].value) || '';
      await window.rpc('submit_payment', {
        p_ref: currentRef,
        p_code: code,
        p_phone: phone
      });

      // Celebration
      celebrateRef.textContent = currentRef;
      celebration.hidden = false;
      celebration.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      payStepMsg.textContent = 'Error: ' + err.message;
      payStepMsg.className = 'msg error';
    }
  });
});
