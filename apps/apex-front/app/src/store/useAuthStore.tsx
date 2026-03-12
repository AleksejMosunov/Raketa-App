import { create } from 'zustand';
import type { User } from '../model/User';
import { login as loginService, getMe } from '../services/authService';

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;

  login: (userName: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>; // проверка токена при загрузке
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  loading: false,

  login: async (userName, password) => {
    set({ loading: true });
    try {
      const data = await loginService(userName, password);
      localStorage.setItem('token', data.access_token);
      set({
        user: {
          userName: data.userName, role: data.role,
          _id: '',
          password: ''
        }, token: data.access_token, loading: false
      });
    } catch (error) {
      console.error('Login error:', error);
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, token: null });
      return;
    }

    set({ loading: true });
    try {
      const user = await getMe(token); // /auth/me
      set({ user, token, loading: false });
    } catch (error) {
      console.error('Token invalid:', error);
      localStorage.removeItem('token');
      set({ user: null, token: null, loading: false });
    }
  },
}));
