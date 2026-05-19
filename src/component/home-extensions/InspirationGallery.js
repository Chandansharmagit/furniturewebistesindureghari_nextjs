import React from 'react';
import { useNavigate } from 'react-router-dom';
import './InspirationGallery.css';

const InspirationGallery = () => {
    const navigate = useNavigate();

    return (
        <section className="inspiration-container">
            <div className="inspiration-header">
                <span className="inspiration-subtitle">Curated Spaces</span>
                <h2 className="inspiration-title">Shop The Look</h2>
                <p className="inspiration-desc">
                    Discover handpicked furniture collections designed to transform your home into a masterpiece of modern living.
                </p>
            </div>

            <div className="bento-grid">
                {/* Large Featured Tile */}
                <div 
                    className="bento-card bento-large"
                    onClick={() => navigate('/category/living-room')}
                >
                    <div className="bento-image-wrapper">
                        <img 
                            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200" 
                            alt="Luxury Living Room" 
                            loading="lazy"
                        />
                    </div>
                    <div className="bento-overlay">
                        <div className="bento-content">
                            <h3>The Royal Living</h3>
                            <p>Explore Premium Sofas & Lounges</p>
                            <span className="bento-btn">Explore <span className="arrow">→</span></span>
                        </div>
                    </div>
                </div>

                {/* Medium Top Tile */}
                <div 
                    className="bento-card bento-medium-top"
                    onClick={() => navigate('/category/bedroom')}
                >
                    <div className="bento-image-wrapper">
                        <img 
                            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1000" 
                            alt="Serene Bedroom" 
                            loading="lazy"
                        />
                    </div>
                    <div className="bento-overlay">
                        <div className="bento-content">
                            <h3>Serene Bedrooms</h3>
                            <span className="bento-btn">View Collection</span>
                        </div>
                    </div>
                </div>

                {/* Medium Bottom Tile */}
                <div 
                    className="bento-card bento-medium-bottom"
                    onClick={() => navigate('/category/dining-room')}
                >
                    <div className="bento-image-wrapper">
                        <img 
                            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1000" 
                            alt="Dining Room" 
                            loading="lazy"
                        />
                    </div>
                    <div className="bento-overlay">
                        <div className="bento-content">
                            <h3>Dining & Entertaining</h3>
                            <span className="bento-btn">View Collection</span>
                        </div>
                    </div>
                </div>

                {/* Tall Tile */}
                <div 
                    className="bento-card bento-tall"
                    onClick={() => navigate('/category/office-and-study')}
                >
                    <div className="bento-image-wrapper">
                        <img 
                            src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1000" 
                            alt="Office Space" 
                            loading="lazy"
                        />
                    </div>
                    <div className="bento-overlay">
                        <div className="bento-content">
                            <h3>Modern Executive</h3>
                            <p>Ergonomic Office Solutions</p>
                            <span className="bento-btn">Explore <span className="arrow">→</span></span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InspirationGallery;
