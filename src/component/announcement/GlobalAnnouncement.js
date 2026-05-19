import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './GlobalAnnouncement.css';

const GlobalAnnouncement = ({
  isPopup = false,
  onClose,
  showCloseButton = true,
  autoShow = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (autoShow) {
      // Show announcement after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [autoShow]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, 300);
  };

  if (!isVisible) return null;

  const announcementContent = (
    <div className={`global-announcement-content ${isClosing ? 'closing' : ''}`}>
      {showCloseButton && (
        <button
          className="global-announcement-close"
          onClick={handleClose}
          aria-label="Close announcement"
        >
          ×
        </button>
      )}

      <div className="global-announcement-header">
        <div className="global-announcement-badge">
          🎉 Big News
        </div>
        <h2 className="global-announcement-title">
          Sindureghari Furniture is Now an LLC!
        </h2>
      </div>

      <div className="global-announcement-body">
        <p className="global-announcement-text">
          We're excited to announce that Sindureghari Furniture has officially become a
          Limited Liability Company! This milestone represents our commitment to providing
          you with even better service, quality, and reliability.
        </p>

        <div className="global-announcement-highlights">
          <div className="highlight-item">
            <span className="highlight-icon">🏛️</span>
            <span>Official LLC Registration</span>
          </div>
          <div className="highlight-item">
            <span className="highlight-icon">🌍</span>
            <span>Expanding Our Reach</span>
          </div>
          <div className="highlight-item">
            <span className="highlight-icon">✨</span>
            <span>Enhanced Customer Service</span>
          </div>
        </div>

        <div className="global-announcement-cta">
          <button className="global-announcement-btn">
            Explore Our Collection
          </button>
        </div>
      </div>
    </div>
  );

  if (isPopup) {
    return createPortal(
      <div className="global-announcement-overlay">
        <div className="global-announcement-popup">
          {announcementContent}
        </div>
      </div>,
      document.body
    );
  }

  return (
    <div className="global-announcement-banner">
      {announcementContent}
    </div>
  );
};

export default GlobalAnnouncement;