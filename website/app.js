const load = path => fetch(path).then(r => {
  if (!r.ok) throw new Error(path + ' not found (' + r.status + ')');
  return r.json();
});
const setText = (id, text) => { document.getElementById(id).textContent = text; };

Promise.all([load('../data/facts.json'), load('../data/policies.json')]).then(([f, policies]) => {
  setText('problem', f.problem);
  setText('source', 'Source: ' + f.source);

  const stats = [
    { value: f.deaths['2025'].toLocaleString(), label: 'road deaths in 2025' },
    { value: f.deaths.per_hour_2025, label: 'deaths every hour' },
    { value: 'Rs ' + f.unpaid_echallans_crore.toLocaleString() + ' cr', label: 'unpaid e-challans' },
    { value: f.vietnam_pass_mark_pct + '%', label: 'Vietnam test pass mark' }
  ];
  document.getElementById('stats').innerHTML = stats
    .map(s => `<div class="stat"><strong>${s.value}</strong><span>${s.label}</span></div>`).join('');

  const r = f.fatality_rate_per_lakh;
  setText('trend-text', `Road deaths rose from ${f.deaths['2015'].toLocaleString()} in 2015 to ${f.deaths['2025'].toLocaleString()} in 2025, about ${f.deaths.per_hour_2025} every hour.`);
  setText('compare-text', `Vietnam requires ${f.vietnam_pass_mark_pct}% to pass its driving test, yet its fatality rate is ${r.Vietnam} per lakh. Singapore, without the toughest test, has ${r.Singapore}. India is at ${r.India}. A tough test alone does not make roads safe.`);
  setText('enforcement-text', `E-challans worth Rs ${f.unpaid_echallans_crore.toLocaleString()} crore remain unpaid across states. Example: ${f.example}. When offenders know nothing will happen, attitudes do not change.`);
  setText('argument', f.argument);

  document.getElementById('policy-grid').innerHTML = policies.map(p => `
    <div class="policy">
      <div class="icon">${p.icon}</div>
      <h3>${p.title}</h3>
      <p>${p.action}</p>
      <p class="tradeoff"><b>Trade-off:</b> ${p.tradeoff}</p>
    </div>`).join('');

  new Chart(document.getElementById('trendChart'), {
    type: 'bar',
    data: { labels: ['2015', '2025'], datasets: [{ label: 'Road deaths', data: [f.deaths['2015'], f.deaths['2025']], backgroundColor: ['#7aa6d6', '#c0392b'] }] }
  });
  new Chart(document.getElementById('compareChart'), {
    type: 'bar',
    data: { labels: Object.keys(r), datasets: [{ label: 'Deaths per lakh population', data: Object.values(r), backgroundColor: ['#c0392b', '#e0a030', '#2e8b57'] }] }
  });
}).catch(err => {
  document.body.insertAdjacentHTML('afterbegin',
    `<p style="background:#ffe0e0;color:#900;padding:1rem;margin:0">Data failed to load: ${err.message}</p>`);
  console.error(err);
});