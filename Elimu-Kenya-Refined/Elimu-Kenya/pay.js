document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('payForm');
  const msg = document.getElementById('payMsg');
  const success = document.getElementById('paySuccess');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = 'Submitting…';
    msg.className = 'msg';

    const fd = new FormData(form);
    const ref = (fd.get('ref') || '').trim().toUpperCase();
    const code = (fd.get('code') || '').trim().toUpperCase();
    const phone = (fd.get('phone') || '').trim();

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
