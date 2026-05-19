import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './EMIPlansPage.css';

const EMIPlansModal = ({ isOpen, onClose, productPrice, formatPrice }) => {
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedTenure, setSelectedTenure] = useState(3);
  const [downPayment, setDownPayment] = useState(0);
  const [error, setError] = useState('');
  const modalRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  // Center modal when opened
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const modal = modalRef.current;
      const x = Math.max(0, (window.innerWidth - modal.offsetWidth) / 2);
      const y = Math.max(0, (window.innerHeight - modal.offsetHeight) / 2);
      setPosition({ x, y });
    }
  }, [isOpen]);

  // Handle drag movement
  const onDrag = useCallback(
    (e) => {
      e.preventDefault();
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);
      if (clientX == null || clientY == null || !modalRef.current) return;

      const modal = modalRef.current;
      const maxX = Math.max(0, window.innerWidth - modal.offsetWidth);
      const maxY = Math.max(0, window.innerHeight - modal.offsetHeight);
      let newX = clientX - dragOffsetRef.current.x;
      let newY = clientY - dragOffsetRef.current.y;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
      setPosition({ x: newX, y: newY });
    },
    []
  );

  // End dragging
  const endDrag = useCallback(() => {
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', endDrag);
    window.removeEventListener('touchmove', onDrag);
    window.removeEventListener('touchend', endDrag);
  }, [onDrag]);

  // Start dragging
  const startDrag = (e) => {
    e.preventDefault();
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);
    if (clientX == null || clientY == null) return;

    dragOffsetRef.current = { x: clientX - position.x, y: clientY - position.y };
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchmove', onDrag, { passive: false });
    window.addEventListener('touchend', endDrag);
  };

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      endDrag();
    };
  }, [endDrag]);

  // Define Nepali banks with interest rates (annual rates in %)
  const banks = [
    {
      name: 'Nepal Investment Bank',
      shortName: 'NIBL',
      interestRates: { 3: 13.5, 6: 14, 9: 14.5, 12: 15, 18: 15.5, 24: 16 },
      logo: '🏦'
    },
    {
      name: 'Standard Chartered Bank',
      shortName: 'SCB',
      interestRates: { 3: 13, 6: 13.5, 9: 14, 12: 14.5, 18: 15, 24: 15.5 },
      logo: '🏛️'
    },
    {
      name: 'Nabil Bank',
      shortName: 'NABIL',
      interestRates: { 3: 14, 6: 14.5, 9: 15, 12: 15.5, 18: 16, 24: 16.5 },
      logo: '🏦'
    },
    {
      name: 'Nepal SBI Bank',
      shortName: 'NSBI',
      interestRates: { 3: 13.25, 6: 13.75, 9: 14.25, 12: 14.75, 18: 15.25, 24: 15.75 },
      logo: '🏛️'
    },
    {
      name: 'Himalayan Bank',
      shortName: 'HBL',
      interestRates: { 3: 13.75, 6: 14.25, 9: 14.75, 12: 15.25, 18: 15.75, 24: 16.25 },
      logo: '🏔️'
    },
    {
      name: 'NIC Asia Bank',
      shortName: 'NICA',
      interestRates: { 3: 13.5, 6: 14, 9: 14.5, 12: 15, 18: 15.5, 24: 16 },
      logo: '🏦'
    }
  ];

  const tenures = [3, 6, 9, 12, 18, 24];

  // Calculate EMI: EMI = [P * r * (1 + r)^n] / [(1 + r)^n - 1]
  const calculateEMI = (principal, annualRate, months) => {
    if (!principal || !annualRate || !months) return 0;
    const monthlyRate = annualRate / 100 / 12;
    const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, months);
    const denominator = Math.pow(1 + monthlyRate, months) - 1;
    return numerator / denominator;
  };

  // Calculate total interest paid over the tenure
  const calculateTotalInterest = (emi, months, principal) => {
    if (!emi || !months || !principal) return 0;
    return emi * months - principal;
  };

  // Validate down payment
  const validateDownPayment = (value) => {
    if (value < 0 || value > productPrice * 0.5) {
      setError('Down payment must be between 0% and 50% of the product price.');
      return false;
    }
    setError('');
    return true;
  };

  // Handle down payment change
  const handleDownPaymentChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    if (validateDownPayment(value)) {
      setDownPayment(value);
    }
  };

  // Calculate EMI details
  const getEMIDetails = () => {
    if (!selectedBank || !productPrice || !formatPrice) return null;
    const bank = banks.find((b) => b.name === selectedBank);
    if (!bank) return null;
    const interestRate = bank.interestRates[selectedTenure];
    const principal = productPrice - downPayment;
    const emi = calculateEMI(principal, interestRate, selectedTenure);
    const totalInterest = calculateTotalInterest(emi, selectedTenure, principal);
    const totalAmount = emi * selectedTenure + downPayment;
    return { emi, interestRate, totalInterest, totalAmount, principal };
  };

  // Handle proceed button
  const handleProceed = () => {
    const details = getEMIDetails();
    if (!details) {
      setError('Please select a bank and try again.');
      return;
    }
    console.log('Proceeding with EMI:', {
      bank: selectedBank,
      tenure: selectedTenure,
      downPayment: formatPrice(downPayment),
      principal: formatPrice(details.principal),
      monthlyEMI: formatPrice(details.emi),
      interestRate: details.interestRate,
      totalInterest: formatPrice(details.totalInterest),
      totalAmount: formatPrice(details.totalAmount),
    });
    alert('EMI plan selected! Contact us to proceed.');
  };

  if (!isOpen) return null;

  if (!productPrice || !formatPrice) {
    return createPortal(
      <div className="emi-modal-overlay">
        <div
          className="emi-modal"
          ref={modalRef}
          style={{ left: position.x, top: position.y }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="emi-modal-title"
        >
          <div
            className="emi-modal-header"
            onMouseDown={startDrag}
            onTouchStart={startDrag}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && startDrag(e)}
            aria-label="Drag to move modal"
          >
            <h2 id="emi-modal-title">Error</h2>
            <button
              className="emi-modal-close-btn"
              onClick={onClose}
              aria-label="Close EMI modal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18" />
                <path d="M6 6L18 18" />
              </svg>
            </button>
          </div>
          <div className="emi-modal-content">
            <p>Unable to load EMI plans. Please try again.</p>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  const emiDetails = getEMIDetails();

  return createPortal(
    <div className="emi-modal-overlay">
      <div
        className="emi-modal"
        ref={modalRef}
        style={{ left: position.x, top: position.y }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="emi-modal-title"
      >
        <div
          className="emi-modal-header"
          onMouseDown={startDrag}
          onTouchStart={startDrag}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && startDrag(e)}
          aria-label="Drag to move modal"
        >
          <h2 id="emi-modal-title">Customize Your EMI Plan</h2>
          <button
            className="emi-modal-close-btn"
            onClick={onClose}
            aria-label="Close EMI modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18" />
              <path d="M6 6L18 18" />
            </svg>
          </button>
        </div>
        <div className="emi-modal-content">
          <p>Customize EMI for ₹{formatPrice(productPrice)}:</p>
          {error && <p className="emi-error-message">{error}</p>}

          {/* Bank Selection */}
          <div className="emi-selection">
            <label className="emi-label" htmlFor="bank-select">
              Select Bank:
            </label>
            <select
              id="bank-select"
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="emi-select"
              aria-required="true"
            >
              <option value="">Choose a bank</option>
              {banks.map((bank) => (
                <option key={bank.name} value={bank.name}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tenure Selection */}
          <div className="emi-selection">
            <label className="emi-label">Select Tenure:</label>
            <div className="emi-tenure-buttons">
              {tenures.map((months) => (
                <button
                  key={months}
                  className={`emi-tenure-btn ${selectedTenure === months ? 'active' : ''}`}
                  onClick={() => setSelectedTenure(months)}
                  aria-pressed={selectedTenure === months}
                >
                  {months} Months
                </button>
              ))}
            </div>
          </div>

          {/* Down Payment */}
          <div className="emi-selection">
            <label className="emi-label" htmlFor="down-payment-slider">
              Down Payment (0% - 50%):
            </label>
            <input
              id="down-payment-slider"
              type="range"
              min="0"
              max={productPrice * 0.5}
              step="100"
              value={downPayment}
              onChange={handleDownPaymentChange}
              className="emi-downpayment-slider"
              aria-valuenow={downPayment}
              aria-valuemin={0}
              aria-valuemax={productPrice * 0.5}
              aria-label="Down payment slider"
            />
            <div className="emi-downpayment-value">
              ₹{formatPrice(downPayment)} ({((downPayment / productPrice) * 100).toFixed(0)}%)
            </div>
          </div>

          {/* EMI Details Table */}
          {emiDetails && (
            <table className="emi-plans-table" aria-label="EMI plan details">
              <thead>
                <tr>
                  <th scope="col">Principal</th>
                  <th scope="col">Monthly EMI</th>
                  <th scope="col">Interest Rate</th>
                  <th scope="col">Total Interest</th>
                  <th scope="col">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="emi-table-row">
                  <td>₹{formatPrice(emiDetails.principal)}</td>
                  <td>₹{formatPrice(emiDetails.emi)}</td>
                  <td>{emiDetails.interestRate}% p.a.</td>
                  <td>₹{formatPrice(emiDetails.totalInterest)}</td>
                  <td>₹{formatPrice(emiDetails.totalAmount)}</td>
                </tr>
              </tbody>
            </table>
          )}

          <p className="emi-note">*Contact us to proceed with your selected EMI plan.</p>
          <button
            className="emi-proceed-btn"
            onClick={handleProceed}
            disabled={!selectedBank}
            aria-disabled={!selectedBank}
          >
            Proceed with EMI
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EMIPlansModal;