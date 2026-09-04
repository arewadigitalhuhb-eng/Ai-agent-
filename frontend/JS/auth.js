class AuthManager {
  constructor() { this.user = null; this.isAuthenticated = false; }

  async init() {
    const token = api.getToken();
    if (token) {
      try {
        const response = await api.getMe();
        if (response.success) { this.user = response.data.user; this.isAuthenticated = true; this.updateUI(); return true; }
      } catch (error) { api.setToken(null); }
    }
    this.showAuthScreen();
    return false;
  }

  async login(email, password) {
    try {
      const response = await api.login(email, password);
      if (response.success) {
        api.setToken(response.data.token);
        this.user = response.data.user;
        this.isAuthenticated = true;
        this.updateUI();
        return { success: true };
      }
    } catch (error) { return { success: false, error: error.message }; }
  }

  async register(email, password, displayName, language) {
    try {
      const response = await api.register(email, password, displayName, language);
      if (response.success) {
        api.setToken(response.data.token);
        this.user = response.data.user;
        this.isAuthenticated = true;
        this.updateUI();
        return { success: true };
      }
    } catch (error) { return { success: false, error: error.message }; }
  }

  logout() {
    api.logout();
    this.user = null;
    this.isAuthenticated = false;
    this.showAuthScreen();
    window.location.reload();
  }

  updateUI() {
    if (!this.user) return;
    const userNameEl = document.getElementById('user-name');
    const userAvatarEl = document.getElementById('user-avatar');
    const userPlanEl = document.getElementById('user-plan');
    if (userNameEl) userNameEl.textContent = this.user.displayName || this.user.email;
    if (userAvatarEl) userAvatarEl.textContent = (this.user.displayName || this.user.email)?.[0]?.toUpperCase() || 'U';
    if (userPlanEl) userPlanEl.textContent = this.user.plan || 'Free';
    document.getElementById('auth-screen')?.classList.remove('active');
    document.getElementById('main-screen')?.classList.add('active');
    if (this.user.language) i18n.setLanguage(this.user.language);
  }

  showAuthScreen() {
    document.getElementById('auth-screen')?.classList.add('active');
    document.getElementById('main-screen')?.classList.remove('active');
  }

  getUser() { return this.user; }
}

const auth = new AuthManager();