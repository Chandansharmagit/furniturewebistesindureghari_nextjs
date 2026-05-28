"use client";

import React, { useState, useMemo } from 'react';
import './emi-plans.css';
import { 
  FaPercent, FaCheckCircle, FaUserShield, FaCreditCard, 
  FaCalendarAlt, FaChevronDown, FaBuilding, FaHandshake, 
  FaClipboardCheck, FaShippingFast, FaCalculator, FaPhone, FaTags
} from 'react-icons/fa';

export default function EMIPlansPage({ initialPrice = 120000, initialProduct = null }) {
  const [productPrice, setProductPrice] = useState(initialPrice);
  const [selectedBank, setSelectedBank] = useState('NABIL');
  const [selectedTenure, setSelectedTenure] = useState(12);
  const [downPaymentRate, setDownPaymentRate] = useState(10); // in %
  const [activeFaq, setActiveFaq] = useState(null);

  // Bank partnership details & custom merchant discounts
  const banks = useMemo(() => [
    {
      id: 'NABIL',
      name: 'Nabil Bank',
      logo: '🏦',
      annualRate: 12.5,
      discountPerk: '0% Downpayment Option Available',
      processingFee: 'Rs. 0 Processing Fees'
    },
    {
      id: 'SCB',
      name: 'Standard Chartered',
      logo: '🏛️',
      annualRate: 11.9,
      discountPerk: '10% Cashback up to Rs. 15,000',
      processingFee: 'Rs. 500 processing rebate'
    },
    {
      id: 'NICA',
      name: 'NIC Asia Bank',
      logo: '🏦',
      annualRate: 12.9,
      discountPerk: 'NIC Super Chamatkari Cashback',
      processingFee: '0% processing fee'
    },
    {
      id: 'HBL',
      name: 'Himalayan Bank',
      logo: '🏔️',
      annualRate: 13.0,
      discountPerk: 'Free 1-year product warranty coverage',
      processingFee: 'Rs. 1,000 woodcraft voucher'
    },
    {
      id: 'NIBL',
      name: 'Nepal Investment Bank',
      logo: '🏛️',
      annualRate: 12.2,
      discountPerk: 'No collateral required',
      processingFee: '100% paperless approval'
    }
  ], []);

  const tenures = [3, 6, 9, 12, 18, 24];

  // Exclusive merchants discounts data to display in sidebar
  const discounts = [
    {
      icon: <FaPercent />,
      title: "0% Interest EMI Scheme",
      desc: "Available on Nabil and Standard Chartered credit cards for orders above Rs. 1,50,000 on selected premium sofas."
    },
    {
      icon: <FaTags />,
      title: "Instant 10% Cashbacks",
      desc: "Pay down payment using NIC Asia credit cards or eSewa to claim an instant 10% markdown up to Rs. 10,000."
    },
    {
      icon: <FaUserShield />,
      title: "Complimentary Upholstery Polish",
      desc: "All EMI setups with tenure above 12 months qualify for a free 2-year maintenance package worth Rs. 5,000."
    }
  ];

  // Steps Roadmap details
  const roadmapSteps = [
    {
      num: "01",
      icon: <FaCalculator />,
      title: "Select & Estimate",
      desc: "Choose your favorite luxury furniture in our showroom or website, and estimate your monthly EMI via our slider calculator."
    },
    {
      num: "02",
      icon: <FaBuilding />,
      title: "Choose Partner Bank",
      desc: "Select a partner bank. We support Credit Cards from five of Nepal's leading financial networks for instant approvals."
    },
    {
      num: "03",
      icon: <FaClipboardCheck />,
      title: "Quick Documentation",
      desc: "Provide basic identity papers (Citizenship copy, salary slip/bank statement) to our financing desk in-store or online."
    },
    {
      num: "04",
      icon: <FaShippingFast />,
      title: "Fabrication & Delivery",
      desc: "Upon loan clearance, our master carpenters fabricate your custom set and ship it with free white-glove assembly."
    }
  ];

  // FAQ contents
  const faqs = [
    {
      q: "What documents are required to apply for the EMI plan?",
      a: "Standard requirements include: a photocopy of your Nepalese Citizenship or Passport, two passport-sized photographs, your last 3 months salary bank statement, and a formal recommendation letter from your employer showing salary details."
    },
    {
      q: "Can I apply for EMI without a Credit Card?",
      a: "Yes! While Credit Card holders get instant 0% processing approvals, non-card holders can apply using our financing partner schemes by submitting standard bank post-dated checks and salary proof verification."
    },
    {
      q: "Is there a prepayment charge if I pay off the EMI early?",
      a: "For credit-card based EMIs, there are zero prepayment charges! For general financing partnerships, minor foreclosure charges (up to 1%) may be applied by the respective banking partners."
    },
    {
      q: "What is the minimum purchase value to qualify for EMI?",
      a: "The minimum purchase value to avail our premium EMI plans is Rs. 30,000. You can bundle multiple items (e.g. bed + bedside table + lounge chair) to cross the threshold."
    }
  ];

  // Compute values
  const currentBank = useMemo(() => {
    return banks.find(b => b.id === selectedBank) || banks[0];
  }, [selectedBank, banks]);

  const calculations = useMemo(() => {
    const downPayment = (productPrice * downPaymentRate) / 100;
    const principal = productPrice - downPayment;
    
    // EMI Formula: EMI = [P * r * (1 + r)^n] / [(1 + r)^n - 1]
    const annualRate = currentBank.annualRate;
    const monthlyRate = (annualRate / 100) / 12;
    
    let emi = 0;
    if (monthlyRate === 0) {
      emi = principal / selectedTenure;
    } else {
      emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, selectedTenure)) / 
            (Math.pow(1 + monthlyRate, selectedTenure) - 1);
    }
    
    const totalAmount = emi * selectedTenure + downPayment;
    const totalInterest = emi * selectedTenure - principal;
    
    return {
      downPayment,
      principal,
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest)
    };
  }, [productPrice, downPaymentRate, selectedTenure, currentBank]);

  // Format currency
  const formatNPR = (num) => {
    return "Rs. " + num.toLocaleString('en-NP');
  };

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="emi-page-container">
      {/* Luxury Hero Banner */}
      <header className="emi-hero">
        <div className="emi-hero-content">
          <span className="emi-badge">Flexible Finance</span>
          <h1>Luxury Furniture Made Affordable</h1>
          <p>
            Experience premium Nepalese woodcraft today and pay in easy monthly installments. Explore tailored EMI structures, zero-percent interest offers, and exclusive partner bank discounts.
          </p>
        </div>
      </header>

      {/* Main Two-Column Interactive Grid */}
      <main className="emi-grid-container">
        {/* Left Column: EMI Calculator */}
        <section className="emi-calc-card">
          <h2>EMI Installment Estimator</h2>
          
          {/* Price Range Slider */}
          <div className="emi-form-group">
            <div className="emi-form-label">
              <span>Select Furniture Budget</span>
              <span className="value">{formatNPR(productPrice)}</span>
            </div>
            <input 
              type="range" 
              min="30000" 
              max="500000" 
              step="5000" 
              value={productPrice}
              onChange={(e) => setProductPrice(parseInt(e.target.value))}
              className="emi-slider"
            />
          </div>

          {/* Down Payment Slider */}
          <div className="emi-form-group">
            <div className="emi-form-label">
              <span>Down Payment Percent</span>
              <span className="value">{downPaymentRate}% ({formatNPR(calculations.downPayment)})</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="50" 
              step="5" 
              value={downPaymentRate}
              onChange={(e) => setDownPaymentRate(parseInt(e.target.value))}
              className="emi-slider"
            />
          </div>

          {/* Partner Bank Select */}
          <div className="emi-form-group">
            <div className="emi-form-label">
              <span>Select Financing Partner</span>
              <span className="value" style={{ textTransform: 'none' }}>Interest Rate: {currentBank.annualRate}% p.a.</span>
            </div>
            <div className="emi-bank-select-grid">
              {banks.map((bank) => (
                <button 
                  key={bank.id}
                  className={`bank-option-btn ${selectedBank === bank.id ? 'active' : ''}`}
                  onClick={() => setSelectedBank(bank.id)}
                >
                  <span className="bank-logo">{bank.logo}</span>
                  <span>{bank.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tenure Buttons */}
          <div className="emi-form-group" style={{ marginBottom: '10px' }}>
            <div className="emi-form-label">
              <span>Choose Payment Tenure</span>
              <span className="value">{selectedTenure} Months</span>
            </div>
            <div className="emi-tenures-grid">
              {tenures.map((months) => (
                <button 
                  key={months}
                  className={`tenure-option-btn ${selectedTenure === months ? 'active' : ''}`}
                  onClick={() => setSelectedTenure(months)}
                >
                  {months} Mo
                </button>
              ))}
            </div>
          </div>

          {/* Calculator Output Displays */}
          <div className="emi-results-banner">
            <div className="emi-result-block">
              <div className="emi-result-label">Monthly EMI Payment</div>
              <div className="emi-result-value">{formatNPR(calculations.emi)}</div>
            </div>
            <div className="emi-result-block" style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)', paddingLeft: '20px' }}>
              <div className="emi-result-label">Active Bank Discount</div>
              <div className="emi-result-value" style={{ fontSize: '1.25rem', color: '#ffffff', fontWeight: '600', marginTop: '6px' }}>
                {currentBank.discountPerk}
              </div>
            </div>
            <div className="emi-secondary-results">
              <span>Down Payment: <strong>{formatNPR(calculations.downPayment)}</strong></span>
              <span>Total Interest Paid: <strong>{formatNPR(calculations.totalInterest)}</strong></span>
              <span>Total Outflow: <strong>{formatNPR(calculations.totalAmount)}</strong></span>
            </div>
          </div>
        </section>

        {/* Right Column: Partners & Sidebar Discounts */}
        <section className="emi-sidebar-section">
          {/* Active Discounts Widget */}
          <div className="emi-sidebar-widget">
            <h3>Exclusive Customer Discounts</h3>
            <div className="discount-list">
              {discounts.map((disc, idx) => (
                <div key={idx} className="discount-item">
                  <div className="discount-icon">{disc.icon}</div>
                  <div className="discount-details">
                    <h4>{disc.title}</h4>
                    <p>{disc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Partner Perks Card */}
          <div className="emi-sidebar-widget" style={{ borderLeft: '3px solid var(--aether-primary)' }}>
            <h3>Financing Perks</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>
                <FaCheckCircle style={{ color: 'var(--aether-accent)', flexShrink: 0 }} />
                <span>100% paperless bank application processing.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>
                <FaCheckCircle style={{ color: 'var(--aether-accent)', flexShrink: 0 }} />
                <span>0% Downpayment eligibility on select cards.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>
                <FaCheckCircle style={{ color: 'var(--aether-accent)', flexShrink: 0 }} />
                <span>Fast in-showroom sanctioning within 2 hours.</span>
              </li>
            </ul>
          </div>
        </section>
      </main>

      {/* Step-by-Step Purchase Roadmap UI */}
      <section className="roadmap-container">
        <div className="roadmap-header">
          <h2>Your Path to Royal Living</h2>
          <p>availing solid wood furniture on installments is simpler than ever. Follow our financing pathway:</p>
        </div>
        <div className="roadmap-steps-grid">
          {roadmapSteps.map((step, idx) => (
            <div key={idx} className="roadmap-step-card">
              <div className="roadmap-step-num">{step.num}</div>
              <div className="roadmap-step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Accordion FAQs Section */}
      <section className="faq-section">
        <div className="faq-header">
          <h2>Installment Eligibility FAQs</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`faq-item ${activeFaq === idx ? 'active' : ''}`}
            >
              <button className="faq-question" onClick={() => toggleFaq(idx)}>
                {faq.q}
                <span className="faq-icon"><FaChevronDown /></span>
              </button>
              <div className="faq-answer">
                <p style={{ margin: 0 }}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Block */}
      <section className="faq-section" style={{ padding: '0 20px' }}>
        <div className="emi-cta-box">
          <h3>Apply for Your Custom Installment Today</h3>
          <p>
            Ready to design your customized royal furniture set? Talk to our finance advisors directly to verify your eligibility and claim card-specific merchant discounts.
          </p>
          <div className="emi-cta-buttons">
            <a 
              href="tel:+977-9867332731" 
              className="action-btn primary-btn"
              style={{ display: 'inline-flex', padding: '12px 24px', textDecoration: 'none' }}
            >
              <FaPhone style={{ marginRight: '8px', marginTop: '2px' }} /> Call Finance Advisor
            </a>
            <a 
              href="/contact" 
              className="action-btn"
              style={{ display: 'inline-flex', padding: '12px 24px', textDecoration: 'none' }}
            >
              Visit Our Showroom
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
