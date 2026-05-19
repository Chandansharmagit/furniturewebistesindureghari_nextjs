import React, { useState, useEffect } from 'react';
import RecommendationService from '../../services/recommendationService';
import useActivityTracking from '../../hooks/useActivityTracking';
import './ProductRecommendations.css';
import ProductCard from '../common/ProductCard/ProductCard';

const ProductRecommendations = ({ 
  type = 'personalized', // 'personalized', 'similar', 'trending'
  productId = null, // Required for 'similar' type
  limit = 6,
  title = null,
  className = '',
  showPrice = true,
  showAddToCart = true
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { trackProductView, trackProductClick, trackAddToCart } = useActivityTracking();

  // Default titles based on type
  const getDefaultTitle = () => {
    switch (type) {
      case 'similar':
        return 'Similar Products';
      case 'trending':
        return 'Trending Now';
      case 'personalized':
      default:
        return 'Recommended for You';
    }
  };

  const displayTitle = title || getDefaultTitle();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        switch (type) {
          case 'similar':
            if (!productId) {
              throw new Error('Product ID is required for similar products');
            }
            response = await RecommendationService.getSimilarProducts(productId, limit);
            setRecommendations(response.similar_products || []);
            break;
            
          case 'trending':
            response = await RecommendationService.getTrendingProducts(limit);
            setRecommendations(response.trending_products || []);
            break;
            
          case 'personalized':
          default:
            response = await RecommendationService.getPersonalizedRecommendations(null, limit);
            setRecommendations(response.recommendations || []);
            break;
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to load recommendations');
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [type, productId, limit]);

  // Handle product view tracking when product comes into view
  const handleProductView = (product) => {
    trackProductView(product.id, product.categoryId);
  };

  // Handle product click
  const handleProductClick = (product, clickType = 'card') => {
    trackProductClick(product.id, product.categoryId, clickType);
  };

  // Handle add to cart
  // eslint-disable-next-line no-unused-vars
  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    trackAddToCart(product.id, 1, product.new_price);
    // You can add actual cart logic here
    console.log('Added to cart:', product.name);
  };

  // Format price
  // eslint-disable-next-line no-unused-vars
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <div className={`recommendations-container ${className}`}>
        <h3 className="recommendations-title">{displayTitle}</h3>
        <div className="recommendations-loading">
          <div className="loading-grid">
            {[...Array(limit)].map((_, index) => (
              <div key={index} className="loading-card">
                <div className="loading-image"></div>
                <div className="loading-text"></div>
                <div className="loading-text short"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || recommendations.length === 0) {
    return null; // Don't show anything if there's an error or no recommendations
  }

  return (
    <div className={`recommendations-container ${className}`}>
      <h3 className="recommendations-title">{displayTitle}</h3>
      <div className="recommendations-grid">
        {recommendations.map((product) => (
          <div 
            key={product.id || product._id} 
            className="recommendation-card-wrapper"
            onClick={() => handleProductClick(product, 'card')}
            onMouseEnter={() => handleProductView(product)}
            style={{ position: 'relative', width: '100%' }}
          >
             <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;