import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Grid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useFavorites from '../../hooks/useFavorites';
import authService from '../../services/authService';
import './FavoritesPage.css';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { favorites, loading, removeFromFavorites } = useFavorites();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortedFavorites, setSortedFavorites] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!authService.isAuthenticatedWithContext()) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    let filtered = [...favorites];
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category_name?.toLowerCase() === filterCategory.toLowerCase());
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'price': return (a.price || 0) - (b.price || 0);
        case 'newest': default: return new Date(b.created_at) - new Date(a.created_at);
      }
    });
    setSortedFavorites(filtered);
  }, [favorites, sortBy, filterCategory]);

  const categories = [...new Set(favorites.map(item => item.category_name).filter(Boolean))];

  if (loading) {
    return (
      <div className="fav-loading-screen">
        <div className="fav-spinner"></div>
        <p className="serif-italic">Curating your collection...</p>
      </div>
    );
  }

  return (
    <div className={`fav-page ${scrolled ? 'scrolled' : ''}`}>
      <header className="fav-editorial-header">
        <div className="fav-container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fav-header-badge"
          >
            Personal Curation
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="fav-main-title serif"
          >
            Your <span className="serif-italic">Wishlist</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="fav-main-subtitle"
          >
            A sanctuary for pieces that spoke to you. Revisit your favorites and bring your unique vision to life.
          </motion.p>
        </div>
      </header>

      <div className="fav-controls-section">
        <div className="fav-container">
          <div className="fav-controls-flex">
            <div className="fav-filter-pills">
              <button 
                className={`fav-pill ${filterCategory === 'all' ? 'active' : ''}`}
                onClick={() => setFilterCategory('all')}
              >
                All Pieces
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  className={`fav-pill ${filterCategory === cat ? 'active' : ''}`}
                  onClick={() => setFilterCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="fav-meta-controls">
              <select className="fav-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="newest">Recently Saved</option>
                <option value="name">Alphabetical</option>
                <option value="price">Price: Low to High</option>
              </select>
              <div className="fav-view-toggle">
                <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}><Grid size={16} /></button>
                <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}><List size={16} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="fav-container">
        {favorites.length === 0 ? (
          <div className="fav-empty-state">
            <Heart size={48} className="fav-empty-icon" />
            <h2 className="serif">An Empty Canvas</h2>
            <p>Your wishlist is waiting for its first masterpiece.</p>
            <Link to="/" className="fav-cta-btn">Begin Browsing</Link>
          </div>
        ) : (
          <div className={`fav-masonry-grid ${viewMode}`}>
            <AnimatePresence mode="popLayout">
              {sortedFavorites.map((item, idx) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.16, 1, 0.3, 1],
                    delay: idx * 0.05 
                  }}
                  key={item.id} 
                  className={`fav-item-wrapper ${idx % 5 === 0 ? 'large' : ''}`}
                >
                  <div className="fav-card">
                    <div className="fav-card-image">
                      <Link to={`/product/${item.id}`}>
                        <img src={item.image_url || '/api/placeholder/800/800'} alt={item.name} />
                        <div className="fav-category-tag">{item.category_name}</div>
                      </Link>
                      <button 
                        className="fav-remove-btn" 
                        onClick={() => removeFromFavorites(item.id)}
                        title="Remove from favorites"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="fav-card-details">
                      <div className="fav-card-info">
                        <Link to={`/product/${item.id}`} className="fav-name serif">{item.name}</Link>
                        <div className="fav-price">₹{item.price?.toLocaleString()}</div>
                      </div>
                      <button className="fav-add-cart">
                        <ShoppingCart size={18} />
                        <span>Add to Collection</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <footer className="fav-container fav-footer-info">
        <p>Showing {sortedFavorites.length} curious pieces</p>
      </footer>
    </div>
  );
};

export default FavoritesPage;