"use client";

import React, { useState } from 'react';
import { Building2, Award, ShieldCheck, TrendingUp, Sparkles, Send, CheckCircle } from 'lucide-react';
import './franchise.css';

export default function FranchisePage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    area: '',
    investment: '25-50',
    experience: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API Submission
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="franchise-container">
      {/* Hero Section */}
      <div className="franchise-hero">
        <div className="franchise-hero-content">
          <div className="franchise-badge">
            <Sparkles size={14} className="gold-icon" />
            <span>Sindureghari Franchise Program</span>
          </div>
          <h1>Partner with Nepal's Most Trusted Solid Wood Brand</h1>
          <p>
            Bring the timeless heritage of hand-carved royal Sisau, Teak, and Rosewood furniture to your city. 
            Join our growing network of premium showrooms across Nepal.
          </p>
        </div>
      </div>

      <div className="franchise-main-grid">
        {/* Left Side: Why Partner With Us */}
        <div className="franchise-info-panel">
          <h2>Why Partner with Sindureghari?</h2>
          <p className="panel-intro">
            We don't just sell furniture; we create lifelong relationships bonded with love and traditional craftsmanship.
          </p>

          <div className="bento-benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon-wrapper">
                <Award className="benefit-icon" />
              </div>
              <h3>100% Authentic Wood</h3>
              <p>Exclusive access to premium quality dried Sisau, Teak, and Rosewood products with absolute durability.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-wrapper">
                <TrendingUp className="benefit-icon" />
              </div>
              <h3>High Return on Investment</h3>
              <p>Enjoy premium margins, high cart values, and steady demand driven by our powerful brand identity in Nepal.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-wrapper">
                <Building2 className="benefit-icon" />
              </div>
              <h3>Showroom & 3D Design Support</h3>
              <p>Our expert interior designers will help plan your premium showroom layout, 3D renders, and storefront branding.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-wrapper">
                <ShieldCheck className="benefit-icon" />
              </div>
              <h3>Full Marketing Support</h3>
              <p>Benefit from our high-performance digital ads, website lead-routing to your local showroom, and catalog materials.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Application Form */}
        <div className="franchise-form-card">
          {success ? (
            <div className="franchise-success">
              <CheckCircle size={64} className="success-check-icon" />
              <h2>Application Submitted Successfully!</h2>
              <p>
                Thank you for your interest in the Sindureghari Furniture Franchise. Our Business Development 
                team will review your application and contact you within 24-48 business hours to discuss details.
              </p>
              <div className="success-details">
                <p><strong>Primary Contact:</strong> +977-9867332731</p>
                <p><strong>Email Support:</strong> business@sinduregharifurniture.shop</p>
              </div>
              <button onClick={() => setSuccess(false)} className="reset-btn">
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="franchise-form">
              <h3>Franchise Application Form</h3>
              <p className="form-subtitle">Fill in the details below, and our team will get in touch with you shortly.</p>
              
              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Ram Bahadur"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Contact Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 98XXXXXXXX"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. name@example.com"
                />
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="city">Proposed City/Location *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Pokhara, Lalitpur, etc."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="area">Available Showroom Space (Sq. Ft.) *</label>
                  <input
                    type="number"
                    id="area"
                    name="area"
                    required
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="e.g. 1500"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="investment">Investment Capacity (NPR) *</label>
                <select
                  id="investment"
                  name="investment"
                  value={formData.investment}
                  onChange={handleChange}
                >
                  <option value="15-25">NPR 15 Lakhs - 25 Lakhs</option>
                  <option value="25-50">NPR 25 Lakhs - 50 Lakhs</option>
                  <option value="50+">NPR 50 Lakhs +</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="experience">Prior Business/Furniture Experience (Optional)</label>
                <textarea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Briefly tell us about your current business or active operations..."
                  rows={2}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Any Additional Comments</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type any questions you have here..."
                  rows={2}
                />
              </div>

              <button type="submit" className="franchise-submit-btn" disabled={loading}>
                {loading ? (
                  <span>Sending Application...</span>
                ) : (
                  <>
                    <span>Submit Application</span>
                    <Send size={16} className="submit-icon" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
