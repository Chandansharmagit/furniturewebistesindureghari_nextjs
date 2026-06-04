import React, { useEffect, useRef, useState } from 'react';
import {
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
  Store,
  Search,
  Building2,
  HelpCircle,
  BadgePercent,
  LogIn,
  UserPlus,
  PackageCheck,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import SearchFunctionality from '../navbar/search/SearchFunctionality';
import { useCart } from '../../context/CartContext';
import useFavorites from '../../hooks/useFavorites';
// import useOrders from '../../hooks/useOrders';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL, buildApiUrl } from '../../config/api';
import couponService from '../../services/couponService';
import { fetchLoyaltyStatus, getLoyaltyStatusClass } from '../../utils/loyaltyStatus';
import './Header.css';

const Header = ({ isMobileMenuOpen = false, setIsMobileMenuOpen }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [loyaltyStatus, setLoyaltyStatus] = useState(null);
  const userMenuRef = useRef(null);
  const userMenuCloseTimerRef = useRef(null);
  const navigate = useNavigate();
  const { getCartItemsCount } = useCart();
  const { favoritesCount } = useFavorites();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    let isMounted = true;

    fetchLoyaltyStatus({
      id: user?.id || user?.user_id,
      email: user?.email,
      totalSpend: user?.total_spend || user?.totalSpend
    })
      .then((status) => {
        if (isMounted) setLoyaltyStatus(status);
      })
      .catch(() => {
        if (isMounted) {
          setLoyaltyStatus({
            status: 'Registered',
            status_key: 'registered',
            eligible_for_loyalty: false
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user]);

  useEffect(() => {
    let isMounted = true;

    const getCouponDiscount = (coupon) => Number(
      coupon.discount_percentage ?? coupon.discount_value ?? coupon.discount ?? 0
    );

    const isActiveValue = (value) => (
      value === undefined ||
      value === null ||
      value === true ||
      value === 1 ||
      value === '1' ||
      String(value).toLowerCase() === 'true' ||
      String(value).toLowerCase() === 'active'
    );

    const isNotExpired = (expiryDate) => {
      if (!expiryDate) return true;

      const dateOnlyMatch = String(expiryDate).match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (dateOnlyMatch) {
        const [, year, month, day] = dateOnlyMatch;
        const endOfDay = new Date(Number(year), Number(month) - 1, Number(day), 23, 59, 59, 999);
        return endOfDay >= new Date();
      }

      return new Date(expiryDate) >= new Date();
    };

    const isCouponLive = (coupon) => {
      const isActive = isActiveValue(coupon.is_active ?? coupon.status);
      const hasNotExpired = isNotExpired(coupon.expiry_date ?? coupon.expires_at ?? coupon.valid_until);
      return isActive && hasNotExpired && coupon.code && getCouponDiscount(coupon) > 0;
    };

    const pickBestCoupon = (coupons) => coupons
        .filter(isCouponLive)
        .sort((a, b) => getCouponDiscount(b) - getCouponDiscount(a))[0] || null;

    const normalizeCouponList = (data) => {
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.coupons)) return data.coupons;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.items)) return data.items;
      return [];
    };

    const loadActiveCoupon = async () => {
      try {
        const response = await fetch(buildApiUrl(`/api/products/coupons/active?fresh=1&t=${Date.now()}`), {
          cache: 'no-store',
        });

        if (response.ok) {
          const data = await response.json();
          if (isMounted && data?.coupon && isCouponLive(data.coupon)) {
            setActiveCoupon(data.coupon);
            return;
          }
        }
      } catch (error) {
        console.warn('Active coupon endpoint failed, falling back to coupon list:', error);
      }

      let result = { success: false };
      try {
        result = await couponService.getAllCoupons({ fresh: true });
      } catch {
        result = { success: false };
      }
      if (!isMounted || !result.success) return;

      const bestCoupon = pickBestCoupon(normalizeCouponList(result.data));
      if (bestCoupon) {
        setActiveCoupon(bestCoupon);
        return;
      }

      setActiveCoupon(null);
    };

    loadActiveCoupon();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadActiveCoupon();
      }
    };

    const refreshTimer = window.setInterval(loadActiveCoupon, 5 * 60 * 1000);
    window.addEventListener('focus', loadActiveCoupon);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      window.clearInterval(refreshTimer);
      window.removeEventListener('focus', loadActiveCoupon);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (userMenuCloseTimerRef.current) {
        window.clearTimeout(userMenuCloseTimerRef.current);
      }
    };
  }, []);

  const getProfileImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
  };

  const getAllProducts = () => [];
  const activeDiscount = activeCoupon ? Math.round(Number(
    activeCoupon.discount_percentage ?? activeCoupon.discount_value ?? activeCoupon.discount ?? 0
  )) : null;
  const displayName = user?.name || user?.first_name || 'Customer';
  const displayEmail = user?.email || 'Manage your Sindureghari account';

  const openUserMenu = () => {
    if (userMenuCloseTimerRef.current) {
      window.clearTimeout(userMenuCloseTimerRef.current);
    }
    setShowUserDropdown(true);
  };

  const closeUserMenuSoon = () => {
    userMenuCloseTimerRef.current = window.setTimeout(() => {
      setShowUserDropdown(false);
    }, 140);
  };

  return (
    <header className={`premium-header ${isMobileSearchOpen ? 'mobile-search-active' : ''}`}>
      <div className="header-utility-row desktop-only">
        <div className="header-utility-inner">
          <div className="header-utility-offer">
            <BadgePercent size={15} />
            <span>{activeCoupon ? `${activeDiscount}% discount` : 'Current Offer'}</span>
            <strong>{activeCoupon ? `Use code ${activeCoupon.code}` : 'Offers updating'}</strong>
          </div>

          <nav className="header-utility-links" aria-label="Quick header links">
            <Link to="/become-a-franchise" className="header-utility-link">
              <Building2 size={14} />
              <span>Become a Franchise</span>
            </Link>
            <Link to="/order-request" className="header-utility-link header-utility-link-strong">
              <PackageCheck size={14} />
              <span>Order Request</span>
            </Link>
            <Link to="/orders" className="header-utility-link">
              <Store size={14} />
              <span>Track Order</span>
            </Link>
            <Link to="/help-and-support" className="header-utility-link">
              <HelpCircle size={14} />
              <span>Help Center</span>
            </Link>
          </nav>
        </div>
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
              ref={userMenuRef}
              onMouseEnter={openUserMenu}
              onMouseLeave={closeUserMenuSoon}
            >
              <button
                type="button"
                className={`action-icon-wrapper user-menu-trigger ${showUserDropdown ? 'active' : ''}`}
                onClick={() => setShowUserDropdown(current => !current)}
                aria-expanded={showUserDropdown}
                aria-label="Open account menu"
              >
                {isAuthenticated && user?.profile_picture ? (
                  <img
                    src={getProfileImageUrl(user.profile_picture)}
                    alt="Profile"
                    className="avatar-img"
                  />
                ) : (
                  <User size={18} strokeWidth={1.5} className="action-icon" />
                )}
              </button>
              {isAuthenticated && loyaltyStatus?.status && (
                <span className={`header-loyalty-pill ${getLoyaltyStatusClass(loyaltyStatus.status_key || loyaltyStatus.status)}`}>
                  {loyaltyStatus.status}
                </span>
              )}

              {showUserDropdown && (
                  <div className="premium-dropdown">
                    <div className="dropdown-header account-menu-header">
                      <div className="account-menu-avatar">
                        {isAuthenticated && user?.profile_picture ? (
                          <img src={getProfileImageUrl(user.profile_picture)} alt="Profile" />
                        ) : (
                          <User size={22} />
                        )}
                      </div>
                      <div className="account-menu-identity">
                        <strong>{isAuthenticated ? displayName : 'Welcome'}</strong>
                        <span>{isAuthenticated ? displayEmail : 'Sign in for orders, wishlist and faster checkout'}</span>
                        {isAuthenticated && loyaltyStatus?.status && (
                          <em className={`account-status-badge ${getLoyaltyStatusClass(loyaltyStatus.status_key || loyaltyStatus.status)}`}>
                            {loyaltyStatus.status}
                            {loyaltyStatus.discount_percent ? ` - ${loyaltyStatus.discount_percent}% loyalty` : ''}
                          </em>
                        )}
                      </div>
                    </div>
                    <div className="dropdown-links">
                      {!isAuthenticated ? (
                        <>
                          <Link to="/login" className="drop-link account-menu-primary" onClick={() => setShowUserDropdown(false)}>
                            <LogIn size={17} />
                            <span>Login</span>
                            <ChevronRight size={15} />
                          </Link>
                          <Link to="/register" className="drop-link" onClick={() => setShowUserDropdown(false)}>
                            <UserPlus size={17} />
                            <span>Create account</span>
                            <ChevronRight size={15} />
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link to="/profile" className="drop-link" onClick={() => setShowUserDropdown(false)}>
                            <User size={17} />
                            <span>My Profile</span>
                            <ChevronRight size={15} />
                          </Link>
                          <Link to="/orders" className="drop-link" onClick={() => setShowUserDropdown(false)}>
                            <PackageCheck size={17} />
                            <span>Orders</span>
                            <ChevronRight size={15} />
                          </Link>
                          <Link to="/favorites" className="drop-link" onClick={() => setShowUserDropdown(false)}>
                            <Heart size={17} />
                            <span>Wishlist</span>
                            <ChevronRight size={15} />
                          </Link>
                          <button onClick={() => { logout(); setShowUserDropdown(false); navigate('/'); }} className="drop-link logout">
                            <LogOut size={17} />
                            <span>Logout</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
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
      {isMobileSearchOpen && (
          <div 
            className="mobile-search-overlay"
          >
            <div className="mobile-search-container">
              <SearchFunctionality 
                apiBaseUrl={API_BASE_URL} 
                getAllProducts={getAllProducts} 
                isMobile={true} 
                onClose={() => setIsMobileSearchOpen(false)} 
              />
            </div>
          </div>
        )}
    </header>
  );
};

export default Header;
