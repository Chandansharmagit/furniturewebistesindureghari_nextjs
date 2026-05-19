import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCrown, FaEnvelope, FaTimes, FaGift, FaGem } from 'react-icons/fa';
import { API_BASE_URL } from '../../config/api';
import './NewsletterPopup.css';

const NewsletterPopup = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/customer-data/subscribe`,
        { email, source: 'popup' }
      );

      if (response.data.success) {
        setStatus('success');
        setMessage('Welcome to the Royal Circle! Your exclusive offers are on the way.');
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.error || 'Failed to join. Please try again.');
    }
  };

  if (!isOpen && status !== 'success') return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="newsletter-popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="newsletter-popup-card"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={onClose}>
              <FaTimes />
            </button>

            <div className="popup-grid">
              <div className="popup-visual">
                <div className="visual-content">
                  <FaCrown className="crown-icon" />
                  <div className="offer-badge">15% OFF</div>
                </div>
                <div className="visual-bg-pattern"></div>
              </div>

              <div className="popup-form-content">
                <div className="header-icon">
                  <FaGem />
                </div>
                <h2>Join the Royal Circle</h2>
                <p>Subscribe to receive exclusive previews of our limited collections and a <strong>15% discount</strong> on your first majestic purchase.</p>

                {status === 'success' ? (
                  <motion.div 
                    className="success-message"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="success-icon">✓</div>
                    <p>{message}</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="newsletter-form">
                    <div className="input-field">
                      <FaEnvelope className="field-icon" />
                      <input 
                        type="email" 
                        placeholder="Your Imperial Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={status === 'loading'}
                      />
                    </div>
                    
                    {status === 'error' && <p className="error-text">{message}</p>}

                    <motion.button 
                      type="submit" 
                      className="subscribe-btn"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={status === 'loading'}
                    >
                      {status === 'loading' ? 'Joining...' : 'Claim My Invitation'}
                    </motion.button>

                    <p className="privacy-note">
                      By joining, you agree to our <a href="/privacy-policy">Privacy Charter</a>.
                    </p>
                  </form>
                )}
              </div>
            </div>

            <div className="popup-footer-bar">
              <div className="footer-item"><FaGift /> Exclusive Gifts</div>
              <div className="footer-item"><FaGem /> Private Sales</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewsletterPopup;
