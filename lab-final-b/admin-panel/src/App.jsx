import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import Navbar from './components/Navbar';
import OrderList from './components/OrderList';

import './App.css';

const BASENAME = import.meta.env.PROD ? '/admin' : '';

const ProtectedRoute = ({ children, onLogout }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/login" replace />;

  return (
    <>
      <Navbar onLogout={onLogout} />
      <div className="main-content">{children}</div>
    </>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('adminToken')
  );

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
  };

  return (
    <Router basename={BASENAME}>
      <Routes>
        {/* Always redirect /admin → /admin/login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute onLogout={handleLogout}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute onLogout={handleLogout}>
              <ProductList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/add"
          element={
            <ProtectedRoute onLogout={handleLogout}>
              <ProductForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/edit/:id"
          element={
            <ProtectedRoute onLogout={handleLogout}>
              <ProductForm />
            </ProtectedRoute>
          }
        />

        {/* ✅ New Orders route (protected) */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute onLogout={handleLogout}>
              <OrderList />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
