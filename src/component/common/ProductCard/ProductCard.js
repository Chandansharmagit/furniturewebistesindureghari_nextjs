"use client";

import React, { useState } from 'react';
import { Star, X, Heart, ShoppingCart, Shield, Truck, Wrench, ShieldCheck, Eye, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../../../context/CartContext';
import { productSeoPath } from '../../../data/nepalSeo';
import { API_BASE_URL } from '../../../config/api';
import './ProductCard.css';

const FALLBACK_IMAGE = '/images/placeholder.svg';

const resolveImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') return FALLBACK_IMAGE;
    let url = imagePath;
    if (url.startsWith('data:')) return url;
    if (url.startsWith('/assets/') || url.startsWith('/images/')) return url;
    if (url.startsWith('/')) url = `${API_BASE_URL}${url}`;

    if (url.includes('res.cloudinary.com') && url.includes('/upload/') && !/\/upload\/[a-z]_/.test(url)) {
        url = url.replace('/upload/', '/upload/f_auto,q_auto,w_650/');
    }
    return url;
};

const useFallbackImage = (event) => {
    const image = event.currentTarget;
    if (image.src.endsWith(FALLBACK_IMAGE)) return;
    image.onerror = null;
    image.src = FALLBACK_IMAGE;
};

const ProductCard = ({ product }) => {
    const {
        id,
        _id,
        name,
        title,
        images,
        imageUrl,
        imageUrls,
        image1,
        category,
        categoryName,
        brand,
        rating,
        reviewCount,
        new_price,
        old_price,
        price,
        salePrice,
        stock,
        wooden_type,
        material,
        warranty
    } = product;

    const [showQuickView, setShowQuickView] = useState(false);
    const [activeImage, setActiveImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [addedToast, setAddedToast] = useState(false);
    const { addToCart } = useCart();

    const productId = id || _id;
    const productTitle = name || title || 'Handcrafted Solid Wood Furniture';
    const productCategory = categoryName || category || 'Furniture';
    const productHref = productSeoPath(product);

    // Resolve image from multiple possible shapes
    let displayImage = imageUrl || image1 || FALLBACK_IMAGE;
    if (Array.isArray(images) && images.length > 0) displayImage = images[0];
    if (imageUrls) {
        try {
            const parsed = typeof imageUrls === 'string' ? JSON.parse(imageUrls) : imageUrls;
            if (Array.isArray(parsed) && parsed.length > 0) displayImage = parsed[0];
        } catch (e) { /* keep existing */ }
    }
    displayImage = resolveImageUrl(displayImage);

    const displayRating = rating || 4.9;
    const displayReviews = reviewCount || 42;

    const numNew = Number(new_price ?? salePrice ?? price ?? 0);
    const numOld = Number(old_price ?? price ?? 0);
    const displayPrice = numNew > 0 ? numNew : numOld;
    const originalPrice = numOld > displayPrice ? numOld : 0;
    const discountPercent = originalPrice > displayPrice && displayPrice > 0
        ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
        : 0;

    const formatPrice = (p) => {
        return Number.isFinite(Number(p)) && Number(p) > 0
            ? `Rs. ${Math.round(Number(p)).toLocaleString('en-IN')}`
            : null;
    };

    const handleCloseModal = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setShowQuickView(false);
        document.body.style.overflow = '';
    };

    const handleOpenQuickView = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowQuickView(true);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({
            id: productId,
            name: productTitle,
            price: displayPrice,
            quantity: quantity,
            image: displayImage
        });
        setAddedToast(true);
        setTimeout(() => setAddedToast(false), 1800);
    };

    const woodLabel = wooden_type || material || 'Solid Wood';
    const isInStock = stock === undefined || stock === null || Number(stock) > 0;

    return (
        <>
            <article className="aether-product-card">
                <div className="lux-card-media-wrap">
                    <Link href={productHref} className="lux-card-media-link" aria-label={productTitle}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={displayImage}
                            alt={productTitle}
                            loading="lazy"
                            onError={useFallbackImage}
                            className="lux-card-img"
                        />
                    </Link>

                    {discountPercent > 0 && (
                        <span className="lux-card-discount-badge">
                            {discountPercent}% OFF
                        </span>
                    )}

                    <button
                        type="button"
                        className="lux-card-quickview-btn"
                        onClick={handleOpenQuickView}
                        aria-label="Quick view product"
                        title="Quick View"
                    >
                        <Eye size={16} />
                    </button>
                </div>

                <div className="lux-card-body">
                    <div className="lux-card-meta-row">
                        <span className="lux-card-category">{productCategory}</span>
                        <span className={`lux-card-stock ${isInStock ? 'in-stock' : 'out-stock'}`}>
                            <ShieldCheck size={13} />
                            {isInStock ? 'In stock' : 'Made to order'}
                        </span>
                    </div>

                    <h3 className="lux-card-title">
                        <Link href={productHref}>
                            {productTitle}
                        </Link>
                    </h3>

                    <div className="lux-card-specs-line">
                        <span>{woodLabel}</span>
                        {warranty && (
                            <>
                                <span className="lux-spec-dot">•</span>
                                <span>{String(warranty).includes('Year') ? warranty : `${warranty} Yr Warranty`}</span>
                            </>
                        )}
                    </div>

                    <div className="lux-card-footer">
                        <div className="lux-card-pricing">
                            <span className="lux-card-price-now">
                                {formatPrice(displayPrice) || 'Ask for Price'}
                            </span>
                            {originalPrice > displayPrice && (
                                <span className="lux-card-price-old">
                                    {formatPrice(originalPrice)}
                                </span>
                            )}
                        </div>

                        <div className="lux-card-actions">
                            <button
                                type="button"
                                className={`lux-card-cart-btn ${addedToast ? 'added' : ''}`}
                                onClick={handleAddToCart}
                                title="Add to Cart"
                                aria-label="Add to Cart"
                            >
                                <ShoppingCart size={15} />
                                <span>{addedToast ? 'Added' : 'Add'}</span>
                            </button>
                            <Link href={productHref} className="lux-card-view-link" aria-label="View details">
                                <ArrowUpRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </article>

            {/* ── PREMIUM QUICK-VIEW PRODUCT MODAL ── */}
            {showQuickView && (
                <div className="premium-modal-overlay" onClick={handleCloseModal}>
                    <div
                        className="premium-modal-card"
                        onClick={(e) => e.stopPropagation()}
                    >
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
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={activeImage ? resolveImageUrl(activeImage) : displayImage}
                                        alt={productTitle}
                                        className="modal-view-image"
                                        onError={useFallbackImage}
                                    />
                                </div>
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
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
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
                                <span className="modal-brand-tag">{brand || 'SINDUREGHARI ATELIER'}</span>
                                <h2 className="modal-product-title">{productTitle}</h2>

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

                                <div className="modal-price-display">
                                    <span className="modal-active-price">
                                        {formatPrice(displayPrice) || 'Contact for Price'}
                                    </span>
                                    {originalPrice > displayPrice && (
                                        <span className="modal-crossed-price">
                                            {formatPrice(originalPrice)}
                                        </span>
                                    )}
                                </div>

                                <div className="specs-list-box">
                                    <div className="spec-item">
                                        <span className="spec-label">Timber / Material</span>
                                        <span className="spec-value">{woodLabel}</span>
                                    </div>
                                    <div className="spec-item">
                                        <span className="spec-label">Finish / Color</span>
                                        <span className="spec-value">{product.product_color || 'Natural Teak Polish'}</span>
                                    </div>
                                    <div className="spec-item">
                                        <span className="spec-label">Dimensions</span>
                                        <span className="spec-value">{product.product_size || product.dimensions || 'Custom Size Available'}</span>
                                    </div>
                                    <div className="spec-item">
                                        <span className="spec-label">Warranty</span>
                                        <span className="spec-value"><strong>{warranty || 10} Years</strong> Structural Warranty</span>
                                    </div>
                                </div>

                                <p className="modal-description-paragraph">
                                    {product.description || 'Handcrafted by master artisans at Sindureghari Furniture using seasoned solid timber for lasting durability and everyday comfort.'}
                                </p>

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
                                        <span>{stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                                    </button>

                                    <Link
                                        href={productHref}
                                        className="modal-wishlist-btn"
                                        aria-label="View full details"
                                        title="View Full Product Page"
                                    >
                                        <ArrowUpRight size={18} />
                                    </Link>
                                </div>

                                <div className="luxury-value-props">
                                    <div className="prop-badge">
                                        <Shield size={16} />
                                        <span>Seasoned Timber</span>
                                    </div>
                                    <div className="prop-badge">
                                        <Truck size={16} />
                                        <span>Safe Home Delivery</span>
                                    </div>
                                    <div className="prop-badge">
                                        <Wrench size={16} />
                                        <span>Free Assembly</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductCard;
