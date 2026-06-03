import React from 'react';
import { BadgeCheck, Crown, Gift, Sparkles, TicketPercent, UserRound } from 'lucide-react';
import './LoyaltySchemeShowcase.css';

const tiers = [
  {
    icon: UserRound,
    label: 'Registered',
    title: 'Start Your Interior Journey',
    copy: 'Create an account, save favourites, and begin building your purchase history.',
    meta: 'First-order offers',
    className: 'registered'
  },
  {
    icon: BadgeCheck,
    label: 'Regular',
    title: 'Earn Better Offers',
    copy: 'Customers with active purchases receive smarter offers based on their buying pattern.',
    meta: 'Personalized deals',
    className: 'regular'
  },
  {
    icon: Crown,
    label: 'VIP',
    title: 'Unlock 40% Loyalty Reward',
    copy: 'Spend Rs. 2,00,000 or more and receive a unique one-time loyalty coupon by email.',
    meta: 'Rs. 2L+ spend',
    className: 'vip'
  }
];

export default function LoyaltySchemeShowcase() {
  return (
    <section className="loyalty-scheme-section" aria-labelledby="loyalty-scheme-title">
      <div className="loyalty-scheme-inner">
        <div className="loyalty-scheme-copy">
          <span className="loyalty-eyebrow">
            <Sparkles size={15} />
            Sindureghari Rewards
          </span>
          <h2 id="loyalty-scheme-title">A smarter loyalty scheme for beautiful homes.</h2>
          <p>
            Your status grows with every purchase. VIP customers receive a private 40% coupon
            that is linked to their account and cannot be shared.
          </p>
          <div className="loyalty-proof-row">
            <span><TicketPercent size={16} /> Unique coupon code</span>
            <span><Gift size={16} /> One-time use</span>
            <span><Crown size={16} /> VIP after Rs. 2L spend</span>
          </div>
        </div>

        <div className="loyalty-coupon-preview">
          <div className="loyalty-coupon-top">
            <span>VIP Reward</span>
            <Crown size={22} />
          </div>
          <strong>40%</strong>
          <p>Private loyalty discount</p>
          <em>LOYALTY-YOURNAME-8F92KQ</em>
        </div>

        <div className="loyalty-tier-grid">
          {tiers.map(({ icon: Icon, label, title, copy, meta, className }) => (
            <article className={`loyalty-tier-card ${className}`} key={label}>
              <div className="loyalty-tier-icon">
                <Icon size={20} />
              </div>
              <div>
                <span>{label}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <small>{meta}</small>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
