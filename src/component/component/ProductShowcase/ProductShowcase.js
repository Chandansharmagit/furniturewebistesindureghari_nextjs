/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl, PRODUCT_ENDPOINTS } from '../../../config/api';
import { buildCategoryPath, flattenCategories } from '../../../utils/categoryHelpers';
import './FurnitureCategories.css';

const FurnitureCategories = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const response = await fetch(buildApiUrl(PRODUCT_ENDPOINTS.CATEGORIES));
        if (!response.ok) return;
        const data = await response.json();
        if (isMounted && Array.isArray(data)) {
          setCategories(data);
        }
      } catch (error) {
        console.warn('Product showcase categories failed to load:', error);
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const rootCategories = useMemo(() => categories.filter((category) => category.status !== 'inactive'), [categories]);
  const categoryItems = useMemo(() => flattenCategories(rootCategories), [rootCategories]);
  const visibleItems = activeCategory === 'all'
    ? categoryItems
    : categoryItems.filter((category) => category.slug === activeCategory || category.parent?.slug === activeCategory);

  const handleCategoryClick = (category) => {
    navigate(buildCategoryPath(category, category.parent));
  };

  const handleCategoryChange = (categorySlug) => {
    setActiveCategory(categorySlug);
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 50);
  };

  if (categoryItems.length === 0) return null;

  return (
    <div className="furniture-categories">
      <div className="container">
        <div className="header-section">
          <div className="title-wrapper">
            <span className="title-badge">Premium Collection</span>
            <h1 className="main-title">
              Discover Your<br />
              <i className="serif-italic">Perfect Furniture</i>
            </h1>
            <div className="title-separator"></div>
            <p className="main-subtitle">
              Category collections are managed directly from the admin dashboard.
            </p>
          </div>
        </div>

        <div className="category-filters">
          <button
            className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('all')}
          >
            <span className="filter-text">All</span>
          </button>
          {rootCategories.map((category) => (
            <button
              key={category.id}
              className={`filter-btn ${activeCategory === category.slug ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category.slug)}
            >
              <span className="filter-text">{category.name}</span>
            </button>
          ))}
        </div>

        <div className={`furniture-grid ${isVisible ? 'visible' : ''}`}>
          {visibleItems.map((category) => (
            <div
              key={category.id}
              className="furniture-card regular"
              onClick={() => handleCategoryClick(category)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleCategoryClick(category);
                }
              }}
            >
              <div className="image-container">
                {category.image ? (
                  <img src={category.image} alt={category.name} loading="lazy" />
                ) : (
                  <div className="category-image-placeholder">{category.icon || category.name.charAt(0)}</div>
                )}
                <div className="category-label">{category.product_count || 0} products</div>
              </div>

              <div className="furniture-card-content">
                <h3 className="furniture-title serif">{category.name}</h3>
                <p className="furniture-description">{category.description || `Explore ${category.name} products.`}</p>
                <div className="view-link">EXPLORE</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FurnitureCategories;
