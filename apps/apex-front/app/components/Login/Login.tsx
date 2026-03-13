import { useState, type FormEvent } from 'react';
import './styles.css';
import { useNavigate } from 'react-router';
import { useAuthStore } from '~/src/store/useAuthStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(e.currentTarget);

    const userName = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!userName || !password) {
      setError('Введите логин и пароль');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const user = await login(userName, password);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="login-shell">
      <div className="login-card">
        <p className="login-kicker">Welcome Back</p>
        <h2>Sign In To Dashboard</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input type="text" placeholder="Username" name="username" autoComplete="username" />
          <input type="password" placeholder="Password" name="password" autoComplete="current-password" />
          {error && <p className="login-error">{error}</p>}
          <button className='login-btn' disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </section>
  );
}
