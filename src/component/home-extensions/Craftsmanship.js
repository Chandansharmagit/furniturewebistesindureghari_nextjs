import React from 'react';
import './Craftsmanship.css';

const Craftsmanship = () => {
    return (
        <section className="craftsmanship-section">
            <div className="craft-container">
                <div className="craft-image-container">
                    <img 
                        src="https://images.unsplash.com/photo-1541194577687-8c63bf9e7ee3?auto=format&fit=crop&q=80&w=1200" 
                        alt="Wood Craftsmanship" 
                        className="craft-main-image"
                        loading="lazy"
                    />
                    <div className="craft-floating-card">
                        <span className="years">25+</span>
                        <p>Years of Master Craftsmanship in Nepal</p>
                    </div>
                </div>

                <div className="craft-content">
                    <span className="craft-subtitle">Uncompromising Quality</span>
                    <h2 className="craft-title">The Art of Furniture Making</h2>
                    <p className="craft-description">
                        Every piece at Sindureghari Furniture is born from a legacy of woodworking excellence. We meticulously select premium hardwoods and apply time-honored artisanal techniques to ensure your furniture isn't just beautiful—it's built to last generations.
                    </p>

                    <div className="craft-features">
                        <div className="craft-feature">
                            <div className="craft-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                            </div>
                            <div>
                                <h4>Premium Materials</h4>
                                <p>Sourced ethically for durability and natural beauty.</p>
                            </div>
                        </div>

                        <div className="craft-feature">
                            <div className="craft-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                </svg>
                            </div>
                            <div>
                                <h4>Precision Assembly</h4>
                                <p>Engineered joints that stand the test of daily life.</p>
                            </div>
                        </div>

                        <div className="craft-feature">
                            <div className="craft-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                            </div>
                            <div>
                                <h4>Lifetime Support</h4>
                                <p>Comprehensive warranty sets your mind at ease.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Craftsmanship;
