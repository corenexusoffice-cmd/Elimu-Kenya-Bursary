// Fill in from Supabase > Project Settings > API.
// The publishable key is safe in the browser: tables are locked by RLS.
window.ELIMU = {
  url: 'https://tjkazupgohdpjptekhqk.supabase.co',
  key: 'sb_publishable_c7h-3JXJzu_W6RXVETYXJg_DGdC2WQk'
};

// Band → fee (KES) and bursary amount (KES)
window.FEES    = { 1: 300, 2: 250, 3: 200, 4: 150, 5: 100 };
window.AMOUNTS = { 1: 20000, 2: 16250, 3: 12500, 4: 8750, 5: 5000 };

// Currency formatter
window.money = n => 'KSh ' + Number(n).toLocaleString('en-KE');

// RPC caller
window.rpc = async (fn, body) => {
  const c = window.ELIMU;
  if (!c.url) return null;
  const r = await fetch(c.url + '/rest/v1/rpc/' + fn, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: c.key
    },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
};
