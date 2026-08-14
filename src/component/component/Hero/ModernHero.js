'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  FaArrowRight, 
  FaTruckFast,
  FaShieldHalved,
  FaHeadset,
  FaChevronLeft,
  FaChevronRight,
  FaWhatsapp,
  FaStar,
  FaGem,
  FaCouch,
  FaBed,
  FaUtensils
} from 'react-icons/fa6';
import './ModernHero.css';

const HERO_SLIDES = [
  {
    id: 'living',
    category: 'Living Room',
    categoryIcon: <FaCouch />,
    kicker: 'PREMIUM ATELIER IN NEPAL',
    titleLine1: 'Modern Living.',
    titleLine2: 'Beautifully Furnished.',
    description: 'Handcrafted solid teak sofas, ergonomic lounge chairs, and bespoke coffee tables for timeless living spaces.',
    bgImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=88&w=2200',
    tag: 'Collection 2026',
    primaryCta: { label: 'Explore Collection', href: '/products' },
    secondaryCta: { label: 'Best Sellers', href: '/collections' },
    highlightBadge: { title: '100% Solid Wood', sub: 'Handcrafted Artisans' }
  },
  {
    id: 'bedroom',
    category: 'Modern Beds',
    categoryIcon: <FaBed />,
    kicker: 'RESTFUL ELEGANCE',
    titleLine1: 'Luxury Bedrooms.',
    titleLine2: 'Unmatched Comfort.',
    description: 'Solid timber bed frames, custom upholstered headboards, and nightstands crafted for restful sleep.',
    bgImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=88&w=2200',
    tag: 'Bedroom Suite',
    primaryCta: { label: 'Shop Bed Collection', href: '/products?category=bedroom' },
    secondaryCta: { label: 'Custom Orders', href: '/custom-order' },
    highlightBadge: { title: '10-Year Warranty', sub: 'Termite & Moisture Resistant' }
  },
  {
    id: 'dining',
    category: 'Dining Room',
    categoryIcon: <FaUtensils />,
    kicker: 'FAMILY GATHERINGS',
    titleLine1: 'Royal Dining.',
    titleLine2: 'Timeless Teak Craft.',
    description: 'Transform mealtime into a luxury dining experience with our 6-seater solid wood dining sets.',
    bgImage: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=88&w=2200',
    tag: 'Dining Sets',
    primaryCta: { label: 'Explore Dining', href: '/products?category=dining' },
    secondaryCta: { label: 'Showrooms', href: '/showrooms' },
    highlightBadge: { title: 'Custom Sizes', sub: 'Built to Fit Your Dining Area' }
  },
  {
    id: 'luxury',
    category: 'Bespoke Sofas',
    categoryIcon: <FaGem />,
    kicker: 'TAILORED UPHOLSTERY',
    titleLine1: 'Modular Sofas.',
    titleLine2: 'Crafted For Distinction.',
    description: 'Stain-resistant premium fabrics, high-density memory foam, and structural hardwood frames.',
    bgImage: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&q=88&w=2200',
    tag: 'Bespoke Luxury',
    primaryCta: { label: 'Configure Sofa', href: '/products?category=sofa' },
    secondaryCta: { label: 'Fabric Swatches', href: '/contact' },
    highlightBadge: { title: 'Free Delivery', sub: 'Kathmandu & Nationwide' }
  }
];

const HERO_FEATURES = [
  { title: 'Free Delivery', subtext: 'Kathmandu & Nepal', icon: <FaTruckFast /> },
  { title: '10-Yr Guarantee', subtext: '100% Solid Wood', icon: <FaShieldHalved /> },
  { title: '24/7 Consult', subtext: 'Direct WhatsApp', icon: <FaHeadset /> }
];

const STATS_DATA = [
  { value: '15+', label: 'Years Experience' },
  { value: '2,500+', label: 'Happy Homes' },
  { value: '100%', label: 'Solid Timber' },
  { value: '4.9★', label: 'Top Rated' }
];

const ModernHero = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeSlide = HERO_SLIDES[currentSlideIndex];

  const handleNext = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  return (
    <section 
      className="modern-hero-container compact-hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Sindureghari Furniture - Modern Living Hero Section"
    >
      {/* Background Slides */}
      {HERO_SLIDES.map((slide, idx) => (
        <div 
          key={slide.id}
          className={`hero-slide-bg ${idx === currentSlideIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.bgImage})` }}
        />
      ))}

      {/* Vignette Overlay */}
      <div className="hero-gradient-overlay" />

      {/* Main Content Area */}
      <div className="hero-main-content compact-content">
        
        {/* Category Switcher Pills */}
        <div className="hero-category-pills-bar compact-pills">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`category-pill-btn ${idx === currentSlideIndex ? 'active' : ''}`}
            >
              <span className="pill-icon">{slide.categoryIcon}</span>
              <span className="pill-label">{slide.category}</span>
            </button>
          ))}
        </div>

        {/* Compact Text Content Card */}
        <div className="hero-text-card compact-card" key={activeSlide.id}>
          
          <div className="hero-kicker-badge compact-badge">
            <span className="kicker-sparkle">✨</span>
            <span className="kicker-text">{activeSlide.kicker}</span>
            <span className="kicker-tag">{activeSlide.tag}</span>
          </div>

          <h1 className="hero-headline compact-headline">
            <span className="headline-dark">{activeSlide.titleLine1}</span>{' '}
            <span className="headline-gold">{activeSlide.titleLine2}</span>
          </h1>

          <p className="hero-subtext compact-subtext">
            {activeSlide.description}
          </p>

          <div className="hero-cta-group compact-cta">
            <Link href={activeSlide.primaryCta.href} className="btn-solid-gold btn-compact">
              <span>{activeSlide.primaryCta.label}</span>
              <FaArrowRight className="arrow-icon" />
            </Link>
            
            <Link href={activeSlide.secondaryCta.href} className="btn-outline-glass btn-compact">
              <span>{activeSlide.secondaryCta.label}</span>
            </Link>

            <a 
              href="https://wa.me/9779851000000?text=Hi%20Sindureghari%20Furniture,%20I%20would%20like%20to%20inquire%20about%20your%20products." 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-whatsapp-direct btn-compact"
              title="Chat on WhatsApp"
            >
              <FaWhatsapp className="wa-icon" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Compact Stats Row */}
          <div className="hero-stats-row compact-stats">
            {STATS_DATA.map((stat, i) => (
              <div className="stat-box" key={i}>
                <strong className="stat-val">{stat.value}</strong>
                <span className="stat-lbl">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Highlight Badge */}
        <div className="hero-floating-badge compact-float-badge" key={`badge-${activeSlide.id}`}>
          <div className="badge-icon">
            <FaStar className="star-icon" />
          </div>
          <div className="badge-text">
            <strong>{activeSlide.highlightBadge.title}</strong>
            <span>{activeSlide.highlightBadge.sub}</span>
          </div>
        </div>

        {/* Inline Features Bar */}
        <div className="hero-inline-features compact-features">
          {HERO_FEATURES.map((feature, idx) => (
            <div className="inline-feature-item" key={idx}>
              <div className="feature-icon">{feature.icon}</div>
              <div className="feature-text">
                <strong>{feature.title}</strong>
                <span>{feature.subtext}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Carousel Controls */}
      <div className="hero-carousel-controls compact-controls">
        <button 
          className="carousel-nav-btn prev" 
          onClick={handlePrev}
          aria-label="Previous Slide"
        >
          <FaChevronLeft />
        </button>

        <div className="carousel-dots-wrapper">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              className={`carousel-dot ${idx === currentSlideIndex ? 'active' : ''}`}
              onClick={() => setCurrentSlideIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            >
              <span className="dot-inner"></span>
            </button>
          ))}
        </div>

        <button 
          className="carousel-nav-btn next" 
          onClick={handleNext}
          aria-label="Next Slide"
        >
          <FaChevronRight />
        </button>

        <div className="slide-counter">
          <span>0{currentSlideIndex + 1}</span>
          <div className="counter-divider">/</div>
          <span>0{HERO_SLIDES.length}</span>
        </div>
      </div>
    </section>
  );
};

export default ModernHero;
