import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import './EMIPlansPage.css';

const banks = [
  {
    name: 'Nabil Bank',
    shortName: 'NABIL',
    cardType: 'Credit Card EMI',
    interestRates: { 3: 12.5, 6: 13, 9: 13.5, 12: 14, 18: 14.5, 24: 15 },
  },
  {
    name: 'Standard Chartered Bank',
    shortName: 'SCB',
    cardType: 'Credit Card EMI',
    interestRates: { 3: 12, 6: 12.75, 9: 13.25, 12: 13.75, 18: 14.25, 24: 14.75 },
  },
  {
    name: 'NIC Asia Bank',
    shortName: 'NICA',
    cardType: 'Card / Finance EMI',
    interestRates: { 3: 13, 6: 13.5, 9: 14, 12: 14.5, 18: 15, 24: 15.5 },
  },
  {
    name: 'Global IME Bank',
    shortName: 'GIME',
    cardType: 'Card EMI',
    interestRates: { 3: 12.75, 6: 13.25, 9: 13.75, 12: 14.25, 18: 14.75, 24: 15.25 },
  },
  {
    name: 'Himalayan Bank',
    shortName: 'HBL',
    cardType: 'Credit Card EMI',
    interestRates: { 3: 13, 6: 13.5, 9: 14, 12: 14.5, 18: 15, 24: 15.5 },
  },
  {
    name: 'Nepal SBI Bank',
    shortName: 'NSBI',
    cardType: 'Card EMI',
    interestRates: { 3: 13.25, 6: 13.75, 9: 14.25, 12: 14.75, 18: 15.25, 24: 15.75 },
  },
  {
    name: 'Kumari Bank',
    shortName: 'KBL',
    cardType: 'Finance EMI',
    interestRates: { 3: 13.25, 6: 13.75, 9: 14.25, 12: 14.75, 18: 15.25, 24: 15.75 },
  },
  {
    name: 'Siddhartha Bank',
    shortName: 'SBL',
    cardType: 'Card EMI',
    interestRates: { 3: 13, 6: 13.5, 9: 14, 12: 14.5, 18: 15, 24: 15.5 },
  },
];

const tenures = [3, 6, 9, 12, 18, 24];

const calculateEMI = (principal, annualRate, months) => {
  if (!principal || !annualRate || !months) return 0;
  const monthlyRate = annualRate / 100 / 12;
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
};

const EMIPlansModal = ({ isOpen, onClose, productPrice, formatPrice }) => {
  const [selectedBank, setSelectedBank] = useState('Nabil Bank');
  const [selectedTenure, setSelectedTenure] = useState(6);
  const [downPayment, setDownPayment] = useState(0);

  const selectedBankData = banks.find((bank) => bank.name === selectedBank) || banks[0];
  const maxDownPayment = Math.round((Number(productPrice) || 0) * 0.5);

  const emiDetails = useMemo(() => {
    const price = Number(productPrice) || 0;
    const principal = Math.max(0, price - downPayment);
    const interestRate = selectedBankData.interestRates[selectedTenure];
    const emi = calculateEMI(principal, interestRate, selectedTenure);
    const totalAmount = emi * selectedTenure + downPayment;
    const totalInterest = Math.max(0, emi * selectedTenure - principal);

    return {
      principal,
      interestRate,
      emi,
      totalInterest,
      totalAmount,
    };
  }, [downPayment, productPrice, selectedBankData, selectedTenure]);

  const handleProceed = () => {
    const message = `Hi Sindureghari Furniture, I want to proceed with this EMI plan:
Bank: ${selectedBank}
Tenure: ${selectedTenure} months
Product Price: NPR ${formatPrice(productPrice)}
Down Payment: NPR ${formatPrice(downPayment)}
Financed Amount: NPR ${formatPrice(emiDetails.principal)}
Monthly EMI: NPR ${formatPrice(emiDetails.emi)}
Interest Rate: ${emiDetails.interestRate}% p.a.
Total Payable: NPR ${formatPrice(emiDetails.totalAmount)}
Product Link: ${window.location.href}`;

    window.open(`https://wa.me/9779845427041?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (!isOpen) return null;

  if (!productPrice || !formatPrice) {
    return createPortal(
      <div className="emi-modal-overlay">
        <div className="emi-modal" role="dialog" aria-modal="true" aria-labelledby="emi-modal-title">
          <div className="emi-modal-header">
            <h2 id="emi-modal-title">EMI Plans</h2>
            <button className="emi-modal-close-btn" onClick={onClose} aria-label="Close EMI modal">x</button>
          </div>
          <div className="emi-modal-content">
            <p>Unable to load EMI plans. Please try again.</p>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="emi-modal-overlay">
      <div className="emi-modal" role="dialog" aria-modal="true" aria-labelledby="emi-modal-title">
        <div className="emi-modal-header">
          <div>
            <span className="emi-modal-kicker">Nepal Bank EMI</span>
            <h2 id="emi-modal-title">Choose Your EMI Plan</h2>
          </div>
          <button className="emi-modal-close-btn" onClick={onClose} aria-label="Close EMI modal">x</button>
        </div>

        <div className="emi-modal-content">
          <p className="emi-intro">
            Estimate EMI for <strong>NPR {formatPrice(productPrice)}</strong>. Final approval, processing charge, and exact rate depend on the selected bank.
          </p>

          <div className="emi-selection">
            <label className="emi-label">Select Nepal Bank</label>
            <div className="emi-banks-grid-modal">
              {banks.map((bank) => (
                <button
                  type="button"
                  key={bank.name}
                  className={`emi-bank-option ${selectedBank === bank.name ? 'selected' : ''}`}
                  onClick={() => setSelectedBank(bank.name)}
                  aria-pressed={selectedBank === bank.name}
                >
                  <span className="bank-logo">{bank.shortName}</span>
                  <span className="bank-details">
                    <span className="bank-name">{bank.name}</span>
                    <span className="bank-full-name">{bank.cardType}</span>
                    <span className="bank-rate">{bank.interestRates[selectedTenure]}% p.a. estimate</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="emi-selection">
            <label className="emi-label">Select Tenure</label>
            <div className="emi-tenure-buttons">
              {tenures.map((months) => (
                <button
                  type="button"
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

          <div className="emi-selection">
            <div className="emi-label-row">
              <label className="emi-label" htmlFor="down-payment-slider">Down Payment</label>
              <strong>NPR {formatPrice(downPayment)}</strong>
            </div>
            <input
              id="down-payment-slider"
              type="range"
              min="0"
              max={maxDownPayment}
              step="500"
              value={downPayment}
              onChange={(event) => setDownPayment(Number(event.target.value))}
              className="emi-downpayment-slider"
            />
            <div className="emi-downpayment-value">
              {productPrice ? ((downPayment / productPrice) * 100).toFixed(0) : 0}% of product price
            </div>
          </div>

          <div className="emi-summary-card">
            <div>
              <span>Monthly EMI</span>
              <strong>NPR {formatPrice(emiDetails.emi)}</strong>
            </div>
            <div>
              <span>Financed Amount</span>
              <strong>NPR {formatPrice(emiDetails.principal)}</strong>
            </div>
            <div>
              <span>Total Interest</span>
              <strong>NPR {formatPrice(emiDetails.totalInterest)}</strong>
            </div>
            <div>
              <span>Total Payable</span>
              <strong>NPR {formatPrice(emiDetails.totalAmount)}</strong>
            </div>
          </div>

          <p className="emi-note">*This is an estimate for planning. The bank may ask for citizenship, income proof, card eligibility, or additional verification.</p>
          <button className="emi-proceed-btn" onClick={handleProceed}>
            Proceed on WhatsApp
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EMIPlansModal;
