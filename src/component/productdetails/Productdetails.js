"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SEOComponent from '../../components/SEO/SEOComponent';
import { API_BASE_URL } from '../../config/api';
import ProductTabs from './ProductTabs';
import EMIPlansModal from './Emi/Emiplan';
import { useCart } from '../../context/CartContext';
import useActivityTracking from '../../hooks/useActivityTracking';
import FavoriteButton from '../common/FavoriteButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
    Activity,
    BadgeCheck,
    ChevronDown,
    Copy,
    CreditCard,
    Headphones,
    LockKeyhole,
    MessageCircle,
    RotateCcw,
    Share2,
    ShieldCheck,
    ShoppingCart,
    Truck,
    Wrench,
    X,
} from 'lucide-react';
import { FaChevronLeft, FaChevronRight, FaShareAlt } from 'react-icons/fa';
import gsap from 'gsap';
import './ProductDetails.css';

export default function ProductDetails({ productId }) {
    const routeParams = useParams();
    const id = productId || routeParams?.id;
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { trackProductView, trackAddToCart } = useActivityTracking();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const [email, setEmail] = useState('');
    const [priceAlertMessage, setPriceAlertMessage] = useState('');
    const [couponValidation, setCouponValidation] = useState('');
    const [validationResult, setValidationResult] = useState(null);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [showDetails, setShowDetails] = useState(false);
    const [shareMessage, setShareMessage] = useState('');
    const [isEMIPlansModalOpen, setIsEMIPlansModalOpen] = useState(false);
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

    // Get product by ID
    const getProductById = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_BASE_URL}/api/products/${id}`);
            setProduct(response.data);
            setSelectedImageIndex(0);
            console.log('Product Details:', response.data);
        } catch (error) {
            console.error('Error fetching product:', error);
            setError('Failed to load product details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            getProductById();
        }
    }, [id, getProductById]);

    // GSAP Animations
    useEffect(() => {
        if (!loading && product) {
            const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });

            tl.fromTo(".main-image-container",
                { opacity: 0, x: -50 },
                { opacity: 1, x: 0 }
            )
                .fromTo(".product-header",
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0 },
                    "-=0.7"
                )
                .fromTo(".product-description, .product-pricing",
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, stagger: 0.2 },
                    "-=0.6"
                )
                .fromTo(".cart-section, .trust-section",
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, stagger: 0.15 },
                    "-=0.5"
                );
        }
    }, [loading, product]);

    // Track product view when component mounts and product is loaded
    useEffect(() => {
        if (product && product.id) {
            trackProductView(product.id, product.categoryId);
        }
    }, [product, trackProductView]);

    // Sanitize description metadata
    const sanitizeDescription = (text) => {
        if (!text) return "";
        return text
            .replace(/Youtube Thumb Image:- [^\s]*/g, "")
            .replace(/Product Image \d+ -/g, "")
            .replace(/Box Storage \(King Size, Honey Finish\)/g, "")
            .replace(/Brixton Sheesham Wood Bed/g, "")
            .trim();
    };

    const normalizeImageUrl = (url) => {
        if (!url || typeof url !== 'string') return '';
        const trimmed = url.trim();
        if (!trimmed) return '';
        if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith('data:') || trimmed.startsWith('/api/')) {
            return trimmed;
        }
        if (trimmed.startsWith('/')) {
            return `${API_BASE_URL}${trimmed}`;
        }
        return trimmed;
    };

    const getProductImages = (item) => {
        const rawImages = [];

        if (item?.imageUrls) {
            try {
                const parsed = typeof item.imageUrls === 'string'
                    ? JSON.parse(item.imageUrls)
                    : item.imageUrls;
                if (Array.isArray(parsed)) rawImages.push(...parsed);
            } catch (e) {
                console.error('Error parsing imageUrls:', e);
            }
        }

        if (item?.imageUrl) rawImages.push(item.imageUrl);
        if (Array.isArray(item?.image_paths)) rawImages.push(...item.image_paths);

        return [...new Set(rawImages.map(normalizeImageUrl).filter(Boolean))];
    };

    // Calculate discount percentage


    // Format price with Indian numbering
    const formatPrice = (price) => {
        if (!price) return '0';
        const numPrice = parseFloat(price);
        return new Intl.NumberFormat('en-IN').format(numPrice);
    };

    // Generate random rating
    const generateRandomRating = (productId) => {
        const seed = productId * 123;
        const rating = 3.5 + ((seed % 100) / 100) * 1.5;
        return Math.round(rating * 10) / 10;
    };

    // Render star rating
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={i} className="star star-full">★</span>);
        }

        if (hasHalf) {
            stars.push(<span key="half" className="star star-half">★</span>);
        }

        const remaining = 5 - Math.ceil(rating);
        for (let i = 0; i < remaining; i++) {
            stars.push(<span key={`empty-${i}`} className="star star-empty">★</span>);
        }

        return stars;
    };

    // Handle quantity change
    const handleQuantityChange = (type) => {
        if (type === 'increase') {
            setQuantity(prev => prev + 1);
        } else if (type === 'decrease' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    // Handle add to cart
    const handleAddToCart = async () => {
        setIsAddingToCart(true);
        try {
            // Track add to cart activity
            trackAddToCart(product.id, quantity, parseFloat(product.new_price));

            await new Promise(resolve => setTimeout(resolve, 800));

            // Calculate the final price with coupon discount applied
            const basePrice = parseFloat(product.new_price);
            const discountAmount = couponDiscount ? (basePrice * couponDiscount) / 100 : 0;
            const finalPrice = basePrice - discountAmount;

            const cartItem = {
                id: product.id,
                title: product.title,
                price: finalPrice, // Use discounted price
                originalPrice: parseFloat(product.old_price),
                image: product.imageUrl ? `${product.imageUrl}` : (product.image_paths?.[0] ? `${product.image_paths[0]}` : '/placeholder-image.jpg'),
                quantity: quantity,
                coupon: validationResult?.valid ? validationResult.coupon : null,
                discount: couponDiscount,
                basePrice: basePrice // Keep original price for reference
            };

            addToCart(cartItem);

            // Show success message and navigate to cart

            setTimeout(() => {
                navigate('/cart');
            }, 500);

        } catch (error) {
            console.error('Error adding to cart:', error);

        } finally {
            setIsAddingToCart(false);
        }
    };



    // Handle WhatsApp order
    const handleWhatsApp = () => {
        const message = `Hi! I'm interested in this product:
${product.title}
Price: ₹${formatPrice(calculateFinalPrice())}alert
Quantity: ${quantity}
Product Link: ${window.location.href}`;

        const whatsappUrl = `https://wa.me/9779845427041?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    // Handle EMI plan
    const handleEMI = () => {
        setIsEMIPlansModalOpen(true);
    };

    // Handle price drop alert
    const handlePriceAlert = async () => {
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            setPriceAlertMessage('Please enter a valid email address');
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setPriceAlertMessage('You will be notified when the price drops!');
            setEmail('');
        } catch (error) {
            console.error('Error setting price alert:', error);
            setPriceAlertMessage('Failed to set price alert');
        }
    };

    // Validate coupon
    const validateCoupon = async () => {
        if (!couponValidation.trim()) {
            setValidationResult({ valid: false, message: 'Please enter a coupon code' });
            return;
        }

        try {
            let storedUser = {};
            try {
                storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            } catch {
                storedUser = {};
            }

            const authToken = localStorage.getItem('authToken');
            const couponParams = new URLSearchParams();
            const userEmail = storedUser.email || localStorage.getItem('userEmail');
            const userId = storedUser.id || storedUser.user_id || storedUser.userId;

            if (userEmail) couponParams.set('email', userEmail);
            if (userId) couponParams.set('user_id', userId);

            const couponUrl = `${API_BASE_URL}/api/products/coupons/validate/${encodeURIComponent(couponValidation.trim())}${couponParams.toString() ? `?${couponParams.toString()}` : ''}`;
            const response = await fetch(couponUrl, {
                headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined
            });
            if (response.ok) {
                const coupon = await response.json();
                const expiryDate = coupon.expiry_date || coupon.expires_at ? new Date(coupon.expiry_date || coupon.expires_at) : null;
                const now = new Date();
                if (expiryDate && expiryDate < now) {
                    setValidationResult({ valid: false, message: 'Coupon has expired' });
                    setCouponDiscount(0);
                } else {
                    setValidationResult({ valid: true, coupon });
                    setCouponDiscount(parseFloat(coupon.discount_percentage) || 0);
                }
            } else {
                const errorData = await response.json();
                setValidationResult({
                    valid: false,
                    message: errorData.error || 'Invalid or expired coupon'
                });
                setCouponDiscount(0);
            }
        } catch (error) {
            console.error('Error validating coupon:', error);
            setValidationResult({
                valid: false,
                message: 'Error validating coupon'
            });
            setCouponDiscount(0);
        }
    };

    // Calculate final price with coupon
    const calculateFinalPrice = () => {
        const basePrice = parseFloat(product.new_price) * quantity;
        const discountAmount = couponDiscount ? (basePrice * couponDiscount) / 100 : 0;
        return basePrice - discountAmount;
    };

    // Share functions
    const shareProduct = (platform) => {
        const url = window.location.href;
        const title = product.title;
        const description = product.description || 'Check out this amazing product!';

        let shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                break;
            case 'pinterest':
                const imageUrl = product.image_paths?.[0] ? `${API_BASE_URL}${product.image_paths[0]}` : '';
                shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(description)}`;
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                setShareMessage('Link copied to clipboard!');
                setTimeout(() => setShareMessage(''), 3000);
                return;
            default:
                return;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    };

    const handleQuickShare = async () => {
        const url = window.location.href;
        const title = product.name || product.title || 'Sindureghari Furniture product';
        const text = `Check out ${title}`;

        try {
            if (navigator.share) {
                await navigator.share({ title, text, url });
                return;
            }

            await navigator.clipboard.writeText(url);
            setShareMessage('Link copied to clipboard!');
            setTimeout(() => setShareMessage(''), 3000);
        } catch (error) {
            console.error('Error sharing product:', error);
            setShareMessage('Unable to share right now');
            setTimeout(() => setShareMessage(''), 3000);
        }
    };

    // Toggle product details
    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    const productImages = product ? getProductImages(product) : [];
    const selectedImage = productImages[selectedImageIndex] || productImages[0];

    const showPreviousImage = useCallback(() => {
        setSelectedImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
    }, [productImages.length]);

    const showNextImage = useCallback(() => {
        setSelectedImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
    }, [productImages.length]);

    useEffect(() => {
        if (!isImageViewerOpen) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') setIsImageViewerOpen(false);
            if (event.key === 'ArrowLeft' && productImages.length > 1) showPreviousImage();
            if (event.key === 'ArrowRight' && productImages.length > 1) showNextImage();
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isImageViewerOpen, productImages.length, showNextImage, showPreviousImage]);

    // Loading state
    if (loading) {
        return (
            <div className="product-details-loading">
                <LoadingSpinner
                    size="large"
                    type="pulse"
                    message="Loading product details..."
                    color="primary"
                />
            </div>
        );
    }

    // Error state
    if (error || !product) {
        return (
            <div className="product-details-error">
                <h2>Product Not Found</h2>
                <p>{error || 'The product you are looking for does not exist.'}</p>
            </div>
        );
    }

    const rating = generateRandomRating(product.id);
    const reviewCount = Math.floor((product.id * 7 + 123) % 50) + 10;
    const hasDiscount = product.old_price && parseFloat(product.old_price) > parseFloat(product.new_price);
    const discountPercent = hasDiscount
        ? Math.round(((parseFloat(product.old_price) - parseFloat(product.new_price)) / parseFloat(product.old_price)) * 100)
        : 0;
    const productSku = product?.sku || `SF-${product?.id || '000'}`;

    const copySku = async () => {
        try {
            await navigator.clipboard.writeText(productSku);
            setShareMessage('SKU copied to clipboard!');
        } catch (error) {
            console.error('Error copying SKU:', error);
            setShareMessage('Unable to copy SKU right now');
        }
        setTimeout(() => setShareMessage(''), 3000);
    };


    return (
        <div className="product-details-container">
            <SEOComponent
                title={`${product?.name || product?.title || 'Premium Furniture'} — Buy Online Nepal | Sindureghari Furniture`}
                description={`Buy ${product?.name || product?.title || 'premium furniture'} at NPR ${formatPrice(product?.new_price)} from Sindureghari Furniture. ${product?.description ? product.description.substring(0, 140) : 'Premium handcrafted wooden furniture.'} ✓ Free Delivery ✓ EMI Available ✓ Warranty`}
                keywords={`${product?.name || ''}, ${product?.name || ''} price Nepal, buy ${product?.name || 'furniture'} online, ${product?.wooden_type || 'wooden'} furniture Nepal, sindureghari furniture, bishwokarma furniture`}
                ogTitle={`${product?.name || product?.title || 'Premium Furniture'} — NPR ${formatPrice(product?.new_price)} | Sindureghari Furniture`}
                ogDescription={`Buy ${product?.name || product?.title || 'premium furniture'} at best price in Nepal. Free delivery nationwide. EMI options available.`}
                ogImage={productImages[0] || ''}
                ogType="product"
                price={product?.new_price}
                priceCurrency="NPR"
                sku={product?.sku || `SF-${product?.id || '000'}`}
                canonicalUrl={`https://sinduregharifurniture.shop/product/${id}`}
                structuredData={{
                    "@context": "https://schema.org",
                    "@type": "Product",
                    "name": product?.name || product?.title || 'Premium Furniture',
                    "description": product?.description || 'Premium handcrafted furniture from Sindureghari, Nepal.',
                    "image": productImages[0] || '',
                    "sku": product?.sku || `SF-${product?.id || '000'}`,
                    "mpn": `SF-${product?.id || '000'}`,
                    "brand": { "@type": "Brand", "name": "Sindureghari Furniture" },
                    "manufacturer": { "@type": "Organization", "name": "Sindureghari Furniture (Bishwokarma)", "url": "https://sinduregharifurniture.shop" },
                    "category": product?.categoryName || "Furniture",
                    "material": product?.wooden_type || "Premium Wood",
                    "color": product?.product_color || undefined,
                    "offers": {
                        "@type": "Offer",
                        "priceCurrency": "NPR",
                        "price": product?.new_price || '0',
                        "priceValidUntil": new Date(new Date().getFullYear() + 1, 0, 1).toISOString().split('T')[0],
                        "availability": product?.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                        "itemCondition": "https://schema.org/NewCondition",
                        "url": `https://sinduregharifurniture.shop/product/${id}`,
                        "seller": { "@type": "Organization", "name": "Sindureghari Furniture", "url": "https://sinduregharifurniture.shop" },
                        "shippingDetails": {
                            "@type": "OfferShippingDetails",
                            "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "NPR" },
                            "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "NP" },
                            "deliveryTime": { "@type": "ShippingDeliveryTime", "handlingTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 3, "unitCode": "DAY" }, "transitTime": { "@type": "QuantitativeValue", "minValue": 2, "maxValue": 7, "unitCode": "DAY" } }
                        },
                        "hasMerchantReturnPolicy": { "@type": "MerchantReturnPolicy", "applicableCountry": "NP", "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow", "merchantReturnDays": 7, "returnMethod": "https://schema.org/ReturnByMail" }
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": rating || 4.5,
                        "reviewCount": reviewCount || 25,
                        "bestRating": 5,
                        "worstRating": 1
                    }
                }}
            />

            <div className="pd-breadcrumb">
                <button type="button" onClick={() => navigate('/products')}>Products</button>
                <span>/</span>
                <span>{product.category || product.categoryName || 'Furniture'}</span>
                <span>/</span>
                <strong>{product.name || product.title}</strong>
            </div>

            <div className="product-details-content">
                {/* Image Section */}
                <div className="product-images-section">
                    <div className="main-image-container">
                        {selectedImage ? (
                                <div className="main-image-wrapper">
                                    <span className="pd-best-seller-badge">Best Seller</span>
                                    <div className="pd-image-actions">
                                        <button type="button" className="pd-image-action-btn" onClick={handleQuickShare} aria-label="Share product">
                                            <FaShareAlt size={17} />
                                        </button>
                                        <FavoriteButton
                                            productId={product?.id}
                                            size="medium"
                                            className="pd-image-favorite"
                                        />
                                    </div>
                                    <img
                                        src={selectedImage}
                                        alt={product.name || product.title}
                                        className="main-product-image"
                                        onClick={() => setIsImageViewerOpen(true)}
                                        onError={(e) => {
                                            e.currentTarget.src = '/api/placeholder/600/600';
                                        }}
                                    />

                                    {/* Navigation arrows for multiple images */}
                                    {productImages.length > 1 && (
                                        <>
                                            <button
                                                className="image-nav-btn prev-btn"
                                                onClick={showPreviousImage}
                                                aria-label="Previous image"
                                            >
                                                <FaChevronLeft size={16} />
                                            </button>
                                            <button
                                                className="image-nav-btn next-btn"
                                                onClick={showNextImage}
                                                aria-label="Next image"
                                            >
                                                <FaChevronRight size={16} />
                                            </button>

                                            {/* Image counter */}
                                            <div className="image-counter">
                                                {selectedImageIndex + 1} / {productImages.length}
                                            </div>
                                        </>
                                    )}
                                </div>
                        ) : (
                                <div className="no-image-placeholder">
                                    <span>No Image Available</span>
                                </div>
                        )}
                    </div>

                    {productImages.length > 1 && (
                            <div className="thumbnail-gallery">
                                <div className="thumbnail-container">
                                    {productImages.map((imageUrl, index) => (
                                        <button
                                            type="button"
                                            key={index}
                                            className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                                            onClick={() => setSelectedImageIndex(index)}
                                            aria-label={`View product image ${index + 1}`}
                                        >
                                            <img
                                                src={imageUrl}
                                                alt={`${product.name || product.title} ${index + 1}`}
                                                onError={(e) => {
                                                    e.currentTarget.src = '/api/placeholder/90/90';
                                                }}
                                            />
                                            <div className="thumbnail-overlay"></div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                    )}

                    {/* Video Section */}
                    {product.videoUrl && (
                        <div className="product-video-section">
                            <h3 className="video-title">Product Video</h3>
                            <div className="video-container">
                                <video
                                    controls
                                    className="product-video"
                                    poster={(() => {
                                        return productImages[0] || '';
                                    })()}
                                >
                                    <source src={product.videoUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>
                    )}
                </div>

                {/* Product Info Section */}
                <div className="product-info-section">
                    <div className="product-header">
                        <div className="pd-status-row">
                            <span className="pd-category-pill">{product.category || product.categoryName || 'Furniture'}</span>
                            <span className={`pd-stock-pill ${Number(product.stock || 0) > 0 ? 'in-stock' : 'out-stock'}`}>
                                {Number(product.stock || 0) > 0 ? 'In stock' : 'Made to order'}
                            </span>
                        </div>
                        <h1 className="product-title">{product.name || product.title}</h1>
                        <div className="pd-sku-row">
                            <span>SKU</span>
                            <strong>{productSku}</strong>
                            <button type="button" onClick={copySku} aria-label="Copy product SKU">
                                <Copy size={14} />
                                Copy
                            </button>
                        </div>
                        <div className="product-rating">
                            <div className="stars-container">
                                {renderStars(rating)}
                            </div>
                            <span className="rating-number">({rating})</span>
                            <span className="review-count">{reviewCount} reviews</span>
                        </div>
                    </div>

                    <div className="product-description">
                        <p>{sanitizeDescription(product.description) || 'Premium quality product designed for your comfort and style.'}</p>
                    </div>

                    <div className="pd-service-strip">
                        <div>
                            <Truck size={18} />
                            <strong>Delivery</strong>
                            <span>Kathmandu & across Nepal</span>
                        </div>
                        <div>
                            <Wrench size={18} />
                            <strong>Assembly</strong>
                            <span>Available on request</span>
                        </div>
                        <div>
                            <Headphones size={18} />
                            <strong>Support</strong>
                            <span>Call or WhatsApp order help</span>
                        </div>
                    </div>

                    <div className="product-pricing">
                        <div className="pd-deal-row">
                            <span className="pd-deal-badge">Limited-Time Deal</span>
                        </div>
                        <div className="price-container">
                            <span className="current-price">₹{formatPrice(product.new_price)}</span>
                            {product.old_price && parseFloat(product.old_price) > parseFloat(product.new_price) && (
                                <span className="original-price">₹{formatPrice(product.old_price)}</span>
                            )}
                        </div>
                        {hasDiscount && (
                            <span className="pd-discount-badge">{discountPercent}% off</span>
                        )}
                        {hasDiscount && (
                            <p className="pd-mrp-line">MRP <span>₹{formatPrice(product.old_price)}</span></p>
                        )}
                        <p className="pd-unlock-line">
                            Get today&apos;s instant extra discount on this product <button type="button" onClick={() => setCouponValidation('')}>Unlock Now!</button>
                        </p>
                    </div>

                    <div className="pd-choice-panel">
                        <div className="pd-option-title">Color &amp; Finishes : <strong>{product.product_color || 'Honey Finish'}</strong></div>
                        <div className="pd-finish-grid">
                            {(() => {
                                const finishImages = productImages.length > 1 ? productImages.slice(0, 2) : [productImages[0], productImages[0]].filter(Boolean);
                                const finishNames = [product.product_color || 'Honey Finish', 'Walnut Finish'];

                                return finishImages.map((imageUrl, index) => (
                                    <button
                                        type="button"
                                        key={`${imageUrl}-${index}`}
                                        className={`pd-finish-card ${index === 0 ? 'active' : ''}`}
                                        onClick={() => setSelectedImageIndex(Math.min(index, productImages.length - 1))}
                                    >
                                        <img src={imageUrl} alt={finishNames[index]} />
                                        <span>{finishNames[index]}</span>
                                        <small>₹{formatPrice(index === 0 ? product.new_price : Number(product.new_price || 0) + 1000)}</small>
                                    </button>
                                ));
                            })()}
                        </div>
                        <div className="pd-option-title size-title">Size : <strong>{product.size || 'King Size'}</strong></div>
                        <div className="pd-size-grid">
                            <button type="button" className="pd-size-chip active">King Size</button>
                            <button type="button" className="pd-size-chip">Queen Size</button>
                        </div>
                    </div>



                    {/* Share Section */}
                    <div className="share-section">
                        <label className="share-label"><Share2 size={16} /> Share this product:</label>
                        <div className="share-buttons">
                            <button className="share-btn facebook" onClick={() => shareProduct('facebook')}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Share
                            </button>
                            <button className="share-btn twitter" onClick={() => shareProduct('twitter')}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                                Tweet
                            </button>
                            <button className="share-btn pinterest" onClick={() => shareProduct('pinterest')}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.085.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.747-1.378l-.742 2.852c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
                                </svg>
                                Pin
                            </button>
                            <button className="share-btn copy" onClick={() => shareProduct('copy')}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                                Copy
                            </button>
                        </div>
                        {shareMessage && (
                            <p className="coupon-message success">{shareMessage}</p>
                        )}
                    </div>

                    {/* Coupon Section */}
                    <div className="coupon-section">
                        <label className="coupon-label">Apply Coupon:</label>
                        <div className="coupon-controls">
                            <input
                                type="text"
                                value={couponValidation}
                                onChange={(e) => setCouponValidation(e.target.value)}
                                placeholder="Enter coupon code"
                                className="coupon-input"
                            />
                            <button
                                className="apply-coupon-btn"
                                onClick={validateCoupon}
                            >
                                Apply
                            </button>
                        </div>
                        {validationResult && (
                            <p className={`coupon-message ${validationResult.valid ? 'success' : 'error'}`}>
                                {validationResult.message}
                                {validationResult.valid && ` (${parseFloat(validationResult.coupon.discount_percentage)}% off)`}
                            </p>
                        )}
                    </div>

                    {/* Price Drop Alert */}
                    <div className="price-alert-section">
                        <label className="price-alert-label">Price Drop Alert:</label>
                        <div className="price-alert-controls">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="price-alert-input"
                            />
                            <button
                                className="price-alert-btn"
                                onClick={handlePriceAlert}
                            >
                                Notify Me
                            </button>
                        </div>
                        {priceAlertMessage && (
                            <p className={`price-alert-message ${priceAlertMessage.includes('Failed') ? 'error' : 'success'}`}>
                                {priceAlertMessage}
                            </p>
                        )}
                    </div>

                    {/* Product Details Section */}
                    <div className="product-details-section">
                        <div className="details-header" onClick={toggleDetails}>
                            <h3>Product Specifications</h3>
                            <ChevronDown size={20} style={{ transform: showDetails ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                        </div>
                        <div className={`details-content ${showDetails ? 'active' : ''}`}>
                            <ul className="details-list">
                                <li>
                                    <span className="label">Product ID:</span>
                                    <span className="value">#{product.id}</span>
                                </li>
                                <li>
                                    <span className="label">SKU:</span>
                                    <span className="value">{productSku}</span>
                                </li>
                                <li>
                                    <span className="label">Category:</span>
                                    <span className="value">{product.category || 'General'}</span>
                                </li>
                                <li>
                                    <span className="label">Brand:</span>
                                    <span className="value">{product.brand || 'Premium Brand'}</span>
                                </li>
                                <li>
                                    <span className="label">Warranty:</span>
                                    <span className="value">1 Year Manufacturer Warranty</span>
                                </li>
                                <li>
                                    <span className="label">Material:</span>
                                    <span className="value">Premium Quality Material</span>
                                </li>
                                <li>
                                    <span className="label">Origin:</span>
                                    <span className="value">Made in India</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="quantity-section">
                        <label className="quantity-label">Quantity:</label>
                        <div className="quantity-controls">
                            <button
                                className="quantity-btn"
                                onClick={() => handleQuantityChange('decrease')}
                                disabled={quantity <= 1}
                            >
                                -
                            </button>
                            <span className="quantity-display">{quantity}</span>
                            <button
                                className="quantity-btn"
                                onClick={() => handleQuantityChange('increase')}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Cart Section with All Buttons */}
                    <div className="cart-section">
                        <div className="cart-buttons-container">
                            <button
                                className={`add-to-cart-btn ${isAddingToCart ? 'loading' : ''}`}
                                onClick={handleAddToCart}
                                disabled={isAddingToCart}
                            >
                                {isAddingToCart ? (
                                    <>
                                        <div className="pd-btn-spinner"></div>
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={20} />
                                        Add to Cart
                                    </>
                                )}
                            </button>

                            <div className="cart-buttons-secondary">
                                <FavoriteButton
                                    productId={product?.id}
                                    size="medium"
                                    className="favorite-btn-detail"
                                />

                                <button className="whatsapp-btn" onClick={handleWhatsApp}>
                                    <MessageCircle size={18} />
                                    WhatsApp
                                </button>

                                <button className="emi-btn" onClick={handleEMI}>
                                    <CreditCard size={18} />
                                    EMI Plan
                                </button>
                            </div>
                        </div>

                        <div className="total-price">
                            <span>Total: ₹{formatPrice(calculateFinalPrice())}</span>
                        </div>
                    </div>

                    {/* EMI Plans Modal */}
                    <EMIPlansModal
                        isOpen={isEMIPlansModalOpen}
                        onClose={() => setIsEMIPlansModalOpen(false)}
                        productPrice={calculateFinalPrice()}
                        formatPrice={formatPrice}
                    />

                    {/* Trust Section */}
                    <div className="trust-section">
                        <h3 className="trust-title">Why Choose Us?</h3>
                        <div className="trust-indicators">
                            <div className="trust-item">
                                <BadgeCheck size={24} />
                                <h4>Premium Quality</h4>
                                <p>100% authentic products with quality guarantee</p>
                            </div>
                            <div className="trust-item">
                                <RotateCcw size={24} />
                                <h4>Easy Returns</h4>
                                <p>7-day easy return policy with full refund</p>
                            </div>
                            <div className="trust-item">
                                <Truck size={24} />
                                <h4>Fast Delivery</h4>
                                <p>Free shipping on orders above ₹499</p>
                            </div>
                            <div className="trust-item">
                                <LockKeyhole size={24} />
                                <h4>Secure Payment</h4>
                                <p>100% secure payment with SSL encryption</p>
                            </div>
                            <div className="trust-item">
                                <Headphones size={24} />
                                <h4>24/7 Support</h4>
                                <p>Round-the-clock customer support</p>
                            </div>
                            <div className="trust-item">
                                <Activity size={24} />
                                <h4>Live Tracking</h4>
                                <p>Real-time order tracking available</p>
                            </div>
                        </div>
                    </div>

                    {/* Product Features */}
                    <div className="product-features">
                        <div className="feature-item">
                            <div className="feature-icon-wrapper">
                                <BadgeCheck size={18} />
                            </div>
                            <div className="feature-text-wrapper">
                                <span>Premium Quality</span>
                                <small>Handcrafted premium wood</small>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon-wrapper">
                                <ShieldCheck size={18} />
                            </div>
                            <div className="feature-text-wrapper">
                                <span>Quality Assured</span>
                                <small>Strict multi-step checking</small>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon-wrapper">
                                <LockKeyhole size={18} />
                            </div>
                            <div className="feature-text-wrapper">
                                <span>Secure Purchase</span>
                                <small>100% verified SSL gate</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <ProductTabs
                productId={id}
                category={product.category}
                generateRandomRating={generateRandomRating}
                renderStars={renderStars}
                formatPrice={formatPrice}
                API_BASE={API_BASE_URL}
                product={product}
            />

            {isImageViewerOpen && selectedImage && (
                <div className="pd-image-lightbox" role="dialog" aria-modal="true" aria-label="Product image viewer" onClick={() => setIsImageViewerOpen(false)}>
                    <div className="pd-image-lightbox__topbar" onClick={(event) => event.stopPropagation()}>
                        <span>{selectedImageIndex + 1} / {productImages.length}</span>
                        <button type="button" onClick={() => setIsImageViewerOpen(false)} aria-label="Close image viewer">
                            <X size={22} />
                        </button>
                    </div>

                    {productImages.length > 1 && (
                        <button
                            type="button"
                            className="pd-image-lightbox__nav pd-image-lightbox__nav--prev"
                            onClick={(event) => {
                                event.stopPropagation();
                                showPreviousImage();
                            }}
                            aria-label="Previous image"
                        >
                            <FaChevronLeft size={20} />
                        </button>
                    )}

                    <div className="pd-image-lightbox__stage" onClick={(event) => event.stopPropagation()}>
                        <img src={selectedImage} alt={product.name || product.title} />
                    </div>

                    {productImages.length > 1 && (
                        <button
                            type="button"
                            className="pd-image-lightbox__nav pd-image-lightbox__nav--next"
                            onClick={(event) => {
                                event.stopPropagation();
                                showNextImage();
                            }}
                            aria-label="Next image"
                        >
                            <FaChevronRight size={20} />
                        </button>
                    )}

                    {productImages.length > 1 && (
                        <div className="pd-image-lightbox__thumbs" onClick={(event) => event.stopPropagation()}>
                            {productImages.map((imageUrl, index) => (
                                <button
                                    type="button"
                                    key={`${imageUrl}-${index}`}
                                    className={index === selectedImageIndex ? 'active' : ''}
                                    onClick={() => setSelectedImageIndex(index)}
                                    aria-label={`Open image ${index + 1}`}
                                >
                                    <img src={imageUrl} alt={`${product.name || product.title} thumbnail ${index + 1}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
