import React, { useState } from 'react';
import './RoyalSpecialOfferPopup.css';

const RoyalSpecialOfferPopup = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('ROYAL30');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShopNow = () => {
    handleClose();
    // Scroll to products section or navigate to products page
    const productsSection = document.getElementById('products') || document.querySelector('.products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`royal-offer-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div className="royal-offer-popup" onClick={(e) => e.stopPropagation()}>
        <button className="royal-offer-close-btn" onClick={handleClose}>
          ×
        </button>

        <div className="royal-offer-container">
          {/* Image Sidebar */}
          <div className="royal-offer-sidebar">
            <div className="special-decoration">
              {/* Premium Furniture Illustration SVG */}
              <svg viewBox="0 0 200 300" className="special-illustration">
                <defs>
                  <pattern id="nepaliPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="2" fill="#d4af37" opacity="0.3" />
                  </pattern>
                </defs>
                <rect width="200" height="300" fill="url(#nepaliPattern)" />

                {/* Crown Illustration */}
                <path d="M50,150 L150,150 L160,100 L130,120 L100,80 L70,120 L40,100 Z" fill="#d4af37" stroke="#b8941f" strokeWidth="2" />
                <circle cx="100" cy="80" r="5" fill="#d4af37" />

                {/* Decorative Elements */}
                <path d="M50,250 Q100,230 150,250" stroke="#d4af37" strokeWidth="3" fill="none" />
                <circle cx="70" cy="240" r="3" fill="#d4af37" />
                <circle cx="130" cy="240" r="3" fill="#d4af37" />
              </svg>
            </div>

            <div className="festival-text">
              <h3>Royal Special</h3>
              <p>Premium Experience</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="royal-offer-content">
            <div className="offer-header">
              <h2>🎉 Royal Special Offer!</h2>
              <div className="festival-badge">Premium Deals</div>
            </div>

            <div className="offer-details">
              <p className="offer-description">
                Upgrade your living space with our exclusive discounts on premium furniture!
              </p>

              <div className="discount-highlight">
                <span className="discount-text">Get</span>
                <span className="discount-percent">30% OFF</span>
                <span className="discount-text">on all collections</span>
              </div>

              <div className="coupon-section">
                <label>Use Promo Code:</label>
                <div className="coupon-code-container">
                  <span className="coupon-code">ROYAL30</span>
                  <button
                    className={`copy-btn ${copiedCode ? 'copied' : ''}`}
                    onClick={handleCopyCode}
                  >
                    {copiedCode ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="offer-features">
                <div className="feature-item">
                  <span className="feature-icon">🚚</span>
                  <span>Free Delivery</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💰</span>
                  <span>Best Price</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">⭐</span>
                  <span>Top Quality</span>
                </div>
              </div>

              <div className="offer-actions">
                <button className="shop-now-btn" onClick={handleShopNow}>
                  Shop Now
                </button>
                <div className="offer-timer">
                  <span>⏰ Limited time premium offer!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoyalSpecialOfferPopup;