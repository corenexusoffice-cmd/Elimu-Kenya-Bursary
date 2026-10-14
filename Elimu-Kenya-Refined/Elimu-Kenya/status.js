document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('statusForm');
  const msg = document.getElementById('statusMsg');
  const result = document.getElementById('statusResult');
  const valueEl = document.getElementById('statusValue');

  const labels = {
    pending_payment:    '⏳ Pending payment',
    payment_submitted:  '🔍 Payment under review',
    verified:           '✅ Verified — bursary approved',
    rejected:           '❌ Rejected'
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = 'Checking…';
    msg.className = 'msg';
    result.hidden = true;

    const ref = (new FormData(form).get('ref') || '').trim().toUpperCase();

    try {
      const status = await window.rpc('application_status', { p_ref: ref });
      if (!status) {
        msg.textContent = 'Reference not found.';
        msg.className = 'msg error';
        return;
      }
      msg.textContent = '';
      valueEl.textContent = labels[status] || status;
      result.hidden = false;
    } catch (err) {
      msg.textContent = 'Error: ' + err.message;
      msg.className = 'msg error';
    }
  });
});
