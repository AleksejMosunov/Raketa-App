import React from 'react';
import { Link } from 'react-router';
import './styles.css';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { user, isLoggedIn, logout } = useAuth();

  const handleClick = () => {
    if (!isLoggedIn) return;
    logout();
  };

  console.log(user);

  return (
    <header className='header'>
      <Link className="logo" to="/">Raketa-Apex</Link>
      <div className="nav-container">
        <nav className='nav'>
          {user && <span className="user-pill">{user.userName}</span>}
          {isLoggedIn ? (
            <button className="auth-btn" onClick={handleClick}>Logout</button>
          ) : (
            <Link className="auth-btn ghost" to="/login">Login</Link>
          )}
        </nav>
        {user?.role === 'admin' && (
          <nav className='nav'>
            <Link className="auth-btn ghost" to="/admin">Admin</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
