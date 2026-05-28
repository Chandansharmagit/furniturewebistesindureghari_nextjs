import React from 'react';
import Script from 'next/script';
import './GoogleReviews.css';

const GoogleReviews = () => {
  return (
    <section className="google-reviews-section">
      <Script 
        src="https://elfsightcdn.com/platform.js" 
        strategy="afterInteractive"
      />
      
      <div className="reviews-container">
        <div className="reviews-header text-center">
          <span className="reviews-subtitle">Client Testimonials</span>
          <h2 className="reviews-title">What Our Customers Say</h2>
          <div className="rating-badge-container">
            <div className="rating-badge">
              <span className="rating-score">4.9</span>
              <div className="rating-stars">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <span className="rating-text">Google Customer Rating</span>
            </div>
          </div>
          <p className="reviews-description">
            Discover why home owners and businesses across Nepal trust Sindureghari Furniture for exceptional quality, timeless design, and reliable service.
          </p>
        </div>

        {/* Elfsight Google Reviews Widget */}
        <div className="reviews-widget-wrapper">
          <div 
            className="elfsight-app-6585c3c3-1033-4030-afc7-96a507f9eb1d" 
            data-elfsight-app-lazy
          ></div>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviews;
