import React, { useState} from 'react';
import { Heart } from 'lucide-react';
import useFavorites from '../../hooks/useFavorites';
import authService from '../../services/authService';
import './FavoriteButton.css';

const FavoriteButton = ({ 
  productId, 
  size = 'medium', 
  showText = false, 
  className = '',
  onToggle = null 
}) => {
  const { isFavorite, toggleFavorite, loading } = useFavorites();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!authService.isAuthenticatedWithContext()) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 3000);
      return;
    }

    setIsProcessing(true);
    try {
      const result = await toggleFavorite(productId);
      if (onToggle) {
        onToggle(result);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const isCurrentlyFavorite = isFavorite(productId);
  const isLoading = loading || isProcessing;

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'favorite-btn-small';
      case 'large': return 'favorite-btn-large';
      default: return 'favorite-btn-medium';
    }
  };

  return (
    <div className={`favorite-button-container ${className}`}>
      <button
        className={`favorite-button ${
          isCurrentlyFavorite ? 'favorite-button-active' : 'favorite-button-inactive'
        } ${getSizeClass()} ${isLoading ? 'favorite-button-loading' : ''}`}
        onClick={handleToggleFavorite}
        disabled={isLoading}
        title={isCurrentlyFavorite ? 'Remove from favorites' : 'Add to favorites'}
        aria-label={isCurrentlyFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart 
          className={`favorite-icon ${
            isCurrentlyFavorite ? 'favorite-icon-filled' : 'favorite-icon-outline'
          }`}
          fill={isCurrentlyFavorite ? 'currentColor' : 'none'}
        />
        {showText && (
          <span className="favorite-text">
            {isCurrentlyFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </span>
        )}
        {isLoading && (
          <div className="favorite-loading-spinner"></div>
        )}
      </button>
      
      {showLoginPrompt && (
        <div className="favorite-login-prompt">
          <span>Please login to add favorites</span>
        </div>
      )}
    </div>
  );
};

export default FavoriteButton;