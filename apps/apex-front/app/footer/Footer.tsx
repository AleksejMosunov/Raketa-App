import React from 'react';
import './styles.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>Raketa-Apex</p>
      <span>Live race timing dashboard</span>
      <span>{year}</span>
    </footer>
  );
}
