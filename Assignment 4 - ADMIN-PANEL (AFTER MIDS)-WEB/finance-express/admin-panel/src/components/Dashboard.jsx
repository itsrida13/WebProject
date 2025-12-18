// admin-panel/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const admin = JSON.parse(localStorage.getItem('adminUser') || '{}');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getDashboardStats();
      if (response.success) {
        setStats(response.stats);
      }
    } catch (err) {
      setError('Failed to load dashboard stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-large"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {admin.username}! 👋</h1>
          <p>Here's what's happening with your store today</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => navigate('/products/add')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add New Product
        </button>
      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5z" fill="currentColor"/>
            </svg>
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Products</p>
            <h2 className="stat-value">{stats?.totalProducts || 0}</h2>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="stat-info">
            <p className="stat-label">Categories</p>
            <h2 className="stat-value">{stats?.totalCategories || 0}</h2>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2v20M17 7H9.5C8.57 7 7.68 7.37 7.02 8.02 6.37 8.68 6 9.57 6 10.5s.37 1.82 1.02 2.48C7.68 13.63 8.57 14 9.5 14h5c.93 0 1.82.37 2.48 1.02.65.66 1.02 1.55 1.02 2.48s-.37 1.82-1.02 2.48C16.32 20.63 15.43 21 14.5 21H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Value</p>
            <h2 className="stat-value">Rs. {(stats?.totalRevenue || 0).toLocaleString()}</h2>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-info">
            <p className="stat-label">Recent Products</p>
            <h2 className="stat-value">{stats?.recentProducts?.length || 0}</h2>
          </div>
        </div>
      </div>

      {/* Categories Overview */}
      <div className="section-card">
        <h3>Categories Overview</h3>
        <div className="categories-list">
          {stats?.categories?.map((category, index) => (
            <div key={index} className="category-badge">
              {category}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Products */}
      <div className="section-card">
        <div className="section-header">
          <h3>Recent Products</h3>
          <button 
            className="btn-link"
            onClick={() => navigate('/products')}
          >
            View All →
          </button>
        </div>
        <div className="recent-products-grid">
          {stats?.recentProducts?.slice(0, 5).map((product) => (
            <div key={product._id} className="product-mini-card">
              <img src={product.image} alt={product.name} />
              <div className="product-mini-info">
                <h4>{product.name}</h4>
                <p className="price">Rs. {product.price.toLocaleString()}</p>
                <span className="category-tag">{product.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button 
            className="action-btn"
            onClick={() => navigate('/products')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Manage Products
          </button>
          <button 
            className="action-btn"
            onClick={() => navigate('/products/add')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add Product
          </button>
          <button 
            className="action-btn"
            onClick={fetchStats}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Refresh Stats
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;