"use client";

/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { buildApiUrl, PRODUCT_ENDPOINTS } from '../../../config/api';
import './TopBrand.css';

const TopratedBrand = () => {
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
        console.warn('Top rated categories failed to load:', error);
      }
    };

    loadCategories();
  }, []);

  if (roomCategories.length === 0) return null;

  return (
    <section className="toprated-brand-section">
      <div className="toprated-brand-container">
        <div className="toprated-brand-header">
          <div className="toprated-brand-title-wrapper">
            <h2 className="toprated-brand-title">Our Top Rated Collections</h2>
            <div className="title-orange-underline"></div>
          </div>
          <div className="toprated-brand-description-wrapper">
            <p className="toprated-brand-description">
              Experience the pinnacle of comfort and style with <span className="toprated-brand-highlight">Sindureghari's</span> top-rated furniture collections. Handpicked by our customers and designers alike for their exceptional quality and timeless appeal.
              {isExpanded && (
                <span className="toprated-brand-expanded-text">
                  {" "}Each piece in our top-rated selection has been rigorously tested for durability and ergonomic perfection. From plush lounge seating to master-crafted bed frames, we bring you the very best of Nepalese wooden artistry combined with global design trends.
                </span>
              )}
              <button
                className="toprated-brand-more-btn"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Show Less' : 'Read More'}
              </button>
            </p>
          </div>
        </div>

        <div className="toprated-brand-slider-container">
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
            className="toprated-brand-swiper"
          >
            {roomCategories.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="toprated-category-card">
                  <div className="toprated-image-overlay">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="toprated-category-img" />
                    ) : (
                      <div className="category-image-placeholder">{item.icon || item.name.charAt(0)}</div>
                    )}
                    <div className="toprated-card-hover-mask">
                      <span className="toprated-explore-text">View Collection</span>
                    </div>
                  </div>
                  <div className="toprated-category-info">
                    <h3 className="toprated-category-title">{item.name}</h3>
                    <div className="toprated-category-link">Shop Now</div>
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

export default TopratedBrand;
