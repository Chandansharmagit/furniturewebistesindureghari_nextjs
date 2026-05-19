import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, Sofa, Bed, Utensils, Flame } from 'lucide-react';
import '../navbar.css';

const SearchFunctionality = ({ apiBaseUrl, getAllProducts, isMobile = false, onClose }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const searchInputRef = useRef(null);
    const debounceTimeout = useRef(null);
    const navigate = useNavigate();

    const trendingSearches = ['Sofa Set', 'Dining Table', 'Bed Frame', 'Office Chair', 'Wardrobe'];

    const defaultCategories = [
        {
            id: 'sofas',
            title: 'Sofa Sets & Seating',
            desc: 'Explore luxury handcrafted royal wooden sofa sets',
            icon: <Sofa size={18} strokeWidth={1.5} />,
            path: '/category/living-room'
        },
        {
            id: 'beds',
            title: 'Bed Frames & Bedroom',
            desc: 'Serene solid-wood luxury beds & wardrobe systems',
            icon: <Bed size={18} strokeWidth={1.5} />,
            path: '/category/bedroom'
        },
        {
            id: 'dining',
            title: 'Dining Tables & Chairs',
            desc: 'Premium wooden dining tables for memory making',
            icon: <Utensils size={18} strokeWidth={1.5} />,
            path: '/category/dining-room'
        },
        {
            id: 'kitchens',
            title: 'Modular Kitchens',
            desc: 'Tailored luxury modular kitchen setups & cabinets',
            icon: <Flame size={18} strokeWidth={1.5} />,
            path: '/category/modular-kitchens'
        }
    ];

    // Debounced search function
    const debounceSearch = useCallback((query) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(async () => {
            if (query.length < 2) {
                setSearchResults([]);
                return;
            }
            setLoading(true);
            try {
                const searchResponse = await axios.get(`${apiBaseUrl}/api/search`, {
                    params: { q: query, limit: 6 }
                });
                setSearchResults(searchResponse.data.products.map(product => ({
                    id: product._id || product.id,
                    image: product.imageUrl || 'https://via.placeholder.com/80',
                    title: product.name,
                    price: product.new_price || product.salePrice || product.price,
                    oldPrice: product.old_price || product.originalPrice,
                    category: product.categoryName || 'Furniture',
                })));

                if (!searchResponse.data.products.length) {
                    const allProducts = getAllProducts();
                    const filtered = allProducts.filter(product =>
                        product.title.toLowerCase().includes(query.toLowerCase()) ||
                        product.subtitle.toLowerCase().includes(query.toLowerCase()) ||
                        product.categoryName.toLowerCase().includes(query.toLowerCase())
                    );
                    const sorted = filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
                    setSearchResults(sorted.slice(0, 4));
                }
            } catch (err) {
                console.error('Error fetching search results:', err);
                const allProducts = getAllProducts();
                const filtered = allProducts.filter(product =>
                    product.title.toLowerCase().includes(query.toLowerCase()) ||
                    product.subtitle.toLowerCase().includes(query.toLowerCase()) ||
                    product.categoryName.toLowerCase().includes(query.toLowerCase())
                );
                const sorted = filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
                setSearchResults(sorted.slice(0, 4));
            } finally {
                setLoading(false);
            }
        }, 200);
    }, [apiBaseUrl, getAllProducts]);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setActiveIndex(-1);
        debounceSearch(query);
    };

    const handleProductClick = (product) => {
        if (product.id) {
            navigate(`/product/${product.id}`);
        } else {
            navigate(`/search?q=${encodeURIComponent(product.title)}`);
        }
        setIsSearchOpen(false);
        setSearchQuery('');
        if (isMobile && onClose) onClose();
    };

    const handleCategorySelect = (item) => {
        navigate(item.path);
        setIsSearchOpen(false);
        setSearchQuery('');
        if (isMobile && onClose) onClose();
    };

    const handleTrendingClick = (term) => {
        setSearchQuery(term);
        debounceSearch(term);
    };

    const handleKeyDown = (e) => {
        const totalItems = searchQuery.length < 2 ? defaultCategories.length : searchResults.length;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => (prev < totalItems - 1 ? prev + 1 : 0));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => (prev > 0 ? prev - 1 : totalItems - 1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && activeIndex < totalItems) {
                if (searchQuery.length < 2) {
                    handleCategorySelect(defaultCategories[activeIndex]);
                } else {
                    handleProductClick(searchResults[activeIndex]);
                }
            } else if (searchQuery.trim()) {
                navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                setIsSearchOpen(false);
                setSearchQuery('');
                if (isMobile && onClose) onClose();
            }
        } else if (e.key === 'Escape') {
            setIsSearchOpen(false);
            setSearchQuery('');
            if (isMobile && onClose) onClose();
        }
    };

    const formatPrice = (price) => {
        if (!price) return 'Contact for Price';
        return parseFloat(price).toLocaleString('en-IN');
    };

    useEffect(() => {
        if (isMobile) {
            setIsSearchOpen(true);
        }
    }, [isMobile]);

    useEffect(() => {
        if (isSearchOpen) {
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isSearchOpen]);

    return (
        <div className="center-search">
            {/* Header Trigger Input (Mock Bar) */}
            <div className="search-bar-trigger" onClick={() => setIsSearchOpen(true)}>
                <div className="search-icon">
                    <Search size={16} />
                </div>
                <input
                    type="text"
                    placeholder="Search furniture..."
                    readOnly
                    className="main-search-input mock-input"
                />
            </div>

            <AnimatePresence>
                {isSearchOpen && (
                    <div className="bkf-palette__portal">
                        {/* Dark Backdrop Overlay */}
                        <motion.div 
                            className="bkf-palette__backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setIsSearchOpen(false);
                                if (isMobile && onClose) onClose();
                            }}
                        />

                        {/* Centered Modal Container */}
                        <div className="bkf-palette__wrapper">
                            <motion.div 
                                className="bkf-palette__panel"
                                initial={{ opacity: 0, scale: 0.96, y: -20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96, y: -20 }}
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            >
                                {/* Modal Header */}
                                <div className="bkf-palette__header">
                                    <div className="bkf-palette__search-icon">
                                        <Search size={22} className="palette-search-icon" />
                                    </div>
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Type to search..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onKeyDown={handleKeyDown}
                                        className="bkf-palette__input"
                                        autoComplete="off"
                                    />
                                    <div className="bkf-palette__close-hint" onClick={() => {
                                        setIsSearchOpen(false);
                                        if (isMobile && onClose) onClose();
                                    }}>
                                        <span>ESC</span>
                                    </div>
                                </div>

                                {/* Modal Content Body */}
                                <div className="bkf-palette__body">
                                    {loading ? (
                                        <div className="bkf-palette__loading">
                                            <div className="royal-spinner-small" />
                                            <p>Searching Sindureghari registry...</p>
                                        </div>
                                    ) : searchQuery.length < 2 ? (
                                        /* Default state: Categories & Trending Tags */
                                        <div className="bkf-palette__default-state">
                                            <div className="bkf-palette__section">
                                                <h4 className="bkf-palette__section-title">Royal Categories</h4>
                                                <div className="bkf-palette__list">
                                                    {defaultCategories.map((item, idx) => {
                                                        const isSelected = activeIndex === idx;
                                                        return (
                                                            <div
                                                                key={item.id}
                                                                className={`bkf-palette__item ${isSelected ? 'is-selected' : ''}`}
                                                                onClick={() => handleCategorySelect(item)}
                                                                onMouseEnter={() => setActiveIndex(idx)}
                                                            >
                                                                <div className="bkf-palette__item-icon">
                                                                    {item.icon}
                                                                </div>
                                                                <div className="bkf-palette__item-text">
                                                                    <span className="bkf-palette__item-title">{item.title}</span>
                                                                    <span className="bkf-palette__item-desc">{item.desc}</span>
                                                                </div>
                                                                <ChevronRight size={16} className="bkf-palette__item-arrow" />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="bkf-palette__section spacing-top">
                                                <h4 className="bkf-palette__section-title">Trending Inquiries</h4>
                                                <div className="bkf-palette__tags">
                                                    {trendingSearches.map((term, i) => (
                                                        <button
                                                            key={i}
                                                            className="bkf-palette__tag-btn"
                                                            onClick={() => handleTrendingClick(term)}
                                                        >
                                                            ✦ {term}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Search Results State */
                                        <div className="bkf-palette__results-state">
                                            {searchResults.length === 0 ? (
                                                <div className="bkf-palette__empty">
                                                    <div className="bkf-palette__empty-icon">✧</div>
                                                    <h4>No masterpieces found for "{searchQuery}"</h4>
                                                    <p>Try searching for other premium products like 'Sofa', 'Dining Table' or 'Bed'.</p>
                                                </div>
                                            ) : (
                                                <div className="bkf-palette__section">
                                                    <h4 className="bkf-palette__section-title">Matching Masterpieces ({searchResults.length})</h4>
                                                    <div className="bkf-palette__list">
                                                        {searchResults.map((product, idx) => {
                                                            const isSelected = activeIndex === idx;
                                                            return (
                                                                <div
                                                                    key={product.id}
                                                                    className={`bkf-palette__item product-item ${isSelected ? 'is-selected' : ''}`}
                                                                    onClick={() => handleProductClick(product)}
                                                                    onMouseEnter={() => setActiveIndex(idx)}
                                                                >
                                                                    <div className="bkf-palette__product-img-wrapper">
                                                                        <img src={product.image} alt={product.title} />
                                                                    </div>
                                                                    <div className="bkf-palette__item-text">
                                                                        <span className="bkf-palette__item-title">{product.title}</span>
                                                                        <span className="bkf-palette__item-desc">
                                                                            {product.category} • <strong className="gold-text">Rs. {formatPrice(product.price)}</strong>
                                                                        </span>
                                                                    </div>
                                                                    <ChevronRight size={16} className="bkf-palette__item-arrow" />
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Modal Footer Hint */}
                                <div className="bkf-palette__footer">
                                    <div className="bkf-palette__footer-left">
                                        <span className="bkf-palette__footer-badge">↓ ↑</span>
                                        <span className="bkf-palette__footer-label">Navigate</span>
                                        
                                        <span className="bkf-palette__footer-badge">↵</span>
                                        <span className="bkf-palette__footer-label">Select</span>
                                        
                                        <span className="bkf-palette__footer-badge font-small">ESC</span>
                                        <span className="bkf-palette__footer-label">Close</span>
                                    </div>
                                    <div className="bkf-palette__footer-right">
                                        <span className="bkf-palette__footer-brand">QUICK SEARCH</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchFunctionality;