/* eslint-disable react-hooks/set-state-in-effect, react-hooks/preserve-manual-memoization, react-hooks/immutability */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, ChevronRight, Grid3X3, Mic, Sparkles, SlidersHorizontal } from 'lucide-react';
import { buildCategoryPath, flattenCategories } from '../../../utils/categoryHelpers';
import '../navbar.css';

const SearchFunctionality = ({ apiBaseUrl, getAllProducts, isMobile = false, onClose }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [isListening, setIsListening] = useState(false);
    const [voiceSupported, setVoiceSupported] = useState(false);
    const [categories, setCategories] = useState([]);
    const [popularTerms, setPopularTerms] = useState([]);
    const [keywordIndex, setKeywordIndex] = useState(0);
    const searchInputRef = useRef(null);
    const debounceTimeout = useRef(null);
    const recognitionRef = useRef(null);
    const navigate = useNavigate();

    const fallbackKeywords = [
        'sofa set price in Nepal',
        'wooden bed with storage',
        'teak dining table',
        'custom wardrobe',
        'office study table',
        'living room furniture',
        'furniture under Rs. 50000',
        'handmade furniture Nepal'
    ];

    const aiPrompts = [
        'Show sofa sets under Rs. 50000',
        'Find teak wood dining tables',
        'Best storage beds for bedroom',
        'Custom wardrobe for small room',
        'Premium living room furniture',
        'In stock office study tables'
    ];

    const extractSmartFilters = (query) => {
        const normalized = query.toLowerCase();
        const filters = {};
        const underMatch = normalized.match(/(?:under|below|less than|upto|up to)\s*(?:rs\.?|npr)?\s*([0-9,]+)/i);
        const aboveMatch = normalized.match(/(?:above|over|more than)\s*(?:rs\.?|npr)?\s*([0-9,]+)/i);
        const betweenMatch = normalized.match(/(?:between)\s*(?:rs\.?|npr)?\s*([0-9,]+)\s*(?:and|-|to)\s*(?:rs\.?|npr)?\s*([0-9,]+)/i);

        if (betweenMatch) {
            filters.minPrice = Number(betweenMatch[1].replace(/,/g, ''));
            filters.maxPrice = Number(betweenMatch[2].replace(/,/g, ''));
        } else {
            if (underMatch) filters.maxPrice = Number(underMatch[1].replace(/,/g, ''));
            if (aboveMatch) filters.minPrice = Number(aboveMatch[1].replace(/,/g, ''));
        }

        if (normalized.includes('in stock') || normalized.includes('available')) {
            filters.inStock = true;
        }

        ['teak', 'sheesham', 'walnut', 'mango', 'sal'].forEach((wood) => {
            if (normalized.includes(wood)) filters.wooden_type = wood;
        });

        return filters;
    };

    const cleanSmartQuery = (query) => {
        const normalized = query.toLowerCase();
        const productAliases = [
            { test: /\bsofa|sofas|couch|sectional\b/, value: 'sofa' },
            { test: /\bbed|beds|storage bed|bedroom\b/, value: 'bed' },
            { test: /\bwardrobe|wardrobes|almirah|closet\b/, value: 'wardrobe' },
            { test: /\bdining|dining table|table set\b/, value: 'dining table' },
            { test: /\boffice|study table|desk\b/, value: 'study table' },
            { test: /\bliving room|living\b/, value: 'living room' },
            { test: /\bchair|chairs\b/, value: 'chair' },
        ];

        const alias = productAliases.find((item) => item.test.test(normalized));
        if (alias) return alias.value;

        return normalized
            .replace(/(?:under|below|less than|upto|up to|above|over|more than|between)\s*(?:rs\.?|npr)?\s*[0-9,]+(?:\s*(?:and|-|to)\s*(?:rs\.?|npr)?\s*[0-9,]+)?/gi, ' ')
            .replace(/\b(show|find|best|get|search|for|me|premium|available|in stock|with|from|your|my|room|small|large|custom)\b/gi, ' ')
            .replace(/\b(rs|npr)\b/gi, ' ')
            .replace(/[^\w\s-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    };

    const normalizeSearchProduct = (product = {}) => ({
        id: product._id || product.id,
        image: product.imageUrl || product.image || product.image1 || 'https://via.placeholder.com/80',
        title: product.name || product.title || 'Furniture product',
        price: product.new_price || product.salePrice || product.price,
        oldPrice: product.old_price || product.originalPrice,
        category: product.categoryName || product.category_name || product.category || 'Furniture',
    });

    // Check browser support for SpeechRecognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            setVoiceSupported(true);
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-IN';

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setSearchQuery(transcript);
                debounceSearch(transcript);
                setIsListening(false);
            };

            recognition.onerror = (event) => {
                console.warn('Voice recognition error:', event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    const handleVoiceSearch = (e) => {
        if (e) e.stopPropagation();
        if (!voiceSupported || !recognitionRef.current) {
            alert('Voice search is not supported in your browser. Please try Chrome or Edge.');
            return;
        }
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            // Open the search modal first if not open
            if (!isSearchOpen) setIsSearchOpen(true);
            setIsListening(true);
            try {
                recognitionRef.current.start();
            } catch (err) {
                setIsListening(false);
            }
        }
    };

    useEffect(() => {
        let isMounted = true;

        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/api/categories`);
                if (isMounted && Array.isArray(response.data)) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.warn('Search categories failed to load:', error);
            }
        };

        fetchCategories();

        const fetchPopularTerms = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/api/search/popular`, {
                    params: { limit: 8 }
                });
                const terms = Array.isArray(response.data?.popular)
                    ? response.data.popular.map((item) => item.text).filter(Boolean)
                    : [];
                if (isMounted && terms.length) {
                    setPopularTerms(terms);
                }
            } catch (error) {
                console.warn('Popular search terms failed to load:', error);
            }
        };

        fetchPopularTerms();

        return () => {
            isMounted = false;
        };
    }, [apiBaseUrl]);

    const defaultCategories = flattenCategories(categories)
        .filter((category) => category.status !== 'inactive')
        .slice(0, 8)
        .map((category) => ({
            id: category.id,
            title: category.name,
            desc: category.description || `${category.product_count || 0} products`,
            icon: <Grid3X3 size={18} strokeWidth={1.5} />,
            path: buildCategoryPath(category, category.parent)
        }));

    const trendingSearches = [
        ...popularTerms,
        ...defaultCategories.slice(0, 5).map((category) => category.title),
        ...fallbackKeywords
    ].filter((term, index, list) => term && list.indexOf(term) === index).slice(0, 8);

    const animatedKeywords = (trendingSearches.length ? trendingSearches : fallbackKeywords).slice(0, 8);
    const animatedPlaceholder = `Search ${animatedKeywords[keywordIndex % animatedKeywords.length]}...`;

    useEffect(() => {
        if (!animatedKeywords.length || isSearchOpen) return undefined;

        const intervalId = window.setInterval(() => {
            setKeywordIndex((current) => (current + 1) % animatedKeywords.length);
        }, 2200);

        return () => window.clearInterval(intervalId);
    }, [animatedKeywords.length, isSearchOpen]);

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
                const smartFilters = extractSmartFilters(query);
                const cleanedQuery = cleanSmartQuery(query);
                const searchResponse = await axios.get(`${apiBaseUrl}/api/search`, {
                    params: {
                        q: cleanedQuery || query,
                        limit: 8,
                        sortBy: 'relevance',
                        ...smartFilters
                    }
                });
                const products = Array.isArray(searchResponse.data?.products)
                    ? searchResponse.data.products
                    : [];
                setSearchResults(products.map(normalizeSearchProduct));

                if (!products.length) {
                    const allProducts = getAllProducts();
                    const filtered = allProducts.filter(product =>
                        (product.title || product.name || '').toLowerCase().includes(cleanedQuery || query.toLowerCase()) ||
                        (product.subtitle || product.description || '').toLowerCase().includes(cleanedQuery || query.toLowerCase()) ||
                        (product.categoryName || product.category || '').toLowerCase().includes(cleanedQuery || query.toLowerCase())
                    );
                    const sorted = filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
                    setSearchResults(sorted.slice(0, 4));
                }
            } catch (err) {
                console.error('Error fetching search results:', err);
                const allProducts = getAllProducts();
                const cleanedQuery = cleanSmartQuery(query);
                const filtered = allProducts.filter(product =>
                    (product.title || product.name || '').toLowerCase().includes(cleanedQuery || query.toLowerCase()) ||
                    (product.subtitle || product.description || '').toLowerCase().includes(cleanedQuery || query.toLowerCase()) ||
                    (product.categoryName || product.category || '').toLowerCase().includes(cleanedQuery || query.toLowerCase())
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
        setIsSearchOpen(true);
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
                    placeholder={animatedPlaceholder}
                    readOnly
                    className="main-search-input mock-input"
                />
                {voiceSupported && (
                    <div 
                        className={`voice-search-icon ${isListening ? 'voice-listening' : ''}`}
                        onClick={handleVoiceSearch}
                        title={isListening ? 'Listening... Click to stop' : 'Search by voice'}
                    >
                        <Mic size={16} />
                    </div>
                )}
            </div>

            {isSearchOpen && (
                    <div className="bkf-palette__portal">
                        {/* Dark Backdrop Overlay */}
                        <div 
                            className="bkf-palette__backdrop"
                            onClick={() => {
                                setIsSearchOpen(false);
                                if (isMobile && onClose) onClose();
                            }}
                        />

                        {/* Centered Modal Container */}
                        <div className="bkf-palette__wrapper">
                            <div 
                                className="bkf-palette__panel"
                            >
                                {/* Modal Header */}
                                <div className="bkf-palette__header">
                                    <div className="bkf-palette__search-icon">
                                        <Search size={22} className="palette-search-icon" />
                                    </div>
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder={isListening ? 'Listening...' : 'Ask AI search: sofa under 50000, teak dining table...'}
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onKeyDown={handleKeyDown}
                                        className={`bkf-palette__input ${isListening ? 'voice-active-input' : ''}`}
                                        autoComplete="off"
                                    />
                                    {voiceSupported && (
                                        <div 
                                            className={`bkf-palette__voice-icon ${isListening ? 'voice-listening' : ''}`}
                                            onClick={handleVoiceSearch}
                                            title={isListening ? 'Listening... Click to stop' : 'Search by voice'}
                                        >
                                            <Mic size={20} />
                                        </div>
                                    )}
                                    <div className="bkf-palette__close-hint" onClick={() => {
                                        setIsSearchOpen(false);
                                        if (isMobile && onClose) onClose();
                                    }}>
                                        <span>ESC</span>
                                    </div>
                                </div>

                                {/* Modal Content Body */}
                                <div className="bkf-palette__body">
                                    <div className="bkf-palette__ai-strip">
                                        <div className="bkf-palette__ai-title">
                                            <Sparkles size={17} />
                                            <span>AI Advanced Search</span>
                                        </div>
                                        <p>Use natural language: room, budget, material, stock and product type.</p>
                                        <div className="bkf-palette__ai-chips">
                                            {aiPrompts.map((prompt) => (
                                                <button
                                                    type="button"
                                                    key={prompt}
                                                    onClick={() => handleTrendingClick(prompt)}
                                                >
                                                    <SlidersHorizontal size={13} />
                                                    {prompt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {loading ? (
                                        <div className="bkf-palette__loading">
                                            <div className="royal-spinner-small" />
                                            <p>Searching Sindureghari registry...</p>
                                        </div>
                                    ) : searchQuery.length < 2 ? (
                                        /* Default state: Categories & Trending Tags */
                                        <div className="bkf-palette__default-state">
                                            <div className="bkf-palette__section">
                                                <h4 className="bkf-palette__section-title">Smart Categories</h4>
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
                                                <h4 className="bkf-palette__section-title">Animating Product Keywords</h4>
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
                                                    <h4>No masterpieces found for &quot;{searchQuery}&quot;</h4>
                                                    <p>Try another product name or choose a category from the admin-managed list.</p>
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
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default SearchFunctionality;
