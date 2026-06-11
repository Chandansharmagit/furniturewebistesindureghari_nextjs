import React from 'react';
import './ModernHero.css';

const heroCollections = [
  {
    index: '01',
    label: 'Sofa Studio',
    title: 'Low, generous seating for calm living rooms',
    price: 'Shop sofas',
    href: '/sofas',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=82&w=520',
  },
  {
    index: '02',
    label: 'Bedroom Edit',
    title: 'Beds and wardrobes built around your space',
    price: 'View bedroom',
    href: '/wardrobes',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=82&w=520',
  },
  {
    index: '03',
    label: 'Made to Order',
    title: 'Custom dimensions, polish and storage details',
    price: 'Plan custom',
    href: '/beds',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=82&w=520',
  },
];

const ModernHero = () => {
  return (
    <section className="modern-hero-section" aria-label="Sindureghari handmade luxury furniture">
      <div className="modern-hero-visual">
        <img
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=88&w=2200"
          alt="Luxury handmade Sindureghari furniture living room collection"
          className="modern-hero-bg"
          loading="eager"
        />
        <div className="modern-hero-shade"></div>

        <div className="modern-hero-edition" aria-label="Brand details">
          <span>Showroom edit</span>
          <strong>Handmade in Nepal</strong>
        </div>

        <div className="modern-hero-content">
          <span className="modern-hero-kicker">Sindureghari Furniture Atelier</span>
          <h1>Design your room around made-for-you furniture.</h1>
          <p>
            Browse handcrafted collections, commission exact sizes, and bring solid wood
            pieces into your home with a finish that looks calm, warm and intentional.
          </p>

          <div className="modern-hero-actions">
            <a href="/products" className="modern-hero-btn modern-hero-btn--primary">Browse collection</a>
            <a href="/room-visualizer" className="modern-hero-btn modern-hero-btn--light">Try room visualizer</a>
          </div>

          <div className="modern-hero-signature" aria-label="Sindureghari furniture highlights">
            <span><strong>01</strong> Choose a room style</span>
            <span><strong>02</strong> Customize size and finish</span>
            <span><strong>03</strong> Deliver and install</span>
          </div>

          <div className="modern-hero-materials" aria-label="Material and finish palette">
            <span className="swatch swatch-1"></span>
            <span className="swatch swatch-2"></span>
            <span className="swatch swatch-3"></span>
            <small>Teak, sheesham, walnut and honey polish finishes</small>
          </div>
        </div>

        <div className="modern-hero-room-card" aria-label="Featured room service">
          <span>New</span>
          <strong>Preview pieces inside your own room</strong>
          <a href="/room-visualizer">Open visualizer</a>
        </div>

        <div className="modern-hero-rail" aria-label="Featured collections">
          {heroCollections.map((collection) => (
            <a href={collection.href} className="modern-hero-rail-item" key={collection.label}>
              <img src={collection.image} alt={collection.title} loading="eager" />
              <em>{collection.index}</em>
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
