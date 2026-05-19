import React from 'react';
import Image from 'next/image';
import './ModernHero.css';

const ModernHero = () => {
  return (
    <section className="modern-hero-section">
      <div className="modern-hero-container">
        {/* SEO Hidden H1 - Screen Reader & Bot Accessible Only */}
        <h1 className="sr-only">Sindureghari Furniture — Buy Sofas, Beds & Home Furniture Online in Nepal</h1>
        
        <div className="modern-hero-grid">
          {/* Left Column: Huge Main Banner */}
          <div className="hero-main-banner">
            <Image 
              src="/images/showroom-exterior.jpg" 
              alt="Premium handcrafted royal sofa set in Nepal starting Rs 45,999" 
              className="banner-img"
              width={800}
              height={600}
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            <div className="banner-content left-banner-content">
              <h2 className="banner-subtitle">The <span className="banner-highlight">ROYAL</span> Collection</h2>
              {/* Visual H1 replacement */}
              <div className="banner-title h1-visual">Royal Sofa Sets</div>
              <div className="banner-price-tag">Starting From Rs 45,999*</div>
            </div>
            {/* Carousel Arrows (Visual only for now) */}
            <button className="carousel-arrow left-arrow" aria-label="Previous slide">‹</button>
            <button className="carousel-arrow right-arrow" aria-label="Next slide">›</button>
          </div>

          {/* Right Column: Two Stacked Banners */}
          <div className="hero-side-banners">
            <div className="side-banner top-banner">
              <Image 
                src="/images/wardrobe-hero.jpg" 
                alt="Luxury wooden wardrobes and bedroom furniture Kathmandu" 
                className="banner-img"
                width={400}
                height={300}
                priority
                sizes="(max-width: 768px) 100vw, 30vw"
              />
              <div className="banner-content top-right-content">
                <h2 className="banner-title-small">Organize. Style. Live.</h2>
                <p className="banner-desc">Premium wooden wardrobes and storage</p>
                <div className="banner-price-tag small-tag">Starting From Rs 25,000*</div>
              </div>
            </div>

            <div className="side-banner bottom-banner">
              <Image 
                src="/images/bed-hero.jpg" 
                alt="Solid wood king size beds in Nepal" 
                className="banner-img"
                width={400}
                height={300}
                sizes="(max-width: 768px) 100vw, 30vw"
              />
              <div className="banner-content bottom-right-content">
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
