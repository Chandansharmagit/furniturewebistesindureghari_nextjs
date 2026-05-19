import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import './FurnitureSlider.css';

const FurnitureSlider = () => {
  const slides = [
    {
      id: 1,
      title: "Crafted for Royal Sleep",
      titleAccent: "Premium Beds",
      subtitle: "ARTISANAL COLLECTION 2026",
      price: "₹11,699",
      description: "Experience the ultimate in comfort and luxury with our artisanal teak wood bed frames, designed for those who demand nothing but perfection.",
      mainImage: "/assets/images/premium_bed.png",
      accentColor: "#d4af37",
      sideOffers: [
        {
          id: 'offer-1',
          type: 'special',
          title: "SPECIAL DEAL",
          amount: "₹5,000 OFF",
          label: "INSTANT DISCOUNT",
          image: "/api/placeholder/600/400",
          isGold: true
        },
        {
          id: 'offer-2',
          type: 'product',
          title: "ORTHO MATTRESS",
          price: "₹9,999",
          label: "FREE Delivery",
          image: "/api/placeholder/600/400",
          isWhite: true
        }
      ]
    },
    {
      id: 2,
      title: "Elegance in Every Meal",
      titleAccent: "Dining Sets",
      subtitle: "ELITE DINING SERIES",
      price: "₹24,999",
      description: "Transform your dining room into a palatial hall with our hand-carved solid wood sets, featuring intricate details and timeless beauty.",
      mainImage: "/assets/images/premium_dining_set.png",
      accentColor: "#ff6b35",
      sideOffers: [
        {
          id: 'offer-3',
          type: 'special',
          title: "FESTIVE SALE",
          amount: "20% OFF",
          label: "FOR NEW BUYERS",
          image: "/api/placeholder/600/400",
          isGold: true
        },
        {
          id: 'offer-4',
          type: 'product',
          title: "ROYAL CHAIRS",
          price: "₹4,500",
          label: "Teak Wood Build",
          image: "/api/placeholder/600/400",
          isWhite: true
        }
      ]
    }
  ];

  return (
    <section className="furniture-slider-wrapper">
      <div className="slider-main-container">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1200}
          autoplay={{ delay: 8000, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
          className="main-hero-swiper"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              {({ isActive }) => (
                <div className="hero-slide-content">
                  <div className="hero-slide-grid">
                    {/* Left: Main Content */}
                    <div className="hero-left-col">
                      <AnimatePresence mode="wait">
                        {isActive && (
                          <div className="hero-text-content">
                            <motion.span 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: 0.2 }}
                              className="hero-subtitle"
                            >
                              {slide.subtitle}
                            </motion.span>
                            
                            <motion.h1 
                              initial={{ opacity: 0, x: -30 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.8, delay: 0.4 }}
                              className="hero-title"
                            >
                              {slide.title.split(' ').slice(0, -1).join(' ')} 
                              <span>{slide.title.split(' ').pop()}</span>
                            </motion.h1>
                            
                            <motion.p 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 1, delay: 0.6 }}
                              className="hero-desc"
                            >
                              {slide.description}
                            </motion.p>

                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.6, delay: 0.8 }}
                              className="hero-price-tag"
                            >
                              <span className="price-label">Starting at</span>
                              <div className="price-amount">{slide.price}</div>
                            </motion.div>

                            <motion.button 
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.6, delay: 1 }}
                              className="hero-cta-btn"
                            >
                              Explore Collection
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                              </svg>
                            </motion.button>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Middle: Image Showcase */}
                    <div className="hero-image-showcase">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isActive ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="image-aura" 
                        style={{ backgroundColor: slide.accentColor + '11' }}
                      ></motion.div>
                      
                      <motion.img 
                        initial={{ opacity: 0, x: 100, rotate: 5 }}
                        animate={isActive ? { opacity: 1, x: 0, rotate: 0 } : {}}
                        transition={{ duration: 1.2, delay: 0.3, type: "spring", stiffness: 40 }}
                        src={slide.mainImage} 
                        alt={slide.title} 
                        className="hero-main-img" 
                      />
                    </div>

                    {/* Right: Side Offers */}
                    <div className="hero-right-col">
                      {slide.sideOffers.map((offer, idx) => (
                        <motion.div 
                          key={offer.id} 
                          initial={{ opacity: 0, x: 50 }}
                          animate={isActive ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.6, delay: 0.8 + (idx * 0.2) }}
                          className={`offer-card ${offer.isGold ? 'gold-theme' : 'white-theme'}`}
                        >
                          <div className="offer-inner">
                            <div className="offer-info">
                              <span className="offer-type">{offer.title}</span>
                              <div className="offer-value">{offer.amount || offer.price}</div>
                              <span className="offer-label">{offer.label}</span>
                              <div className="offer-action">View Deal</div>
                            </div>
                            <div className="offer-img-box">
                              <img src={offer.image} alt={offer.title} />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FurnitureSlider;
