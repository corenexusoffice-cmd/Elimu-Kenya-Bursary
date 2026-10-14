document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('applyForm');
  const msg = document.getElementById('applyMsg');
  const success = document.getElementById('applySuccess');
  const bandSelect = document.getElementById('band');
  const bandInfo = document.getElementById('bandInfo');

  // Show fee/amount preview when band changes
  bandSelect.addEventListener('change', () => {
    const b = parseInt(bandSelect.value, 10);
    if (window.FEES[b]) {
      bandInfo.textContent = `Amount: ${window.money(window.AMOUNTS[b])} · Fee: ${window.money(window.FEES[b])}`;
    } else {
      bandInfo.textContent = '';
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = 'Submitting…';
    msg.className = 'msg';

    const fd = new FormData(form);
    const payload = {};
    fd.forEach((v, k) => { payload[k] = v; });

    try {
      const res = await window.rpc('submit_application', { p: payload });
      if (!res) throw new Error('Not configured. Missing Supabase credentials.');

      document.getElementById('refCode').textContent = res.ref;
      document.getElementById('refAmount').textContent = window.money(res.amount);
      document.getElementById('refFee').textContent = window.money(res.fee);

      form.hidden = true;
      success.hidden = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      msg.textContent = 'Error: ' + err.message;
      msg.className = 'msg error';
    }
  });
});
