const auth = {
  user: null,
  token: null,

  init() {
    this.token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (userData) this.user = JSON.parse(userData);
  },

  save(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isLoggedIn() {
    return !!this.token;
  }
};

window.auth = auth;
