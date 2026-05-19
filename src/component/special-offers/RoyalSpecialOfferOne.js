import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './RoyalSpecialOfferOne.css';

export default function RoyalSpecialOfferOne() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSpecialProducts();
    }, []);

    const fetchSpecialProducts = async () => {
        try {
            setLoading(true);
            // Mock data for Special offer products
            const mockProducts = [
                {
                    id: 1,
                    name: "Royal Special Dining Set",
                    description: "Complete dining set perfect for premium home gatherings",
                    price: 45000,
                    originalPrice: 55000,
                    discount: 18,
                    image: "/api/placeholder/600/400",
                    category: "Dining Room"
                },
                {
                    id: 2,
                    name: "Premium Living Room Collection",
                    description: "Elegant living room furniture with royal aesthetics",
                    price: 85000,
                    originalPrice: 100000,
                    discount: 15,
                    image: "/api/placeholder/600/400",
                    category: "Living Room"
                },
                {
                    id: 3,
                    name: "Traditional Royal Cabinet",
                    description: "Handcrafted wooden cabinet with premium royal details",
                    price: 25000,
                    originalPrice: 30000,
                    discount: 17,
                    image: "/api/placeholder/600/400",
                    category: "Storage"
                },
                {
                    id: 4,
                    name: "Royal Decoration Shelf",
                    description: "Perfect shelf for displaying your premium decor collection",
                    price: 15000,
                    originalPrice: 18000,
                    discount: 17,
                    image: "/api/placeholder/600/400",
                    category: "Decoration"
                }
            ];

            setProducts(mockProducts);
            setLoading(false);
        } catch (err) {
            setError('Failed to load special offer products');
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-NP', {
            style: 'currency',
            currency: 'NPR',
            minimumFractionDigits: 0
        }).format(price).replace('NPR', 'Rs.');
    };

    if (loading) {
        return (
            <div className="royal-offer-container">
                <div className="royal-loading">
                    <div className="royal-spinner"></div>
                    <p>Loading Exclusive Offers...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="royal-offer-container">
                <div className="royal-error">
                    <h2>Oops! Something went wrong</h2>
                    <p>{error}</p>
                    <button onClick={fetchSpecialProducts} className="royal-retry-btn">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="royal-offer-container">
            {/* Header Section */}
            <div className="royal-header">
                <div className="royal-header-content">
                    <h1 className="royal-title">🎉 Royal Special Offers 🎉</h1>
                    <p className="royal-subtitle">
                        Discover our exclusive premium furniture collection.
                        Special discounts on royal furniture for your elegant home!
                    </p>
                </div>
                <div className="royal-breadcrumb">
                    <Link to="/" className="royal-breadcrumb-link">Home</Link>
                    <span className="royal-breadcrumb-separator">/</span>
                    <span className="royal-breadcrumb-current">Royal Special Offers</span>
                </div>
            </div>

            {/* Featured Offers Section */}
            <div className="royal-featured-section">
                <h2 className="royal-section-title">Featured Royal Collections</h2>
                <div className="royal-featured-grid">
                    <div className="royal-featured-item">
                        <div className="royal-featured-image">
                            <img src="/api/placeholder/600/400" alt="Royal Living Room Collection" />
                            <div className="royal-featured-overlay">
                                <div className="royal-featured-content">
                                    <h3>Living Room Collection</h3>
                                    <p>Transform your living space with royal aesthetics</p>
                                    <div className="royal-featured-discount">Up to 20% OFF</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="royal-featured-item">
                        <div className="royal-featured-image">
                            <img src="/api/placeholder/600/400" alt="Royal Dining Collection" />
                            <div className="royal-featured-overlay">
                                <div className="royal-featured-content">
                                    <h3>Dining Collection</h3>
                                    <p>Perfect dining sets for premium gatherings</p>
                                    <div className="royal-featured-discount">Up to 18% OFF</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="royal-products-section">
                <h2 className="royal-section-title">All Royal Special Offers</h2>
                <div className="royal-products-grid">
                    {products.map((product) => (
                        <div key={product.id} className="royal-product-card">
                            <div className="royal-product-image-wrapper">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="dashain-product-image"
                                />
                                <div className="royal-discount-badge">
                                    {product.discount}% OFF
                                </div>
                            </div>
                            <div className="royal-product-info">
                                <h3 className="royal-product-title">
                                    <Link to={`/product/${product.id}`}>
                                        {product.name}
                                    </Link>
                                </h3>
                                <p className="royal-product-description">
                                    {product.description}
                                </p>
                                <div className="royal-product-category">
                                    {product.category}
                                </div>
                                <div className="royal-product-pricing">
                                    <span className="royal-current-price">
                                        {formatPrice(product.price)}
                                    </span>
                                    <span className="royal-original-price">
                                        {formatPrice(product.originalPrice)}
                                    </span>
                                </div>
                                <div className="royal-savings">
                                    You save: {formatPrice(product.originalPrice - product.price)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Call to Action */}
            <div className="royal-cta-section">
                <div className="royal-cta-content">
                    <h2>Premium Living Awaits!</h2>
                    <p>Limited time Royal Special offers. Shop now and save big on premium furniture!</p>
                    <Link to="/" className="royal-cta-button">
                        Shop All Products
                    </Link>
                </div>
            </div>
        </div>
    );
}
