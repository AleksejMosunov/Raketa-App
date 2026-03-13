import { create } from 'zustand';
import type { User } from '../model/User';
import { login as loginService, getMe } from '../services/authService';

const initialToken =
  typeof window !== 'undefined' ? localStorage.getItem('token') : null;

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;

  login: (userName: string, password: string) => Promise<User>;
  logout: () => void;
  checkAuth: () => Promise<void>; // проверка токена при загрузке
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: initialToken,
  loading: Boolean(initialToken),

  login: async (userName, password) => {
    set({ loading: true });
    try {
      const data = await loginService(userName, password);
      const nextUser: User = {
        userName: data.userName,
        role: data.role,
        _id: '',
        password: '',
      };

      localStorage.setItem('token', data.access_token);
      set({
        user: nextUser,
        token: data.access_token,
        loading: false,
      });

      return nextUser;
    } catch (error) {
      console.error('Login error:', error);
      set({ loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, token: null, loading: false });
      return;
    }

    set({ loading: true });
    try {
      const user = await getMe(token); // /auth/me
      set({ user, token, loading: false });
    } catch (error) {
      const status =
        typeof error === 'object' && error !== null && 'status' in error
          ? Number((error as { status?: number; }).status)
          : undefined;

      // Logout only when token is really invalid/expired.
      if (status === 401 || status === 403) {
        localStorage.removeItem('token');
        set({ user: null, token: null, loading: false });
        return;
      }

      // Network/server issues should not immediately drop the session.
      set({ token, loading: false });
    }
  },
}));
