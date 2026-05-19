import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FurnitureCategories.css';

const FurnitureCategories = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger fade-in animation on mount
    setIsVisible(true);
  }, []);

  const categories = [
    { name: 'All' },
    { name: 'Living' },
    { name: 'Bedroom' },
    { name: 'Dining' },
    { name: 'Mattress' },
    { name: 'Decor' }
  ];

  const furnitureItems = [
    {
      id: 1,
      title: 'Artisan Dining Table',
      category: 'Dining',
      categoryName: 'dining',
      image: 'https://images.unsplash.com/photo-1577145745727-42b77dd1f6e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      description: 'Elegant dining sets designed for memorable family moments.',
      gridSize: 'large'
    },
    {
      id: 2,
      title: 'Sleek Wardrobe Solutions',
      category: 'Bedroom',
      categoryName: 'wardrobe',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Conceal the clutter with high-end modular storage systems.',
      gridSize: 'regular'
    },
    {
      id: 3,
      title: 'The Minimalist Sofa',
      category: 'Living',
      categoryName: 'sofa',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      description: 'Sculptural silhouettes meet unparalleled comfort in this centerpiece for the modern home.',
      gridSize: 'large'
    },
    {
      id: 4,
      title: 'Royal Sleep Set',
      category: 'Bedroom',
      categoryName: 'bed',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Premium quality beds for a perfect night\'s restorative sleep.',
      gridSize: 'regular'
    },
    {
      id: 5,
      title: 'Modern TV Units',
      category: 'Living',
      categoryName: 'tvunit',
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Organize your entertainment space with sophisticated minimalism.',
      gridSize: 'regular'
    },
    {
      id: 6,
      title: 'Statement Cabinets',
      category: 'Decor',
      categoryName: 'cabinet',
      image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Functional art pieces that command attention in any room.',
      gridSize: 'regular'
    }
  ];

  // Filter furniture items based on active category
  const filteredItems = activeCategory === 'All'
    ? furnitureItems
    : furnitureItems.filter(item => item.category === activeCategory);

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName}`);
  };

  const handleCategoryChange = (categoryName) => {
    setActiveCategory(categoryName);
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 50);
  };

  return (
    <div className="furniture-categories">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="container">
        {/* Header Section */}
        <div className="header-section">
          <div className="title-wrapper">
            <span className="title-badge">Premium Collection 2024</span>
            <h1 className="main-title">
              Discover Your<br />
              <i className="serif-italic">Perfect Furniture</i>
            </h1>
            <div className="title-separator"></div>
            <p className="main-subtitle">
              Handcrafted excellence meets modern architectural vision.<br />
              Transform your sanctuary with our meticulously curated editorial collection.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="category-filters">
          {categories.map((category, index) => (
            <button
              key={category.name}
              className={`filter-btn ${activeCategory === category.name ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category.name)}
            >
              <span className="filter-text">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Furniture Grid */}
        <div className={`furniture-grid ${isVisible ? 'visible' : ''}`}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <div
                key={item.id}
                className={`furniture-card ${item.gridSize}`}
                onClick={() => handleCategoryClick(item.categoryName)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCategoryClick(item.categoryName);
                  }
                }}
              >
                {/* Image Container */}
                <div className="image-container">
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <div className="category-label">{item.category}</div>
                </div>

                {/* Card Content */}
                <div className="furniture-card-content">
                  <h3 className="furniture-title serif">{item.title}</h3>
                  <p className="furniture-description">{item.description}</p>
                  <div className="view-link">
                    EXPLORE
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-items-message">
              <div className="no-items-icon">📦</div>
              <h3>No items found</h3>
              <p>Try selecting a different category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FurnitureCategories;