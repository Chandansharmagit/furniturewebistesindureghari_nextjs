import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronRight, FiArrowRight, FiGrid } from 'react-icons/fi';
import { MdOutlineShoppingBag } from 'react-icons/md';
import { buildApiUrl, PRODUCT_ENDPOINTS } from '../../config/api';
import { mapCategoriesToNavigation, slugifyCategory } from '../../utils/categoryHelpers';
import './navbar.css';

const utilityLinks = [
  { name: 'Our Showrooms', path: '/stores', isHighlighted: true },
  { name: 'The Journal', path: '/blog', isHighlighted: true },
  { name: 'Offers', path: '/category/offers', isHighlighted: true }
];

const Navbar = ({ isMobileMenuOpen = false, setIsMobileMenuOpen }) => {
  const [expandedMobile, setExpandedMobile] = useState(null);
  const [adminCategories, setAdminCategories] = useState([]);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const fetchAdminCategories = async () => {
      try {
        const response = await fetch(buildApiUrl(PRODUCT_ENDPOINTS.CATEGORIES));
        if (!response.ok) return;
        const data = await response.json();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setAdminCategories(data);
        }
      } catch (error) {
        console.warn('Navbar category fetch failed, using fallback menu:', error);
      }
    };

    fetchAdminCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const dynamicCategories = mapCategoriesToNavigation(adminCategories);
  const categoryData = [...dynamicCategories, ...utilityLinks];

  const getCategorySlug = (categoryName) => {
    return slugifyCategory(categoryName);
  };

  const menuVariants = {
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  const backdropVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  };

  const toggleMobileExpand = (name) => {
    setExpandedMobile(expandedMobile === name ? null : name);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="premium-navbar desktop-only" aria-label="Main product navigation">
        <div className="navbar-inner">
          <div className="nav-items-container">
            {categoryData.map((item) => {
              const slug = getCategorySlug(item.name);
              const itemPath = item.path || `/category/${slug}`;
              const isActive = item.path
                ? location.pathname === item.path
                : location.pathname === `/category/${slug}` || location.pathname.startsWith(`/category/${slug}/`);

              const hasDropdown = item.subLinks && item.subLinks.length > 0;

              return (
                <div key={item.name} className={`nav-item-wrapper ${hasDropdown ? 'has-dropdown' : ''}`}>
                  <Link
                    to={itemPath}
                    className={`nav-link-premium ${isActive ? 'active' : ''} ${item.isHighlighted ? 'highlighted-link' : ''}`}
                  >
                    <span className="link-text">{item.name}</span>
                    {hasDropdown && <FiChevronDown className="nav-chevron" size={12} />}
                  </Link>

                  {/* ── Premium Mega Menu ── */}
                  {hasDropdown && (
                    <div className="mega-menu-dropdown">
                      {/* Caret triangle */}
                      <div className="mega-caret" />

                      {/* Header strip */}
                      <div className="mega-header">
                        <div className="mega-header-left">
                          {item.Icon && <item.Icon className="mega-header-icon" size={28} />}
                          <div>
                            <p className="mega-header-cat">Category</p>
                            <h3 className="mega-header-title">{item.name}</h3>
                            <p className="mega-header-desc">{item.desc}</p>
                          </div>
                        </div>
                        <Link to={itemPath} className="mega-view-all">
                          View All <FiArrowRight size={13} />
                        </Link>
                      </div>

                      {/* Body */}
                      <div className="mega-body">
                        {/* Sub-links */}
                        <div className="mega-links-col">
                          {item.subLinks.map((sub, idx) => (
                            <Link key={idx} to={sub.path} className="mega-sub-link">
                              <div className="mega-sub-dot" style={{ background: item.color || '#8B4513' }} />
                              <div className="mega-sub-text">
                                <span className="mega-sub-name">{sub.name}</span>
                                <span className="mega-sub-desc">{sub.desc}</span>
                              </div>
                              <FiChevronRight className="mega-sub-arrow" size={14} />
                            </Link>
                          ))}
                        </div>

                        {/* Promo panel */}
                        {item.promo && (
                          <div className="mega-promo-panel">
                            <span className="mega-promo-badge">{item.promo.badge}</span>
                            <h4 className="mega-promo-title">{item.promo.title}</h4>
                            <p className="mega-promo-desc">{item.promo.desc}</p>
                            <Link to={item.promo.ctaPath} className="mega-promo-cta">
                              {item.promo.cta} <FiArrowRight size={13} />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              className="nav-mobile-backdrop"
              initial="closed"
              animate="open"
              exit="closed"
              variants={backdropVariants}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              className="nav-mobile-drawer"
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
            >
              <div className="drawer-header">
                <span className="drawer-title">Browse Categories</span>
              </div>
              
              <div className="drawer-content">
                <div className="mobile-nav-list">
                  {categoryData.map((item) => {
                    const slug = getCategorySlug(item.name);
                    const itemPath = item.path || `/category/${slug}`;
                    const isActive = item.path 
                      ? location.pathname === item.path 
                      : location.pathname === `/category/${slug}` || location.pathname.startsWith(`/category/${slug}/`);
                    const hasDropdown = item.subLinks && item.subLinks.length > 0;
                    const isExpanded = expandedMobile === item.name;
                    
                    return (
                      <React.Fragment key={item.name}>
                        <div className="mobile-nav-row">
                          <Link 
                            to={itemPath}
                            className={`mobile-nav-link ${isActive ? 'active' : ''} ${item.isHighlighted ? 'highlighted-link' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                          {hasDropdown && (
                            <button 
                              className={`mobile-expand-btn ${isExpanded ? 'expanded' : ''}`}
                              onClick={() => toggleMobileExpand(item.name)}
                              aria-label={`Expand ${item.name}`}
                            >
                              ▾
                            </button>
                          )}
                        </div>
                        
                        {hasDropdown && isExpanded && (
                          <div className="mobile-sublinks-wrapper">
                            {item.subLinks.map((sub, idx) => (
                              <Link
                                key={idx}
                                to={sub.path}
                                className="mobile-sub-link"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <span className="mobile-sub-name">{sub.name}</span>
                                {sub.desc && <span className="mobile-sub-desc">{sub.desc}</span>}
                              </Link>
                            ))}
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                  
                  <div className="drawer-divider" />
                  
                  <Link to="/stores" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Our Stores</Link>
                  <Link to="/orders" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Track Order</Link>
                  <Link to="/profile" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>My Account</Link>
                  <Link to="/contact" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
                  <Link to="/help-and-support" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Help & Support</Link>
                </div>
              </div>
              
              <div className="drawer-footer">
                <p>Sindureghari Furniture</p>
                <small>Traditional... bonded with love</small>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
