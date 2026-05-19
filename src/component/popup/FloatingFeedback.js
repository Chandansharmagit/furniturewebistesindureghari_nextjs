import React, { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FaCommentDots, FaTimes, FaPaperPlane, FaStar } from 'react-icons/fa';
import './FloatingFeedback.css';

const FloatingFeedback = ({ isOpen, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Drag functionality state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 20, y: 300 }); // Default position shifted
  const popupRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackType: '',
    rating: 0,
    subject: '',
    message: '',
    suggestions: '',
    wouldRecommend: '',
    anonymous: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRatingClick = (value) => {
    setRating(value);
    setFormData(prev => ({
      ...prev,
      rating: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Add timestamp and status
      const submitData = {
        ...formData,
        rating: rating,
        timestamp: new Date().toISOString(),
        status: 'pending',
        type: 'feedback'
      };

      // Here you would typically send to your backend API
      console.log('Feedback submitted:', submitData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert('Thank you for your feedback! Your input helps us improve our services.');

      // Reset form
      setFormData({
        name: '',
        email: '',
        feedbackType: '',
        rating: 0,
        subject: '',
        message: '',
        suggestions: '',
        wouldRecommend: '',
        anonymous: false
      });
      setRating(0);
      onClose();

    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Drag functionality handlers
  const handleMouseDown = (e) => {
    if (e.target.closest('.header-actions')) return; // Don't drag when clicking buttons

    setIsDragging(true);
    const rect = popupRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // Keep popup within viewport bounds
    const maxX = window.innerWidth - 400; // popup width
    const maxY = window.innerHeight - 600; // approximate popup height

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  }, [isDragging, dragOffset.x, dragOffset.y]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouse event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, handleMouseMove, handleMouseUp]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={popupRef}
      className={`floating-feedback-container ${isMinimized ? 'minimized' : ''}`}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 20002
      }}
    >
      <div
        className="floating-feedback-header"
        onMouseDown={handleMouseDown}
        style={{ userSelect: 'none' }}
      >
        <div className="header-left">
          <FaCommentDots />
          <span>Send Feedback</span>
        </div>
        <div className="header-actions">
          <button
            className="minimize-btn"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? '□' : '_'}
          </button>
          <button
            className="close-btn"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="floating-feedback-content">
          <div className="feedback-intro">
            <p>We value your opinion! Please share your experience with us.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Overall Rating *</label>
              <div className="rating-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`star ${star <= (hoverRating || rating) ? 'active' : ''}`}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                ))}
                <span className="rating-text">
                  {rating > 0 && (
                    <>
                      {rating} star{rating > 1 ? 's' : ''} -
                      {rating === 1 && ' Poor'}
                      {rating === 2 && ' Fair'}
                      {rating === 3 && ' Good'}
                      {rating === 4 && ' Very Good'}
                      {rating === 5 && ' Excellent'}
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Name {!formData.anonymous && '*'}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required={!formData.anonymous}
                  disabled={formData.anonymous}
                />
              </div>
              <div className="form-group">
                <label>Email {!formData.anonymous && '*'}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required={!formData.anonymous}
                  disabled={formData.anonymous}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="anonymous"
                  checked={formData.anonymous}
                  onChange={handleInputChange}
                />
                Submit feedback anonymously
              </label>
            </div>

            <div className="form-group">
              <label>Feedback Type *</label>
              <select
                name="feedbackType"
                value={formData.feedbackType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select feedback type</option>
                <option value="product-quality">Product Quality</option>
                <option value="customer-service">Customer Service</option>
                <option value="website-experience">Website Experience</option>
                <option value="delivery-service">Delivery Service</option>
                <option value="pricing">Pricing</option>
                <option value="product-variety">Product Variety</option>
                <option value="suggestion">Suggestion</option>
                <option value="complaint">Complaint</option>
                <option value="compliment">Compliment</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Brief subject of your feedback"
                required
              />
            </div>

            <div className="form-group">
              <label>Your Feedback *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="4"
                placeholder="Please share your detailed feedback..."
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label>Suggestions for Improvement</label>
              <textarea
                name="suggestions"
                value={formData.suggestions}
                onChange={handleInputChange}
                rows="3"
                placeholder="Any suggestions on how we can improve?"
              ></textarea>
            </div>

            <div className="form-group">
              <label>Would you recommend us to others?</label>
              <select
                name="wouldRecommend"
                value={formData.wouldRecommend}
                onChange={handleInputChange}
              >
                <option value="">Select an option</option>
                <option value="definitely">Definitely Yes</option>
                <option value="probably">Probably Yes</option>
                <option value="maybe">Maybe</option>
                <option value="probably-not">Probably Not</option>
                <option value="definitely-not">Definitely Not</option>
              </select>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting || rating === 0}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>,
    document.body
  );
};

export default FloatingFeedback;