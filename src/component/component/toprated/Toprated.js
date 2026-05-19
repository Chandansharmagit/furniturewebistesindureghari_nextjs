import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './TopBrand.css';

const TopratedBrand = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const roomCategories = [
    {
      id: 1,
      title: 'Living Room',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=fit&crop&w=600&q=80'
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
    <section className="toprated-brand-section">
      <div className="toprated-brand-container">
        <div className="toprated-brand-header">
          <div className="toprated-brand-title-wrapper">
            <h2 className="toprated-brand-title">Our Top Rated Collections</h2>
            <div className="title-orange-underline"></div>
          </div>
          <div className="toprated-brand-description-wrapper">
            <p className="toprated-brand-description">
              Experience the pinnacle of comfort and style with <span className="toprated-brand-highlight">Bishwokarma's</span> top-rated furniture collections. Handpicked by our customers and designers alike for their exceptional quality and timeless appeal.
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
                    <img src={item.image} alt={item.title} className="toprated-category-img" />
                    <div className="toprated-card-hover-mask">
                      <span className="toprated-explore-text">View Collection</span>
                    </div>
                  </div>
                  <div className="toprated-category-info">
                    <h3 className="toprated-category-title">{item.title}</h3>
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
