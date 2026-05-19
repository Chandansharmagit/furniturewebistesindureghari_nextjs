import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FavoriteButton from '../common/FavoriteButton';
import SEOComponent from '../../components/SEO/SEOComponent';
import { buildApiUrl, PRODUCT_ENDPOINTS } from '../../config/api';
import './HomeAppliancesViewAll.css';

export default function HomeAppliancesViewAll() {
    const location = useLocation();
    const initialCategory = location.state?.category || 'bed'; // Default to 'bed' if none passed

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null); // Removed due to unused warning
    const [sortBy, setSortBy] = useState('newest');
    const [filterBy, setFilterBy] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);
    const [activeCategory, setActiveCategory] = useState(initialCategory);

    // Fetch products from API
    const fetchProducts = async (category) => {
        try {
            setLoading(true);
            // setError(null);

            // Build URL based on passed category or fallback
            let url = buildApiUrl(`${PRODUCT_ENDPOINTS.LIST}?categoryName=${category}`);
            let response = await axios.get(url);

            if (response.data && response.data.length > 0) {
                setProducts(response.data);
            } else {
                console.log(`No products found for ${category}, falling back to 'bed' or all...`);
                // Final fallback: fetch beds specifically if requested was something else empty
                const bedUrl = buildApiUrl(`${PRODUCT_ENDPOINTS.LIST}?categoryName=bed`);
                const bedResponse = await axios.get(bedUrl);

                if (bedResponse.data && bedResponse.data.length > 0) {
                    setProducts(bedResponse.data);
                    setActiveCategory('bed');
                } else {
                    // Absolute fallback: all products
                    const allUrl = buildApiUrl(PRODUCT_ENDPOINTS.LIST);
                    const allResponse = await axios.get(allUrl);
                    setProducts(allResponse.data || []);
                    setActiveCategory('All Collections');
                }
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            // setError('The royal vault is temporarily unreachable. Please try again soon.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(activeCategory);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeCategory]);

    const formatPrice = (price) => {
        if (!price) return '0';
        return new Intl.NumberFormat('en-NP').format(parseFloat(price));
    };

    const calculateDiscount = (oldPrice, newPrice) => {
        if (!oldPrice || !newPrice) return 0;
        const old = parseFloat(oldPrice);
        const newP = parseFloat(newPrice);
        if (old <= newP) return 0;
        return Math.round(((old - newP) / old) * 100);
    };

    const renderStars = (rating = 4.5) => {
        return (
            <div className="royal-stars">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className={`royal-star ${i < Math.floor(rating) ? 'full' : 'empty'}`}>★</span>
                ))}
            </div>
        );
    };

    // Processing products
    const getProcessedProducts = () => {
        let processed = [...products];

        // Filter
        if (filterBy === 'on-sale') {
            processed = processed.filter(p => calculateDiscount(p.old_price, p.new_price) > 0);
        } else if (filterBy === 'in-stock') {
            processed = processed.filter(p => (p.stock || 0) > 0);
        }

        // Sort
        if (sortBy === 'price-low') processed.sort((a, b) => a.new_price - b.new_price);
        else if (sortBy === 'price-high') processed.sort((a, b) => b.new_price - a.new_price);
        else if (sortBy === 'name') processed.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        else processed.sort((a, b) => b.id - a.id);

        return processed;
    };

    const processedProducts = getProcessedProducts();
    const indexOfLast = currentPage * productsPerPage;
    const currentProducts = processedProducts.slice(indexOfLast - productsPerPage, indexOfLast);
    const totalPages = Math.ceil(processedProducts.length / productsPerPage);

    if (loading) {
        return (
            <div className="royal-full-page-loader">
                <div className="spinner-royal"></div>
                <p>Establishing Your Royal Presence...</p>
            </div>
        );
    }

    return (
        <div className="royal-luxury-page">
            <SEOComponent title={`Premium ${activeCategory} | Royal Collection | Sindureghari`} />

            {/* Elite Hero with Gold Accents */}
            <section className="royal-elite-hero">
                <div className="royal-hero-backdrop"></div>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="hero-inner"
                >
                    <span className="hero-elite-label">The Sovereign Collection</span>
                    <h1 className="hero-main-title">Exquisite <span>{activeCategory}</span></h1>
                    <div className="hero-divider-gold"></div>
                    <p className="hero-desc">Experience the pinnacle of Nepalese craftsmanship. Our elite range of {activeCategory} is curated for those who demand nothing less than perfection.</p>
                </motion.div>

                <div className="hero-scroll-indicator">
                    <span>DESCEND TO LUXURY</span>
                    <div className="indicator-line"></div>
                </div>
            </section>

            {/* Refined Sorting Center */}
            <div className="royal-luxury-controls">
                <div className="controls-container">
                    <div className="royal-select-group">
                        <label>Refine By Status</label>
                        <select value={filterBy} onChange={(e) => { setFilterBy(e.target.value); setCurrentPage(1); }}>
                            <option value="all">All Masterpieces</option>
                            <option value="on-sale">Elite Offers</option>
                            <option value="in-stock">Immediate Availability</option>
                        </select>
                    </div>
                    <div className="royal-select-group">
                        <label>Sovereign Arrangement</label>
                        <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}>
                            <option value="newest">Latest Acquisitions</option>
                            <option value="price-low">Value to Prestige</option>
                            <option value="price-high">Prestige to Value</option>
                            <option value="name">Alphabetical Order</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Masterpiece Showcase */}
            <section className="royal-masterpiece-section">
                <AnimatePresence mode="wait">
                    {currentProducts.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="royal-empty-vault"
                        >
                            <h3>Vault Temporarily Sealed</h3>
                            <p>We are currently curating new {activeCategory} arrivals. Please broaden your selection.</p>
                            <button onClick={() => { setFilterBy('all'); setSortBy('newest'); }} className="royal-back-btn">Return to Full Collection</button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid"
                            className="royal-masterpiece-grid"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: 0.15 } }
                            }}
                        >
                            {currentProducts.map((product, index) => {
                                const disc = calculateDiscount(product.old_price, product.new_price);
                                const rating = 4.5 + (index % 5) * 0.1;

                                return (
                                    <motion.div
                                        key={product.id || index}
                                        variants={{
                                            hidden: { opacity: 0, y: 40, scale: 0.9 },
                                            visible: { opacity: 1, y: 0, scale: 1 }
                                        }}
                                        className="royal-product-artifact"
                                    >
                                        <div className="artifact-visuals">
                                            <Link to={`/product/${product.id}`}>
                                                <img src={product.imageUrl} alt={product.name} />
                                                <div className="artifact-overlay"></div>
                                            </Link>
                                            <div className="artifact-actions">
                                                <FavoriteButton productId={product.id} size="small" />
                                            </div>
                                            {disc > 0 && <div className="artifact-status">-{disc}% PRESTIGE</div>}
                                        </div>

                                        <div className="artifact-details">
                                            <div className="artifact-meta">
                                                <span className="artifact-tag">{activeCategory}</span>
                                                <div className="artifact-rating">
                                                    {renderStars(rating)}
                                                    <span>{rating}</span>
                                                </div>
                                            </div>
                                            <h3 className="artifact-title">
                                                <Link to={`/product/${product.id}`}>{product.name}</Link>
                                            </h3>
                                            {product.description && (
                                                <p className="artifact-snippet">
                                                    {product.description.length > 70
                                                        ? `${product.description.substring(0, 70)}...`
                                                        : product.description
                                                    }
                                                </p>
                                            )}

                                            <div className="artifact-bottom">
                                                <div className="artifact-pricing">
                                                    {disc > 0 && <span className="old-val">Rs. {formatPrice(product.old_price)}</span>}
                                                    <span className="new-val">Rs. {formatPrice(product.new_price)}</span>
                                                </div>
                                                <Link to={`/product/${product.id}`} className="artifact-cta">
                                                    ACQUIRE
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Sovereign Pagination */}
                {totalPages > 1 && (
                    <div className="royal-sovereign-pagination">
                        <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>PREVIOUS</button>
                        <div className="page-indices">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={currentPage === i + 1 ? 'active' : ''}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>NEXT</button>
                    </div>
                )}
            </section>
        </div>
    );
}