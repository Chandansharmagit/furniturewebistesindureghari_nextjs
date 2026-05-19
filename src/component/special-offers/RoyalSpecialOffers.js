import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { buildApiUrl, PRODUCT_ENDPOINTS } from '../../config/api';
import './RoyalSpecialOffers.css';

export default function RoyalSpecialOffers() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pageData, setPageData] = useState({
        title: 'Royal Special Collection - Exclusive Furniture Offers | Furniture Sindureghari',
        description: 'Discover our exclusive Royal Special furniture collection. Transform your home with elegant designs and premium savings on quality furniture.',
        keywords: 'Special offers, premium furniture, royal collection, Nepal furniture, exclusive collection, home decor, quality furniture, premium savings',
        ogImage: 'https://sinduregharifurniture.shop/images/special-premium-collection.jpg'
    });

    useEffect(() => {
        fetchSpecialProducts();
    }, []);

    const fetchSpecialProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Fetching all products for filtering Royal Special offers...');

            // Fetch all products as the primary source to ensure we don't miss any due to category naming inconsistencies
            const response = await fetch(`${buildApiUrl(PRODUCT_ENDPOINTS.LIST)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.status}`);
            }

            const responseData = await response.json();
            const allProducts = Array.isArray(responseData) ? responseData : responseData.products || [];

            // Robust filtering for Royal Special products
            // We look for "offer", "royal", or "dashain" in the category name primarily
            const filteredProducts = allProducts.filter(product => {
                const catName = (product.categoryName || product.category || '').toLowerCase();
                return (
                    catName.includes('offer') ||
                    catName.includes('royal') ||
                    catName.includes('dashain')
                );
            });

            console.log(`Found ${filteredProducts.length} special products from ${allProducts.length} total products`);

            if (filteredProducts.length === 0) {
                throw new Error('No special offer products found in the database');
            }

            let data = filteredProducts;

            // Transform API data to match component structure
            const transformedProducts = data.map((product, index) => {
                // Parse image URLs
                let imageUrl = product.imageUrl;
                if (!imageUrl && product.imageUrls) {
                    try {
                        const imageUrls = typeof product.imageUrls === 'string' ? JSON.parse(product.imageUrls) : product.imageUrls;
                        imageUrl = Array.isArray(imageUrls) ? imageUrls[0] : imageUrls;
                    } catch (e) {
                        console.warn('Failed to parse imageUrls:', product.imageUrls);
                    }
                }

                return {
                    id: product.id,
                    name: product.name || 'Unnamed Product',
                    description: product.description || `Premium ${product.categoryName || 'furniture'} for your home`,
                    price: parseFloat(product.new_price) || 0,
                    originalPrice: parseFloat(product.old_price) || (parseFloat(product.new_price) * 1.25),
                    discount: product.old_price && product.new_price
                        ? Math.round(((parseFloat(product.old_price) - parseFloat(product.new_price)) / parseFloat(product.old_price)) * 100)
                        : 20, // Default discount if not available
                    image: imageUrl || `/api/placeholder/600/400`,
                    category: product.categoryName || product.category || 'Furniture'
                };
            });

            // Update page metadata based on actual products
            if (transformedProducts.length > 0) {
                const firstProduct = transformedProducts[0];
                setPageData({
                    title: `Royal Special Collection - ${transformedProducts.length} Exclusive Offers | Furniture Sindureghari`,
                    description: `Discover ${transformedProducts.length} premium furniture pieces in our Royal Special collection. Starting from Rs. ${Math.min(...transformedProducts.map(p => p.price)).toLocaleString()} with up to ${Math.max(...transformedProducts.map(p => p.discount))}% off.`,
                    keywords: `${transformedProducts.map(p => p.name).slice(0, 5).join(', ')}, premium furniture, Nepal furniture, royal offers`,
                    ogImage: firstProduct.image.startsWith('http') ? firstProduct.image : `https://sinduregharifurniture.shop${firstProduct.image}`
                });
            }

            // Sort by ID descending (assuming higher ID = newer) to show newest offers first
            const sortedProducts = transformedProducts.sort((a, b) => b.id - a.id);
            setProducts(sortedProducts);
            setLoading(false);

        } catch (err) {
            console.error('Error fetching special offer products:', err);
            setError(err.message);
            setLoading(false);
            setProducts([]);
        }
    };


    if (loading) {
        return (
            <div className="royal-special-container">
                <div className="royal-special-loading">
                    <div className="royal-special-spinner"></div>
                    <p>Loading Exclusive Offers...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="royal-special-container">
                <Helmet>
                    <title>Exclusive Offers - Furniture Sindureghari</title>
                    <meta name="description" content="Exclusive furniture offers currently unavailable. Please check back soon for royal deals." />
                </Helmet>
                <div className="royal-special-error">
                    <h2>Exclusive Offers Currently Unavailable</h2>
                    <p>{error}</p>
                    <button onClick={fetchSpecialProducts} className="royal-special-retry-btn">
                        Try Again
                    </button>
                    <div style={{ marginTop: '20px' }}>
                        <Link to="/" className="royal-special-breadcrumb-link">
                            Browse All Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="royal-special-container">
                <Helmet>
                    <title>No Exclusive Offers Available - Furniture Sindureghari</title>
                </Helmet>
                <div className="royal-special-error">
                    <h2>No Special Offers Found</h2>
                    <p>We don't have any specific offers available at the moment.</p>
                    <div style={{ marginTop: '20px' }}>
                        <Link to="/" className="royal-special-breadcrumb-link">
                            Browse All Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="royal-special-container">
            <Helmet>
                <title>{pageData.title}</title>
                <meta name="description" content={pageData.description} />
                <meta name="keywords" content={pageData.keywords} />
                <meta property="og:title" content={pageData.title} />
                <meta property="og:description" content={pageData.description} />
                <meta property="og:image" content={pageData.ogImage} />
                <meta property="og:url" content={window.location.href} />
                <meta name="twitter:title" content={pageData.title} />
                <meta name="twitter:description" content={pageData.description} />
                <meta name="twitter:image" content={pageData.ogImage} />
            </Helmet>

            {/* Header Section */}
            <div className="royal-special-header">
                <div className="royal-special-header-content">
                    <h1 className="royal-special-title">Royal Special Collection</h1>
                    <p className="royal-special-subtitle">
                        Discover our exclusive premium furniture collection.
                        Transform your home with elegant designs and royal savings! ({products.length} items available)
                    </p>
                </div>
                <div className="royal-special-breadcrumb">
                    <Link to="/" className="royal-special-breadcrumb-link">Home</Link>
                    <span className="royal-special-breadcrumb-separator">/</span>
                    <span className="royal-special-breadcrumb-current">Royal Special Offers</span>
                </div>
            </div>

            {/* Hero Section */}
            <div className="royal-special-hero-section">
                <div className="royal-special-hero-content">
                    <div className="royal-special-hero-text">
                        <h2>Premium Royal Collection</h2>
                        <p>
                            Celebrate your home in style with our carefully curated premium furniture collection.
                            Each piece is crafted with attention to detail and designed to bring elegance to your living space.
                        </p>
                        <div className="royal-special-hero-features">
                            <div className="royal-special-feature">
                                <span className="royal-special-feature-icon">✨</span>
                                <span>Premium Quality Materials</span>
                            </div>
                            <div className="royal-special-feature">
                                <span className="royal-special-feature-icon">🎯</span>
                                <span>Up to {Math.max(...products.map(p => p.discount))}% Royal Discount</span>
                            </div>
                            <div className="royal-special-feature">
                                <span className="royal-special-feature-icon">🚚</span>
                                <span>Free Home Delivery</span>
                            </div>
                            <div className="royal-special-feature">
                                <span className="royal-special-feature-icon">🛠️</span>
                                <span>Professional Installation</span>
                            </div>
                        </div>
                    </div>
                    <div className="royal-special-hero-images">
                        <div className="royal-special-hero-image-left">
                            <img
                                src={products[0]?.image || "/api/placeholder/400/300"}
                                alt={products[0]?.name || "Royal Furniture 1"}
                            />
                            <div className="royal-special-image-label">
                                {products[0]?.name || "Elegant Living"}
                            </div>
                        </div>
                        <div className="royal-special-hero-image-right">
                            <img
                                src={products[1]?.image || products[0]?.image || "/api/placeholder/400/300"}
                                alt={products[1]?.name || products[0]?.name || "Royal Furniture 2"}
                            />
                            <div className="royal-special-image-label">
                                {products[1]?.name || products[0]?.name || "Royal Comfort"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="royal-special-products-section">
                <div className="royal-special-section-header">
                    <h2 className="royal-special-section-title">Royal Special Offers ({products.length} items)</h2>
                    {products.length > 4 && (
                        <Link to="/special-offers-all" className="royal-special-view-all-btn">
                            View All Offers
                        </Link>
                    )}
                </div>
                <div className="royal-special-products-grid">
                    {products.slice(0, 4).map((product) => (
                        <div key={product.id} className="royal-special-product-card">
                            <div className="royal-special-product-image-wrapper">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="royal-special-product-image"
                                />
                                <div className="royal-special-discount-badge">
                                    {product.discount}% OFF
                                </div>
                            </div>
                            <div className="royal-special-product-info">
                                <h3 className="royal-special-product-title">
                                    <Link to={`/product/${product.id}`}>
                                        {product.name.length > 15
                                            ? product.name.substring(0, 85) + "..."
                                            : product.name}
                                    </Link>
                                </h3>
                                {/* <div className="royal-special-product-category">
                                    {product.category}
                                </div>
                                <div className="royal-special-product-pricing">
                                    <span className="royal-special-current-price">
                                        {formatPrice(product.price)}
                                    </span>
                                    <span className="royal-special-original-price">
                                        {formatPrice(product.originalPrice)}
                                    </span>
                                </div>
                                <div className="royal-special-savings">
                                    You save: {formatPrice(product.originalPrice - product.price)}
                                </div> */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Special Banner */}
            <div className="royal-special-banner-section">
                <div className="royal-special-banner-content">
                    <div className="royal-special-banner-text">
                        <h2>Special Financing Available!</h2>
                        <p>Get 0% interest for 12 months on purchases above Rs. 50,000</p>
                    </div>
                    <div className="royal-special-banner-action">
                        <Link to="/contact" className="royal-special-banner-button">
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
