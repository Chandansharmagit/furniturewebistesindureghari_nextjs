import React from 'react';
import './EMIPromo.css';
import { FaPercent, FaRegClock, FaCalendarCheck, FaRegCreditCard, FaArrowRight } from 'react-icons/fa';

const EMIPromo = () => {
  return (
    <section className="luxury-emi-promo">
      <div className="promo-background-glow"></div>
      
      <div className="promo-container">
        {/* Left Grid: Attraction Content */}
        <div className="promo-left-content">
          <span className="promo-badge">✦ Smart Living Finance</span>
          <h2>Own Custom solid Wood Furniture Today. Pay Later at <span className="gold-highlight">0% Interest</span>.</h2>
          <p>
            Why wait to construct your dream bedroom or living space? Sindureghari Furniture has partnered with Nepal's premier banking institutions to offer instant, flexible EMI installments. 
          </p>

          {/* Special Bank Discount Indicators */}
          <div className="promo-perks-grid">
            <div className="perk-box">
              <span className="perk-icon">💳</span>
              <div className="perk-info">
                <h4>Nabil Bank 0% Downpayment</h4>
                <p>Order without paying any initial downpayment today.</p>
              </div>
            </div>

            <div className="perk-box">
              <span className="perk-icon">💰</span>
              <div className="perk-info">
                <h4>NIC Asia 10% instant Cashback</h4>
                <p>Reclaim up to Rs. 10,000 on purchase checkout.</p>
              </div>
            </div>
          </div>

          <div className="promo-cta-wrapper">
            <a href="/emi-plans" className="promo-cta-btn primary">
              Calculator Installment & Plans <FaArrowRight />
            </a>
            <a href="/category/living-room" className="promo-cta-btn secondary">
              Browse Catalogs
            </a>
          </div>
        </div>

        {/* Right Grid: Teaser Step Roadmap UI */}
        <div className="promo-right-roadmap">
          <h3>3-Step Quick Financing Roadmap</h3>
          
          <div className="promo-steps-timeline">
            <div className="promo-step-row">
              <div className="step-circle">1</div>
              <div className="step-content">
                <h4>Choose Furniture Set</h4>
                <p>Select ready-made products or plan a custom size set with our designer carpenters.</p>
              </div>
            </div>

            <div className="promo-step-row">
              <div className="step-circle">2</div>
              <div className="step-content">
                <h4>Choose Installment Terms</h4>
                <p>Select credit cards or financing programs from 3 to 24 months p.a. tenures.</p>
              </div>
            </div>

            <div className="promo-step-row">
              <div className="step-circle">3</div>
              <div className="step-content">
                <h4>Fast Sanctioning & Delivery</h4>
                <p>Complete fast approval procedures and enjoy free white-glove setup at home.</p>
              </div>
            </div>
          </div>

          {/* Small Trust Note */}
          <div className="promo-trust-footer">
            <span>🛡️ 100% Secure Processing</span>
            <span>⏱️ 2-Hour Approval Timeline</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EMIPromo;
