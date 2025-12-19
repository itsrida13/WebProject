// admin-panel/src/components/OrderList.jsx
import React, { useEffect, useState } from 'react';
import { getAdminOrders } from '../services/api';
import '../styles/OrderList.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getAdminOrders(); // see api.js change below
        // accept either { success, orders } or plain array
        if (Array.isArray(res)) {
          setOrders(res);
        } else if (res && res.orders) {
          setOrders(res.orders);
        } else if (res && res.data && Array.isArray(res.data.orders)) {
          setOrders(res.data.orders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error('Admin orders error:', err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            'Failed to load orders'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="orders-page">
        <div className="spinner-large" />
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Status</th>
              <th>Total (Rs.)</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id || o.orderNumber}>
                <td>{o.orderNumber || '—'}</td>
                <td>{o.customerName || '—'}</td>
                <td>{Array.isArray(o.items) ? o.items.length : 0}</td>
                <td>{o.status || 'Unknown'}</td>
                <td>{o.grandTotal?.toLocaleString?.() ?? o.grandTotal ?? 0}</td>
                <td>
                  {o.createdAt
                    ? new Date(o.createdAt).toLocaleString()
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderList;
