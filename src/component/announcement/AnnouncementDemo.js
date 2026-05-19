import React, { useState } from 'react';
import GlobalAnnouncement from './GlobalAnnouncement';
import './AnnouncementDemo.css';

const AnnouncementDemo = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const toggleBanner = () => {
    setShowBanner(!showBanner);
  };

  return (
    <div className="announcement-demo">
      {/* Demo Controls */}
      <div className="demo-controls">
        <h1 className="demo-title">Sindureghari Furniture - Global Announcement Demo</h1>
        <p className="demo-description">
          Professional announcement template showcasing the LLC registration milestone.
          Test both banner and popup versions with responsive design.
        </p>
        
        <div className="demo-buttons">
          <button 
            className="demo-btn demo-btn-primary" 
            onClick={handleOpenPopup}
          >
            Show Popup Version
          </button>
          
          <button 
            className="demo-btn demo-btn-secondary" 
            onClick={toggleBanner}
          >
            {showBanner ? 'Hide' : 'Show'} Banner Version
          </button>
        </div>

        <div className="demo-info">
          <h3>Features Included:</h3>
          <ul>
            <li>✨ Premium design with warm earthy tones</li>
            <li>🎨 Elegant typography (Playfair Display + Inter)</li>
            <li>📱 Fully responsive (mobile, tablet, desktop)</li>
            <li>🎉 Celebratory visual elements and animations</li>
            <li>🌍 Global expansion messaging</li>
            <li>🏛️ LLC registration highlight</li>
            <li>🚀 Call-to-action button</li>
            <li>♿ Accessibility features</li>
          </ul>
        </div>
      </div>

      {/* Banner Version */}
      {showBanner && (
        <div className="demo-section">
          <h2 className="demo-section-title">Banner Version</h2>
          <p className="demo-section-desc">Perfect for homepage or dedicated announcement page</p>
          <GlobalAnnouncement 
            isPopup={false} 
            showCloseButton={false}
          />
        </div>
      )}

      {/* Popup Version */}
      {showPopup && (
        <GlobalAnnouncement 
          isPopup={true} 
          onClose={handleClosePopup}
          showCloseButton={true}
        />
      )}

      {/* Usage Instructions */}
      <div className="demo-usage">
        <h2>Usage Instructions</h2>
        
        <div className="usage-section">
          <h3>1. As a Homepage Banner</h3>
          <pre className="code-block">
          </pre>
        </div>

        <div className="usage-section">
          <h3>2. As a Popup Modal</h3>
          <pre className="code-block">
          </pre>
        </div>

        <div className="usage-section">
          <h3>3. Email Template</h3>
          <p>The component can be easily adapted for email by:</p>
          <ul>
            <li>Removing interactive elements (hover effects, animations)</li>
            <li>Converting to inline CSS</li>
            <li>Using email-safe fonts as fallbacks</li>
            <li>Optimizing images for email clients</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      
    </div>
  );
};

export default AnnouncementDemo;