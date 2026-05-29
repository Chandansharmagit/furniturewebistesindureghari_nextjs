import React, { useState, useEffect, useCallback } from 'react';
import './ProductUploading.css';
import couponService from '../../services/couponService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { buildApiUrl, PRODUCT_ENDPOINTS, COUPON_ENDPOINTS } from '../../config/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus, FaEdit, FaTrash, FaSync,
  FaBoxOpen, FaThLarge, FaTicketAlt, FaFilter,
  FaCubes, FaExclamationTriangle, FaChevronRight,
  FaArrowLeft, FaCloudUploadAlt, FaVideo, FaImage
} from 'react-icons/fa';

const ProductUploading = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Form state for product
  const [formData, setFormData] = useState({
    name: '',
    new_price: '',
    old_price: '',
    stock: '',
    description: '',
    sku: '',
    product_color: '',
    manufacturer: '',
    warranty: '',
    product_size: '',
    wooden_type: '',
    categoryId: ''
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Form state for category
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    parentCategoryId: ''
  });

  // Coupon state
  const [couponData, setCouponData] = useState({
    code: '',
    discount_percentage: '',
    expiry_date: ''
  });
  const [couponValidation, setCouponValidation] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  // No longer needed: const API_BASE = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api`;

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      // Get authentication credentials
      const email = localStorage.getItem('userEmail');
      const password = localStorage.getItem('userPassword');

      // Add cache-busting parameter to prevent caching issues
      const cacheBuster = Date.now();
      const url = `${buildApiUrl(PRODUCT_ENDPOINTS.LIST)}?_t=${cacheBuster}`;
      console.log('Fetching products from:', url);

      const response = await fetch(url, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'email': email,
          'password': password
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched products:', data);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setErrorMessage('Error fetching products. Make sure the server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      // Get authentication credentials
      const email = localStorage.getItem('userEmail');
      const password = localStorage.getItem('userPassword');

      // Add cache-busting parameter to prevent caching issues
      const cacheBuster = Date.now();
      const url = `${buildApiUrl(PRODUCT_ENDPOINTS.CATEGORIES)}?_t=${cacheBuster}`;

      const response = await fetch(url, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'email': email,
          'password': password
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched categories:', data);
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setErrorMessage('Error fetching categories. Make sure the server is running on port 5000.');
    }
  }, []);

  const fetchCoupons = useCallback(async () => {
    try {
      setLoadingCoupons(true);
      const result = await couponService.getAllCoupons();
      if (result.success) {
        setCoupons(result.data);
      } else {
        setErrorMessage(`Error fetching coupons: ${result.error}`);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setErrorMessage('Error fetching coupons');
    } finally {
      setLoadingCoupons(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchCoupons();

    // Set up auto-refresh for products every 30 seconds when on list tab
    const interval = setInterval(() => {
      if (activeTab === 'list') {
        fetchProducts();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [activeTab, fetchProducts, fetchCategories, fetchCoupons]);

  useEffect(() => {
    if (activeTab === 'create' && !editingProduct && !formData.sku) {
      setFormData(prev => ({
        ...prev,
        sku: generateRandomSKU()
      }));
    }
  }, [activeTab, editingProduct, formData.sku]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 15) {
      alert('You can only upload up to 15 images');
      return;
    }
    setSelectedImages(files);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('Video file size should be less than 50MB');
        return;
      }
      setSelectedVideo(file);
    }
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setSelectedVideo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const submitFormData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '') {
          submitFormData.append(key, formData[key]);
        }
      });

      // Append multiple images
      selectedImages.forEach((image, index) => {
        submitFormData.append('images', image);
      });

      // Append video if selected
      if (selectedVideo) {
        submitFormData.append('video', selectedVideo);
      }

      // Get authentication credentials
      const email = localStorage.getItem('userEmail');
      const password = localStorage.getItem('userPassword');

      const url = buildApiUrl(PRODUCT_ENDPOINTS.LIST);
      console.log('Creating product at:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'email': email,
          'password': password
        },
        body: submitFormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      // const newProduct = await response.json();
      alert('Product created successfully!');
      resetForm();
      fetchProducts();
      setActiveTab('list');
    } catch (error) {
      console.error('Error creating product:', error);
      setErrorMessage(`Error creating product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // Get authentication credentials
      const email = localStorage.getItem('userEmail');
      const password = localStorage.getItem('userPassword');

      const url = buildApiUrl(PRODUCT_ENDPOINTS.CATEGORIES);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'email': email,
          'password': password
        },
        body: JSON.stringify({
          name: categoryForm.name,
          parentCategoryId: categoryForm.parentCategoryId ? parseInt(categoryForm.parentCategoryId) : null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create category');
      }

      alert('Category created successfully!');
      setCategoryForm({ name: '', parentCategoryId: '' });
      await fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      setErrorMessage(`Error creating category: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      new_price: product.new_price.toString(),
      old_price: product.old_price ? product.old_price.toString() : '',
      stock: product.stock ? product.stock.toString() : '',
      description: product.description || '',
      sku: product.sku || '',
      product_color: product.product_color || '',
      manufacturer: product.manufacturer || '',
      warranty: product.warranty || '',
      product_size: product.product_size || '',
      wooden_type: product.wooden_type || '',
      categoryId: product.categoryId ? product.categoryId.toString() : ''
    });
    setSelectedImages([]);
    setSelectedVideo(null);
    setActiveTab('create');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const submitFormData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '') {
          submitFormData.append(key, formData[key]);
        }
      });

      // Append multiple images
      selectedImages.forEach((image, index) => {
        submitFormData.append('images', image);
      });

      // Append video if selected
      if (selectedVideo) {
        submitFormData.append('video', selectedVideo);
      }

      // Get authentication credentials
      const email = localStorage.getItem('userEmail');
      const password = localStorage.getItem('userPassword');

      // Add cache-busting parameter to prevent caching issues
      const cacheBuster = Date.now();
      const url = `${buildApiUrl(PRODUCT_ENDPOINTS.DETAIL.replace(':id', editingProduct.id))}?_t=${cacheBuster}`;
      console.log('Updating product at:', url);

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'email': email,
          'password': password
        },
        body: submitFormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update product');
      }

      alert('Product updated successfully!');
      resetForm();
      // Force refresh products list to reflect changes immediately
      await fetchProducts();
      setActiveTab('list');
    } catch (error) {
      console.error('Error updating product:', error);
      const detailedError = error.message;
      setErrorMessage(`Error updating product: ${detailedError}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Get authentication credentials
        const email = localStorage.getItem('userEmail');
        const password = localStorage.getItem('userPassword');

        // Add cache-busting parameter to prevent caching issues
        const cacheBuster = Date.now();
        const url = `${buildApiUrl(PRODUCT_ENDPOINTS.DETAIL.replace(':id', id))}?_t=${cacheBuster}`;
        console.log('Deleting product at:', url);

        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'email': email,
            'password': password
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete product');
        }

        alert('Product deleted successfully!');
        // Force refresh products list to reflect changes immediately
        await fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        setErrorMessage(`Error deleting product: ${error.message}`);
      }
    }
  };

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      // Get authentication credentials
      const email = localStorage.getItem('userEmail');
      const password = localStorage.getItem('userPassword');

      const url = buildApiUrl(COUPON_ENDPOINTS.LIST);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'email': email,
          'password': password
        },
        body: JSON.stringify({
          ...couponData,
          discount_percentage: parseFloat(couponData.discount_percentage)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create coupon');
      }

      alert('Coupon created successfully!');
      setCouponData({
        code: '',
        discount_percentage: '',
        expiry_date: ''
      });
      fetchCoupons(); // Refresh the coupons list
    } catch (error) {
      console.error('Error creating coupon:', error);
      setErrorMessage(`Error creating coupon: ${error.message}`);
    }
  };

  const validateCoupon = async () => {
    if (!couponValidation.trim()) {
      setErrorMessage('Please enter a coupon code');
      return;
    }

    try {
      // Get authentication credentials
      const email = localStorage.getItem('userEmail');
      const password = localStorage.getItem('userPassword');

      const url = buildApiUrl(COUPON_ENDPOINTS.VALIDATE.replace(':code', couponValidation));

      const response = await fetch(url, {
        headers: {
          'email': email,
          'password': password
        }
      });
      if (response.ok) {
        const coupon = await response.json();
        setValidationResult({
          valid: true,
          coupon
        });
      } else {
        const errorData = await response.json();
        setValidationResult({
          valid: false,
          message: errorData.error || 'Invalid or expired coupon'
        });
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      setValidationResult({
        valid: false,
        message: 'Error validating coupon'
      });
    }
  };



  const deleteCoupon = async (couponId) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) {
      return;
    }

    try {
      const result = await couponService.deleteCoupon(couponId);
      if (result.success) {
        alert('Coupon deleted successfully!');
        fetchCoupons(); // Refresh the list
      } else {
        alert(`Error deleting coupon: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Error deleting coupon');
    }
  };

  const generateRandomSKU = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randPart1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const randPart2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `SIND-${randPart1}-${randPart2}`;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      new_price: '',
      old_price: '',
      stock: '',
      description: '',
      sku: generateRandomSKU(),
      product_color: '',
      manufacturer: '',
      warranty: '',
      product_size: '',
      wooden_type: '',
      categoryId: ''
    });
    setSelectedImages([]);
    setSelectedVideo(null);
    setEditingProduct(null);
    setErrorMessage('');
  };

  const resetCategoryForm = () => {
    setCategoryForm({ name: '', parentCategoryId: '' });
    setErrorMessage('');
  };

  const renderCategories = (cats, level = 0) => (
    cats.map(cat => (
      <React.Fragment key={cat.id}>
        <option value={cat.id}>{'-'.repeat(level) + ' ' + cat.name}</option>
        {cat.children.length > 0 && renderCategories(cat.children, level + 1)}
      </React.Fragment>
    ))
  );

  const formatPrice = (price) => {
    return price ? parseFloat(price).toFixed(2) : '0.00';
  };

  const getFlatCategories = (cats, list = []) => {
    cats.forEach(cat => {
      list.push({ id: cat.id, name: cat.name });
      if (cat.children && cat.children.length > 0) {
        getFlatCategories(cat.children, list);
      }
    });
    return list;
  };

  const flatCategories = getFlatCategories(categories);
  const filteredProducts = selectedCategoryId === 'all'
    ? products
    : products.filter(p => p.categoryId && p.categoryId.toString() === selectedCategoryId.toString());

  const summaryStats = {
    total: products.length,
    outOfStock: products.filter(p => !p.stock || parseInt(p.stock) === 0).length,
    categories: categories.length,
    coupons: coupons.length
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="pu-product-upload-container royal-theme">
      <header className="pu-header-royal">
        <div className="pu-header-main">
          <div className="pu-title-group">
            <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              Product Repository <span>Intelligence</span>
            </motion.h1>
            <p className="pu-subtitle">Registry & Inventory Protocol</p>
          </div>
          <div className="pu-header-actions">
            <button onClick={fetchProducts} className="pu-refresh-btn-royal">
              <FaSync className={loading ? 'spin' : ''} /> <span>Sync Trace</span>
            </button>
            <button
              className={`pu-create-btn-royal ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => {
                if (editingProduct) resetForm();
                setActiveTab('create');
              }}
            >
              <FaPlus /> <span>Initialize</span>
            </button>
          </div>
        </div>

        <nav className="pu-nav-tabs-royal">
          <button
            className={activeTab === 'list' ? 'pu-active' : ''}
            onClick={() => setActiveTab('list')}
          >
            <FaThLarge /> Live Index
          </button>
          <button
            className={activeTab === 'categories' ? 'pu-active' : ''}
            onClick={() => setActiveTab('categories')}
          >
            <FaCubes /> Taxonomy
          </button>
          <button
            className={activeTab === 'coupons' ? 'pu-active' : ''}
            onClick={() => setActiveTab('coupons')}
          >
            <FaTicketAlt /> Protocols
          </button>
        </nav>
      </header>

      {/* Summary Cards */}
      <motion.div
        className="pu-summary-grid-royal"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="pu-stat-card-royal" variants={itemVariants}>
          <div className="stat-icon-royal"><FaBoxOpen /></div>
          <div className="stat-info-royal">
            <label>Master Registry</label>
            <div className="stat-value">{summaryStats.total}</div>
            <div className="stat-trend positive">Total Units</div>
          </div>
        </motion.div>
        <motion.div className="pu-stat-card-royal warning" variants={itemVariants}>
          <div className="stat-icon-royal"><FaExclamationTriangle /></div>
          <div className="stat-info-royal">
            <label>Depleted Stock</label>
            <div className="stat-value">{summaryStats.outOfStock}</div>
            <div className="stat-trend negative">Attention Required</div>
          </div>
        </motion.div>
        <motion.div className="pu-stat-card-royal info" variants={itemVariants}>
          <div className="stat-icon-royal"><FaCubes /></div>
          <div className="stat-info-royal">
            <label>Taxonomy Nodes</label>
            <div className="stat-value">{summaryStats.categories}</div>
            <div className="stat-trend neutral">Categories</div>
          </div>
        </motion.div>
        <motion.div className="pu-stat-card-royal accent" variants={itemVariants}>
          <div className="stat-icon-royal"><FaTicketAlt /></div>
          <div className="stat-info-royal">
            <label>Active Coupons</label>
            <div className="stat-value">{summaryStats.coupons}</div>
            <div className="stat-trend positive">Procedures</div>
          </div>
        </motion.div>
      </motion.div>

      {errorMessage && (
        <motion.div
          className="pu-error-royal"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <FaExclamationTriangle /> {errorMessage}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            className="pu-loading-royal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingSpinner size="medium" type="wave" message="Synchronizing Data..." color="primary" />
          </motion.div>
        )}
      </AnimatePresence>

      {activeTab === 'list' && (
        <motion.div
          className="pu-products-list-royal"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="pu-filter-panel-royal">
            <div className="pu-filter-label">
              <FaFilter /> <span>Category Trace</span>
            </div>
            <div className="pu-category-filters-royal">
              <button
                className={`pu-filter-tab-royal ${selectedCategoryId === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategoryId('all')}
              >
                All Index
              </button>
              {flatCategories.map(cat => (
                <button
                  key={cat.id}
                  className={`pu-filter-tab-royal ${selectedCategoryId.toString() === cat.id.toString() ? 'active' : ''}`}
                  onClick={() => setSelectedCategoryId(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredProducts.length === 0 && !loading ? (
              <motion.div
                className="pu-no-products-royal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <FaBoxOpen className="empty-icon" />
                <p>{selectedCategoryId === 'all' ? 'System Registry Empty' : 'No data for this taxonomy node'}</p>
                {selectedCategoryId !== 'all' && (
                  <button onClick={() => setSelectedCategoryId('all')} className="pu-clear-filter-btn-royal">
                    Reset Filter
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                className="pu-products-grid-royal"
                layout
              >
                {filteredProducts.map(product => {
                  const isOutOfStock = !product.stock || parseInt(product.stock) === 0;
                  return (
                    <motion.div
                      key={product.id}
                      className={`pu-product-card-royal ${isOutOfStock ? 'out-of-stock' : ''}`}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="pu-card-visual">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} />
                        ) : (
                          <div className="pu-placeholder-visual"><FaImage /></div>
                        )}
                        <div className="pu-status-badge-royal">
                          {isOutOfStock ? 'DEPLETED' : 'ACTIVE'}
                        </div>
                      </div>

                      <div className="pu-card-content">
                        <div className="pu-card-header">
                          <h3>{product.name}</h3>
                          <div className="pu-card-price">
                            <span className="current">₹{formatPrice(product.new_price)}</span>
                            {product.old_price && <span className="old">₹{formatPrice(product.old_price)}</span>}
                          </div>
                        </div>

                        <p className="pu-card-desc">{product.description || 'No descriptive logs available.'}</p>

                        <div className="pu-card-specs">
                          <div className="spec-item">
                            <label>Stock</label>
                            <span>{product.stock || 0} U</span>
                          </div>
                          <div className="spec-item">
                            <label>SKU</label>
                            <span>{product.sku || '---'}</span>
                          </div>
                        </div>

                        <div className="pu-card-actions-royal">
                          <button onClick={() => handleEdit(product)} className="action-edit" title="Edit Product">
                            <FaEdit /> <span>Update</span>
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="action-delete" title="Delete Product">
                            <FaTrash /> <span>Purge</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {activeTab === 'create' && (
        <motion.div
          className="pu-form-section-royal"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="pu-form-header-royal">
            <h2><FaPlus /> {editingProduct ? 'Modify Unit' : 'Initialize Unit'}</h2>
            <button onClick={() => setActiveTab('list')} className="pu-back-btn-royal">
              <FaArrowLeft /> Back to Registry
            </button>
          </div>

          <form onSubmit={editingProduct ? handleUpdate : handleSubmit} className="pu-form-royal">
            <div className="pu-form-grid-royal">
              <div className="pu-form-group-royal">
                <label>Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Enter product name..." />
              </div>

              <div className="pu-form-group-royal">
                <label>Taxonomy Node (Category)</label>
                <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} required>
                  <option value="">Select Category Node</option>
                  {renderCategories(categories)}
                </select>
              </div>

              <div className="pu-form-group-royal">
                <label>Unit Valuation (Price)</label>
                <div className="input-with-symbol">
                  <span className="symbol">₹</span>
                  <input type="number" step="0.01" name="new_price" value={formData.new_price} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="pu-form-group-royal">
                <label>Legacy Valuation (Old Price)</label>
                <div className="input-with-symbol">
                  <span className="symbol">₹</span>
                  <input type="number" step="0.01" name="old_price" value={formData.old_price} onChange={handleInputChange} />
                </div>
              </div>

              <div className="pu-form-group-royal">
                <label>Inventory Count (Stock)</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required />
              </div>

              <div className="pu-form-group-royal">
                <label>Unique Identifier (SKU)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    name="sku" 
                    value={formData.sku} 
                    onChange={handleInputChange} 
                    style={{ flex: 1 }} 
                    placeholder="Auto-generated or custom..."
                  />
                  <button 
                    type="button" 
                    onClick={() => setFormData(prev => ({ ...prev, sku: generateRandomSKU() }))}
                    className="pu-refresh-btn-royal"
                    style={{ padding: '0 16px', border: '1px solid var(--royal-glass-border)', whiteSpace: 'nowrap' }}
                    title="Generate New Random SKU"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div className="pu-form-group-royal">
                <label>Chromatic Profile (Color)</label>
                <input type="text" name="product_color" value={formData.product_color} onChange={handleInputChange} />
              </div>

              <div className="pu-form-group-royal">
                <label>Manufacturer Trace</label>
                <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleInputChange} />
              </div>

              <div className="pu-form-group-royal">
                <label>Protection Period (Warranty)</label>
                <input type="text" name="warranty" value={formData.warranty} onChange={handleInputChange} />
              </div>

              <div className="pu-form-group-royal">
                <label>Dimensional Specs (Size)</label>
                <input type="text" name="product_size" value={formData.product_size} onChange={handleInputChange} />
              </div>

              <div className="pu-form-group-royal">
                <label>Material Matrix (Wood Type)</label>
                <input type="text" name="wooden_type" value={formData.wooden_type} onChange={handleInputChange} />
              </div>
            </div>

            <div className="pu-media-uploads-royal">
              <div className="upload-box-royal">
                <label><FaImage /> Visual Assets (Limit 15)</label>
                <div className="dropzone-royal">
                  <input type="file" multiple accept="image/*" onChange={handleImagesChange} />
                  <FaCloudUploadAlt />
                  <p>Deploy Visual Traces</p>
                </div>
                {selectedImages.length > 0 && (
                  <div className="pu-preview-grid-royal">
                    {selectedImages.map((img, i) => (
                      <div key={i} className="preview-item">
                        <img src={URL.createObjectURL(img)} alt="preview" />
                        <button type="button" onClick={() => removeImage(i)} className="remove">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="upload-box-royal">
                <label><FaVideo /> Motion Assets</label>
                <div className="dropzone-royal">
                  <input type="file" accept="video/*" onChange={handleVideoChange} />
                  <FaCloudUploadAlt />
                  <p>Deploy Motion Protocol</p>
                </div>
                {selectedVideo && (
                  <div className="pu-video-preview-royal">
                    <video src={URL.createObjectURL(selectedVideo)} controls />
                    <button type="button" onClick={removeVideo} className="remove">×</button>
                  </div>
                )}
              </div>
            </div>

            <div className="pu-form-group-royal full-width">
              <label>Detailed Logs (Description)</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" placeholder="Enter comprehensive product details..." />
            </div>

            <div className="pu-form-actions-royal">
              <button type="submit" className="pu-submit-btn-royal" disabled={loading}>
                {loading ? 'Processing Transaction...' : (editingProduct ? 'Commit Changes' : 'Execute Creation')}
              </button>
              {editingProduct && <button type="button" onClick={resetForm} className="pu-reset-btn-royal">Abort Operation</button>}
            </div>
          </form>
        </motion.div>
      )}

      {activeTab === 'categories' && (
        <motion.div
          className="pu-form-section-royal"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="pu-form-header-royal">
            <h2><FaCubes /> Taxonomy Management</h2>
            <button onClick={resetCategoryForm} className="pu-back-btn-royal">
              <FaSync /> Clear Logic
            </button>
          </div>

          <form onSubmit={handleCategorySubmit} className="pu-form-royal">
            <div className="pu-form-grid-royal">
              <div className="pu-form-group-royal">
                <label>Category Label</label>
                <input
                  type="text"
                  name="name"
                  value={categoryForm.name}
                  onChange={handleCategoryInputChange}
                  required
                  placeholder="Enter category name..."
                />
              </div>
              <div className="pu-form-group-royal">
                <label>Parent Node</label>
                <select
                  name="parentCategoryId"
                  value={categoryForm.parentCategoryId}
                  onChange={handleCategoryInputChange}
                >
                  <option value="">Independent Root</option>
                  {renderCategories(categories)}
                </select>
              </div>
              <div className="pu-form-group-royal" style={{ justifyContent: 'flex-end', display: 'flex' }}>
                <button type="submit" className="pu-submit-btn-royal" disabled={loading} style={{ width: '100%' }}>
                  {loading ? 'Processing...' : 'Deploy Node'}
                </button>
              </div>
            </div>
          </form>

          <div className="pu-categories-list-royal">
            <h3>Registered Taxonomy Nodes</h3>
            {categories.length === 0 ? (
              <div className="pu-no-data-royal">No nodes found in the registry.</div>
            ) : (
              <div className="pu-category-tree-royal">
                {categories.map(cat => (
                  <div key={cat.id} className="pu-tree-node-royal">
                    <div className="node-content">
                      <FaCubes /> <span>{cat.name}</span>
                      <small>ID: {cat.id}</small>
                    </div>
                    {cat.children && cat.children.length > 0 && (
                      <div className="node-children">
                        {cat.children.map(child => (
                          <div key={child.id} className="pu-tree-node-royal child">
                            <FaChevronRight /> <span>{child.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {activeTab === 'coupons' && (
        <motion.div
          className="pu-form-section-royal"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="pu-form-header-royal">
            <h2><FaTicketAlt /> Protocol Configuration</h2>
          </div>

          <div className="pu-protocol-grid-royal">
            <div className="pu-coupon-config-box">
              <h3>Create Active Protocol</h3>
              <form onSubmit={handleCouponSubmit} className="pu-form-royal">
                <div className="pu-form-group-royal">
                  <label>Protocol Code</label>
                  <input
                    type="text"
                    value={couponData.code}
                    onChange={(e) => setCouponData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    required
                    placeholder="e.g. ROYAL2024"
                  />
                </div>
                <div className="pu-form-group-royal">
                  <label>Discount Magnitude (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={couponData.discount_percentage}
                    onChange={(e) => setCouponData(prev => ({ ...prev, discount_percentage: e.target.value }))}
                    required
                  />
                </div>
                <div className="pu-form-group-royal">
                  <label>Expiry Timestamp</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={couponData.expiry_date}
                    onChange={(e) => setCouponData(prev => ({ ...prev, expiry_date: e.target.value }))}
                  />
                </div>
                <button type="submit" className="pu-submit-btn-royal" style={{ width: '100%', marginTop: '20px' }}>
                  Deploy Protocol
                </button>
              </form>
            </div>

            <div className="pu-coupon-config-box">
              <h3>Validate Protocol Trace</h3>
              <div className="pu-validation-form-royal">
                <input
                  type="text"
                  placeholder="Scan Protocol Code..."
                  value={couponValidation}
                  onChange={(e) => setCouponValidation(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && validateCoupon()}
                />
                <button onClick={validateCoupon} className="pu-validate-btn-royal">
                  Execute Validation
                </button>
              </div>

              <AnimatePresence>
                {validationResult && (
                  <motion.div
                    className={`pu-validation-result-royal ${validationResult.valid ? 'valid' : 'invalid'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {validationResult.valid ? (
                      <div className="result-content">
                        <div className="check-icon">✓</div>
                        <div className="data">
                          <strong>Active Trace Identified</strong>
                          <p>{validationResult.coupon.code} | {validationResult.coupon.discount_percentage}% REDUCTION</p>
                        </div>
                      </div>
                    ) : (
                      <div className="result-content">
                        <div className="check-icon">×</div>
                        <div className="data">
                          <strong>Trace Rejected</strong>
                          <p>{validationResult.message}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="pu-protocol-registry-royal">
            <h3>Active Protocols Registry</h3>
            {loadingCoupons ? (
              <div className="pu-loading-royal">Loading Protocols...</div>
            ) : coupons.length === 0 ? (
              <div className="pu-no-data-royal">No active protocols detected.</div>
            ) : (
              <div className="royal-table-container">
                <table className="royal-analytics-table">
                  <thead>
                    <tr>
                      <th>Identifier</th>
                      <th>Magnitude</th>
                      <th>Expiration</th>
                      <th>Status</th>
                      <th>Operations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map(coupon => {
                      const isExpired = coupon.expiry_date && new Date(coupon.expiry_date) < new Date();
                      const isActive = coupon.is_active !== false && !isExpired;
                      return (
                        <tr key={coupon.id}>
                          <td className="mono"><strong>{coupon.code}</strong></td>
                          <td>{coupon.discount_percentage}%</td>
                          <td>{coupon.expiry_date ? new Date(coupon.expiry_date).toLocaleDateString() : 'INDETERMINATE'}</td>
                          <td>
                            <span className={`pu-tag-royal ${isActive ? 'active' : isExpired ? 'expired' : 'inactive'}`}>
                              {isActive ? 'NOMINAL' : isExpired ? 'EXPIRED' : 'OFFLINE'}
                            </span>
                          </td>
                          <td>
                            <button className="action-delete" onClick={() => deleteCoupon(coupon.id)}>
                              <FaTrash /> Purge
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProductUploading;