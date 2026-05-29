"use client";

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './FurnitureBrand.css';

const FurnitureBrand = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const roomCategories = [
    {
      id: 1,
      title: 'Living Room',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2,
      title: 'Bedroom',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3,
      title: 'Dining Room',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 4,
      title: 'Study',
      image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 5,
      title: 'Outdoor',
      image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <section className="furniture-brand-section">
      <div className="furniture-brand-watermark">CRAFTSMANSHIP</div>
      <div className="furniture-brand-container">
        <div className="furniture-brand-header-editorial">
          <div className="editorial-left">
            <span className="editorial-eyebrow">Premium Craftsmanship</span>
            <h2 className="furniture-brand-title">Nepal's Finest <br/>Online Furniture Brand</h2>
            <div className="title-gold-accent"></div>
          </div>
          
          <div className="editorial-right">
            <p className="furniture-brand-description">
              Elevate your living experience with <span className="furniture-brand-highlight">Sindureghari Furniture</span>. 
              Our extensive collection of premium wooden furniture units is meticulously crafted to bring an 
              elegant, sophisticated touch to your home interiors.
              {isExpanded && (
                <span className="furniture-brand-expanded-text">
                  {" "}Discover a world where traditional craftsmanship meets modern sensibilities. From artisanal sofa sets and ergonomic beds to monumental dining tables and bespoke home decor.
                </span>
              )}
              <button
                className="furniture-brand-more-btn"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Show Less' : 'Read More'}
              </button>
            </p>
          </div>
        </div>

        <div className="furniture-brand-slider-container">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1440: { slidesPerView: 4 }
            }}
            className="furniture-brand-swiper"
          >
            {roomCategories.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="brand-category-card">
                  <div className="brand-image-overlay">
                    <img src={item.image} alt={item.title} className="brand-category-img" />
                    <div className="card-hover-mask">
                      <span className="explore-text">Explore Collection</span>
                    </div>
                  </div>
                  <div className="brand-category-info">
                    <h3 className="brand-category-title">{item.title}</h3>
                    <div className="brand-category-link">View Details</div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default FurnitureBrand;
