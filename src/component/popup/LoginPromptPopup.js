import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL, AUTH_ENDPOINTS } from '../../config/api';
import './LoginPromptPopup.css';

const LoginPromptPopup = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 400); // matching smooth CSS transition
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const result = await login({ email, password });
      if (result && result.success) {
        setSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 1600);
      } else {
        setError(result?.error || 'Invalid credentials. Please verify your email and password.');
      }
    } catch (err) {
      setError('A connection error occurred. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`login-prompt-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div className="login-prompt-popup" onClick={(e) => e.stopPropagation()}>
        
        {/* Glow Effects */}
        <div className="glow-orb-top"></div>
        <div className="glow-orb-bottom"></div>

        {/* Close Button */}
        <button className="login-prompt-close-btn" onClick={handleClose} aria-label="Close Dialog">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Sidebar Info - Luxurious Crimson Velvet */}
        <div className="login-prompt-sidebar">
          <div className="sidebar-pattern-overlay"></div>
          
          {/* Animated sparkles/particles */}
          <div className="sparkle sp-1"></div>
          <div className="sparkle sp-2"></div>
          <div className="sparkle sp-3"></div>
          
          <div className="welcome-decoration">
            <svg width="50" height="50" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 10L42 26L58 18L50 46H14L6 18L22 26L32 10Z" fill="url(#goldGradient)" stroke="#d4af37" strokeWidth="1.5" strokeLinejoin="round"/>
              <circle cx="32" cy="10" r="2.5" fill="#ffffff" stroke="#d4af37" strokeWidth="1"/>
              <circle cx="6" cy="18" r="2.5" fill="#ffffff" stroke="#d4af37" strokeWidth="1"/>
              <circle cx="58" cy="18" r="2.5" fill="#ffffff" stroke="#d4af37" strokeWidth="1"/>
              <circle cx="32" cy="30" r="3.5" fill="#ffffff" opacity="0.9"/>
              <rect x="18" y="38" width="28" height="4" rx="2" fill="url(#goldGradient)" stroke="#d4af37" strokeWidth="0.5"/>
              <path d="M14 46C14 49 20 52 32 52C44 52 50 49 50 46" stroke="#d4af37" strokeWidth="2" strokeLinecap="round"/>
              <defs>
                <linearGradient id="goldGradient" x1="6" y1="10" x2="58" y2="46" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ffe89c"/>
                  <stop offset="50%" stopColor="#d4af37"/>
                  <stop offset="100%" stopColor="#8a6d1c"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="welcome-text">
            <h3>Royal Lounge</h3>
            <span className="welcome-divider"></span>
            <p>Traditional artistry... bonded with absolute love</p>
          </div>
        </div>

        {/* Credentials Form Container - High Contrast Elegant Pearl */}
        <div className="login-prompt-content">
          <div className="form-header-block">
            <span className="membership-tag">
              BISHWOKARMA MEMBERSHIP
            </span>
            <h2 className="form-main-title">
              Sign In Directly
            </h2>
            <p className="form-subtitle">Unlock your premium furniture experience</p>
          </div>

          <form onSubmit={handleSubmit} className="popup-auth-form">
            
            {/* Email Field */}
            <div className="input-field-group">
              <label htmlFor="popup-email">
                Email Address
              </label>
              <div className="input-icon-container">
                <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  type="email"
                  id="popup-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. Shyam@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="input-field-group">
              <label htmlFor="popup-password">
                Secret Password
              </label>
              <div className="input-icon-container">
                <svg className="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type="password"
                  id="popup-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            {/* Dynamic Error State */}
            {error && (
              <div className="error-banner-container animate-shake">
                <span className="banner-icon">⚠️</span>
                <span className="banner-text">{error}</span>
              </div>
            )}

            {/* Dynamic Success State */}
            {success && (
              <div className="success-banner-container">
                <span className="banner-icon">✨</span>
                <span className="banner-text"><strong>Access Granted!</strong> Welcome to the Sindureghari Furniture lounge. Synchronizing secure profile details...</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="form-actions-hub">
              <button
                type="submit"
                disabled={loading || success}
                className={`login-submit-btn ${loading ? 'loading' : ''}`}
              >
                {loading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Verifying Credentials...
                  </>
                ) : (
                  'Sign In Now'
                )}
              </button>

              <div className="form-divider-row">
                <div className="divider-line"></div>
                <span className="divider-text">OR</span>
                <div className="divider-line"></div>
              </div>

              <button
                type="button"
                onClick={() => window.location.href = `${API_BASE_URL}${AUTH_ENDPOINTS.GOOGLE}`}
                className="google-signin-btn"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  <path d="M1 1h22v22H1z" fill="none"/>
                </svg>
                Sign In with Google
              </button>
            </div>

          </form>

          {/* Prompt Footer Links */}
          <div className="login-prompt-footer-row">
            <a 
              href="/register" 
              onClick={handleClose} 
              className="footer-create-link"
            >
              Create Free Account
            </a>
            <button 
              type="button"
              onClick={handleClose} 
              className="footer-browse-guest"
            >
              Browse as Guest
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPromptPopup;
