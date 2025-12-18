// admin-panel/src/components/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../services/api';
import '../styles/ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.products || []);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h1>Products</h1>
        <Link to="/products/add" className="btn-add">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
          </svg>
          Add Product
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="products-grid">
        {products.length === 0 ? (
          <div className="no-products">
            <p>No products found</p>
            <Link to="/products/add" className="btn-primary">Add First Product</Link>
          </div>
        ) : (
          products.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img src={product.image || '/placeholder.png'} alt={product.name} />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-price">₨ {product.price?.toLocaleString()}</p>
                <div className="product-actions">
                  <Link to={`/products/edit/${product._id}`} className="btn-edit">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(product._id)} className="btn-delete">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;