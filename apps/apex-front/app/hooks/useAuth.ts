import { useAuthStore } from "~/src/store/useAuthStore";

export function useAuth() {
  const { user, loading, login, logout } = useAuthStore();
  const isLoggedIn = !!user;

  return { user, isLoggedIn, loading, login, logout };
}
