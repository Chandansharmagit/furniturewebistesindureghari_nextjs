import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  type = 'modern', 
  message = 'Loading...', 
  showMessage = true,
  color = 'primary'
}) => {
  const getSpinnerClass = () => {
    return `ls-loading-spinner ls-${size} ls-${type} ls-${color}`;
  };

  const renderModernSpinner = () => (
    <div className="ls-modern-spinner">
      <div className="ls-spinner-ring">
        <div className="ls-ring-segment"></div>
        <div className="ls-ring-segment"></div>
        <div className="ls-ring-segment"></div>
        <div className="ls-ring-segment"></div>
      </div>
      <div className="ls-spinner-dots">
        <div className="ls-dot"></div>
        <div className="ls-dot"></div>
        <div className="ls-dot"></div>
      </div>
    </div>
  );

  const renderPulseSpinner = () => (
    <div className="ls-pulse-spinner">
      <div className="ls-pulse-circle ls-pulse-1"></div>
      <div className="ls-pulse-circle ls-pulse-2"></div>
      <div className="ls-pulse-circle ls-pulse-3"></div>
    </div>
  );

  const renderWaveSpinner = () => (
    <div className="ls-wave-spinner">
      <div className="ls-wave-bar"></div>
      <div className="ls-wave-bar"></div>
      <div className="ls-wave-bar"></div>
      <div className="ls-wave-bar"></div>
      <div className="ls-wave-bar"></div>
    </div>
  );

  const renderSpinner = () => {
    switch (type) {
      case 'pulse':
        return renderPulseSpinner();
      case 'wave':
        return renderWaveSpinner();
      case 'modern':
      default:
        return renderModernSpinner();
    }
  };

  return (
    <div className={getSpinnerClass()}>
      <div className="ls-spinner-container">
        {renderSpinner()}
        {showMessage && (
          <div className="ls-loading-message">
            <span className="ls-message-text">{message}</span>
            <div className="ls-message-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;