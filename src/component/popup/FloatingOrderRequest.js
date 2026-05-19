import React, { useState, useRef, useCallback } from 'react';
// import { createPortal } from 'react-dom';
import { FaTimes, FaShoppingCart, FaUpload, FaTrash, FaPaperPlane } from 'react-icons/fa';
import './FloatingOrderRequest.css';

const FloatingOrderRequest = ({ isOpen, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Drag functionality state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 20, y: 100 }); // Default position shifted
  const popupRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    furnitureType: '',
    description: '',
    budget: '',
    timeline: '',
    dimensions: '',
    material: '',
    color: '',
    style: '',
    location: '',
    urgency: 'normal'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      alert('You can upload maximum 3 images');
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert('Each image must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          file: file,
          preview: e.target.result,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();

      // Add form fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      // Add images
      images.forEach((image, index) => {
        submitData.append(`image_${index}`, image.file);
      });

      // Add timestamp and status
      submitData.append('timestamp', new Date().toISOString());
      submitData.append('status', 'pending');

      // Here you would typically send to your backend API
      console.log('Order request submitted:', formData, images);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert('Your order request has been submitted successfully! We will contact you soon.');

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        furnitureType: '',
        description: '',
        budget: '',
        timeline: '',
        dimensions: '',
        material: '',
        color: '',
        style: '',
        location: '',
        urgency: 'normal'
      });
      setImages([]);
      setCurrentStep(1);
      onClose();

    } catch (error) {
      console.error('Error submitting order request:', error);
      alert('Failed to submit order request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3>Personal Information</h3>
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
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter your location/address"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3>Product Details</h3>
            <div className="form-group">
              <label>Furniture Type *</label>
              <select
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
                <option value="dining-set">Dining Set</option>
                <option value="office-furniture">Office Furniture</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description & Requirements *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Describe your requirements in detail..."
                required
              ></textarea>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Dimensions</label>
                <input
                  type="text"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleInputChange}
                  placeholder="L x W x H (in feet/inches)"
                />
              </div>
              <div className="form-group">
                <label>Material Preference</label>
                <select
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                >
                  <option value="">Select material</option>
                  <option value="wood">Wood</option>
                  <option value="metal">Metal</option>
                  <option value="fabric">Fabric</option>
                  <option value="leather">Leather</option>
                  <option value="glass">Glass</option>
                  <option value="mixed">Mixed Materials</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Color Preference</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="Preferred colors"
                />
              </div>
              <div className="form-group">
                <label>Style</label>
                <select
                  name="style"
                  value={formData.style}
                  onChange={handleInputChange}
                >
                  <option value="">Select style</option>
                  <option value="modern">Modern</option>
                  <option value="traditional">Traditional</option>
                  <option value="contemporary">Contemporary</option>
                  <option value="vintage">Vintage</option>
                  <option value="minimalist">Minimalist</option>
                  <option value="rustic">Rustic</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3>Budget & Timeline</h3>
            <div className="form-group">
              <label>Budget Range</label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
              >
                <option value="">Select budget range</option>
                <option value="under-25000">Under ₹25,000</option>
                <option value="25000-50000">₹25,000 - ₹50,000</option>
                <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                <option value="100000-200000">₹1,00,000 - ₹2,00,000</option>
                <option value="200000-500000">₹2,00,000 - ₹5,00,000</option>
                <option value="above-500000">Above ₹5,00,000</option>
              </select>
            </div>
            <div className="form-group">
              <label>Expected Timeline</label>
              <select
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
            <div className="form-group">
              <label>Urgency Level</label>
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

            {/* Image Upload Section */}
            <div className="form-group">
              <label>Reference Images (Optional - Max 3)</label>
              <div className="image-upload-area">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={images.length >= 3}
                >
                  <FaUpload /> Upload Images ({images.length}/3)
                </button>

                {images.length > 0 && (
                  <div className="image-preview-grid">
                    {images.map((image) => (
                      <div key={image.id} className="image-preview">
                        <img src={image.preview} alt={image.name} />
                        <button
                          type="button"
                          className="remove-image"
                          onClick={() => removeImage(image.id)}
                        >
                          <FaTrash />
                        </button>
                        <span className="image-name">{image.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={popupRef}
      className={`floating-order-container ${isMinimized ? 'minimized' : ''}`}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 20002
      }}
    >
      <div
        className="floating-order-header"
        onMouseDown={handleMouseDown}
        style={{ userSelect: 'none' }}
      >
        <div className="header-left">
          <FaShoppingCart />
          <span>Custom Order Request</span>
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
        <div className="floating-order-content">
          <div className="step-indicator">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
          </div>

          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            <div className="form-actions">
              {currentStep > 1 && (
                <button type="button" className="prev-btn" onClick={prevStep}>
                  Previous
                </button>
              )}

              {currentStep < 3 ? (
                <button type="button" className="next-btn" onClick={nextStep}>
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Submit Request
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FloatingOrderRequest;