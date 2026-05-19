import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const {
        id,
        _id,
        name,
        images,
        imageUrl,
        imageUrls,
        image1,
        category,
        brand,
        rating,
        reviewCount
    } = product;

    // Handle varying data structures from different API endpoints
    const productId = id || _id;

    // Resolve image from multiple possible shapes
    let displayImage = imageUrl || image1 || '/images/placeholder.jpg';
    if (images && images.length > 0) displayImage = images[0];
    if (imageUrls) {
        try {
            const parsed = typeof imageUrls === 'string' ? JSON.parse(imageUrls) : imageUrls;
            if (parsed.length > 0) displayImage = parsed[0];
        } catch (e) { /* keep existing */ }
    }

    const displayRating = rating || 4.9;
    const displayReviews = reviewCount || '2.4k';

    return (
        <motion.div
            className="aether-product-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <Link to={`/product/${productId}`} className="card-link-overlay" aria-label={name} />

            <div className="card-media">
                <img
                    src={displayImage}
                    alt={name}
                    loading="lazy"
                    onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                />
                <div className="card-overlay"></div>
            </div>

            <div className="card-top-badges">
                <div className="badge-pill category-badge">
                    {category || 'FURNITURE'}
                </div>
                <div className="badge-pill rating-badge">
                    <Star size={14} fill="#f59e0b" stroke="none" />
                    <span className="rating-score">{Math.round(displayRating * 10) / 10}</span>
                    <span className="rating-count">({displayReviews})</span>
                </div>
            </div>

            <div className="card-bottom-content">
                <div className="subtitle-brand">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="pin-icon">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{brand || 'GANDAKI PROVINCE, NEPAL'}</span>
                </div>

                <h3 className="product-title-bold">
                    {name ? name.split(' ').slice(0, 4).join(' ') : 'PREMIUM COLLECTION'}
                </h3>

                <div className="card-action-footer">
                    <div className="avatar-group">
                        <img src="https://i.pravatar.cc/100?img=1" alt="user1" className="avatar" />
                        <img src="https://i.pravatar.cc/100?img=5" alt="user2" className="avatar" />
                        <img src="https://i.pravatar.cc/100?img=8" alt="user3" className="avatar" />
                        <div className="avatar-more">+12</div>
                    </div>

                    <button className="navigate-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
