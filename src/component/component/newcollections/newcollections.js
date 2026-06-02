import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaHeart, FaSearch, FaInfoCircle, FaStar } from 'react-icons/fa';

// Move API URL to a constant or config (ideally in a separate config file)
import { API_BASE_URL } from '../../../config/api';
const API_URL = API_BASE_URL;

const FurnitureProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let isMounted = true; // Track component mount status

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Normalize data to match expected structure
        const normalizedData = (Array.isArray(data) ? data : data.products || []).map(product => ({
          ...product,
          price: Number(product.price) || 0, // Convert price to number, default to 0 if invalid
          image1: product.image_paths?.[0], // Map image_paths to image1, image2, etc.
          image2: product.image_paths?.[1],
          image3: product.image_paths?.[2]
        }));
        if (isMounted) {
          setProducts(normalizedData);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching products:', error);
          setProducts([]); // Set empty array to avoid undefined errors
          setLoading(false);
        }
      }
    };

    fetchProducts();

    // Store original scroll behavior
    const originalOverflow = document.body.style.overflow;
    document.documentElement.style.scrollBehavior = 'smooth';

    // Cleanup on unmount
    return () => {
      isMounted = false;
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.overflow = originalOverflow; // Restore original overflow
    };
  }, []);

  const formatPrice = (price) => {
    return Number.isFinite(price) && price != null
      ? `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : 'Price not available';
  };

  const truncateText = (text, limit) => {
    if (typeof text !== 'string') return 'No description';
    return text.length <= limit ? text : text.substring(0, limit) + '...';
  };

  const getImageUrl = (imagePath) => {
    return imagePath ? `${API_URL}${imagePath}` : 'https://via.placeholder.com/300x250?text=No+Image';
  };

  const openModal = (product) => {
    if (!product) return;
    setSelectedProduct(product);
    setActiveImage(product.image_paths?.[0] || ''); // Use first image from image_paths
    setQuantity(1);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setActiveImage('');
    document.body.style.overflow = ''; // Use empty string to reset to default
  };

  const changeActiveImage = (imagePath) => {
    setActiveImage(imagePath || '');
  };

  const increaseQuantity = () => {
    if (selectedProduct && Number.isFinite(selectedProduct.stock) && quantity < selectedProduct.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleCategoryFilter = (category) => {
    setFilterCategory(category);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value || '');
  };

  const filteredProducts = products.filter((product) => {
    if (!product) return false;
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesSearch =
      (product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="loading-container" role="status" aria-live="polite">
        <div className="spinner"></div>
        <p>Loading premium furniture collection...</p>
      </div>
    );
  }

  return (
    <div className="furniture-catalog">
      <header className="catalog-header">
        <h1>Newly Updated Furniture Collection</h1>
        <p>Discover our curated selection of quality furniture</p>

        <div className="catalog-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search furniture..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
              aria-label="Search furniture"
            />
            <FaSearch className="search-icon" aria-hidden="true" />
          </div>

          <div className="filter-container" role="group" aria-label="Category filters">
            {['all', 'living', 'bedroom', 'dining', 'office'].map((category) => (
              <button
                key={category}
                className={`filter-btn ${filterCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryFilter(category)}
                aria-pressed={filterCategory === category}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {filteredProducts.length === 0 ? (
        <div className="no-results" role="alert">
          <FaInfoCircle className="no-results-icon" aria-hidden="true" />
          <h3>No products found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id || Math.random()} className="product-card">
              <div className="product-image-container">
                <img
                  src={getImageUrl(product.image_paths?.[0])}
                  alt={product.name || 'Product image'}
                  className="product-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x250?text=No+Image';
                  }}
                />
                {(product.discountDuration || 0) > 0 && <span className="discount-badge">Sale</span>}
                <div className="quick-actions">
                  <button
                    className="quick-action-btn"
                    title="Add to wishlist"
                    aria-label="Add to wishlist"
                  >
                    <FaHeart />
                  </button>
                </div>
              </div>

              <div className="product-info">
                <h3 className="product-name">{truncateText(product.name, 60)}</h3>

                <div className="product-price">
                  <span className="price">{formatPrice(product.price)}</span>
                </div>

                <div className="product-meta">
                  <span className="stock-info">
                    {(product.stock || 0) > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                  <span className="warranty-info">{product.warranty || 0} years warranty</span>
                </div>

                <div className="product-actions">
                  <button
                    className="btn-primary"
                    onClick={() => openModal(product)}
                    aria-label={`View details for ${product.name || 'product'}`}
                  >
                    View Details
                  </button>
                  <button
                    className="btn-secondary"
                    disabled={(product.stock || 0) === 0}
                    aria-label={`Add ${product.name || 'product'} to cart`}
                  >
                    <FaShoppingCart className="btn-icon" aria-hidden="true" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <div className="modal-overlay" onClick={closeModal} role="dialog" aria-modal="true">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={closeModal}
              aria-label="Close product details modal"
            >
              ×
            </button>

            <div className="modal-product">
              <div className="modal-images">
                <img
                  src={getImageUrl(activeImage || selectedProduct.image_paths?.[0])}
                  alt={selectedProduct.name || 'Product image'}
                  className="modal-main-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x250?text=No+Image';
                  }}
                />
                <div className="modal-thumbnails">
                  {selectedProduct.image_paths?.slice(0, 3).map((image, index) => (
                    <img
                      key={index}
                      src={getImageUrl(image)}
                      alt={`${selectedProduct.name || 'Product'} thumbnail ${index + 1}`}
                      className={`modal-thumbnail ${activeImage === image ? 'active' : ''}`}
                      onClick={() => changeActiveImage(image)}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="modal-info">
                <h2>{selectedProduct.name || 'Product'}</h2>
                <p className="modal-price">{formatPrice(selectedProduct.price)}</p>

                <div className="modal-rating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < (selectedProduct.rating || 4) ? 'star-filled' : 'star-empty'}
                      aria-hidden="true"
                    />
                  ))}
                  <span className="rating-text">
                    ({selectedProduct.reviewCount || 0} customer reviews)
                  </span>
                </div>

                <div className="modal-specs">
                  <h3>Specifications</h3>
                  <ul>
                    <li><strong>Material:</strong> {selectedProduct.material || 'N/A'}</li>
                    <li><strong>Color:</strong> {selectedProduct.color || 'N/A'}</li>
                    <li><strong>Dimensions:</strong> {selectedProduct.dimensions || 'N/A'}</li>
                    <li><strong>Weight:</strong> {selectedProduct.weight || 0} kg</li>
                    <li><strong>Manufacturer:</strong> {selectedProduct.manufacturer || 'N/A'}</li>
                    <li><strong>Warranty:</strong> {selectedProduct.warranty || 0} years</li>
                  </ul>
                </div>

                <div className="modal-description">
                  <h3>Description</h3>
                  <p>{truncateText(selectedProduct.description, 500)}</p>
                </div>

                <div className="modal-actions">
                  <div className="quantity-selector">
                    <button
                      className="quantity-btn"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={selectedProduct.stock || 1}
                      value={quantity}
                      className="quantity-input"
                      readOnly
                      aria-label={`Quantity of ${selectedProduct.name || 'product'}`}
                    />
                    <button
                      className="quantity-btn"
                      onClick={increaseQuantity}
                      disabled={(selectedProduct.stock || 0) <= quantity}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="btn-primary modal-btn"
                    disabled={(selectedProduct.stock || 0) === 0}
                    aria-label={`Add ${selectedProduct.name || 'product'} to cart`}
                  >
                    <FaShoppingCart className="btn-icon" aria-hidden="true" />
                    Add to Cart
                  </button>
                  <button
                    className="btn-secondary modal-btn"
                    aria-label={`Add ${selectedProduct.name || 'product'} to wishlist`}
                  >
                    <FaHeart className="btn-icon" aria-hidden="true" />
                    Add to Wishlist
                  </button>
                </div>

                <div className="delivery-info">
                  <p>
                    <strong>Availability:</strong>{' '}
                    {(selectedProduct.stock || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                  </p>
                  <p><strong>Delivery:</strong> Free shipping on orders over ₹5,000</p>
                  <p><strong>Assembly:</strong> Professional assembly available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FurnitureProductCatalog;
