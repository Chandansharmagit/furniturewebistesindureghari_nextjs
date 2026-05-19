import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { Link } from 'react-router-dom'; // Removed due to unused warning
import { motion, AnimatePresence } from 'framer-motion';
// import FavoriteButton from '../common/FavoriteButton'; // Removed due to unused warning
import SEOComponent from '../../components/SEO/SEOComponent';
import { buildApiUrl, PRODUCT_ENDPOINTS } from '../../config/api';
import ProductCard from '../common/ProductCard/ProductCard';
import './NewProductsViewAll.css';

export default function NewProductsViewAll() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null); // Removed due to unused warning
    const [sortBy, setSortBy] = useState('newest');
    const [filterBy, setFilterBy] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            // setError(null);

            // Sofa Section is used for "New Products"
            const url = buildApiUrl(`${PRODUCT_ENDPOINTS.LIST}?categoryName=Sofa%20Section`);
            const response = await axios.get(url);

            if (response.data && response.data.length > 0) {
                setProducts(response.data);
            } else {
                // Fallback to all products if category empty
                const allUrl = buildApiUrl(PRODUCT_ENDPOINTS.LIST);
                const allResponse = await axios.get(allUrl);
                setProducts(allResponse.data || []);
            }
        } catch (error) {
            console.error('Error fetching new products:', error);
            // setError('The royal treasure map is temporarily missing. Please try again soon.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);



    const calculateDiscount = (oldPrice, newPrice) => {
        if (!oldPrice || !newPrice) return 0;
        const old = parseFloat(oldPrice);
        const newP = parseFloat(newPrice);
        if (old <= newP) return 0;
        return Math.round(((old - newP) / old) * 100);
    };

    const getProcessedProducts = () => {
        let processed = [...products];

        if (filterBy === 'on-sale') {
            processed = processed.filter(p => calculateDiscount(p.old_price, p.new_price) > 0);
        } else if (filterBy === 'in-stock') {
            processed = processed.filter(p => (p.stock || 0) > 0);
        }

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
                <p>Unveiling the Latest Masterpieces...</p>
            </div>
        );
    }

    return (
        <div className="royal-luxury-page">
            <SEOComponent title="New Arrivals | Royal Furniture Collection | Sindureghari" />

            {/* Exotic Hero Section */}
            <section className="royal-elite-hero">
                <div className="royal-hero-backdrop"></div>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="hero-inner"
                >
                    <span className="hero-elite-label">The New Sovereign Era</span>
                    <h1 className="hero-main-title">Modern <span>Masterpieces</span></h1>
                    <div className="hero-divider-gold"></div>
                    <p className="hero-desc">Be the first to witness our latest acquisitions. Freshly curated designs that redefine the boundaries of luxury and comfort for the elite Nepalese home.</p>
                </motion.div>

                <div className="hero-scroll-indicator">
                    <span>DESCEND TO ELEGANCE</span>
                    <div className="indicator-line"></div>
                </div>
            </section>

            {/* Refined Navigation Center */}
            <div className="royal-luxury-controls">
                <div className="controls-container">
                    <div className="royal-select-group">
                        <label>Availability Status</label>
                        <select value={filterBy} onChange={(e) => { setFilterBy(e.target.value); setCurrentPage(1); }}>
                            <option value="all">All New Arrivals</option>
                            <option value="on-sale">Featured Offers</option>
                            <option value="in-stock">Ready to Acquire</option>
                        </select>
                    </div>
                    <div className="royal-select-group">
                        <label>Sovereign Sort</label>
                        <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}>
                            <option value="newest">Freshly Arrived</option>
                            <option value="price-low">Value Tier</option>
                            <option value="price-high">Prestige Tier</option>
                            <option value="name">Alphabetical</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Masterpiece Gallery */}
            <section className="royal-masterpiece-section">
                <AnimatePresence mode="wait">
                    {currentProducts.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="royal-empty-vault"
                        >
                            <h3 style={{ fontFamily: 'Playfair Display' }}>Vault Under Curation</h3>
                            <p>We are currently uploading new treasures. Please check back for the latest reveals.</p>
                            <button onClick={() => { setFilterBy('all'); setSortBy('newest'); }} className="royal-back-btn" style={{ background: '#000', color: '#fff', padding: '12px 24px', borderRadius: '50px', border: 'none', cursor: 'pointer', marginTop: '20px', fontWeight: 'bold' }}>Full Collection</button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid"
                            className="royal-masterpiece-grid"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: 0.1 } }
                            }}
                        >
                            {currentProducts.map((product, index) => (
                                <ProductCard key={product.id || index} product={product} />
                            ))}
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