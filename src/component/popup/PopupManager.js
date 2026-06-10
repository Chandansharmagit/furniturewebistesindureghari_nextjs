import React, { useState, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import CustomerFurnitureRequest from './CustomerFurnitureRequest';
import FeedbackPopup from './FeedbackPopup';
import LoginPromptPopup from './LoginPromptPopup';
import RoyalSpecialOfferPopup from './RoyalSpecialOfferPopup';
import NewsletterPopup from './NewsletterPopup';
import authService from '../../services/authService';
import './PopupManager.css';

// Create a context for popup management
const PopupContext = React.createContext();

// Custom hook to use popup context
export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};

// PopupProvider component
export const PopupProvider = ({ children }) => {
  const [activePopup, setActivePopup] = useState(null);
  const [popupData, setPopupData] = useState({});
  const [loginPromptShown, setLoginPromptShown] = useState(false);
  const [specialOfferShown, setSpecialOfferShown] = useState(false);
  const [newsletterShown, setNewsletterShown] = useState(false);

  const openPopup = (popupType, data = {}) => {
    setActivePopup(popupType);
    setPopupData(data);
  };

  const closePopup = () => {
    setActivePopup(null);
    setPopupData({});
  };

  // Auto-show lower-priority popups after the Google review prompt has had time to be seen.
  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = authService.isAuthenticatedWithContext();

    // 1. Show login prompt after 5 seconds for unauthenticated users
    if (!isAuthenticated && !loginPromptShown) {
      const loginTimer = setTimeout(() => {
        if (!authService.isAuthenticatedWithContext() && !activePopup) {
          setActivePopup('loginPrompt');
          setLoginPromptShown(true);
        }
      }, 45000);

      return () => clearTimeout(loginTimer);
    }

    // 2. Show newsletter (email requesting) popup after 15 seconds
    if (!newsletterShown) {
      const newsletterTimer = setTimeout(() => {
        if (!activePopup) {
          setActivePopup('newsletter');
          setNewsletterShown(true);
        }
      }, 90000);

      return () => clearTimeout(newsletterTimer);
    }
  }, [activePopup, loginPromptShown, newsletterShown]);

  const value = {
    activePopup,
    popupData,
    openPopup,
    closePopup
  };

  return (
    <PopupContext.Provider value={value}>
      {children}
      <PopupRenderer />
    </PopupContext.Provider>
  );
};

// PopupRenderer component to render active popups
const PopupRenderer = () => {
  const { activePopup, popupData, closePopup } = usePopup();

  if (!activePopup) return null;

  const renderPopup = () => {
    switch (activePopup) {
      case 'customerRequest':
        return (
          <CustomerFurnitureRequest
            isOpen={true}
            onClose={closePopup}
            {...popupData}
          />
        );
      case 'feedback':
        return (
          <FeedbackPopup
            isOpen={true}
            onClose={closePopup}
            {...popupData}
          />
        );
      case 'loginPrompt':
        return (
          <LoginPromptPopup
            isOpen={true}
            onClose={closePopup}
            {...popupData}
          />
        );
      case 'specialOffer':
        return (
          <RoyalSpecialOfferPopup
            isOpen={true}
            onClose={closePopup}
            {...popupData}
          />
        );
      case 'newsletter':
        return (
          <NewsletterPopup
            isOpen={true}
            onClose={closePopup}
            {...popupData}
          />
        );
      default:
        return null;
    }
  };

  return createPortal(
    <div className="popup-overlay">
      {renderPopup()}
    </div>,
    document.body
  );
};

// Main PopupManager component
const PopupManager = () => {
  return (
    <PopupProvider>
      {/* This component serves as a wrapper for popup functionality */}
    </PopupProvider>
  );
};

export default PopupManager;
