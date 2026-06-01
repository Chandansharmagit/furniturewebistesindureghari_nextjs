"use client";

/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { buildApiUrl, PRODUCT_ENDPOINTS } from '../../../config/api';
import './FurnitureBrand.css';

const FurnitureBrand = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [roomCategories, setRoomCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch(buildApiUrl(PRODUCT_ENDPOINTS.CATEGORIES));
        if (!response.ok) return;
        const data = await response.json();
        setRoomCategories((Array.isArray(data) ? data : []).filter(category => category.status !== 'inactive'));
      } catch (error) {
        console.warn('Furniture brand categories failed to load:', error);
      }
    };

    loadCategories();
  }, []);

  if (roomCategories.length === 0) return null;

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
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="brand-category-img" />
                    ) : (
                      <div className="category-image-placeholder">{item.icon || item.name.charAt(0)}</div>
                    )}
                    <div className="card-hover-mask">
                      <span className="explore-text">Explore Collection</span>
                    </div>
                  </div>
                  <div className="brand-category-info">
                    <h3 className="brand-category-title">{item.name}</h3>
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
