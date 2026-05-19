import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import authService from '../../services/authService';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    
    // Clear error when user starts typing
    if (errors.email) {
      setErrors({});
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await authService.forgotPassword(email);
      
      if (result.success) {
        console.log('Password reset email sent to:', email);
        setIsEmailSent(true);
      } else {
        // Even if there's an error, we show success for security reasons
        // (don't reveal if email exists or not)
        setIsEmailSent(true);
      }
      
    } catch (error) {
      console.error('Password reset failed:', error);
      // For security, always show success message
      setIsEmailSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Password reset email resent to:', email);
      alert('Reset email sent again!');
      
    } catch (error) {
      console.error('Failed to resend email:', error);
      alert('Failed to resend email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
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
                Bishwokarma <br /> Furniture
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Your password reset request has been processed. Check your email to continue.
              </motion.p>
              <div className="features">
                {[
                  "Secure Password Reset",
                  "Quick & Easy Process",
                  "24/7 Account Support"
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
              <div className="auth-header">
                <div className="success-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <h1>Check Your Email</h1>
                <p>We've sent a password reset link to <strong>{email}</strong></p>
              </div>
            
              <div className="email-sent-content">
                <div className="instructions">
                  <h3>What's next?</h3>
                  <ol>
                    <li>Check your email inbox (and spam folder)</li>
                    <li>Click the reset link in the email</li>
                    <li>Create a new password</li>
                    <li>Sign in with your new password</li>
                  </ol>
                </div>
                
                <div className="email-actions">
                  <button
                    onClick={handleResendEmail}
                    className={`resend-btn ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="auth-btn-spinner"></div>
                        Sending...
                      </>
                    ) : (
                      'Resend Email'
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsEmailSent(false);
                      setEmail('');
                    }}
                    className="change-email-btn"
                  >
                    Use Different Email
                  </button>
                </div>
              </div>
              
              <div className="auth-footer">
                <p>
                  Remember your password?
                  <Link to="/login" className="auth-link"> Sign In</Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

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
              Bishwokarma <br /> Furniture
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Forgot your password? No problem! We'll help you get back to shopping for beautiful furniture.
            </motion.p>
            <div className="features">
              {[
                "Secure Account Recovery",
                "Instant Email Delivery",
                "Safe & Protected"
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
            <div className="auth-header">
              <h1>Forgot Password?</h1>
              <p>No worries! Enter your email and we'll send you a reset link</p>
            </div>
          
            <form onSubmit={handleSubmit} className="auth-form">
              {errors.general && (
                <div className="error-banner">
                  {errors.general}
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="Enter your registered email"
                  autoFocus
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <button
                type="submit"
                className={`auth-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="auth-btn-spinner"></div>
                    Sending Reset Link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
            
            <div className="auth-footer">
              <p>
                Remember your password?
                <Link to="/login" className="auth-link"> Sign In</Link>
              </p>
              <p>
                Don't have an account?
                <Link to="/register" className="auth-link"> Sign Up</Link>
              </p>
            </div>
            
            <div className="security-note">
              <div className="security-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <p>
                <strong>Security Note:</strong> For your protection, we'll only send reset links to registered email addresses. 
                If you don't receive an email within 5 minutes, please check your spam folder or contact support.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}