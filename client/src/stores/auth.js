import { reactive, computed } from 'vue';
import { auth as authApi } from '../api';

const state = reactive({
  user: null,
  loading: false
});

export const authStore = {
  state,

  get isAuthenticated() {
    return !!state.user;
  },

  get isAdmin() {
    return state.user?.is_admin === 1 || state.user?.is_admin === true;
  },

  async login(credentials) {
    state.loading = true;
    try {
      const { data } = await authApi.login(credentials);
      localStorage.setItem('token', data.token);
      state.user = data.user;
      return data;
    } catch (error) {
      throw error;
    } finally {
      state.loading = false;
    }
  },

  async register(userData) {
    state.loading = true;
    try {
      const { data } = await authApi.register(userData);
      localStorage.setItem('token', data.token);
      state.user = data.user;
      return data;
    } catch (error) {
      throw error;
    } finally {
      state.loading = false;
    }
  },

  async checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const { data } = await authApi.me();
      state.user = data;
    } catch (error) {
      this.logout();
    }
  },

  logout() {
    localStorage.removeItem('token');
    state.user = null;
  }
};
