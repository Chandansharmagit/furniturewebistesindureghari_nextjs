import { useState, useEffect, useCallback } from 'react';
import favoritesService from '../services/favoritesService';
import authService from '../services/authService';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user's favorites
  const loadFavorites = useCallback(async () => {
    if (!authService.isAuthenticatedWithContext()) {
      setFavorites([]);
      setFavoritesCount(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await favoritesService.getFavorites();
      if (result.success) {
        setFavorites(result.data.favorites || []);
        setFavoritesCount(result.data.count || 0);
      } else {
        setError(result.error);
        setFavorites([]);
        setFavoritesCount(0);
      }
    } catch (err) {
      setError('Failed to load favorites');
      setFavorites([]);
      setFavoritesCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add product to favorites
  const addToFavorites = useCallback(async (productId) => {
    if (!authService.isAuthenticatedWithContext()) {
      setError('Please login to add favorites');
      return { success: false, error: 'Please login to add favorites' };
    }

    // Optimistic update - update UI immediately
    const newFavorite = { id: productId, product_id: productId };
    setFavorites(prev => [...prev, newFavorite]);
    setFavoritesCount(prev => prev + 1);

    try {
      const result = await favoritesService.addToFavorites(productId);
      if (result.success) {
        // Sync with server data if needed
        return { success: true, message: 'Added to favorites' };
      } else {
        // Revert optimistic update on failure
        setFavorites(prev => prev.filter(fav => fav.id !== productId));
        setFavoritesCount(prev => prev - 1);
        setError(result.error);
        return result;
      }
    } catch (err) {
      // Revert optimistic update on error
      setFavorites(prev => prev.filter(fav => fav.id !== productId));
      setFavoritesCount(prev => prev - 1);
      const errorMsg = 'Failed to add to favorites';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, []);

  // Remove product from favorites
  const removeFromFavorites = useCallback(async (productId) => {
    if (!authService.isAuthenticatedWithContext()) {
      setError('Please login to manage favorites');
      return { success: false, error: 'Please login to manage favorites' };
    }

    // Store the removed item for potential rollback
    const removedFavorite = favorites.find(fav => fav.id === productId);
    
    // Optimistic update - update UI immediately
    setFavorites(prev => prev.filter(fav => fav.id !== productId));
    setFavoritesCount(prev => prev - 1);

    try {
      const result = await favoritesService.removeFromFavorites(productId);
      if (result.success) {
        return { success: true, message: 'Removed from favorites' };
      } else {
        // Revert optimistic update on failure
        if (removedFavorite) {
          setFavorites(prev => [...prev, removedFavorite]);
          setFavoritesCount(prev => prev + 1);
        }
        setError(result.error);
        return result;
      }
    } catch (err) {
      // Revert optimistic update on error
      if (removedFavorite) {
        setFavorites(prev => [...prev, removedFavorite]);
        setFavoritesCount(prev => prev + 1);
      }
      const errorMsg = 'Failed to remove from favorites';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, [favorites]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async (productId) => {
    if (!authService.isAuthenticatedWithContext()) {
      setError('Please login to manage favorites');
      return { success: false, error: 'Please login to manage favorites' };
    }

    const isCurrentlyFavorite = favorites.some(fav => fav.id === productId);
    
    if (isCurrentlyFavorite) {
      return await removeFromFavorites(productId);
    } else {
      return await addToFavorites(productId);
    }
  }, [favorites, addToFavorites, removeFromFavorites]);

  // Check if product is in favorites
  const isFavorite = useCallback((productId) => {
    return favorites.some(fav => fav.id === productId);
  }, [favorites]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load favorites on mount and when auth status changes
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    favoritesCount,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    loadFavorites,
    clearError
  };
};

export default useFavorites;