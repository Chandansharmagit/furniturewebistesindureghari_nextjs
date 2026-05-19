import React, { useState } from 'react';
import './CustomerFurnitureRequest.css';
import { API_BASE_URL } from '../../config/api';

const CustomerFurnitureRequest = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    furnitureType: '',
    description: '',
    budget: '',
    timeline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        phone: formData.phone,
        furniture_type: formData.furnitureType,
        description: formData.description,
        budget: formData.budget || null,
        timeline: formData.timeline || null,
        priority: 'medium'
      };

      // Submit to backend API
      const response = await fetch(`${API_BASE_URL}/api/customer-data/order-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('Your furniture request has been submitted successfully!');
        onClose();
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          furnitureType: '',
          description: '',
          budget: '',
          timeline: ''
        });
      } else {
        throw new Error(result.error || 'Failed to submit furniture request');
      }
    } catch (error) {
      console.error('Error submitting furniture request:', error);
      alert(`Failed to submit request: ${error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>Request Custom Furniture</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="furniture-request-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
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
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="furnitureType">Furniture Type *</label>
              <select
                id="furnitureType"
                name="furnitureType"
                value={formData.furnitureType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select furniture type</option>
                <option value="sofa">Sofa</option>
                <option value="chair">Chair</option>
                <option value="table">Table</option>
                <option value="bed">Bed</option>
                <option value="wardrobe">Wardrobe</option>
                <option value="cabinet">Cabinet</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description & Requirements *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Please describe your furniture requirements, dimensions, materials, style preferences, etc."
              required
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="budget">Budget Range</label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
              >
                <option value="">Select budget range</option>
                <option value="under-50000">Under ₹50,000</option>
                <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                <option value="100000-200000">₹1,00,000 - ₹2,00,000</option>
                <option value="200000-500000">₹2,00,000 - ₹5,00,000</option>
                <option value="above-500000">Above ₹5,00,000</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="timeline">Expected Timeline</label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
              >
                <option value="">Select timeline</option>
                <option value="1-2-weeks">1-2 weeks</option>
                <option value="3-4-weeks">3-4 weeks</option>
                <option value="1-2-months">1-2 months</option>
                <option value="3-6-months">3-6 months</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerFurnitureRequest;