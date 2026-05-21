import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../../services/authService';
import { motion } from 'framer-motion';
import './Auth.css';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing. Please make sure you clicked the full link from your email.');
      return;
    }
    
    const performVerification = async () => {
      try {
        const result = await authService.verifyEmail(token);
        if (result.success) {
          setStatus('success');
          setMessage(result.message || 'Email verified successfully. You can now log in.');
        } else {
          setStatus('error');
          setMessage(result.error || 'Invalid or expired verification token.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again later.');
      }
    };
    
    performVerification();
  }, [searchParams]);

  return (
    <div className="modern-auth-container">
      <div className="auth-floating-box">
        <div className="auth-side-image">
          <div className="brand-content">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Sindureghari <br /> Furniture
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Verify your email address to unlock your account and experience luxury handcrafted furniture bonded with love.
            </motion.p>
            <div className="features">
              {[
                "Secure Verification",
                "Elite Member Benefits",
                "Handcrafted Luxury"
              ].map((text, i) => (
                <motion.div 
                  key={i} 
                  className="feature"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + (i * 0.1) }}
                >
                  <span className="feature-icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span>{text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="auth-form-section">
          <motion.div 
            className="auth-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {status === 'verifying' && (
              <div className="loading-state">
                <div className="spinner"></div>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '10px', color: 'var(--text-dark)' }}>Verifying...</h1>
                <p style={{ color: 'var(--text-muted)' }}>We are validating your verification link. Please wait.</p>
              </div>
            )}

            {status === 'success' && (
              <>
                <div className="auth-header">
                  <div className="success-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h1>Email Verified</h1>
                  <p>Your account is now active and ready to go.</p>
                </div>
                
                <div className="email-sent-content">
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', margin: '0 0 20px 0' }}>
                    {message || "Thank you for verifying your email address. You have successfully activated your account and can now access all features of our elite furniture sanctuary."}
                  </p>
                  
                  <div className="token-actions">
                    <Link to="/login" className="auth-btn">
                      Sign In to Your Account
                    </Link>
                    <Link to="/" className="secondary-btn" style={{ textAlign: 'center' }}>
                      Go to Home
                    </Link>
                  </div>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="auth-header">
                  <div className="error-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  </div>
                  <h1>Verification Failed</h1>
                  <p>We could not verify your email address.</p>
                </div>
                
                <div className="invalid-token-content" style={{ padding: 0, alignItems: 'flex-start' }}>
                  <div className="error-reasons" style={{ width: '100%', margin: '0 0 24px 0' }}>
                    <h3>This could happen if:</h3>
                    <ul>
                      <li>The link has expired (verification links are valid for 24 hours)</li>
                      <li>The email was already verified</li>
                      <li>The link was copied incorrectly</li>
                    </ul>
                  </div>
                  
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 24px 0' }}>
                    {message}
                  </p>
                  
                  <div className="token-actions" style={{ width: '100%' }}>
                    <Link to="/register" className="auth-btn">
                      Create a New Account
                    </Link>
                    <Link to="/login" className="secondary-btn" style={{ textAlign: 'center' }}>
                      Back to Sign In
                    </Link>
                  </div>
                </div>
              </>
            )}
            
            <div className="security-note" style={{ marginTop: '30px' }}>
              <div className="security-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <p>
                <strong>Security Guarantee:</strong> We protect your credentials with industry-standard encryption protocols.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
