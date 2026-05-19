import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import axios from 'axios';
import './CookieConsentBanner.css';

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = async (consent) => {
    setLoading(true);
    try {
      // Send consent to backend
      await axios.post(`${API_BASE_URL}/api/activity/cookie-consent`, {
        consent: consent
      }, {
        withCredentials: true
      });

      // Store consent in localStorage
      localStorage.setItem('cookieConsent', consent.toString());
      localStorage.setItem('cookieConsentDate', new Date().toISOString());

      // Hide banner
      setShowBanner(false);
    } catch (error) {
      console.error('Error saving cookie consent:', error);
      // Still hide banner and save locally even if backend fails
      localStorage.setItem('cookieConsent', consent.toString());
      localStorage.setItem('cookieConsentDate', new Date().toISOString());
      setShowBanner(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    handleConsent(true);
  };

  const handleDecline = () => {
    handleConsent(false);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div className="cookie-backdrop" />

      {/* Banner */}
      <div className="cookie-banner">
        <div className="cookie-content">
          <div className="cookie-header">
            <div className="cookie-icon">
              🍪
            </div>
            <h3>We Value Your Privacy</h3>
          </div>

          <div className="cookie-text">
            <p>
              We use cookies and similar technologies to enhance your browsing experience,
              analyze site traffic, and provide personalized content and recommendations.
            </p>

            {showDetails && (
              <div className="cookie-details">
                <h4>What cookies do we use?</h4>
                <ul>
                  <li><strong>Essential Cookies:</strong> Required for basic site functionality, shopping cart, and user authentication.</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website to improve user experience.</li>
                  <li><strong>Personalization Cookies:</strong> Enable personalized product recommendations based on your browsing history.</li>
                  <li><strong>Session Cookies:</strong> Track your session for security and to maintain your preferences during your visit.</li>
                </ul>

                <h4>Your Rights</h4>
                <p>
                  You can accept or decline non-essential cookies. Essential cookies cannot be disabled as they are
                  necessary for the website to function properly. You can change your preferences at any time in your
                  browser settings or by contacting us.
                </p>

                <h4>Data We Collect</h4>
                <ul>
                  <li>Pages visited and time spent on site</li>
                  <li>Products viewed and interactions</li>
                  <li>Search queries (without storing personal search terms)</li>
                  <li>Device and browser information</li>
                  <li>IP address (for security and analytics)</li>
                </ul>
              </div>
            )}
          </div>

          <div className="cookie-actions">
            <button
              className="cookie-btn cookie-btn-details"
              onClick={toggleDetails}
              disabled={loading}
            >
              {showDetails ? 'Hide Details' : 'More Info'}
            </button>

            <div className="cookie-main-actions">
              <button
                className="cookie-btn cookie-btn-decline"
                onClick={handleDecline}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Decline'}
              </button>

              <button
                className="cookie-btn cookie-btn-accept"
                onClick={handleAccept}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Accept All'}
              </button>
            </div>
          </div>

          <div className="cookie-footer">
            <p>
              By continuing to use our site, you agree to our{' '}
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="/terms-of-service" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieConsentBanner;