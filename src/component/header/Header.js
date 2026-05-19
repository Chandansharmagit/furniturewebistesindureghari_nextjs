import React, { useState, useEffect } from 'react';
import { User, Heart, ShoppingCart, Menu, X, Store, Search } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SearchFunctionality from '../navbar/search/SearchFunctionality';
import { useCart } from '../../context/CartContext';
import useFavorites from '../../hooks/useFavorites';
// import useOrders from '../../hooks/useOrders';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/api';
import './Header.css';

const Header = ({ isMobileMenuOpen = false, setIsMobileMenuOpen }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { getCartItemsCount } = useCart();
  const { favoritesCount } = useFavorites();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
      document.body.classList.toggle('header-scrolled', isScrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getProfileImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
  };

  const getAllProducts = () => [];

  return (
    <motion.header
      className={`premium-header ${scrolled ? 'scrolled' : ''} ${isMobileSearchOpen ? 'mobile-search-active' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="header-top-bar">
        <p>Free Delivery on Orders Over NPR 50,000 | Quality Guaranteed</p>
      </div>

      <div className="header-main">
        <div className="header-container-fluid">
          {/* Left: Mobile Nav Toggle */}
          <div className="header-left-area">
            <button
              className="mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {/* Mobile Search Toggle */}
            <button 
              className="mobile-search-toggle"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              aria-label="Toggle Search"
            >
              <Search size={22} />
            </button>
          </div>

          {/* Center: Logo Section */}
          <Link to="/" className="brand-logo" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="logo-wrapper">
              <h1 className="logo-text">Sindureghari</h1>
              <div className="logo-badge">Furniture... bonded with love</div>
            </div>
          </Link>

          {/* Large Screen Search */}
          <div className="search-wrapper-center desktop-only">
            <SearchFunctionality apiBaseUrl={API_BASE_URL} getAllProducts={getAllProducts} />
          </div>

          {/* Right: Action Icons */}
          <div className="header-actions">
            {/* Store - Hidden on small mobile */}
            <Link to="/stores" className="action-item desktop-only">
              <div className="action-icon-wrapper">
                <Store size={18} strokeWidth={1.5} className="action-icon" />
              </div>
            </Link>

            {/* User Account */}
            <div
              className="action-item user-account"
              onMouseEnter={() => setShowUserDropdown(true)}
              onMouseLeave={() => setShowUserDropdown(false)}
            >
              <div className="action-icon-wrapper">
                {isAuthenticated && user?.profile_picture ? (
                  <img
                    src={getProfileImageUrl(user.profile_picture)}
                    alt="Profile"
                    className="avatar-img"
                  />
                ) : (
                  <User size={18} strokeWidth={1.5} className="action-icon" />
                )}
              </div>

              <AnimatePresence>
                {showUserDropdown && (
                  <motion.div
                    className="premium-dropdown"
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  >
                    <div className="dropdown-header">
                      {isAuthenticated ? `Hello, ${user?.name || user?.first_name || 'User'}` : 'Welcome'}
                    </div>
                    <div className="dropdown-links">
                      {!isAuthenticated ? (
                        <>
                          <Link to="/login" className="drop-link">Login</Link>
                          <Link to="/register" className="drop-link">Register</Link>
                        </>
                      ) : (
                        <>
                          <Link to="/profile" className="drop-link">My Profile</Link>
                          <Link to="/orders" className="drop-link">Orders</Link>
                          <Link to="/favorites" className="drop-link">Wishlist</Link>
                          <button onClick={() => { logout(); navigate('/'); }} className="drop-link logout">Logout</button>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist */}
            <Link to="/favorites" className="action-item">
              <div className="action-icon-wrapper">
                <Heart size={18} strokeWidth={1.5} className="action-icon" />
                {favoritesCount > 0 && <span className="badge-count">{favoritesCount}</span>}
              </div>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="action-item">
              <div className="action-icon-wrapper">
                <ShoppingCart size={18} strokeWidth={1.5} className="action-icon" />
                {getCartItemsCount() > 0 && <span className="badge-count">{getCartItemsCount()}</span>}
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div 
            className="mobile-search-overlay"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mobile-search-container">
              <SearchFunctionality 
                apiBaseUrl={API_BASE_URL} 
                getAllProducts={getAllProducts} 
                isMobile={true} 
                onClose={() => setIsMobileSearchOpen(false)} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;