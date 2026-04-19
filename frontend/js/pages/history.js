async function renderHistory() {
  const el = document.getElementById('main-content');
  el.innerHTML = `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">Mes séances</h1>
      </div>
      <div class="history-filters">
        <select id="filter-type">
          <option value="">Tous les types</option>
          <option value="push">Push</option>
          <option value="pull">Pull</option>
          <option value="legs">Legs</option>
          <option value="full_body">Full body</option>
          <option value="custom">Autre</option>
        </select>
      </div>
      <div id="history-list" class="history-list">
        <div class="loading"><div class="spinner"></div> Chargement...</div>
      </div>
    </div>`;

  loadHistory();

  document.getElementById('filter-type').addEventListener('change', (e) => {
    const type = e.target.value;
    loadHistory(type);
  });
}

async function loadHistory(type = '') {
  const list = document.getElementById('history-list');
  list.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
  try {
    const params = type ? `type=${type}` : '';
    const workouts = await api.workouts.list(params);
    if (!workouts.length) {
      list.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>
          <h3>Aucune séance</h3>
          <p>Vos séances terminées apparaîtront ici.</p>
        </div>`;
      return;
    }
    list.innerHTML = workouts.map(w => historyItemHtml(w)).join('');
    bindHistoryEvents(list, workouts);
  } catch (err) {
    list.innerHTML = `<div class="empty-state"><p>${err.message}</p></div>`;
  }
}

function historyItemHtml(w) {
  const date = new Date(w.created_at);
  const day = date.getDate();
  const month = date.toLocaleDateString('fr-FR', { month: 'short' });

  return `
    <div class="history-item" data-id="${w.id}">
      <div class="history-date-badge">
        <div class="history-date-day">${day}</div>
        <div class="history-date-month">${month}</div>
      </div>
      <div class="history-info">
        <div class="history-title">${w.title}</div>
        <div class="history-meta">${formatDuration(w.duration_minutes)} · ${w.type || 'Custom'}</div>
      </div>
      <div class="history-actions">
        <button class="btn-ghost view-workout-btn" data-id="${w.id}">
          <svg viewBox="0 0 24 24" style="width:18px;height:18px"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
        </button>
        <button class="btn-ghost delete-workout-btn" data-id="${w.id}" style="color:var(--text-muted)">
          <svg viewBox="0 0 24 24" style="width:18px;height:18px"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        </button>
      </div>
    </div>`;
}

function bindHistoryEvents(list, workouts) {
  list.querySelectorAll('.view-workout-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      await showWorkoutModal(id);
    });
  });

  list.querySelectorAll('.history-item').forEach(item => {
    item.addEventListener('click', async () => {
      await showWorkoutModal(item.dataset.id);
    });
  });

  list.querySelectorAll('.delete-workout-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (!confirm('Supprimer cette séance ?')) return;
      try {
        await api.workouts.delete(btn.dataset.id);
        btn.closest('.history-item').remove();
        toast('Séance supprimée');
      } catch (err) { toast(err.message); }
    });
  });
}

async function showWorkoutModal(id) {
  try {
    const w = await api.workouts.get(id);
    const exHtml = (w.exercises || []).map(ex => `
      <div class="modal-exercise">
        <div class="modal-exercise-name">${ex.name}</div>
        ${(ex.sets || []).map((s, i) => `
          <div class="modal-set-row">
            Série ${i + 1} :
            ${s.weight ? `${s.weight}kg` : ''}
            ${s.reps ? `× ${s.reps} reps` : ''}
            ${s.distance ? `${s.distance}m` : ''}
            ${s.duration_seconds ? `${s.duration_seconds}s` : ''}
          </div>`).join('')}
      </div>`).join('');

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <div>
            <div class="modal-title">${w.title}</div>
            <div class="text-secondary text-sm">${formatDate(w.created_at)} · ${formatDuration(w.duration_minutes)}</div>
          </div>
          <button class="icon-btn close-modal-btn">
            <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
        ${exHtml || '<p class="text-secondary">Aucun exercice enregistré</p>'}
      </div>`;

    modal.querySelector('.close-modal-btn').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
  } catch (err) { toast(err.message); }
}
