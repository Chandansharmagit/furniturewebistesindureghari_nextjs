"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Copy, 
  Check, 
  ArrowRight,
  Truck, 
  ShieldCheck, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import './DiwaliOfferTemplates.css';

const DIWALI_TEMPLATES = [
  {
    id: 'living-set',
    title: 'Living Room Collection',
    desc: 'Solid teak 3+1+1 sofa set & handcrafted center table',
    price: 'Rs. 1,56,750',
    oldPrice: 'Rs. 1,65,000',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    href: '/products?category=sofa'
  },
  {
    id: 'dining-set',
    title: 'Royal Dining Suite',
    desc: '6-seater hand-carved solid sisau table & cushioned chairs',
    price: 'Rs. 1,18,750',
    oldPrice: 'Rs. 1,25,000',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800',
    href: '/products?category=dining'
  },
  {
    id: 'bedroom-set',
    title: 'Master Bedroom Suite',
    desc: 'King hydraulic storage bed, teak wardrobe & nightstands',
    price: 'Rs. 1,75,750',
    oldPrice: 'Rs. 1,85,000',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=800',
    href: '/products?category=bedroom'
  },
  {
    id: 'mandir-set',
    title: 'Solid Wood Pooja Mandir',
    desc: 'Artisanal teak prayer temple with traditional brass accents',
    price: 'Rs. 64,600',
    oldPrice: 'Rs. 68,000',
    image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&q=80&w=800',
    href: '/order-request'
  }
];

export default function DiwaliOfferTemplates() {
  const [copied, setCopied] = useState(false);
  const couponCode = 'DIWALI5';

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <section className="diwali-section" aria-label="Diwali Festival Offers">
      <div className="diwali-container">
        
        {/* Sleek, Compact Header */}
        <div className="diwali-head">
          <div className="diwali-head__text">
            <span className="diwali-kicker">
              <span className="diwali-diya">🪔</span> Shubh Deepawali Special
            </span>
            <h2 className="diwali-title">Festive Room Collections</h2>
            <p className="diwali-subtitle">
              Enjoy flat <strong>5% OFF</strong> on all solid wood furniture with code <strong className="code-highlight">DIWALI5</strong>.
            </p>
          </div>

          {/* Compact Inline Coupon Pill */}
          <div className="diwali-coupon-pill">
            <span className="diwali-coupon-label">Code:</span>
            <strong className="diwali-coupon-code">{couponCode}</strong>
            <button 
              type="button"
              onClick={handleCopy}
              className={`diwali-pill-btn ${copied ? 'copied' : ''}`}
              aria-label="Copy Diwali code"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* 4 Clean, Compact Product Cards */}
        <div className="diwali-grid">
          {DIWALI_TEMPLATES.map((item) => (
            <Link key={item.id} href={item.href} className="diwali-card">
              <div className="diwali-card__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={item.image} 
                  alt={item.title} 
                  loading="lazy" 
                  decoding="async" 
                  width="600" 
                  height="450" 
                />
                <span className="diwali-card__badge">5% OFF</span>
              </div>
              <div className="diwali-card__body">
                <h3 className="diwali-card__title">{item.title}</h3>
                <p className="diwali-card__desc">{item.desc}</p>
                <div className="diwali-card__footer">
                  <div className="diwali-card__price">
                    <strong>{item.price}</strong>
                    <s>{item.oldPrice}</s>
                  </div>
                  <span className="diwali-card__link">
                    Shop <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Minimal Guarantees Strip */}
        <div className="diwali-trust-bar">
          <div className="diwali-trust-item">
            <Truck size={17} />
            <span>Pre-Diwali Free Delivery</span>
          </div>
          <div className="diwali-trust-item">
            <ShieldCheck size={17} />
            <span>10-Year Solid Wood Warranty</span>
          </div>
          <div className="diwali-trust-item">
            <Sparkles size={17} />
            <span>Free Festive Polish Care</span>
          </div>
          <div className="diwali-trust-item">
            <PhoneCall size={17} />
            <a 
              href="https://wa.me/9779845427041?text=Hi%20Sindureghari,%20I%20have%20an%20inquiry%20about%20the%20Diwali%205%25%20offer." 
              target="_blank" 
              rel="noopener noreferrer"
              className="diwali-trust-link"
            >
              WhatsApp Consultation
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
