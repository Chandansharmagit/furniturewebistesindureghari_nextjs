import React, { useState, useEffect } from 'react';
import SEOComponent from '../../components/SEO/SEOComponent';
import { Link } from 'react-router-dom';
import { buildApiUrl, PRODUCT_ENDPOINTS } from '../../config/api';
import './SpecialOffersAll.css';

const SpecialOffersAll = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const fetchSpecialProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const categoryQueries = [
                'royal-offer',
                'special-offer',
                'festival-offer',
                'dashainoffer' // Keep for backward compatibility
            ];

            let allProducts = [];

            for (const category of categoryQueries) {
                try {
                    console.log(`Fetching products for category: ${category}`);
                    const response = await fetch(`${buildApiUrl(PRODUCT_ENDPOINTS.LIST)}?categoryName=${category}`);

                    if (response.ok) {
                        const data = await response.json();

                        // Handle both structured response and direct array response
                        let products = [];
                        if (data.success && Array.isArray(data.data)) {
                            products = data.data;
                        } else if (Array.isArray(data)) {
                            products = data;
                        } else if (data.products && Array.isArray(data.products)) {
                            products = data.products;
                        }

                        if (products.length > 0) {
                            console.log(`Found ${products.length} products for category: ${category}`);
                            allProducts = [...allProducts, ...products];
                        }
                    }
                } catch (err) {
                    console.warn(`Failed to fetch products for category: ${category}`, err);
                }
            }

            // Remove duplicates based on product ID
            const uniqueProducts = allProducts.filter((product, index, self) =>
                index === self.findIndex(p => p.id === product.id)
            );

            setProducts(uniqueProducts);

        } catch (err) {
            console.error('Error fetching special products:', err);
            setError(err.message || 'Failed to load special offers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchSpecialProducts();
    }, []);

    const formatPrice = (price) => {
        if (!price) return 'Price not available';
        const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^\d.-]/g, '')) : price;
        if (isNaN(numPrice)) return 'Price not available';
        return new Intl.NumberFormat('en-NP', {
            style: 'currency',
            currency: 'NPR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(numPrice).replace('NPR', 'Rs.');
    };

    if (loading) {
        return (
            <div className="special-all-container">
                <div className="special-all-loading">
                    <div className="special-all-spinner"></div>
                    <p>Loading all exclusive offers...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="special-all-container">
                <div className="special-all-error">
                    <h2>Oops! Something went wrong</h2>
                    <p>{error}</p>
                    <button onClick={fetchSpecialProducts} className="special-all-retry-btn">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <SEOComponent
                title="All Royal Special Offers - Best Furniture Deals | Bishwokarma Furniture Nepal"
                description="Explore all our exclusive Royal Special offers with amazing discounts on premium furniture. Find the best deals on sofas, beds, dining sets and more."
                keywords="special offers Nepal, furniture deals Nepal, discount furniture Nepal, royal furniture sale, premium offers Nepal"
                ogTitle="All Royal Special Offers - Best Furniture Deals"
                ogDescription="Explore all our exclusive Royal Special offers with amazing discounts on premium furniture."
                ogImage="https://sinduregharifurniture.shop/images/special-offers-banner.jpg"
                ogType="website"
            />

            <div className="special-all-container">
                {/* Header Section */}
                <div className="special-all-header">
                    <div className="special-all-header-content">
                        <h1 className="special-all-title">Royal Special Offers</h1>
                        <p className="special-all-subtitle">
                            Discover all our exclusive deals with amazing discounts on premium furniture
                        </p>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="special-all-products-section">
                    <div className="special-all-section-header">
                        <h2 className="special-all-section-title">All Premium Special Offers ({products.length} items)</h2>
                    </div>
                    {products.length === 0 ? (
                        <div className="special-all-error">
                            <h2>No Special Offers Found</h2>
                            <p>We do not have any special offers available at the moment.</p>
                            <Link to="/" className="special-all-contact-btn">
                                Browse All Products
                            </Link>
                        </div>
                    ) : (
                        <div className="special-all-products-grid">
                            {products.map((product) => (
                            <div key={product.id} className="special-all-product-card">
                                <div className="special-all-product-image-wrapper">
                                    <img
                                        src={product.imageUrl || '/api/placeholder/300/250'}
                                        alt={product.name || 'Product'}
                                        className="special-all-product-image"
                                        loading="lazy"
                                    />
                                    {product.old_price && product.new_price && parseFloat(product.old_price) > parseFloat(product.new_price) && (
                                        <div className="special-all-discount-badge">
                                            -{Math.round(((parseFloat(product.old_price) - parseFloat(product.new_price)) / parseFloat(product.old_price)) * 100)}%
                                        </div>
                                    )}
                                </div>
                                <div className="special-all-product-info">
                                    <h3 className="special-all-product-name">{product.name || 'Unnamed Product'}</h3>
                                    <p className="special-all-product-description">
                                        {product.description ?
                                            (product.description.length > 100 ?
                                                `${product.description.substring(0, 100)}...` :
                                                product.description
                                            ) :
                                            'Premium quality furniture with excellent craftsmanship'
                                        }
                                    </p>
                                    <div className="special-all-product-pricing">
                                        <span className="special-all-current-price">
                                            {formatPrice(product.new_price)}
                                        </span>
                                        {product.old_price && product.old_price !== product.new_price && (
                                            <span className="special-all-original-price">
                                                {formatPrice(product.old_price)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="special-all-product-actions">
                                        <Link
                                            to={`/product/${product.id}`}
                                            className="special-all-view-details-btn"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Special Banner */}
                {products.length > 0 && (
                    <div className="special-all-special-banner">
                    <div className="special-all-banner-content">
                        <h3>🎉 Limited Time Premium Offers!</h3>
                        <p>Do not miss out on these exclusive deals. Offer valid until stocks last!</p>
                        <Link to="/contact" className="special-all-contact-btn">
                            Contact Us for More Deals
                        </Link>
                    </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SpecialOffersAll;
