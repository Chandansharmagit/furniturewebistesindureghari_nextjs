import React, { useState } from 'react';
import { API_BASE_URL } from '../../config/api';
import './FeedbackPopup.css';

const FeedbackPopup = ({ isOpen, onClose, productId = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    comment: '',
    productId: productId
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating: rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Prepare data for backend API
      const submitData = {
        name: formData.name,
        email: formData.email,
        rating: formData.rating,
        message: formData.comment,
        feedback_type: 'general',
        product_id: formData.productId || null
      };

      // Submit to backend API
      const response = await fetch(`${API_BASE_URL}/api/customer-data/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitMessage('Thank you for your feedback!');
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            rating: 0,
            comment: '',
            productId: productId
          });
          setSubmitMessage('');
          onClose();
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitMessage(`Error submitting feedback: ${error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`star ${formData.rating >= star ? 'filled' : ''}`}
        onClick={() => handleRatingClick(star)}
      >
        ★
      </span>
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="feedback-popup-overlay" onClick={onClose}>
      <div className="feedback-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        
        <div className="feedback-header">
          <h2>Share Your Feedback</h2>
          <p>We value your opinion and would love to hear from you!</p>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email address"
            />
          </div>

          <div className="form-group">
            <label>Rating *</label>
            <div className="star-rating">
              {renderStars()}
            </div>
            <small>Click to rate your experience</small>
          </div>

          <div className="form-group">
            <label htmlFor="comment">Comments</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              placeholder="Share your thoughts, suggestions, or experiences..."
              rows="4"
            />
          </div>

          {submitMessage && (
            <div className={`submit-message ${submitMessage.includes('Error') ? 'error' : 'success'}`}>
              {submitMessage}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-btn"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting || !formData.name || !formData.email || formData.rating === 0}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPopup;