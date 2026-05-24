import React from 'react';
import './ModernHero.css';

const ModernHero = () => {
  return (
    <section className="modern-hero-section">
      <div className="modern-hero-container">
        {/* Brand-focused visually prominent H1 (Technical SEO & Accessibility aligned) */}
        {/* <div className="modern-hero-header">
          <h1 className="modern-hero-h1">Bishwokarma Furniture | Premium Solid Wood Furniture Nepal</h1>
          <p className="modern-hero-lead">Handcrafted Wooden Furniture & Royal Home Decor in Kathmandu, Pokhara, & Across Nepal</p>
        </div> */}
        
        <div className="modern-hero-grid">
          {/* Left Column: Huge Main Banner */}
          <div className="hero-main-banner">
            <img 
              src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=1200" 
              alt="Premium handcrafted royal sofa set in Nepal starting Rs 45,999" 
              className="banner-img"
              loading="eager"
            />
            <div className="banner-overlay"></div>
            <div className="banner-content left-banner-content">
              <span className="banner-tag">Exquisite Craft</span>
              <h2 className="banner-subtitle">The <span className="banner-highlight">ROYAL</span> Collection</h2>
              <div className="banner-title h1-visual">Royal Sofa Sets</div>
              <div className="banner-price-tag">Starting From Rs 45,999*</div>
            </div>
            {/* Carousel Arrows (Visual only for now) */}
            <button className="carousel-arrow left-arrow" aria-label="Previous slide">‹</button>
            <button className="carousel-arrow right-arrow" aria-label="Next slide">›</button>
          </div>

          {/* Right Column: Two Stacked Banners */}
          <div className="hero-side-banners">
            
            {/* Top Side Banner */}
            <div className="side-banner top-banner">
              <img 
                src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800" 
                alt="Luxury wooden wardrobes and bedroom furniture Kathmandu" 
                className="banner-img"
                loading="eager"
              />
              <div className="banner-overlay"></div>
              <div className="banner-content side-banner-content top-right-content">
                <span className="banner-tag mini">Artisan Storage</span>
                <h2 className="banner-title-small">Organize. Style. Live.</h2>
                <p className="banner-desc">Premium wooden wardrobes and storage</p>
                <div className="banner-price-tag small-tag">Starting From Rs 25,000*</div>
              </div>
            </div>

            {/* Bottom Side Banner */}
            <div className="side-banner bottom-banner">
              <img 
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800" 
                alt="Solid wood king size beds in Nepal" 
                className="banner-img"
                loading="eager"
              />
              <div className="banner-overlay"></div>
              <div className="banner-content side-banner-content bottom-right-content">
                <span className="banner-tag mini">Comfort Suite</span>
                <h2 className="banner-title-small">Rest. Dream. Recharge.</h2>
                <p className="banner-desc">Handcrafted solid wood king size beds</p>
                <div className="banner-price-tag small-tag">Starting From Rs 35,000*</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernHero;
