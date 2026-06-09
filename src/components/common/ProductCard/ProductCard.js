"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Eye, X, Heart, ShoppingCart, Shield, Truck, Wrench } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../../../context/CartContext';
import { productSeoPath } from '../../../data/nepalSeo';
import { API_BASE_URL } from '../../../config/api';
import './ProductCard.css';

const FALLBACK_IMAGE = '/images/placeholder.svg';

const resolveImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') return FALLBACK_IMAGE;
    if (imagePath.startsWith('data:') || imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    if (imagePath.startsWith('/assets/') || imagePath.startsWith('/images/')) return imagePath;
    if (imagePath.startsWith('/')) return `${API_BASE_URL}${imagePath}`;
    return imagePath;
};

const useFallbackImage = (event) => {
    const image = event.currentTarget;
    if (image.src.endsWith(FALLBACK_IMAGE)) return;
    image.onerror = null;
    image.src = FALLBACK_IMAGE;
};

const ProductCard = ({ product, hideInfo = false, hidePrice = false }) => {
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
        reviewCount,
        new_price,
        old_price,
        price,
        salePrice,
        stock
    } = product;

    const [showQuickView, setShowQuickView] = useState(false);
    const [activeImage, setActiveImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    // Handle varying data structures from different API endpoints
    const productId = id || _id;
    const productHref = productSeoPath(product);

    // Resolve image from multiple possible shapes
    let displayImage = imageUrl || image1 || FALLBACK_IMAGE;
    if (images && images.length > 0) displayImage = images[0];
    if (imageUrls) {
        try {
            const parsed = typeof imageUrls === 'string' ? JSON.parse(imageUrls) : imageUrls;
            if (parsed.length > 0) displayImage = parsed[0];
        } catch (e) { /* keep existing */ }
    }
    displayImage = resolveImageUrl(displayImage);

    const displayRating = rating || 4.9;
    const displayReviews = reviewCount || 42;

    const displayPrice = new_price || salePrice || price;
    const originalPrice = old_price || price;

    const formatPrice = (p) => {
        return Number.isFinite(Number(p)) && Number(p) > 0
            ? `Rs. ${Math.round(Number(p)).toLocaleString('en-NP')}`
            : null;
    };

    const handleOpenQuickView = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowQuickView(true);
        setActiveImage(displayImage);
        setQuantity(1);
        document.body.style.overflow = 'hidden';
    };

    const handleCloseModal = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setShowQuickView(false);
        document.body.style.overflow = '';
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({
            id: productId,
            name: name,
            price: displayPrice,
            quantity: quantity,
            image: displayImage
        });
    };

    return (
        <>
            <motion.div
                className="aether-product-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <Link href={productHref} className="card-link-overlay" aria-label={name} />

                <div className="card-media">
                    <img
                        src={displayImage}
                        alt={name}
                        loading="lazy"
                        onError={useFallbackImage}
                    />
                    <div className="card-overlay"></div>
                </div>

                {/* Quick View Hover Trigger Button */}
                <button
                    className="quick-view-overlay-btn"
                    onClick={handleOpenQuickView}
                    aria-label={`Quick view ${name}`}
                >
                    <Eye size={16} />
                    <span>Quick View</span>
                </button>

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
                        <div className="card-price-wrapper">
                            {originalPrice && Number(originalPrice) > Number(displayPrice) && (
                                <span className="card-old-price">{formatPrice(originalPrice)}</span>
                            )}
                            <span className="card-new-price">{formatPrice(displayPrice) || 'Contact for Price'}</span>
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

            {/* ── PREMIUM QUICK-VIEW PRODUCT MODAL ── */}
            <AnimatePresence>
                {showQuickView && (
                    <div className="premium-modal-overlay" onClick={handleCloseModal}>
                        <motion.div
                            className="premium-modal-card"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            transition={{ duration: 0.4, cubicBezier: [0.16, 1, 0.3, 1] }}
                        >
                            {/* Close Button */}
                            <button
                                className="modal-close-btn"
                                onClick={handleCloseModal}
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>

                            <div className="modal-inner-grid">
                                {/* Images Viewport (Left) */}
                                <div className="modal-gallery-pane">
                                    <div className="modal-main-image-wrapper">
                                        <img
                                            src={activeImage ? resolveImageUrl(activeImage) : displayImage}
                                            alt={name}
                                            className="modal-view-image"
                                            onError={useFallbackImage}
                                        />
                                    </div>
                                    {/* Thumbnails array if multiple exist */}
                                    {(() => {
                                        try {
                                            const list = typeof imageUrls === 'string'
                                                ? JSON.parse(imageUrls)
                                                : imageUrls || (images ? images : []);
                                            if (!Array.isArray(list) || list.length <= 1) return null;
                                            return (
                                                <div className="modal-thumbs-row">
                                                    {list.slice(0, 5).map((img, idx) => (
                                                        <button
                                                            key={idx}
                                                            className={`thumb-button ${activeImage === img ? 'active' : ''}`}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setActiveImage(img);
                                                            }}
                                                        >
                                                            <img src={resolveImageUrl(img)} alt={`thumbnail-${idx}`} onError={useFallbackImage} />
                                                        </button>
                                                    ))}
                                                </div>
                                            );
                                        } catch (err) {
                                            return null;
                                        }
                                    })()}
                                </div>

                                {/* Specs Details Pane (Right) */}
                                <div className="modal-info-pane">
                                    <span className="modal-brand-tag">{brand || 'SINDUREGHARI LUXURY'}</span>
                                    <h2 className="modal-product-title">{name}</h2>

                                    {/* Ratings Row */}
                                    <div className="modal-rating-row">
                                        <div className="stars-wrapper">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    fill={i < Math.round(displayRating) ? '#d4af37' : 'none'}
                                                    stroke={i < Math.round(displayRating) ? 'none' : '#666666'}
                                                />
                                            ))}
                                        </div>
                                        <span className="rating-text-value">
                                            <strong>{displayRating}</strong> ({displayReviews} reviews)
                                        </span>
                                    </div>

                                    {/* Pricing displays */}
                                    <div className="modal-price-display">
                                        <span className="modal-active-price">
                                            {formatPrice(displayPrice) || 'Contact for Price'}
                                        </span>
                                        {originalPrice && Number(originalPrice) > Number(displayPrice) && (
                                            <span className="modal-crossed-price">
                                                {formatPrice(originalPrice)}
                                            </span>
                                        )}
                                    </div>

                                    {/* High quality specs list */}
                                    <div className="specs-list-box">
                                        <div className="spec-item">
                                            <span className="spec-label">Premium Material</span>
                                            <span className="spec-value">{product.material || 'Seasoned Teak Wood'}</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-label">Artisan Color</span>
                                            <span className="spec-value">{product.product_color || 'mid red and brown'}</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-label">Bespoke Size</span>
                                            <span className="spec-value">{product.product_size || product.dimensions || 'Custom Size Available'}</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-label">Security Shield</span>
                                            <span className="spec-value"><strong>{product.warranty || 5} Years</strong> Full Warranty</span>
                                        </div>
                                    </div>

                                    <p className="modal-description-paragraph">
                                        {product.description || 'Exquisitely crafted luxury wood centerpiece. Constructed by master builders using age-old Nepalese joint joinery techniques for uncompromising strength.'}
                                    </p>

                                    {/* Purchase Control Hub */}
                                    <div className="purchase-controls-row">
                                        <div className="quantity-adjuster">
                                            <button
                                                className="adjust-btn"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    quantity > 1 && setQuantity(prev => prev - 1);
                                                }}
                                                disabled={quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="qty-value">{quantity}</span>
                                            <button
                                                className="adjust-btn"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setQuantity(prev => prev + 1);
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            className="modal-add-to-cart-btn"
                                            onClick={handleAddToCart}
                                            disabled={stock === 0}
                                        >
                                            <ShoppingCart size={18} />
                                            <span>{stock === 0 ? 'Fully Reserved' : 'Secure in Cart'}</span>
                                        </button>

                                        <button
                                            className="modal-wishlist-btn"
                                            aria-label="Add to wishlist"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                        >
                                            <Heart size={18} />
                                        </button>
                                    </div>

                                    {/* Value Props Row */}
                                    <div className="luxury-value-props">
                                        <div className="prop-badge">
                                            <Shield size={16} />
                                            <span>Certified Wood</span>
                                        </div>
                                        <div className="prop-badge">
                                            <Truck size={16} />
                                            <span>Elite White-Glove Delivery</span>
                                        </div>
                                        <div className="prop-badge">
                                            <Wrench size={16} />
                                            <span>Complimentary Installation</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ProductCard;
