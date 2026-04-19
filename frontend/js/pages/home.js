async function renderHome() {
  const el = document.getElementById('main-content');
  el.innerHTML = `
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">Fil d'actualité</h1>
      </div>
      <div id="feed" class="feed">
        <div class="loading"><div class="spinner"></div> Chargement...</div>
      </div>
    </div>`;

  try {
    const workouts = await api.feed.get();
    const feed = document.getElementById('feed');
    if (!workouts.length) {
      feed.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          <h3>Personne à suivre encore</h3>
          <p>Cherchez des utilisateurs et suivez-les pour voir leurs séances ici.</p>
        </div>`;
      return;
    }
    feed.innerHTML = workouts.map(w => workoutCardHtml(w)).join('');
    bindFeedEvents(feed, workouts);
  } catch (err) {
    document.getElementById('feed').innerHTML = `<div class="empty-state"><p>${err.message}</p></div>`;
  }
}

function workoutCardHtml(w) {
  const exTags = (w.exercises || []).slice(0, 5).map(e =>
    `<span class="exercise-tag">${e.name}</span>`
  ).join('');
  const moreEx = w.exercises && w.exercises.length > 5 ? `<span class="exercise-tag">+${w.exercises.length - 5}</span>` : '';

  return `
    <div class="workout-card" data-id="${w.id}">
      <div class="card-header">
        ${avatarHtml(w)}
        <div class="card-meta">
          <div class="card-username">${w.username}</div>
          <div class="card-date">${timeAgo(w.created_at)}</div>
        </div>
      </div>
      <div class="card-body">
        <div class="card-title">${w.title}</div>
        <div class="card-stats">
          <div class="stat-item">
            <div class="stat-value">${formatDuration(w.duration_minutes)}</div>
            <div class="stat-label">Durée</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${(w.exercises || []).length}</div>
            <div class="stat-label">Exercices</div>
          </div>
        </div>
        <div class="card-exercises">${exTags}${moreEx}</div>
      </div>
      <div class="card-actions">
        <button class="kudos-btn ${w.user_liked ? 'liked' : ''}" data-workout-id="${w.id}" data-liked="${w.user_liked ? '1' : '0'}">
          <svg viewBox="0 0 24 24"><path d="${w.user_liked ? 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' : 'M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z'}"/></svg>
          <span class="kudos-count">${w.kudos_count || 0}</span>
        </button>
        <button class="comment-toggle" data-workout-id="${w.id}">
          <svg viewBox="0 0 24 24"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
          <span>${w.comments_count || 0}</span>
        </button>
      </div>
      <div class="comments-section" data-workout-id="${w.id}">
        <div class="comments-list"></div>
        <div class="comment-input-row">
          <input type="text" placeholder="Ajouter un commentaire..." class="comment-input" />
          <button class="btn-primary send-comment-btn" style="width:auto;padding:0.4rem 0.8rem">Envoyer</button>
        </div>
      </div>
    </div>`;
}

function bindFeedEvents(feed, workouts) {
  // Kudos
  feed.querySelectorAll('.kudos-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const wid = btn.dataset.workoutId;
      const liked = btn.dataset.liked === '1';
      const countEl = btn.querySelector('.kudos-count');
      try {
        if (liked) {
          await api.social.removeKudos(wid);
          btn.dataset.liked = '0';
          btn.classList.remove('liked');
          countEl.textContent = parseInt(countEl.textContent) - 1;
          btn.querySelector('path').setAttribute('d', 'M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z');
        } else {
          await api.social.kudos(wid);
          btn.dataset.liked = '1';
          btn.classList.add('liked');
          countEl.textContent = parseInt(countEl.textContent) + 1;
          btn.querySelector('path').setAttribute('d', 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z');
        }
      } catch (err) { toast(err.message); }
    });
  });

  // Comments toggle
  feed.querySelectorAll('.comment-toggle').forEach(btn => {
    btn.addEventListener('click', async () => {
      const wid = btn.dataset.workoutId;
      const section = feed.querySelector(`.comments-section[data-workout-id="${wid}"]`);
      const isOpen = section.classList.toggle('open');
      if (isOpen && !section.dataset.loaded) {
        section.dataset.loaded = '1';
        const list = section.querySelector('.comments-list');
        try {
          const comments = await api.social.comments(wid);
          list.innerHTML = comments.map(c => commentHtml(c)).join('') || '<p class="text-secondary text-sm" style="padding:0.5rem 0">Aucun commentaire</p>';
        } catch (err) { list.innerHTML = `<p class="text-secondary text-sm">${err.message}</p>`; }
      }
    });
  });

  // Send comment
  feed.querySelectorAll('.send-comment-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const section = btn.closest('.comments-section');
      const wid = section.dataset.workoutId;
      const input = section.querySelector('.comment-input');
      const text = input.value.trim();
      if (!text) return;
      try {
        const c = await api.social.comment(wid, text);
        const list = section.querySelector('.comments-list');
        list.insertAdjacentHTML('beforeend', commentHtml({ ...c, username: auth.user.username }));
        input.value = '';
        const countEl = feed.querySelector(`.comment-toggle[data-workout-id="${wid}"] span`);
        if (countEl) countEl.textContent = parseInt(countEl.textContent) + 1;
      } catch (err) { toast(err.message); }
    });
  });
}

function commentHtml(c) {
  return `
    <div class="comment-item">
      ${avatarHtml(c, 28)}
      <div class="comment-content">
        <span class="comment-user">${c.username}</span>
        <p class="comment-text">${c.content}</p>
      </div>
    </div>`;
}
