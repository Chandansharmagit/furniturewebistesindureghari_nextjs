import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaTimes, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './GuestLeadModal.css';

const GuestLeadModal = ({ isOpen, onClose, onConfirm, product }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Required';
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/[\s-+()]/g, ''))) {
      newErrors.phone = 'Invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onConfirm(formData);
    }
  };

  const handleCancel = () => {
    onClose();
    const productId = product?._id || product?.id;
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  return (
    <div className="guest-modal-overlay">
      <div className="guest-modal-content white-theme">
        <button className="guest-modal-close" onClick={handleCancel}>
          <FaTimes />
        </button>
        
        <div className="guest-modal-header">
          <div className="guest-modal-icon">
            <FaShoppingCart />
          </div>
          <h2>Quick Checkout Setup</h2>
          <p>Please provide your contact details to continue with <strong>{product?.title || 'your selection'}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="guest-modal-form">
          <div className="form-row-sidebar">
            <div className="guest-input-group">
              <label><FaEnvelope /> Email</label>
              <input 
                type="email" 
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="guest-input-group">
              <label><FaPhone /> Phone</label>
              <input 
                type="tel" 
                placeholder="98XXXXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
          </div>

          <div className="guest-modal-footer">
            <p className="guest-privacy-note">
              We'll use this to keep your cart saved across devices.
            </p>
            <button type="submit" className="guest-confirm-btn">
              Add to Cart & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuestLeadModal;
