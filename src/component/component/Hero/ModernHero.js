import React from 'react';
import './ModernHero.css';

const heroCollections = [
  {
    label: 'Royal Sofas',
    title: 'Carved solid wood seating',
    price: 'From Rs 45,999',
    href: '/sofas',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=82&w=520',
  },
  {
    label: 'Artisan Storage',
    title: 'Wardrobes made to measure',
    price: 'From Rs 25,000',
    href: '/wardrobes',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=82&w=520',
  },
  {
    label: 'Comfort Suites',
    title: 'Handcrafted wooden beds',
    price: 'From Rs 35,000',
    href: '/beds',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=82&w=520',
  },
];

const ModernHero = () => {
  return (
    <section className="modern-hero-section" aria-label="Sindureghari handmade luxury furniture">
      <div className="modern-hero-visual">
        <img
          src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=84&w=2200"
          alt="Luxury handmade Sindureghari furniture living room collection"
          className="modern-hero-bg"
          loading="eager"
        />
        <div className="modern-hero-shade"></div>

        <div className="modern-hero-content">
          <span className="modern-hero-kicker">Handmade furniture from Nepal</span>
          <h1>Luxury that still carries the maker&apos;s hand.</h1>
          <p>
            Slow-built sofas, beds, wardrobes, and custom pieces for homes that want real wood,
            quiet detail, and furniture with a story.
          </p>

          <div className="modern-hero-actions">
            <a href="/products" className="modern-hero-btn modern-hero-btn--primary">Shop handmade collections</a>
            <a href="/custom-furniture-nepal" className="modern-hero-btn modern-hero-btn--light">Start a custom piece</a>
          </div>

          <div className="modern-hero-proof" aria-label="Craft proof points">
            <span>Solid wood</span>
            <span>Hand finished</span>
            <span>Custom sizing</span>
            <span>White-glove delivery</span>
          </div>
        </div>

        <div className="modern-hero-rail" aria-label="Featured collections">
          {heroCollections.map((collection) => (
            <a href={collection.href} className="modern-hero-rail-item" key={collection.label}>
              <img src={collection.image} alt={collection.title} loading="eager" />
              <span>{collection.label}</span>
              <strong>{collection.title}</strong>
              <small>{collection.price}</small>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModernHero;
