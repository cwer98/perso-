let dashCharts = {};

async function renderDashboard() {
  const el = document.getElementById('main-content');
  el.innerHTML = `
    <div class="dashboard">
      <div class="page-header">
        <h1 class="page-title">Ma progression</h1>
      </div>
      <div class="loading"><div class="spinner"></div> Chargement...</div>
    </div>`;

  try {
    const stats = await api.users.stats(auth.user.id);
    renderDashboardContent(stats, el.querySelector('.dashboard'));
  } catch (err) {
    el.querySelector('.dashboard').innerHTML += `<p class="text-secondary">${err.message}</p>`;
  }
}

function renderDashboardContent(stats, container) {
  Object.values(dashCharts).forEach(c => { try { c.destroy(); } catch {} });
  dashCharts = {};

  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Ma progression</h1>
    </div>

    <!-- GLOBAL STATS -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card-value">${stats.total_workouts}</div>
        <div class="stat-card-label">Séances</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-value">${formatDuration(stats.total_minutes)}</div>
        <div class="stat-card-label">Temps total</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-value">${stats.max_weight ? stats.max_weight + 'kg' : '–'}</div>
        <div class="stat-card-label">Poids max</div>
      </div>
    </div>

    <!-- WEEKLY VOLUME -->
    <div class="chart-card">
      <div class="chart-card-title">Séances par semaine (12 dernières semaines)</div>
      <div class="chart-wrap"><canvas id="weekly-chart"></canvas></div>
    </div>

    <!-- EXERCISE PROGRESSION -->
    <div class="chart-card">
      <div class="chart-card-title">Évolution des charges</div>
      <select class="exercise-select" id="exercise-select">
        <option value="">Sélectionnez un exercice</option>
        ${(stats.by_exercise || []).map(e => `<option value="${e.name}">${e.name}</option>`).join('')}
      </select>
      <div class="chart-wrap"><canvas id="progression-chart"></canvas></div>
    </div>

    <!-- RECORDS -->
    <div class="chart-card">
      <div class="chart-card-title">Records personnels (poids max)</div>
      <div class="record-list">
        ${(stats.by_exercise || []).slice(0, 10).map(e => `
          <div class="record-item">
            <span>${e.name}</span>
            <span class="record-weight">${e.max_weight} kg</span>
          </div>`).join('') || '<p class="text-secondary">Aucune donnée encore</p>'}
      </div>
    </div>`;

  // Weekly chart
  const weeklyCtx = document.getElementById('weekly-chart');
  if (weeklyCtx && stats.weekly?.length) {
    const labels = stats.weekly.slice().reverse().map(w => {
      const d = new Date(w.week);
      return `${d.getDate()}/${d.getMonth() + 1}`;
    });
    const data = stats.weekly.slice().reverse().map(w => w.count);
    dashCharts.weekly = new Chart(weeklyCtx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Séances',
          data,
          backgroundColor: 'rgba(212, 255, 59, 0.7)',
          borderColor: '#d4ff3b',
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      options: chartOptions('Séances')
    });
  }

  // Progression chart
  const select = document.getElementById('exercise-select');
  select?.addEventListener('change', () => {
    const name = select.value;
    const ex = (stats.by_exercise || []).find(e => e.name === name);
    if (!ex) return;
    renderProgressionChart(ex);
  });
}

function renderProgressionChart(ex) {
  if (dashCharts.progression) { try { dashCharts.progression.destroy(); } catch {} }
  const ctx = document.getElementById('progression-chart');
  if (!ctx || !ex.history?.length) return;

  const sorted = [...ex.history].sort((a, b) => new Date(a.date) - new Date(b.date));
  const labels = sorted.map(p => {
    const d = new Date(p.date);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  });
  const data = sorted.map(p => parseFloat(p.weight));

  dashCharts.progression = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: ex.name,
        data,
        borderColor: '#d4ff3b',
        backgroundColor: 'rgba(212, 255, 59, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#d4ff3b',
        pointRadius: 4,
        fill: true,
        tension: 0.3,
      }]
    },
    options: chartOptions('kg')
  });
}

function chartOptions(yLabel) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#888', font: { size: 11 } }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#888', font: { size: 11 } },
        title: { display: true, text: yLabel, color: '#888', font: { size: 11 } }
      }
    }
  };
}
