import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './navbar.css';

const Navbar = ({ isMobileMenuOpen = false, setIsMobileMenuOpen }) => {
  const [expandedMobile, setExpandedMobile] = useState(null);
  const location = useLocation();

  const categoryData = [
    { 
      name: 'Living Room',
      desc: 'Handcrafted sofas, TV units & lounge furniture',
      subLinks: [
        { name: 'Wooden Sofa Sets', path: '/category/living-room?type=sofa-sets', desc: 'Royal teak & sisau sofas' },
        { name: 'Designer Coffee Tables', path: '/category/living-room?type=coffee-tables', desc: 'Elegant centerpiece tables' },
        { name: 'Luxury TV Cabinets', path: '/category/living-room?type=tv-cabinets', desc: 'Modern media consoles' },
        { name: 'Premium Recliners', path: '/category/living-room?type=recliners', desc: 'Ergonomic comfort chairs' },
        { name: 'Showcases & Bookshelves', path: '/category/living-room?type=showcases', desc: 'Display & storage units' }
      ],
      promo: {
        badge: 'BESTSELLER',
        title: 'Royal Sofa Collection',
        desc: 'Hand-carved premium Teak & Sisau timber sofa sets. Starting from NPR 45,000.',
        cta: 'Explore Sofas',
        ctaPath: '/category/living-room?type=sofa-sets'
      }
    },
    { 
      name: 'Bedroom',
      desc: 'Luxury beds, wardrobes & dressing tables',
      subLinks: [
        { name: 'Royal Wooden Beds', path: '/category/bedroom?type=beds', desc: 'King & queen solid wood beds' },
        { name: 'Luxury Wardrobes', path: '/category/bedroom?type=wardrobes', desc: 'Spacious storage cabinets' },
        { name: 'Bedside Tables', path: '/category/bedroom?type=bedside-tables', desc: 'Nightstand companions' },
        { name: 'Dressing Tables', path: '/category/bedroom?type=dressing-tables', desc: 'Mirror vanity sets' },
        { name: 'Mattresses & Cushions', path: '/category/bedroom?type=mattresses', desc: 'Premium comfort bedding' }
      ],
      promo: {
        badge: 'NEW ARRIVAL',
        title: 'King-Size Bed Collection',
        desc: 'Solid rosewood king beds with built-in storage. Free assembly & delivery.',
        cta: 'View Beds',
        ctaPath: '/category/bedroom?type=beds'
      }
    },
    { 
      name: 'Dining Room',
      desc: 'Dining sets, crockery units & bar cabinets',
      subLinks: [
        { name: 'Handcrafted Dining Sets', path: '/category/dining-room?type=dining-sets', desc: '4, 6 & 8 seater tables' },
        { name: 'Premium Dining Chairs', path: '/category/dining-room?type=dining-chairs', desc: 'Solid wood seating' },
        { name: 'Wooden Crockery Units', path: '/category/dining-room?type=crockery-units', desc: 'Kitchen display storage' },
        { name: 'Luxury Bar Cabinets', path: '/category/dining-room?type=bar-cabinets', desc: 'Entertainment furniture' }
      ],
      promo: {
        badge: 'TRENDING',
        title: '6-Seater Dining Sets',
        desc: 'Marble-top and solid wood dining tables with matching chairs for the whole family.',
        cta: 'Browse Dining',
        ctaPath: '/category/dining-room?type=dining-sets'
      }
    },
    { 
      name: 'Office and Study',
      desc: 'Desks, ergonomic chairs & office storage',
      subLinks: [
        { name: 'Executive Wooden Desks', path: '/category/office-and-study?type=desks', desc: 'L-shape & standing desks' },
        { name: 'Ergonomic Chairs', path: '/category/office-and-study?type=chairs', desc: 'Comfort-first seating' },
        { name: 'Sturdy Bookshelves', path: '/category/office-and-study?type=bookshelves', desc: 'Open & closed shelving' },
        { name: 'Filing & Storage', path: '/category/office-and-study?type=storage', desc: 'Organized workspace units' }
      ],
      promo: {
        badge: 'WORK FROM HOME',
        title: 'Complete Office Setup',
        desc: 'Desk + chair combos crafted for productivity. Ergonomic designs from NPR 15,000.',
        cta: 'Shop Office',
        ctaPath: '/category/office-and-study'
      }
    },
    { 
      name: 'Modular Kitchens',
      desc: 'Custom kitchens, pantry & countertops',
      subLinks: [
        { name: 'Elite Kitchen Cabinets', path: '/category/modular-kitchens?type=cabinets', desc: 'Wall & base cabinets' },
        { name: 'Designer Pantry Units', path: '/category/modular-kitchens?type=pantry', desc: 'Tall storage solutions' },
        { name: 'Kitchen Counters', path: '/category/modular-kitchens?type=counters', desc: 'Granite & marble tops' },
        { name: 'Kitchen Accessories', path: '/category/modular-kitchens?type=accessories', desc: 'Baskets, racks & more' }
      ],
      promo: {
        badge: 'CUSTOM DESIGN',
        title: 'Free Kitchen Consultation',
        desc: 'Get a personalized 3D kitchen design by our interior experts at zero cost.',
        cta: 'Book Now',
        ctaPath: '/contact'
      }
    },
    { 
      name: 'Bathroom',
      desc: 'Vanities, mirrors & bathroom storage',
      subLinks: [
        { name: 'Bathroom Vanities', path: '/category/bathroom?type=vanities', desc: 'Sink cabinet combos' },
        { name: 'Wall Mirrors', path: '/category/bathroom?type=mirrors', desc: 'LED & decorative mirrors' },
        { name: 'Storage Cabinets', path: '/category/bathroom?type=cabinets', desc: 'Moisture-proof shelving' },
        { name: 'Bath Accessories', path: '/category/bathroom?type=accessories', desc: 'Towel racks & holders' }
      ],
      promo: {
        badge: 'WATERPROOF',
        title: 'Premium Vanity Sets',
        desc: 'Marine-grade plywood bathroom furniture with soft-close hardware.',
        cta: 'View Bathroom',
        ctaPath: '/category/bathroom'
      }
    },
    { 
      name: 'Lightings',
      desc: 'Chandeliers, lamps & ambient lighting',
      subLinks: [
        { name: 'Chandeliers', path: '/category/lightings?type=chandeliers', desc: 'Grand ceiling fixtures' },
        { name: 'Table & Floor Lamps', path: '/category/lightings?type=lamps', desc: 'Decorative accent lights' },
        { name: 'Wall Sconces', path: '/category/lightings?type=wall-sconces', desc: 'Elegant wall fixtures' },
        { name: 'Ceiling Lights', path: '/category/lightings?type=ceiling', desc: 'Flush & pendant mounts' }
      ],
      promo: {
        badge: 'ILLUMINATION',
        title: 'Crystal Chandelier Sale',
        desc: 'Transform any room with our handpicked European-style chandeliers. Up to 30% off.',
        cta: 'Shop Lights',
        ctaPath: '/category/lightings'
      }
    },
    { 
      name: 'Decor',
      desc: 'Wall art, rugs, vases & decorative accents',
      subLinks: [
        { name: 'Wall Art & Frames', path: '/category/decor?type=wall-art', desc: 'Canvas & framed prints' },
        { name: 'Rugs & Carpets', path: '/category/decor?type=rugs', desc: 'Handwoven floor accents' },
        { name: 'Vases & Sculptures', path: '/category/decor?type=vases', desc: 'Ceramic & metal pieces' },
        { name: 'Cushions & Throws', path: '/category/decor?type=cushions', desc: 'Soft furnishing accents' }
      ],
      promo: {
        badge: 'STYLE REFRESH',
        title: 'Complete Room Makeover',
        desc: 'Curated decor bundles to transform any space. Mix & match from NPR 2,500.',
        cta: 'Browse Decor',
        ctaPath: '/category/decor'
      }
    },
    { 
      name: 'Outdoor',
      desc: 'Garden chairs, swings & patio furniture',
      subLinks: [
        { name: 'Garden Chairs & Tables', path: '/category/outdoor?type=garden-sets', desc: 'Weather-resistant seating' },
        { name: 'Porch Swings', path: '/category/outdoor?type=swings', desc: 'Wooden & iron swings' },
        { name: 'Planters & Stands', path: '/category/outdoor?type=planters', desc: 'Decorative plant holders' },
        { name: 'Outdoor Storage', path: '/category/outdoor?type=storage', desc: 'Tool sheds & cabinets' }
      ],
      promo: {
        badge: 'WEATHER-PROOF',
        title: 'Teak Garden Collection',
        desc: 'Solid teak outdoor furniture treated for all seasons. 10-year warranty.',
        cta: 'Shop Outdoor',
        ctaPath: '/category/outdoor'
      }
    },
    { name: 'All Products', path: '/category/all-products' },
    { name: 'Our Showrooms', path: '/stores', isHighlighted: true },
    { name: 'The Journal', path: '/blog', isHighlighted: true },
    { name: 'Offers', path: '/category/offers', isHighlighted: true }
  ];

  const getCategorySlug = (categoryName) => {
    return categoryName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
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

              return (
                <div key={item.name} className="nav-item-wrapper">
                  <Link
                    to={itemPath}
                    className={`nav-link-premium ${isActive ? 'active' : ''} ${item.isHighlighted ? 'highlighted-link' : ''}`}
                  >
                    <span className="link-text">{item.name}</span>
                  </Link>
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