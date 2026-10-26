fetch('../data/facts.json')
  .then(r => r.json())
  .then(f => {
    document.getElementById('problem').textContent = f.problem;
    document.getElementById('source').textContent = 'Source: ' + f.source;

    document.getElementById('trend-text').textContent =
      `Road deaths rose from ${f.deaths['2015'].toLocaleString()} in 2015 to ${f.deaths['2025'].toLocaleString()} in 2025, about ${f.deaths.per_hour_2025} every hour.`;

    document.getElementById('compare-text').textContent =
      `Vietnam requires ${f.vietnam_pass_mark_pct}% to pass its driving test, yet its fatality rate is ${f.fatality_rate_per_lakh.Vietnam} per lakh. Singapore, without the toughest test, has ${f.fatality_rate_per_lakh.Singapore}. India is at ${f.fatality_rate_per_lakh.India}.`;

    document.getElementById('enforcement-text').textContent =
      `E-challans worth Rs ${f.unpaid_echallans_crore.toLocaleString()} crore remain unpaid across states. Example: ${f.example}. When offenders know nothing will happen, attitudes do not change.`;

    document.getElementById('argument').textContent = f.argument;

    new Chart(document.getElementById('trendChart'), {
      type: 'bar',
      data: { labels: ['2015', '2025'], datasets: [{ label: 'Road deaths', data: [f.deaths['2015'], f.deaths['2025']], backgroundColor: ['#7aa6d6', '#c0392b'] }] }
    });

    new Chart(document.getElementById('compareChart'), {
      type: 'bar',
      data: { labels: Object.keys(f.fatality_rate_per_lakh), datasets: [{ label: 'Deaths per lakh population', data: Object.values(f.fatality_rate_per_lakh), backgroundColor: ['#c0392b', '#e0a030', '#2e8b57'] }] }
    });
  });