// admin-panel/src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logoutAdmin } from '../services/api';
import '../styles/Navbar.css';

const Navbar = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      onLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if API fails
      onLogout();
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#00bcd4"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#00bcd4" strokeWidth="2"/>
          </svg>
          <span>Finance Express Admin</span>
        </Link>
      </div>

      <div className="navbar-menu">
        <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
          </svg>
          Dashboard
        </Link>

        <Link to="/products" className={isActive('/products') ? 'active' : ''}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z" fill="currentColor"/>
          </svg>
          Products
        </Link>
      </div>

      <div className="navbar-user">
        <a 
          href="http://localhost:3001" 
          target="_blank" 
          rel="noopener noreferrer"
          className="view-site-btn"
          title="View Main Site"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          View Site
        </a>

        <button 
          className="user-button" 
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="user-avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="white"/>
            </svg>
          </div>
          <span>{adminUser.username || adminUser.name || adminUser.email || 'Admin'}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M7 10l5 5 5-5z" fill="currentColor"/>
          </svg>
        </button>

        {showDropdown && (
          <div className="user-dropdown">
            <div className="dropdown-header">
              <p className="user-name">{adminUser.username || adminUser.name || 'Admin'}</p>
              <p className="user-email">{adminUser.email || 'admin@example.com'}</p>
              <p className="user-role">{adminUser.role || 'Administrator'}</p>
            </div>
            <div className="dropdown-divider"></div>
            <button 
              className="dropdown-item" 
              onClick={() => {
                setShowDropdown(false);
                navigate('/profile');
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Profile
            </button>
            <button 
              className="dropdown-item" 
              onClick={() => {
                setShowDropdown(false);
                navigate('/settings');
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 1v6m0 6v6M23 12h-6m-6 0H5" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Settings
            </button>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item logout" onClick={handleLogout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/>
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;