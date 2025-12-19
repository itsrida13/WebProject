// admin-panel/src/components/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getProduct, getCategories } from '../services/api';
import '../styles/ProductForm.css';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
    description: ''
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      if (response.success) {
        setCategories(response.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getProduct(id);
      if (response.success) {
        const product = response.product;
        setFormData({
          name: product.name,
          price: product.price,
          category: product.category,
          image: product.image,
          description: product.description || ''
        });
        setImagePreview(product.image);
      }
    } catch (err) {
      setError('Failed to load product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'image') {
      setImagePreview(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (isEditMode) {
        response = await updateProduct(id, formData);
      } else {
        response = await createProduct(formData);
      }

      if (response.success) {
        alert(isEditMode ? 'Product updated successfully!' : 'Product created successfully!');
        navigate('/products');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const suggestedImages = [
    'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=500&fit=crop'
  ];

  if (loading && isEditMode) {
    return (
      <div className="loading-container">
        <div className="spinner-large"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  return (
    <div className="product-form-container">
      <div className="form-header">
        <button className="back-btn" onClick={() => navigate('/products')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Back to Products
        </button>
        <h1>{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
        <p>{isEditMode ? 'Update product information' : 'Fill in the details below'}</p>
      </div>

      {error && (
        <div className="error-alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#e74c3c" strokeWidth="2"/>
            <path d="M12 8v4M12 16h.01" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
          {/* Left Column */}
          <div className="form-column">
            <div className="form-section">
              <h3>Basic Information</h3>

              <div className="form-group">
                <label htmlFor="name">
                  Product Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Investment Strategy Guide"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">
                  Price (Rs.) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="5000"
                  min="0"
                  step="100"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">
                  Category <span className="required">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="Finance">Finance</option>
                  <option value="Business">Business</option>
                  <option value="Investment">Investment</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your product..."
                  rows="5"
                  className="form-textarea"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="form-column">
            <div className="form-section">
              <h3>Product Image</h3>

              <div className="form-group">
                <label htmlFor="image">Image URL</label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="form-input"
                />
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="image-preview-container">
                  <p className="preview-label">Preview:</p>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="image-preview"
                    onError={() => setImagePreview('')}
                  />
                </div>
              )}

              {/* Suggested Images */}
              <div className="suggested-images">
                <p className="preview-label">Quick Select:</p>
                <div className="image-grid">
                  {suggestedImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Option ${index + 1}`}
                      className={`suggested-img ${formData.image === img ? 'selected' : ''}`}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, image: img }));
                        setImagePreview(img);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/products')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" strokeWidth="2"/>
                </svg>
                {isEditMode ? 'Update Product' : 'Create Product'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;