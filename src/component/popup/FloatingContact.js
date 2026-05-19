import React, { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FaPhone, FaTimes, FaPaperPlane, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { API_BASE_URL } from '../../config/api';
import './FloatingContact.css';

const FloatingContact = ({ isOpen, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Drag functionality state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 20, y: 200 }); // Default position shifted
  const popupRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    contactMethod: 'email',
    urgency: 'normal'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare data for backend API
      const submitData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
        priority: formData.urgency
      };

      // Submit to backend API
      const response = await fetch(`${API_BASE_URL}/api/customer-data/contact-forms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('Your message has been sent successfully! We will get back to you soon.');

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          contactMethod: 'email',
          urgency: 'normal'
        });
        onClose();
      } else {
        throw new Error(result.error || 'Failed to submit contact form');
      }

    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert(`Failed to send message: ${error.message}. Please try again.`);
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
    const maxX = window.innerWidth - (popupRef.current?.offsetWidth || 400);
    const maxY = window.innerHeight - (popupRef.current?.offsetHeight || 600);

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
      className={`floating-contact-container ${isMinimized ? 'minimized' : ''}`}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 20002
      }}
    >
      <div
        className="floating-contact-header"
        onMouseDown={handleMouseDown}
        style={{ userSelect: 'none' }}
      >
        <div className="header-left">
          <FaPhone />
          <span>Contact Us</span>
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
        <div className="floating-contact-content">
          <div className="contact-info">
            <div className="contact-item">
              <FaEnvelope />
              <span>info@sindureghari.com</span>
            </div>
            <div className="contact-item">
              <FaPhone />
              <span>+977-1-4567890</span>
            </div>
            <div className="contact-item">
              <FaMapMarkerAlt />
              <span>Kathmandu, Nepal</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="form-group">
                <label>Preferred Contact Method</label>
                <select
                  name="contactMethod"
                  value={formData.contactMethod}
                  onChange={handleInputChange}
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Subject *</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
              >
                <option value="">Select subject</option>
                <option value="general-inquiry">General Inquiry</option>
                <option value="product-question">Product Question</option>
                <option value="order-support">Order Support</option>
                <option value="delivery-inquiry">Delivery Inquiry</option>
                <option value="warranty-claim">Warranty Claim</option>
                <option value="complaint">Complaint</option>
                <option value="suggestion">Suggestion</option>
                <option value="partnership">Partnership</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="4"
                placeholder="Please describe your inquiry or message..."
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label>Priority Level</label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleInputChange}
              >
                <option value="low">Low Priority</option>
                <option value="normal">Normal</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Send Message
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

export default FloatingContact;