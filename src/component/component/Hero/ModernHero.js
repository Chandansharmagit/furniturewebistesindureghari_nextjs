import React from 'react';
import './ModernHero.css';

const ModernHero = () => {
  return (
    <section className="modern-hero-section">
      <div className="modern-hero-container">
        <div className="modern-hero-grid">
          {/* Left Column: Image with Overlapping Card */}
          {/* Left Column: Huge Main Banner */}
          <div className="hero-main-banner">
            <img 
              src="/assets/aurelian-hero.png" 
              alt="Main Banner" 
              className="banner-img"
            />
            <div className="banner-content left-banner-content">
              <h2 className="banner-subtitle">The <span className="banner-highlight">HOME</span> Stadium</h2>
              <h1 className="banner-title">Lounge Chairs</h1>
              <div className="banner-price-tag">Starting From ₹5,999*</div>
            </div>
            {/* Carousel Arrows (Visual only for now) */}
            <button className="carousel-arrow left-arrow">‹</button>
            <button className="carousel-arrow right-arrow">›</button>
          </div>

          {/* Right Column: Two Stacked Banners */}
          <div className="hero-side-banners">
            <div className="side-banner top-banner">
              <img 
                src="/assets/aurelian-hero.png" 
                alt="Side Banner 1" 
                className="banner-img"
              />
              <div className="banner-content top-right-content">
                <h2 className="banner-title-small">Watch. Store. Style.</h2>
                <p className="banner-desc">Designed to hold more than just a screen</p>
                <div className="banner-price-tag small-tag">Starting From ₹1,999*</div>
              </div>
            </div>

            <div className="side-banner bottom-banner">
              <img 
                src="/assets/aurelian-hero.png" 
                alt="Side Banner 2" 
                className="banner-img"
              />
              <div className="banner-content bottom-right-content">
                <h2 className="banner-title-small">Recline. Revolve. Rock.</h2>
                <p className="banner-desc">Comfort that moves the way you do</p>
                <div className="banner-price-tag small-tag">Starting From ₹30,599*</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernHero;
