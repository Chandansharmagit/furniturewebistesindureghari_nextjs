import React from 'react';
import './InteriorDesignService.css';

const InteriorDesignService = () => {
    return (
        <section className="interior-service-section">
            <div className="interior-container">
                <div className="interior-image-col">
                    <div className="interior-image-wrapper">
                        <img 
                            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200" 
                            alt="Interior Designer reviewing plans" 
                            loading="lazy"
                        />
                    </div>
                </div>
                
                <div className="interior-content-col">
                    <div className="interior-floating-card">
                        <span className="interior-badge">Free Service</span>
                        <h2>Complimentary Interior Design Studio</h2>
                        <p>
                            Not sure how that new sofa will look in your space? Our team of professional interior designers is ready to help you visualize your dream room.
                        </p>
                        
                        <ul className="service-features">
                            <li>
                                <div className="dot"></div>
                                <span>1-on-1 virtual or in-store consultation</span>
                            </li>
                            <li>
                                <div className="dot"></div>
                                <span>Custom 3D room visualization</span>
                            </li>
                            <li>
                                <div className="dot"></div>
                                <span>Personalized fabric and finish recommendations</span>
                            </li>
                        </ul>

                        <div className="interior-actions">
                            <button className="book-btn">Book Consultation</button>
                            <button className="learn-more-btn">Learn More</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InteriorDesignService;
