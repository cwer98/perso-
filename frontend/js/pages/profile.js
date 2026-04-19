async function renderProfile(userId) {
  const id = userId || auth.user.id;
  const isMe = id === auth.user.id || !userId;
  const el = document.getElementById('main-content');
  el.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

  try {
    const [user, stats] = await Promise.all([
      api.users.get(id),
      api.users.stats(id)
    ]);

    el.innerHTML = `
      <div class="profile-header">
        ${avatarHtml(user, 80)}
        <div class="profile-info">
          <div class="profile-username">${user.username}</div>
          <div class="profile-bio">${user.bio || (isMe ? 'Ajoutez une bio...' : '')}</div>
          <div class="profile-counts">
            <div class="profile-count-item">
              <div class="profile-count-value">${stats.total_workouts}</div>
              <div class="profile-count-label">Séances</div>
            </div>
            <div class="profile-count-item">
              <div class="profile-count-value">${user.followers || 0}</div>
              <div class="profile-count-label">Abonnés</div>
            </div>
            <div class="profile-count-item">
              <div class="profile-count-value">${user.following || 0}</div>
              <div class="profile-count-label">Abonnements</div>
            </div>
          </div>
        </div>
      </div>

      <div class="profile-actions">
        ${isMe
          ? `<button class="btn-secondary" id="edit-profile-btn">Modifier le profil</button>`
          : `<button class="btn-primary" id="follow-btn" style="width:auto">Suivre</button>`
        }
      </div>

      ${isMe ? `
        <div class="profile-edit-form hidden" id="profile-edit-form">
          <input type="text" id="edit-username" placeholder="Pseudo" value="${user.username}" />
          <input type="text" id="edit-bio" placeholder="Bio" value="${user.bio || ''}" />
          <input type="url" id="edit-avatar" placeholder="URL de photo" value="${user.avatar_url || ''}" />
          <div style="display:flex;gap:0.75rem">
            <button class="btn-primary" id="save-profile-btn">Enregistrer</button>
            <button class="btn-secondary" id="cancel-edit-btn">Annuler</button>
          </div>
        </div>` : ''}

      <div class="page" style="padding-top:0">
        <div style="margin-bottom:1rem;font-size:0.85rem;color:var(--text-secondary);font-weight:600;text-transform:uppercase;letter-spacing:0.5px">
          Séances récentes
        </div>
        <div id="profile-workouts" class="history-list">
          <div class="loading"><div class="spinner"></div></div>
        </div>
      </div>`;

    // Load workouts
    loadProfileWorkouts(id);

    // Bind events
    if (isMe) {
      document.getElementById('edit-profile-btn').addEventListener('click', () => {
        document.getElementById('profile-edit-form').classList.toggle('hidden');
      });

      document.getElementById('cancel-edit-btn').addEventListener('click', () => {
        document.getElementById('profile-edit-form').classList.add('hidden');
      });

      document.getElementById('save-profile-btn').addEventListener('click', async () => {
        const username = document.getElementById('edit-username').value;
        const bio = document.getElementById('edit-bio').value;
        const avatar_url = document.getElementById('edit-avatar').value;
        try {
          const updated = await api.users.update(id, { username, bio, avatar_url });
          auth.user = { ...auth.user, ...updated };
          localStorage.setItem('user', JSON.stringify(auth.user));
          toast('Profil mis à jour');
          renderProfile();
        } catch (err) { toast(err.message); }
      });
    } else {
      document.getElementById('follow-btn').addEventListener('click', async (e) => {
        const btn = e.target;
        const following = btn.dataset.following === '1';
        try {
          if (following) {
            await api.social.unfollow(id);
            btn.textContent = 'Suivre';
            btn.dataset.following = '0';
            btn.className = 'btn-primary';
          } else {
            await api.social.follow(id);
            btn.textContent = 'Abonné';
            btn.dataset.following = '1';
            btn.className = 'btn-secondary';
          }
        } catch (err) { toast(err.message); }
      });
    }

  } catch (err) {
    el.innerHTML = `<div class="empty-state"><p>${err.message}</p></div>`;
  }
}

async function loadProfileWorkouts(userId) {
  const list = document.getElementById('profile-workouts');
  if (!list) return;
  try {
    const workouts = await api.users.workouts(userId);
    if (!workouts.length) {
      list.innerHTML = '<div class="empty-state"><p>Aucune séance publique</p></div>';
      return;
    }
    list.innerHTML = workouts.map(w => {
      const date = new Date(w.created_at);
      return `
        <div class="history-item" style="cursor:default">
          <div class="history-date-badge">
            <div class="history-date-day">${date.getDate()}</div>
            <div class="history-date-month">${date.toLocaleDateString('fr-FR', { month: 'short' })}</div>
          </div>
          <div class="history-info">
            <div class="history-title">${w.title}</div>
            <div class="history-meta">${formatDuration(w.duration_minutes)}</div>
          </div>
        </div>`;
    }).join('');
  } catch {}
}
