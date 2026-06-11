"use client";

import React, { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import './change-password.css';

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Password Validation Checks
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasUpper = /[A-Z]/.test(newPassword);
  const isMatched = newPassword && newPassword === confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!currentPassword) {
      setError('Please enter your current password.');
      return;
    }

    if (!hasMinLength || !hasNumber || !hasUpper) {
      setError('New password does not meet all security guidelines.');
      return;
    }

    if (!isMatched) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);

    // Mock API call to simulate password change update
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  return (
    <div className="change-password-split-container">
      {/* Left Sidebar Image Pane */}
      <div className="password-sidebar-pane" style={{ backgroundImage: 'url("/assets/aurelian-hero.png")' }}>
        <div className="sidebar-overlay">
          <div className="sidebar-branding">
            <span className="sidebar-pre-title">Sindureghari Furniture</span>
            <h2 className="serif">Securing Your Sanctuary</h2>
            <p>Every key, every wooden details, crafted with absolute devotion and timeless elegance.</p>
          </div>
          <div className="sidebar-footer">
            <p>&copy; {new Date().getFullYear()} Sindureghari Furniture Pvt. Ltd. | Traditional... bonded with love</p>
          </div>
        </div>
      </div>

      {/* Right Content Form Pane */}
      <div className="password-content-pane">
        <div className="back-nav-container">
          <a href="/" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </a>
        </div>

        <div className="password-card-wrapper">
          {!success ? (
            <form onSubmit={handleSubmit} className="password-form-card">
              <div className="card-header">
                <div className="lock-icon-badge">
                  <KeyRound size={24} className="gold-icon" />
                </div>
                <h1 className="serif">Update Your Password</h1>
                <p>Ensure your account remains safe with a strong, custom security key.</p>
              </div>

              {error && <div className="form-error-banner">{error}</div>}

              <div className="form-group-wrapper">
                {/* Current Password */}
                <div className="form-group relative">
                  <label>Current Password</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-left-icon" />
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowCurrent(!showCurrent)}
                    >
                      {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="form-group relative">
                  <label>New Password</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-left-icon" />
                    <input
                      type={showNew ? 'text' : 'password'}
                      placeholder="Enter new strong password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowNew(!showNew)}
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="form-group relative">
                  <label>Confirm New Password</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-left-icon" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Checklist Requirements */}
              <div className="password-strength-checker">
                <h4>Password Guidelines</h4>
                <ul>
                  <li className={hasMinLength ? 'met' : ''}>
                    <CheckCircle2 size={14} />
                    <span>At least 8 characters long</span>
                  </li>
                  <li className={hasUpper ? 'met' : ''}>
                    <CheckCircle2 size={14} />
                    <span>Contains an uppercase letter (A-Z)</span>
                  </li>
                  <li className={hasNumber ? 'met' : ''}>
                    <CheckCircle2 size={14} />
                    <span>Contains a numeric digit (0-9)</span>
                  </li>
                  <li className={isMatched ? 'met' : ''}>
                    <CheckCircle2 size={14} />
                    <span>Passwords match exactly</span>
                  </li>
                </ul>
              </div>

              <button type="submit" className="submit-password-btn" disabled={loading}>
                {loading ? (
                  <span className="spinner"></span>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>Confirm Changes</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="password-success-card">
              <div className="success-check-badge">
                <ShieldCheck size={48} className="gold-icon animation-pulse" />
              </div>
              <h2 className="serif">Security Key Updated</h2>
              <p>
                Your password has been securely updated. You can now use your new password to log in next time.
              </p>
              <div className="success-footer">
                <a href="/" className="continue-btn">
                  Continue to Homepage
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
