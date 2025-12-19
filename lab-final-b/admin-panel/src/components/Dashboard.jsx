// admin-panel/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const admin = JSON.parse(localStorage.getItem('adminUser') || '{}');

  const formatNumber = (value) => {
    if (typeof value === 'number') return value.toLocaleString();
    if (typeof value === 'string' && !isNaN(Number(value))) {
      return Number(value).toLocaleString();
    }
    return '0';
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data && typeof data === 'object' ? data : {});
      setError(null);
    } catch (err) {
      console.error('Dashboard stats error:', err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to fetch dashboard statistics';
      setError(message);
      setStats({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const safeStats = stats || {};
  const products = safeStats.products || {};
  const orders = safeStats.orders || {};
  const revenue = safeStats.revenue || {};
  const recentOrders = Array.isArray(safeStats.recentOrders)
    ? safeStats.recentOrders
    : [];

  return (
    <div className="dashboard-container">
      {/* Header with quick "Add Product" */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {admin.username || admin.name || 'Admin'} 👋</h1>
          <p>Here’s what’s happening with your store today.</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => navigate('/products/add')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Add New Product
        </button>
      </div>

      {/* Stats cards */}
      <div className="stats-grid">
        {/* Product Stats */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e3f2fd' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#2196f3">
              <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z" />
            </svg>
          </div>
          <div className="stat-details">
            <h3>Total Products</h3>
            <p className="stat-number">{formatNumber(products.total)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e8f5e9' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#4caf50">
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
            </svg>
          </div>
          <div className="stat-details">
            <h3>Active Products</h3>
            <p className="stat-number">{formatNumber(products.active)}</p>
          </div>
        </div>

        {/* Order Stats */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fff3e0' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#ff9800">
              <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
            </svg>
          </div>
          <div className="stat-details">
            <h3>Total Orders</h3>
            <p className="stat-number">{formatNumber(orders.total)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e1f5fe' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#03a9f4">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path
                d="M2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="#03a9f4"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
          <div className="stat-details">
            <h3>Placed Orders</h3>
            <p className="stat-number">{formatNumber(orders.placed)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fff9c4' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#fbc02d">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <div className="stat-details">
            <h3>Processing Orders</h3>
            <p className="stat-number">{formatNumber(orders.processing)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e8f5e9' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#4caf50">
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
            </svg>
          </div>
          <div className="stat-details">
            <h3>Delivered Orders</h3>
            <p className="stat-number">{formatNumber(orders.delivered)}</p>
          </div>
        </div>

        {/* Revenue */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f3e5f5' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#9c27b0">
              <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
            </svg>
          </div>
          <div className="stat-details">
            <h3>Total Revenue</h3>
            <p className="stat-number">Rs. {formatNumber(revenue.total)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ffebee' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#f44336">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>
          <div className="stat-details">
            <h3>Out of Stock</h3>
            <p className="stat-number">{formatNumber(products.outOfStock)}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="recent-activity">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <h2>Recent Orders</h2>
          <Link to="/orders" className="view-all-link">
            View All Orders →
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="recent-orders-list">
            {recentOrders.map((order) => {
              if (!order) return null;
              const itemsCount = Array.isArray(order.items)
                ? order.items.length
                : 0;

              const rawStatus = order.status ?? 'Unknown';
              const statusText =
                typeof rawStatus === 'string' ? rawStatus : 'Unknown';

              const statusClass = `status-${
                typeof statusText === 'string'
                  ? statusText.toLowerCase()
                  : 'unknown'
              }`;

              return (
                <div
                  key={order._id || order.orderNumber}
                  className="recent-order-item"
                >
                  <div className="order-info">
                    <p className="order-number">
                      {order.orderNumber || 'No Order #'}
                    </p>
                    <p className="order-customer">
                      {order.customerName || 'No Name'}
                    </p>
                    <p className="order-items">{itemsCount} items</p>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge ${statusClass}`}>
                      {statusText}
                    </span>
                    <p className="order-total">
                      Rs. {formatNumber(order.grandTotal)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p
            style={{
              color: '#7f8c8d',
              textAlign: 'center',
              padding: '2rem',
            }}
          >
            No recent orders
          </p>
        )}
      </div>

      {/* Quick Actions: manage products + orders */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button
            className="action-btn"
            onClick={() => navigate('/products')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            Manage Products
          </button>

          <button
            className="action-btn"
            onClick={() => navigate('/products/add')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 8v8M8 12h8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Add Product
          </button>

          <button
            className="action-btn"
            onClick={() => navigate('/orders')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 4h18v4H3zM3 10h18v10H3z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            Manage Orders
          </button>

          <button className="action-btn" onClick={fetchStats}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Refresh Stats
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
