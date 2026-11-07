import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiChevronDown, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import { Truck, ShieldCheck, Ruler, ArrowRight, Sparkles } from 'lucide-react';
import { PRODUCT_ENDPOINTS, fetchWithFallback } from '../../config/api';
import { enterpriseCategories } from '../../data/enterpriseSeo';
import {
  mapCategoriesToNavigation,
  mapEnterpriseCategoriesToNavigation,
  slugifyCategory,
} from '../../utils/categoryHelpers';
import './navbar.css';

/* --------------------------------------------------------------------------
   Curated Sub-Categories & Visual Promos for both Admin DB & Enterprise Slugs
   -------------------------------------------------------------------------- */
const CURATED_CATEGORY_CONFIG = {
  'sofa-section': {
    displayName: 'Sofa Section',
    badge: 'Signature Living',
    title: 'Handcrafted Sofa Suites',
    desc: 'L-shape sectionals, 3+1+1 solid teak sofa sets & plush velvet loungers built for Nepali homes.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=700',
    cta: 'Explore Sofa Section',
    ctaPath: '/category/sofa-section',
    subLinks: [
      { name: 'L-Shape Sectional Sofas', path: '/category/sofa-section', desc: 'Corner & modular living room seating' },
      { name: '3+1+1 Luxury Sofa Sets', path: '/category/sofa', desc: 'Complete family seating suites' },
      { name: 'Solid Teak Wood Sofas', path: '/category/living-room/sofa-sets', desc: 'Seasoned hardwood frames' },
      { name: 'Recliners & Lounge Chairs', path: '/category/living-room/recliners', desc: 'Ergonomic relaxation seating' },
      { name: 'Center & Coffee Tables', path: '/category/living-room/coffee-tables', desc: 'Matching solid wood tables' },
      { name: 'TV Units & Media Consoles', path: '/category/living-room/tv-units', desc: 'Living room entertainment storage' },
    ],
  },
  'sofa': {
    displayName: 'Sofas & Loungers',
    badge: 'Bestseller',
    title: '3-Seater & Velvet Sofas',
    desc: 'High-density orthopedic foam cushions paired with kiln-dried timber frames.',
    image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&q=80&w=700',
    cta: 'Shop All Sofas',
    ctaPath: '/category/sofa',
    subLinks: [
      { name: '3-Seater Fabric Sofas', path: '/category/sofa', desc: 'Compact & modern everyday comfort' },
      { name: 'Royal Carved Teak Sofas', path: '/category/sofa-section', desc: 'Traditional handcrafted artistry' },
      { name: 'L-Shape Corner Sofas', path: '/category/living-room/sofa-sets', desc: 'Spacious apartment layouts' },
      { name: 'Accent Chairs & Ottomans', path: '/category/living-room/recliners', desc: 'Statement single seating' },
    ],
  },
  'living-room': {
    displayName: 'Living Room',
    badge: 'Atelier Highlight',
    title: 'Solid Teak Living Sets',
    desc: 'L-shape & 3+1+1 handcrafted luxury sofa suites with 10-year structural warranty.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=700',
    cta: 'Explore Living Room',
    ctaPath: '/category/living-room',
    subLinks: [
      { name: 'Sofa Sets & Sectionals', path: '/category/sofa-section', desc: 'L-Shape, 3-seater & wooden sofas' },
      { name: 'Coffee & Center Tables', path: '/category/living-room/coffee-tables', desc: 'Teak & sheesham center tables' },
      { name: 'TV Units & Cabinets', path: '/category/living-room/tv-units', desc: 'Modern media consoles' },
      { name: 'Recliners & Lounge', path: '/category/living-room/recliners', desc: 'Plush comfort seating' },
      { name: 'Side & End Tables', path: '/category/living-room/side-tables', desc: 'Compact sofa companions' },
    ],
  },
  'modern-beds': {
    displayName: 'Modern Beds',
    badge: 'Master Sanctuary',
    title: 'Hydraulic & King Size Beds',
    desc: 'Heavy-duty solid timber bed frames with silent hydraulic storage & tufted headboards.',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=700',
    cta: 'Explore Modern Beds',
    ctaPath: '/category/modern-beds',
    subLinks: [
      { name: 'King Size Hydraulic Beds', path: '/category/modern-beds', desc: 'Full box storage with gas-lift' },
      { name: 'Upholstered Italian Beds', path: '/category/modern-beds', desc: 'Cushioned velvet & fabric frames' },
      { name: 'Solid Teak & Sisau Beds', path: '/category/bedroom/beds', desc: 'Heirloom natural wood finishes' },
      { name: 'Bedside Nightstands', path: '/category/bedroom/bedside-tables', desc: 'Matching 2-drawer side tables' },
      { name: 'Dressing Tables & Mirrors', path: '/category/bedroom/dressing-tables', desc: 'Vanity units with LED mirrors' },
      { name: 'Bedroom Wardrobes', path: '/category/wardrobes', desc: '2, 3 & 4-door wooden almirahs' },
    ],
  },
  'bedroom': {
    displayName: 'Bedroom',
    badge: 'Bestseller',
    title: 'Hydraulic Storage Beds',
    desc: 'Solid hardwood bed frames with silent German hydraulic lift mechanisms.',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=700',
    cta: 'Explore Bedroom',
    ctaPath: '/category/bedroom',
    subLinks: [
      { name: 'Modern & King Beds', path: '/category/modern-beds', desc: 'King, queen & hydraulic storage' },
      { name: 'Wooden Wardrobes', path: '/category/wardrobes', desc: 'Multi-door & sliding almirahs' },
      { name: 'Dressing Tables', path: '/category/bedroom/dressing-tables', desc: 'Vanity sets with full mirrors' },
      { name: 'Bedside Tables', path: '/category/bedroom/bedside-tables', desc: 'Solid wood nightstands' },
    ],
  },
  'dining-room': {
    displayName: 'Dining Room',
    badge: 'Family Gathering',
    title: 'Royal Sisau Dining Sets',
    desc: '4, 6 & 8-seater hand-carved solid timber tables with ergonomic cushioned chairs.',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=700',
    cta: 'Explore Dining',
    ctaPath: '/category/dining-room',
    subLinks: [
      { name: '6-Seater Family Dining Sets', path: '/category/dining-room', desc: 'Our most popular family size' },
      { name: '8-Seater Grand Dining Suites', path: '/category/dining-room/dining-sets', desc: 'Spacious hosting & banquets' },
      { name: '4-Seater Compact Dining', path: '/category/dining-room/dining-tables', desc: 'Ideal for modern apartments' },
      { name: 'Solid Wood Dining Chairs', path: '/category/dining-room/dining-chairs', desc: 'Ergonomic upholstered seating' },
    ],
  },
  'wardrobes': {
    displayName: 'Wardrobes',
    badge: 'Smart Storage',
    title: 'Solid Wood Wardrobes',
    desc: 'Spacious 2, 3 & 4-door modular wardrobes with full-length dressing mirrors & locks.',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=700',
    cta: 'Shop Wardrobes',
    ctaPath: '/category/wardrobes',
    subLinks: [
      { name: '3-Door Mirror Wardrobes', path: '/category/wardrobes', desc: 'Hanging, shelves & locker storage' },
      { name: '4-Door Master Almirahs', path: '/category/bedroom/wardrobes', desc: 'Full-wall luxury bedroom storage' },
      { name: 'Sliding Door Wardrobes', path: '/category/wardrobes', desc: 'Space-saving modern closets' },
      { name: 'Shoe Racks & Organizers', path: '/category/wardrobes', desc: 'Entryway & utility cabinets' },
    ],
  },
  'study-tables': {
    displayName: 'Study Tables',
    badge: 'Work & Focus',
    title: 'Executive Desks & Study',
    desc: 'Solid wood writing desks with cable management, drawers & ergonomic office seating.',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=700',
    cta: 'Shop Study Tables',
    ctaPath: '/category/study-tables',
    subLinks: [
      { name: 'Wooden Study & Computer Desks', path: '/category/study-tables', desc: 'With keyboard tray & drawers' },
      { name: 'Executive Office Tables', path: '/category/study-room/study-tables', desc: 'Director & home office desks' },
      { name: 'Ergonomic Mesh Office Chairs', path: '/category/study-room/office-chairs', desc: 'High-back lumbar support' },
      { name: 'Bookshelves & Display Units', path: '/category/study-room/bookshelves', desc: 'Solid wood bookcases' },
    ],
  },
  'study-room': {
    displayName: 'Study & Office',
    badge: 'Work & Focus',
    title: 'Executive Study Desks',
    desc: 'Solid wood writing desks with built-in storage & modular bookcases.',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=700',
    cta: 'Explore Study',
    ctaPath: '/category/study-room',
    subLinks: [
      { name: 'Study & Computer Tables', path: '/category/study-tables', desc: 'Home office & student desks' },
      { name: 'Ergonomic Office Chairs', path: '/category/study-room/office-chairs', desc: 'Adjustable lumbar seating' },
      { name: 'Bookshelves & Cabinets', path: '/category/study-room/bookshelves', desc: 'Vertical timber storage' },
    ],
  },
  'dashainoffer': {
    displayName: 'Festive Combos',
    badge: 'Up to 29% OFF',
    title: 'Festive Room Combo Deals',
    desc: 'Complete bedroom, living room & whole-home furniture bundles at special festive prices.',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=700',
    cta: 'View Combo Offers',
    ctaPath: '/category/dashainoffer',
    subLinks: [
      { name: 'Mega 3-Room Furniture Combo', path: '/category/dashainoffer', desc: 'Sofa + Bed + Dining Table bundle' },
      { name: 'Bedroom Upgrade Package', path: '/category/dashainoffer', desc: 'Storage Bed + Wardrobe + Side Tables' },
      { name: 'Living Room Complete Combo', path: '/category/dashainoffer', desc: 'Sofa Set + Center Table + Stools' },
      { name: 'Diwali Flat 5% OFF Deals', path: '/category/offers', desc: 'Use code DIWALI5 at checkout' },
    ],
  },
  'outdoor-furniture': {
    displayName: 'Outdoor',
    badge: 'Weatherproof',
    title: 'Balcony & Patio Sets',
    desc: 'Weather-sealed teakwood outdoor swings, tables & lounge seating.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=700',
    cta: 'Explore Outdoor',
    ctaPath: '/category/outdoor-furniture',
    subLinks: [
      { name: 'Teak Garden Swings', path: '/category/outdoor-furniture/garden-swings', desc: 'Handcrafted porch & terrace swings' },
      { name: 'Patio Table & Chair Sets', path: '/category/outdoor-furniture/patio-sets', desc: 'Weather-resistant dining' },
      { name: 'Balcony Lounge Chairs', path: '/category/outdoor-furniture/outdoor-chairs', desc: 'Compact outdoor seating' },
    ],
  },
  'lighting': {
    displayName: 'Lighting',
    badge: 'Warm Ambience',
    title: 'Artisanal Chandeliers & Lamps',
    desc: 'Warm architectural lighting designed to accentuate wooden interiors.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=700',
    cta: 'Explore Lighting',
    ctaPath: '/category/lighting',
    subLinks: [
      { name: 'Crystal & Brass Chandeliers', path: '/category/lighting', desc: 'Living & dining statement lights' },
      { name: 'Wooden Floor & Table Lamps', path: '/category/lighting', desc: 'Warm bedside & corner lighting' },
    ],
  },
};

const formatDisplayName = (rawName = '', slug = '') => {
  if (CURATED_CATEGORY_CONFIG[slug]?.displayName) {
    return CURATED_CATEGORY_CONFIG[slug].displayName;
  }
  return String(rawName)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const utilityLinks = [
  { name: 'Our Showrooms', path: '/stores', isHighlighted: false },
  { name: 'The Journal', path: '/blog', isHighlighted: false },
  { name: 'Offers', path: '/category/offers', isHighlighted: true, badge: '5% OFF' },
];

const Navbar = ({ isMobileMenuOpen = false, setIsMobileMenuOpen }) => {
  const [expandedMobile, setExpandedMobile] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [adminCategories, setAdminCategories] = useState([]);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const fetchAdminCategories = async () => {
      try {
        const response = await fetchWithFallback(PRODUCT_ENDPOINTS.CATEGORIES);
        if (!response.ok) return;
        const data = await response.json();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setAdminCategories(data);
        }
      } catch (error) {
        console.warn('Navbar category fetch fallback active.');
      }
    };

    fetchAdminCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // Close open dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
  }, [location.pathname]);

  const rawDynamic = mapCategoriesToNavigation(adminCategories);
  const fallbackCategories = mapEnterpriseCategoriesToNavigation(enterpriseCategories);
  const baseCategories = rawDynamic.length > 0 ? rawDynamic : fallbackCategories;

  // Enrich every category so it always has curated subLinks and promo card
  const navigationCategories = baseCategories.map((cat) => {
    const slug = cat.slug || slugifyCategory(cat.name);
    const curated = CURATED_CATEGORY_CONFIG[slug];
    const subLinks =
      Array.isArray(cat.subLinks) && cat.subLinks.length > 0
        ? cat.subLinks
        : curated?.subLinks || [];

    return {
      ...cat,
      slug,
      displayName: formatDisplayName(cat.name, slug),
      subLinks,
      promo: curated || {
        badge: 'Atelier Collection',
        title: `${formatDisplayName(cat.name, slug)} Collection`,
        desc: cat.desc || `Handcrafted solid wood ${formatDisplayName(cat.name, slug).toLowerCase()} built for modern Nepali homes.`,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=700',
        cta: `Explore ${formatDisplayName(cat.name, slug)}`,
        ctaPath: cat.path || `/category/${slug}`,
      },
    };
  });

  const categoryData = [...navigationCategories, ...utilityLinks];

  const toggleMobileExpand = (name) => {
    setExpandedMobile(expandedMobile === name ? null : name);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className="modern-navbar desktop-only"
        aria-label="Main product navigation"
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="navbar-container">
          <div className="nav-items-strip">
            {categoryData.map((item, index) => {
              const slug = item.slug || slugifyCategory(item.name);
              const label = item.displayName || item.name;
              const itemPath = item.path || `/category/${slug}`;
              const isActive = item.path
                ? location.pathname === item.path
                : location.pathname === `/category/${slug}` ||
                  location.pathname.startsWith(`/category/${slug}/`);

              const hasDropdown = Array.isArray(item.subLinks) && item.subLinks.length > 0;
              const isOpen = activeDropdown === item.name;
              const promo = item.promo;

              // Smart horizontal alignment so dropdown never overflows screen
              let alignClass = 'align-left';
              if (index >= categoryData.length - 4) {
                alignClass = 'align-right';
              } else if (index >= 2) {
                alignClass = 'align-center';
              }

              return (
                <div
                  key={item.name}
                  className={`nav-item ${hasDropdown ? 'has-dropdown' : ''} ${isOpen ? 'dropdown-open' : ''} ${alignClass}`}
                  onMouseEnter={() => hasDropdown && setActiveDropdown(item.name)}
                >
                  <Link
                    to={itemPath}
                    className={`nav-link ${isActive ? 'active' : ''} ${item.isHighlighted ? 'highlighted' : ''}`}
                    onClick={() => setActiveDropdown(null)}
                  >
                    <span className="nav-link-text">{label}</span>
                    {item.badge && <span className="nav-offer-badge">{item.badge}</span>}
                    {hasDropdown && <FiChevronDown className="nav-chevron" size={13} />}
                  </Link>

                  {/* ── Modern Luxury Mega Menu Dropdown ── */}
                  {hasDropdown && (
                    <div className="mega-dropdown-wrapper">
                      <div className="mega-dropdown-bridge" />

                      <div className="mega-dropdown-card">
                        {/* Header Bar */}
                        <div className="mega-dropdown-head">
                          <div className="mega-head-left">
                            <span className="mega-head-eyebrow">Sindureghari Atelier</span>
                            <h3 className="mega-head-title">{label}</h3>
                          </div>
                          <Link
                            to={itemPath}
                            className="mega-view-all-link"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <span>View All {label}</span>
                            <ArrowRight size={14} />
                          </Link>
                        </div>

                        {/* Main Grid: Sub-categories + Featured Visual Promo */}
                        <div className="mega-dropdown-main">
                          {/* 2-Column Sub-categories Grid */}
                          <div className="mega-subcategories-grid">
                            {item.subLinks.map((sub, idx) => (
                              <Link
                                key={idx}
                                to={sub.path}
                                className="mega-sub-item"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <div className="mega-sub-icon-box">
                                  <Sparkles size={13} className="sparkle-gold" />
                                </div>
                                <div className="mega-sub-info">
                                  <span className="mega-sub-title">{sub.name}</span>
                                  {sub.desc && <span className="mega-sub-meta">{sub.desc}</span>}
                                </div>
                                <FiChevronRight size={14} className="mega-sub-chevron" />
                              </Link>
                            ))}
                          </div>

                          {/* Featured Visual Promo Panel */}
                          {promo && (
                            <Link
                              to={promo.ctaPath}
                              className="mega-promo-card"
                              onClick={() => setActiveDropdown(null)}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={promo.image}
                                alt={promo.title}
                                className="mega-promo-img"
                                loading="lazy"
                              />
                              <div className="mega-promo-gradient" />
                              <div className="mega-promo-content">
                                <span className="mega-promo-tag">{promo.badge}</span>
                                <h4 className="mega-promo-heading">{promo.title}</h4>
                                <p className="mega-promo-desc">{promo.desc}</p>
                                <span className="mega-promo-button">
                                  <span>{promo.cta}</span>
                                  <FiArrowRight size={13} />
                                </span>
                              </div>
                            </Link>
                          )}
                        </div>

                        {/* Dropdown Footer Strip */}
                        <div className="mega-dropdown-footer">
                          <div className="mega-footer-item">
                            <Truck size={14} />
                            <span>Free Delivery Across Nepal</span>
                          </div>
                          <div className="mega-footer-item">
                            <ShieldCheck size={14} />
                            <span>10-Year Solid Timber Warranty</span>
                          </div>
                          <div className="mega-footer-item">
                            <Ruler size={14} />
                            <span>Custom Dimensions Available</span>
                          </div>
                        </div>
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
      {isMobileMenuOpen && (
        <>
          <div
            className="nav-mobile-backdrop"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="nav-mobile-drawer">
            <div className="drawer-header">
              <span className="drawer-title">Browse Collections</span>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="drawer-content">
              <div className="mobile-nav-list">
                {categoryData.map((item) => {
                  const slug = item.slug || slugifyCategory(item.name);
                  const label = item.displayName || item.name;
                  const itemPath = item.path || `/category/${slug}`;
                  const isActive = item.path
                    ? location.pathname === item.path
                    : location.pathname === `/category/${slug}` ||
                      location.pathname.startsWith(`/category/${slug}/`);
                  const hasDropdown = item.subLinks && item.subLinks.length > 0;
                  const isExpanded = expandedMobile === item.name;

                  return (
                    <div key={item.name} className="mobile-nav-block">
                      <div className="mobile-nav-row">
                        <Link
                          to={itemPath}
                          className={`mobile-nav-link ${isActive ? 'active' : ''} ${item.isHighlighted ? 'highlighted-link' : ''}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span>{label}</span>
                          {item.badge && <span className="mobile-offer-badge">{item.badge}</span>}
                        </Link>
                        {hasDropdown && (
                          <button
                            type="button"
                            className={`mobile-expand-btn ${isExpanded ? 'expanded' : ''}`}
                            onClick={() => toggleMobileExpand(item.name)}
                            aria-label={`Expand ${label}`}
                          >
                            <FiChevronDown size={16} />
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
                    </div>
                  );
                })}

                <div className="drawer-divider" />

                <Link to="/order-request" className="mobile-nav-link highlighted-link" onClick={() => setIsMobileMenuOpen(false)}>Order Request</Link>
                <Link to="/stores" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Our Showrooms</Link>
                <Link to="/orders" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Track Order</Link>
                <Link to="/profile" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>My Account</Link>
                <Link to="/help-and-support" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Help & Support</Link>
              </div>
            </div>

            <div className="drawer-footer">
              <p>Sindureghari Furniture</p>
              <small>Handcrafted... bonded with love</small>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
