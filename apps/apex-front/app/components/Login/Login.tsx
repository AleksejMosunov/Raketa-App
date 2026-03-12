import React, { useState } from 'react';
import './styles.css';
import { login } from '~/src/services/authService';
import { useNavigate } from 'react-router';

export default function LoginPage() {

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const userName = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      await login(userName, password);
      navigate("/");
    } catch (error) {
      console.log('Login error', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem', maxWidth: '250px', marginLeft: 'auto', marginRight: 'auto', width: '100%' }}>
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input style={{ padding: '0.5rem', borderRadius: '5px', border: 'none' }} type="text" placeholder="Username" name="username" />
        <input style={{ padding: '0.5rem', borderRadius: '5px', border: 'none' }} type="password" placeholder="Password" name="password" />
        <button className='login-btn'>Login</button>
      </form>
    </div>
  );
}
