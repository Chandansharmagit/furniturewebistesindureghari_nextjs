import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./recomended.css";

function DoubleImage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const recommendedCategories = [
    {
      id: 1,
      title: "Bedroom Furniture",
      subtitle: "Experience ultimate comfort and style",
      category: "bedroom",
      image: "https://images.woodenstreet.de/wsnew2024/static-webmedia/images/home-new1/beds-banner.jpg",
      alt: "Premium Bedroom Furniture Collection"
    },
    {
      id: 2,
      title: "Space Saving Furniture",
      subtitle: "Innovative solutions for modern homes",
      category: "spacesaving",
      image: "https://images.woodenstreet.de/wsnew2024/static-webmedia/images/home-new1/space-save-banner.jpg",
      alt: "Space Saving Furniture Solutions"
    }
  ];

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
  };

  return (
    <div className={`dimg-container ${isVisible ? 'visible' : ''}`}>
      <div className="dimg-header">
        <span className="dimg-badge">Curated For You</span>
        <h1 className="dimg-recommended">
          Recommended <span className="gradient-text">For You</span>
        </h1>
        <p className="dimg-subtitle">
          Take a look at the newest additions to our modern furniture collection
        </p>
      </div>

      <div className="dimg-grid">
        {recommendedCategories.map((item, index) => (
          <div
            key={item.id}
            className="dimg-item"
            onClick={() => handleCategoryClick(item.category)}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            role="button"
            tabIndex={0}
            style={{ animationDelay: `${index * 0.2}s` }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCategoryClick(item.category);
              }
            }}
          >
            <div className="dimg-image-wrapper">
              <img
                src={item.image}
                alt={item.alt}
                className="dimg-image"
                loading="lazy"
              />
              <div className={`dimg-overlay ${hoveredId === item.id ? 'active' : ''}`}>
                <div className="overlay-content">
                  <h3 className="dimg-category-title">{item.title}</h3>
                  <p className="dimg-category-subtitle">{item.subtitle}</p>
                  <span className="dimg-shop-now">
                    Shop Collection
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            {/* Elegant info card appearing below on mobile or hover */}
            <div className="dimg-info">
              <h3 className="dimg-title-main">{item.title}</h3>
              <p className="dimg-desc-main">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoubleImage;