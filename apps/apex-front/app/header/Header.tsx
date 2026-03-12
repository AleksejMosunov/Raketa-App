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

  return (
    <div className='header'>
      <Link className="logo" to="/">Raketa</Link>
      <nav className='nav'>
        {isLoggedIn ? (
          <button onClick={handleClick}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </div>
  );
}
