import React from 'react';
import './RoyalOfferTemplates.css';

const RoyalOfferTemplates = () => {
  const handleShopNow = (category) => {
    // Navigate to specific category or products section
    const productsSection = document.getElementById('products') || document.querySelector('.products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="royal-offers-container">
      <div className="offers-header">
        <h2>🎉 Exclusive Royal Special Offers</h2>
        <p>Transform your home with our premium furniture deals!</p>
      </div>

      <div className="offers-grid">
        {/* Template 1: Premium Furniture Collection */}
        <div className="offer-template template-1">
          <div className="offer-image">
            <svg viewBox="0 0 400 300" className="furniture-illustration">
              <defs>
                <linearGradient id="sofaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B4513" />
                  <stop offset="100%" stopColor="#A0522D" />
                </linearGradient>
                <pattern id="fabricPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="5" cy="5" r="1" fill="#654321" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="400" height="300" fill="#f8f9fa" />
              <rect x="50" y="180" width="300" height="80" rx="10" fill="url(#sofaGradient)" />
              <rect x="60" y="120" width="280" height="70" rx="15" fill="url(#sofaGradient)" />
              <rect x="80" y="140" width="60" height="40" rx="8" fill="url(#fabricPattern)" />
              <rect x="170" y="140" width="60" height="40" rx="8" fill="url(#fabricPattern)" />
              <rect x="260" y="140" width="60" height="40" rx="8" fill="url(#fabricPattern)" />
              <rect x="70" y="250" width="15" height="30" fill="#654321" />
              <rect x="315" y="250" width="15" height="30" fill="#654321" />
              <circle cx="350" cy="50" r="20" fill="#d4af37" opacity="0.7" />
              <text x="350" y="55" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">25%</text>
            </svg>
          </div>

          <div className="offer-content">
            <h3>Premium Royal Collection</h3>
            <p>Luxury sofas, dining sets, and bedroom furniture</p>

            <div className="offer-details">
              <div className="discount-badge">25% OFF</div>
              <div className="coupon-info">
                <span>Code: </span>
                <span className="coupon-code" onClick={() => handleCopyCode('ROYAL25')}>ROYAL25</span>
              </div>
            </div>

            <button className="shop-btn" onClick={() => handleShopNow('premium')}>
              Shop Royal Collection
            </button>
          </div>
        </div>

        {/* Template 2: Home Decor & Accessories */}
        <div className="offer-template template-2">
          <div className="offer-image">
            <svg viewBox="0 0 400 300" className="decor-illustration">
              <defs>
                <linearGradient id="vaseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#dc143c" />
                  <stop offset="100%" stopColor="#b91c3c" />
                </linearGradient>
              </defs>
              <rect width="400" height="300" fill="#f8f9fa" />
              <ellipse cx="200" cy="220" rx="40" ry="60" fill="url(#vaseGradient)" />
              <ellipse cx="200" cy="160" rx="25" ry="15" fill="url(#vaseGradient)" />
              <circle cx="180" cy="120" r="12" fill="#ffa500" />
              <circle cx="200" cy="110" r="15" fill="#ff6b6b" />
              <circle cx="220" cy="125" r="10" fill="#ffa500" />
              <line x1="180" y1="132" x2="190" y2="160" stroke="#228b22" strokeWidth="3" />
              <line x1="200" y1="125" x2="200" y2="160" stroke="#228b22" strokeWidth="3" />
              <line x1="220" y1="135" x2="210" y2="160" stroke="#228b22" strokeWidth="3" />
              <rect x="100" y="80" width="80" height="60" fill="#d4af37" stroke="#b8941f" strokeWidth="3" />
              <rect x="105" y="85" width="70" height="50" fill="#f0f0f0" />
              <rect x="300" y="180" width="60" height="80" fill="#333" rx="5" />
              <ellipse cx="330" cy="170" rx="35" ry="20" fill="#fff" stroke="#333" strokeWidth="2" />
              <circle cx="350" cy="50" r="25" fill="#d4af37" />
              <text x="350" y="50" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">30%</text>
              <text x="350" y="62" textAnchor="middle" fill="white" fontSize="8">OFF</text>
            </svg>
          </div>

          <div className="offer-content">
            <h3>Home Decor & Accessories</h3>
            <p>Beautiful vases, lamps, frames, and decorative items</p>

            <div className="offer-details">
              <div className="discount-badge">30% OFF</div>
              <div className="coupon-info">
                <span>Code: </span>
                <span className="coupon-code" onClick={() => handleCopyCode('DECOR30')}>DECOR30</span>
              </div>
            </div>

            <button className="shop-btn" onClick={() => handleShopNow('decor')}>
              Shop Home Decor
            </button>
          </div>
        </div>

        {/* Template 3: Kitchen & Dining */}
        <div className="offer-template template-3">
          <div className="offer-image">
            <svg viewBox="0 0 400 300" className="kitchen-illustration">
              <defs>
                <linearGradient id="tableGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B4513" />
                  <stop offset="100%" stopColor="#A0522D" />
                </linearGradient>
              </defs>
              <rect width="400" height="300" fill="#f8f9fa" />
              <ellipse cx="200" cy="200" rx="120" ry="60" fill="url(#tableGradient)" />
              <rect x="120" y="220" width="10" height="50" fill="#654321" />
              <rect x="270" y="220" width="10" height="50" fill="#654321" />
              <rect x="80" y="160" width="30" height="40" rx="5" fill="#8B4513" />
              <rect x="85" y="140" width="20" height="25" rx="3" fill="#8B4513" />
              <rect x="290" y="160" width="30" height="40" rx="5" fill="#8B4513" />
              <rect x="295" y="140" width="20" height="25" rx="3" fill="#8B4513" />
              <circle cx="170" cy="180" r="15" fill="#fff" stroke="#ddd" strokeWidth="2" />
              <circle cx="230" cy="180" r="15" fill="#fff" stroke="#ddd" strokeWidth="2" />
              <line x1="150" y1="175" x2="150" y2="190" stroke="#silver" strokeWidth="2" />
              <line x1="155" y1="175" x2="155" y2="190" stroke="#silver" strokeWidth="2" />
              <rect x="190" y="170" width="20" height="15" fill="#dc143c" rx="2" />
              <circle cx="350" cy="50" r="25" fill="#dc143c" />
              <text x="350" y="50" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">35%</text>
              <text x="350" y="62" textAnchor="middle" fill="white" fontSize="8">OFF</text>
            </svg>
          </div>

          <div className="offer-content">
            <h3>Royal Dining Collection</h3>
            <p>Dining tables, chairs, kitchen cabinets, and storage</p>

            <div className="offer-details">
              <div className="discount-badge">35% OFF</div>
              <div className="coupon-info">
                <span>Code: </span>
                <span className="coupon-code" onClick={() => handleCopyCode('DINING35')}>DINING35</span>
              </div>
            </div>

            <button className="shop-btn" onClick={() => handleShopNow('kitchen')}>
              Shop Dining Collection
            </button>
          </div>
        </div>
      </div>

      <div className="offers-footer">
        <p>🎊 Limited time premium offers valid for this season! 🎊</p>
        <div className="festival-note">
          <span>✨ Free delivery on orders above Rs. 50,000 ✨</span>
        </div>
      </div>
    </div>
  );
};

export default RoyalOfferTemplates;
