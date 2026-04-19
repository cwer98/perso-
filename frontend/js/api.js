const BASE = 'http://localhost:3000/api';

async function request(method, path, body) {
  const token = localStorage.getItem('token');
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {})
  };
  const res = await fetch(BASE + path, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Erreur serveur');
  return data;
}

const api = {
  auth: {
    register: (b) => request('POST', '/auth/register', b),
    login: (b) => request('POST', '/auth/login', b),
    me: () => request('GET', '/auth/me'),
  },
  feed: {
    get: (page = 1) => request('GET', `/feed?page=${page}`),
  },
  workouts: {
    list: (params = '') => request('GET', `/workouts?${params}`),
    create: (b) => request('POST', '/workouts', b),
    get: (id) => request('GET', `/workouts/${id}`),
    update: (id, b) => request('PUT', `/workouts/${id}`, b),
    delete: (id) => request('DELETE', `/workouts/${id}`),
    addExercise: (id, b) => request('POST', `/workouts/${id}/exercises`, b),
    addSet: (weId, b) => request('POST', `/workouts/exercises/${weId}/sets`, b),
    deleteSet: (setId) => request('DELETE', `/workouts/sets/${setId}`),
  },
  exercises: {
    list: (params = '') => request('GET', `/exercises?${params}`),
  },
  users: {
    get: (id) => request('GET', `/users/${id}`),
    update: (id, b) => request('PUT', `/users/${id}`, b),
    workouts: (id) => request('GET', `/users/${id}/workouts`),
    stats: (id) => request('GET', `/users/${id}/stats`),
  },
  social: {
    follow: (id) => request('POST', `/social/follow/${id}`),
    unfollow: (id) => request('DELETE', `/social/follow/${id}`),
    kudos: (id) => request('POST', `/social/kudos/${id}`),
    removeKudos: (id) => request('DELETE', `/social/kudos/${id}`),
    comment: (id, content) => request('POST', `/social/comments/${id}`, { content }),
    comments: (id) => request('GET', `/social/comments/${id}`),
  }
};

window.api = api;
