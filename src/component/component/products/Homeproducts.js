/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, SlidersHorizontal, Grid3X3, Grid2X2, 
  ChevronDown, RefreshCw, Layers, Check, X, Eye
} from 'lucide-react';
import { API_BASE_URL } from '@/config/api';
import ProductCard from '../../common/ProductCard/ProductCard';
import ProductRecommendations from '../../recommendations/ProductRecommendations';
import { flattenCategories } from '@/utils/categoryHelpers';
import './hproduct.css';

const WOOD_TYPES = ['Sheesham Wood', 'Teak Wood', 'Mango Wood', 'Engineered Wood'];

const FurnitureProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [gridCols, setGridCols] = useState(4); // 3 or 4 columns
  const [sortBy, setSortBy] = useState('recommended');
  const [categories, setCategories] = useState([]);
  
  // Custom Filter Panel States
  const [pricePreset, setPricePreset] = useState('all');
  const [customPriceRange, setCustomPriceRange] = useState({ min: '', max: '' });
  const [selectedWood, setSelectedWood] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Fetch products from the centralized backend endpoint
  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Query central backend API
      let url = `${API_BASE_URL}/api/products`;
      
      // Build query string
      const queryParams = [];
      if (filterCategory !== 'all') {
        queryParams.push(`category=${encodeURIComponent(filterCategory)}`);
      }
      if (selectedWood !== 'all') {
        queryParams.push(`wooden_type=${encodeURIComponent(selectedWood)}`);
      }
      
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      const rawProducts = Array.isArray(data) ? data : data.products || [];
      setProducts(rawProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`);
      if (!response.ok) return;
      const data = await response.json();
      setCategories(flattenCategories(Array.isArray(data) ? data : []).filter(category => category.status !== 'inactive'));
    } catch (error) {
      console.warn('Catalog categories failed to load:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filterCategory, selectedWood]);

  useEffect(() => {
    fetchCategories();

    // Smooth scroll configuration
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    let idleTaskId;
    let timeoutId;
    const revealRecommendations = () => setShowRecommendations(true);

    if ('requestIdleCallback' in window) {
      idleTaskId = window.requestIdleCallback(revealRecommendations, { timeout: 4500 });
    } else {
      timeoutId = window.setTimeout(revealRecommendations, 2400);
    }

    return () => {
      if (idleTaskId && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleTaskId);
      }
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  const formatPrice = (price) => {
    return Number.isFinite(Number(price)) 
      ? `Rs. ${Math.round(Number(price)).toLocaleString('en-NP')}` 
      : 'Contact for Price';
  };

  // Filter and sort computation
  const filteredProducts = products.filter((product) => {
    if (!product) return false;

    // Search query match
    const nameMatch = (product.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = (product.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    if (!nameMatch && !descMatch) return false;

    // Category check (redundancy for local fallback filter)
    if (filterCategory !== 'all') {
      const productCategoryId = product.categoryId ? String(product.categoryId) : '';
      if (productCategoryId !== String(filterCategory)) return false;
    }

    // Wood Type check
    if (selectedWood !== 'all' && product.wooden_type !== selectedWood) {
      if (!product.material || !product.material.toLowerCase().includes(selectedWood.toLowerCase())) {
        return false;
      }
    }

    // Stock check
    if (inStockOnly && product.stock !== null && product.stock <= 0) return false;

    // Price Range filter
    const activePrice = product.new_price || product.salePrice || product.price || 0;
    
    // 1. Preset Check
    if (pricePreset !== 'all') {
      if (pricePreset === 'under25' && activePrice >= 25000) return false;
      if (pricePreset === '25to75' && (activePrice < 25000 || activePrice > 75000)) return false;
      if (pricePreset === '75to150' && (activePrice < 75000 || activePrice > 150000)) return false;
      if (pricePreset === 'above150' && activePrice <= 150000) return false;
    }

    // 2. Custom Check
    if (customPriceRange.min && activePrice < parseFloat(customPriceRange.min)) return false;
    if (customPriceRange.max && activePrice > parseFloat(customPriceRange.max)) return false;

    return true;
  }).sort((a, b) => {
    const priceA = a.new_price || a.salePrice || a.price || 0;
    const priceB = b.new_price || b.salePrice || b.price || 0;

    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
    
    // Default / Recommended (Highest rating or Stock)
    return (b.rating || 4.5) - (a.rating || 4.5);
  });

  return (
    <div className="furniture-catalog-premium">
      
      {/* ── IMMERSIVE GLASSMORPHIC HERO BANNER ── */}
      <section className="premium-hero">
        <div className="hero-dark-overlay"></div>
        <div className="hero-grid-pattern"></div>
        
        <motion.div 
          className="hero-text-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="hero-eyebrow">HANDCRAFTED EXCELLENCE</span>
          <h1 className="hero-headline">The Art of Fine Living</h1>
          <p className="hero-subline">
            Experience premium Nepalese artistry. Every piece is meticulously hand-carved in seasoned Sheesham and solid Teak woods to blend timeless luxury with ultimate longevity.
          </p>
          <div className="hero-stats">
            <div className="stat-pill"><strong>500+</strong> Designs</div>
            <div className="stat-pill"><strong>100%</strong> Solid Wood</div>
            <div className="stat-pill"><strong>15 Year</strong> Warranty</div>
          </div>
        </motion.div>
      </section>

      {/* ── MAIN PRODUCTS VIEWPORT ── */}
      <div className="catalog-layout-container">
        
        {/* TOP BAR / CONTROL HUB */}
        <div className="catalog-topbar">
          <div className="topbar-left">
            <button 
              className={`sidebar-toggle-btn ${isSidebarOpen ? 'active' : ''}`}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <SlidersHorizontal size={18} />
              <span>Filters</span>
            </button>
            <span className="results-badge">
              <strong>{filteredProducts.length}</strong> creations found
            </span>
          </div>

          <div className="topbar-center">
            <div className="premium-search-wrapper">
              <input
                type="text"
                placeholder="Search catalog by name, wood or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="premium-search-input"
              />
              <Search className="search-decor-icon" size={18} />
              {searchQuery && (
                <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="topbar-right">
            <div className="grid-switcher">
              <button 
                className={`grid-switch-btn ${gridCols === 3 ? 'active' : ''}`}
                onClick={() => setGridCols(3)}
                aria-label="3 Column Grid"
              >
                <Grid2X2 size={18} />
              </button>
              <button 
                className={`grid-switch-btn ${gridCols === 4 ? 'active' : ''}`}
                onClick={() => setGridCols(4)}
                aria-label="4 Column Grid"
              >
                <Grid3X3 size={18} />
              </button>
            </div>

            <div className="sort-dropdown-wrapper">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="premium-sort-select"
              >
                <option value="recommended">Curated Selections</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Alphabetical: A to Z</option>
              </select>
              <ChevronDown className="sort-select-arrow" size={16} />
            </div>
          </div>
        </div>

        {/* CONTENT SPLIT CONTAINER */}
        <div className="split-content-wrapper">
          
          {/* SIDEBAR FILTER PANEL */}
          <aside className={`premium-sidebar ${isSidebarOpen ? 'drawer-open' : ''}`}>
            
            {/* Category Select Section */}
            <div className="sidebar-widget">
              <h3 className="widget-title">Categories</h3>
              <div className="category-select-list">
                {[{ id: 'all', name: 'All Creations' }, ...categories].map((cat) => {
                  const Icon = cat.id === 'all' ? Layers : Grid3X3;
                  const isSelected = filterCategory === String(cat.id);
                  return (
                    <button
                      key={cat.id}
                      className={`category-select-item ${isSelected ? 'active' : ''}`}
                      onClick={() => setFilterCategory(String(cat.id))}
                    >
                      <Icon size={16} className="category-item-icon" />
                      <span>{cat.name}</span>
                      {isSelected && <Check size={14} className="category-check" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Preset Filter */}
            <div className="sidebar-widget">
              <h3 className="widget-title">Price Budget</h3>
              <div className="price-presets-grid">
                {[
                  { slug: 'all', label: 'All Budgets' },
                  { slug: 'under25', label: 'Under NPR 25K' },
                  { slug: '25to75', label: '25K – 75K' },
                  { slug: '75to150', label: '75K – 150K' },
                  { slug: 'above150', label: 'Above 150K' }
                ].map((preset) => (
                  <button
                    key={preset.slug}
                    className={`price-preset-pill ${pricePreset === preset.slug ? 'active' : ''}`}
                    onClick={() => {
                      setPricePreset(preset.slug);
                      // Reset custom range when choosing preset
                      setCustomPriceRange({ min: '', max: '' });
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Custom price inputs */}
              <div className="custom-price-inputs">
                <input
                  type="number"
                  placeholder="Min NPR"
                  value={customPriceRange.min}
                  onChange={(e) => {
                    setCustomPriceRange(prev => ({ ...prev, min: e.target.value }));
                    setPricePreset('all'); // Clear presets
                  }}
                  className="price-num-input"
                />
                <span className="price-range-sep">to</span>
                <input
                  type="number"
                  placeholder="Max NPR"
                  value={customPriceRange.max}
                  onChange={(e) => {
                    setCustomPriceRange(prev => ({ ...prev, max: e.target.value }));
                    setPricePreset('all'); // Clear presets
                  }}
                  className="price-num-input"
                />
              </div>
            </div>

            {/* Wood Type Options */}
            <div className="sidebar-widget">
              <h3 className="widget-title">Wood & Material</h3>
              <div className="wood-filter-list">
                <button
                  className={`wood-filter-item ${selectedWood === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedWood('all')}
                >
                  All Woods
                </button>
                {WOOD_TYPES.map((wood) => (
                  <button
                    key={wood}
                    className={`wood-filter-item ${selectedWood === wood ? 'active' : ''}`}
                    onClick={() => setSelectedWood(wood)}
                  >
                    {wood}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="sidebar-widget no-border">
              <label className="toggle-switch-container">
                <input 
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <span className="toggle-switch-slider"></span>
                <span className="toggle-label-text">In-Stock Only</span>
              </label>
            </div>

            {/* Reset Button */}
            <button 
              className="reset-all-filters-btn"
              onClick={() => {
                setFilterCategory('all');
                setSearchQuery('');
                setPricePreset('all');
                setCustomPriceRange({ min: '', max: '' });
                setSelectedWood('all');
                setInStockOnly(false);
              }}
            >
              <RefreshCw size={14} />
              <span>Reset All Filters</span>
            </button>
          </aside>

          {/* MAIN GRID VIEWPORT */}
          <main className="catalog-grid-area">
            {loading ? (
              <div className="premium-skeleton-container">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="skeleton-card">
                    <div className="skeleton-media shimmer"></div>
                    <div className="skeleton-line title shimmer"></div>
                    <div className="skeleton-line subtitle shimmer"></div>
                    <div className="skeleton-line footer shimmer"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="catalog-empty-state">
                <Eye size={48} className="empty-decor-icon" />
                <h2>No Creations Found</h2>
                <p>No products match your current filtering or search criteria. Try modifying your specifications or reset the options panel.</p>
                <button 
                  className="reset-cta-btn"
                  onClick={() => {
                    setFilterCategory('all');
                    setSelectedWood('all');
                    setPricePreset('all');
                    setCustomPriceRange({ min: '', max: '' });
                    setSearchQuery('');
                    setInStockOnly(false);
                  }}
                >
                  Clear Active Filters
                </button>
              </div>
            ) : (
              <div className={`products-grid-viewport cols-${gridCols}`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── TWIN RECOMMENDATION ARRAYS ── */}
      {showRecommendations && (
        <section className="recommendations-showcase-section">
          <ProductRecommendations
            type="trending"
            limit={4}
            title="Trending Masterpieces"
            className="home-recommendations-premium"
          />

          <ProductRecommendations
            type="personalized"
            limit={4}
            title="Curated Recommendations"
            className="home-recommendations-premium"
          />
        </section>
      )}

    </div>
  );
};

export default FurnitureProductCatalog;
