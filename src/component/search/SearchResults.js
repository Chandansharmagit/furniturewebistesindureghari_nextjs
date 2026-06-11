/* eslint-disable react-hooks/set-state-in-effect, react/no-unescaped-entities, @next/next/no-html-link-for-pages */
import React, { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Star, Filter, ChevronRight, Images, Grid3X3, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEOComponent from '../../components/SEO/SEOComponent';
import { API_BASE_URL } from '../../config/api';
import ProductCard from '../common/ProductCard/ProductCard';
import { flattenCategories } from '../../utils/categoryHelpers';
import aiService from '../../services/aiService';
import './SearchResults.css';

const parseProductImages = (product = {}) => {
    const images = [];
    if (Array.isArray(product.images)) images.push(...product.images);
    if (product.imageUrl) images.push(product.imageUrl);
    if (product.image_url) images.push(product.image_url);
    if (product.imageUrls) {
        try {
            const parsed = typeof product.imageUrls === 'string' ? JSON.parse(product.imageUrls) : product.imageUrls;
            if (Array.isArray(parsed)) images.push(...parsed);
        } catch {
            // Ignore older malformed image JSON and fall back to primary image.
        }
    }
    return [...new Set(images.filter(Boolean))];
};

const SearchResults = () => {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [, setError] = useState(null);

    const [sortBy, setSortBy] = useState('relevance');
    const [showFilters, setShowFilters] = useState(true); // Default to true for premium bento side-by-side view
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [activeView, setActiveView] = useState('gallery');
    const [aiRecommendation, setAiRecommendation] = useState('');
    const [aiRecommendationLoading, setAiRecommendationLoading] = useState(false);
    const [aiRecommendationError, setAiRecommendationError] = useState('');

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 15
            }
        }
    };

    // Filter states
    const [filters, setFilters] = useState({
        category: '',
        priceRange: { min: 0, max: 100000 },
        rating: 0,
        availability: 'all'
    });

    // Get search query from URL params
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('q') || '';

    const categories = ['All Categories', ...categoryOptions.map(category => category.name)];

    // Price ranges for filter
    const priceRanges = [
        { label: 'All Prices', min: 0, max: 100000 },
        { label: 'Under Rs. 10,000', min: 0, max: 10000 },
        { label: 'Rs. 10,000 - Rs. 25,000', min: 10000, max: 25000 },
        { label: 'Rs. 25,000 - Rs. 50,000', min: 25000, max: 50000 },
        { label: 'Rs. 50,000 - Rs. 1,00,000', min: 50000, max: 100000 },
        { label: 'Above Rs. 1,00,000', min: 100000, max: 999999 }
    ];

    // Fetch search results
    useEffect(() => {
        setActiveView('gallery');

        const fetchSearchResults = async () => {
            if (!searchQuery) {
                setProducts([]);
                setFilteredProducts([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/api/search`, {
                    params: { q: searchQuery, limit: 100 }
                });

                const searchResults = response.data.products || [];

                const transformedProducts = searchResults.map(product => {
                    const images = parseProductImages(product);
                    const imageUrl = images[0] || 'https://via.placeholder.com/300x200';

                    return {
                        id: product.id || product._id,
                        _id: product.id || product._id,
                        name: product.name,
                        new_price: parseFloat(product.new_price) || parseFloat(product.price) || 0,
                        old_price: parseFloat(product.old_price) || 0,
                        price: parseFloat(product.new_price) || parseFloat(product.price) || 0,
                        rating: 4.5,
                        category: product.categoryName || 'Furniture',
                        imageUrl: imageUrl,
                        images,
                        image1: imageUrl,
                        sku: product.sku,
                        availability: product.stock > 0 ? 'in-stock' : 'out-of-stock'
                    };
                });

                // Variety filter: Ensure unique IDs and unique Image URLs for visual diversity
                const uniqueProducts = [];
                const seenIds = new Set();
                const seenImages = new Set();

                transformedProducts.forEach(product => {
                    if (!seenIds.has(product.id) && !seenImages.has(product.imageUrl)) {
                        seenIds.add(product.id);
                        seenImages.add(product.imageUrl);
                        uniqueProducts.push(product);
                    }
                });

                setProducts(uniqueProducts);
                setFilteredProducts(uniqueProducts);
            } catch (err) {
                console.error('Error fetching search results:', err);
                setError('Failed to fetch search results');
                setProducts([]);
                setFilteredProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [searchQuery]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/categories`);
                const categoryTree = Array.isArray(response.data) ? response.data : [];
                setCategoryOptions(flattenCategories(categoryTree).filter(category => category.status !== 'inactive'));
            } catch (err) {
                console.warn('Search filter categories failed to load:', err);
                setCategoryOptions([]);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        let filtered = [...products];
        if (filters.category && filters.category !== 'All Categories') {
            filtered = filtered.filter(product => product.category === filters.category);
        }
        filtered = filtered.filter(product =>
            product.price >= filters.priceRange.min && product.price <= filters.priceRange.max
        );
        if (filters.rating > 0) {
            filtered = filtered.filter(product => product.rating >= filters.rating);
        }
        if (filters.availability !== 'all') {
            filtered = filtered.filter(product => product.availability === filters.availability);
        }
        switch (sortBy) {
            case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
            case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
            case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
            case 'name': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
            default: break;
        }
        setFilteredProducts(filtered);
        setCurrentPage(1);
    }, [products, filters, sortBy]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const galleryImages = useMemo(() => filteredProducts.flatMap((product) => (
        parseProductImages(product).map((image, index) => ({
            id: `${product.id || product._id}-${index}-${image}`,
            productId: product.id || product._id,
            image,
            name: product.name,
            category: product.category,
            sku: product.sku,
            price: product.price
        }))
    )), [filteredProducts]);
    const recommendedProducts = useMemo(() => (
        [...filteredProducts]
            .sort((a, b) => {
                if (a.availability !== b.availability) return a.availability === 'in-stock' ? -1 : 1;
                return (b.rating || 0) - (a.rating || 0) || (a.price || 0) - (b.price || 0);
            })
            .slice(0, 3)
    ), [filteredProducts]);

    useEffect(() => {
        let cancelled = false;

        const generateSearchRecommendation = async () => {
            if (!searchQuery || recommendedProducts.length === 0) {
                setAiRecommendation('');
                setAiRecommendationError('');
                setAiRecommendationLoading(false);
                return;
            }

            setAiRecommendationLoading(true);
            setAiRecommendationError('');

            const productLines = recommendedProducts.map((product, index) => (
                `${index + 1}. ${product.name} | category: ${product.category} | price: Rs. ${product.price} | sku: ${product.sku || 'N/A'} | ${product.availability}`
            )).join('\n');

            const result = await aiService.chat({
                context: 'Customer is searching the Sindureghari Furniture website. Recommend only from the provided product list.',
                prompt: `The customer searched for "${searchQuery}".
Available recommended products:
${productLines}

Write a luxury furniture shopping recommendation in 2 short sentences, then one short "Best pick" line. Mention handmade/premium wooden value only if it fits naturally.`
            });

            if (cancelled) return;

            if (result.success) {
                setAiRecommendation(result.message);
            } else {
                setAiRecommendationError(result.error);
            }

            setAiRecommendationLoading(false);
        };

        generateSearchRecommendation();

        return () => {
            cancelled = true;
        };
    }, [searchQuery, recommendedProducts]);

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({ ...prev, [filterType]: value }));
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                size={14}
                className={index < Math.floor(rating) ? 'star-filled' : 'star-empty'}
            />
        ));
    };

    if (loading) {
        return (
            <div className="search-results-loading-container">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="sr-premium-loader"
                >
                    <div className="royal-spinner">
                        <div className="inner-gold-circle"></div>
                    </div>
                    <motion.h2
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Exploring Our Collection...
                    </motion.h2>
                    <p>Searching for "{searchQuery}" in our premium registry</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bkf-search__container-fluid">
            <SEOComponent
                title={`Search Results for "${searchQuery}" | Sindureghari Furniture Nepal`}
                description={`Found ${filteredProducts.length} furniture products matching "${searchQuery}". Browse our collection of sofas, beds, dining sets, and more with competitive prices and free delivery in Nepal.`}
                keywords={`${searchQuery}, furniture search Nepal, ${searchQuery} furniture, furniture store Nepal, buy ${searchQuery} online, furniture shopping Nepal`}
                ogTitle={`Search Results for "${searchQuery}" | Sindureghari Furniture`}
                ogDescription={`Found ${filteredProducts.length} furniture products matching "${searchQuery}". Browse our collection with competitive prices.`}
                ogImage="https://sinduregharifurniture.shop/images/search-banner.jpg"
                ogType="website"
                twitterTitle={`Search Results for "${searchQuery}"`}
                twitterDescription={`Found ${filteredProducts.length} furniture products matching "${searchQuery}".`}
                twitterImage="https://sinduregharifurniture.shop/images/search-banner.jpg"
                structuredData={{
                    "@context": "https://schema.org",
                    "@type": "SearchResultsPage",
                    "name": `Search Results for "${searchQuery}"`,
                    "description": `Search results for furniture products matching "${searchQuery}"`,
                    "url": `https://sinduregharifurniture.shop/search?q=${encodeURIComponent(searchQuery)}`,
                    "mainEntity": {
                        "@type": "ItemList",
                        "name": `Search Results for "${searchQuery}"`,
                        "description": `Furniture products matching search query "${searchQuery}"`,
                        "numberOfItems": filteredProducts.length,
                        "itemListElement": filteredProducts.slice(0, 10).map((prod, idx) => ({
                            "@type": "ListItem",
                            "position": idx + 1,
                            "url": `https://sinduregharifurniture.shop/product/${prod.id || prod._id}`,
                            "name": prod.title || prod.name
                        }))
                    },
                    "breadcrumb": {
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": "https://sinduregharifurniture.shop/"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "Search",
                                "item": "https://sinduregharifurniture.shop/search"
                            },
                            {
                                "@type": "ListItem",
                                "position": 3,
                                "name": `"${searchQuery}"`,
                                "item": `https://sinduregharifurniture.shop/search?q=${encodeURIComponent(searchQuery)}`
                            }
                        ]
                    }
                }}
                canonicalUrl={`https://sinduregharifurniture.shop/search?q=${encodeURIComponent(searchQuery)}`}
            />

            {/* Ambient Hero Banner */}
            <motion.div
                className="bkf-search__hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="bkf-search__hero-overlay" />
                <div className="bkf-search__hero-container">
                    <div className="bkf-search__hero-content">
                        {/* Minimalist Breadcrumb inside Hero */}
                        <nav className="bkf-search__breadcrumb">
                            <a href="/">Home</a>
                            <ChevronRight size={12} className="bkf-search__breadcrumb-arrow" />
                            <span>Search</span>
                            <ChevronRight size={12} className="bkf-search__breadcrumb-arrow" />
                            <span className="active">"{searchQuery}"</span>
                        </nav>
                        
                        <motion.h1
                            className="bkf-search__title serif"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Search Results
                        </motion.h1>
                        
                        <motion.p
                            className="bkf-search__subtitle"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.35 }}
                        >
                            Discovered <span className="bkf-search__count-highlight">{filteredProducts.length}</span> premium designs matching <span className="bkf-search__query-highlight">"{searchQuery}"</span>
                        </motion.p>
                    </div>
                </div>
            </motion.div>

            {/* Main Content Layout */}
            <div className="bkf-search__main-layout">
                <div className="bkf-search__container">
                    <div className="bkf-search__wrapper">
                        {/* Interactive Left Filters Sidebar */}
                        <div className={`bkf-search__sidebar ${showFilters ? 'is-active' : ''}`}>
                            <div className="bkf-search__sidebar-inner">
                                <div className="bkf-search__sidebar-header">
                                    <h3>Refine Search</h3>
                                    <button
                                        className="bkf-search__sidebar-reset-link"
                                        onClick={() => setFilters({
                                            category: '',
                                            priceRange: { min: 0, max: 100000 },
                                            rating: 0,
                                            availability: 'all'
                                        })}
                                    >
                                        Reset All
                                    </button>
                                </div>

                                {/* Category Filter */}
                                <div className="bkf-search__filter-group">
                                    <h4>Categories</h4>
                                    <div className="bkf-search__filter-options">
                                        {categories.map(category => (
                                            <button
                                                key={category}
                                                className={`bkf-search__filter-pill ${filters.category === category || (category === 'All Categories' && !filters.category) ? 'is-selected' : ''}`}
                                                onClick={() => handleFilterChange('category', category === 'All Categories' ? '' : category)}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range Filter */}
                                <div className="bkf-search__filter-group">
                                    <h4>Budget Range</h4>
                                    <div className="bkf-search__filter-options">
                                        {priceRanges.map(range => (
                                            <button
                                                key={range.label}
                                                className={`bkf-search__filter-pill ${filters.priceRange.min === range.min && filters.priceRange.max === range.max ? 'is-selected' : ''}`}
                                                onClick={() => handleFilterChange('priceRange', { min: range.min, max: range.max })}
                                            >
                                                {range.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Rating Filter */}
                                <div className="bkf-search__filter-group">
                                    <h4>Minimum Rating</h4>
                                    <div className="bkf-search__filter-options">
                                        {[4, 3, 2].map(rating => (
                                            <button
                                                key={rating}
                                                className={`bkf-search__filter-pill rating-pill ${filters.rating === rating ? 'is-selected' : ''}`}
                                                onClick={() => handleFilterChange('rating', rating)}
                                            >
                                                <span className="stars-row">{renderStars(rating)}</span>
                                                <span className="stars-label">& Above</span>
                                            </button>
                                        ))}
                                        <button
                                            className={`bkf-search__filter-pill ${filters.rating === 0 ? 'is-selected' : ''}`}
                                            onClick={() => handleFilterChange('rating', 0)}
                                        >
                                            All Ratings
                                        </button>
                                    </div>
                                </div>

                                {/* Availability Filter */}
                                <div className="bkf-search__filter-group">
                                    <h4>Availability</h4>
                                    <div className="bkf-search__filter-options">
                                        <button
                                            className={`bkf-search__filter-pill ${filters.availability === 'all' ? 'is-selected' : ''}`}
                                            onClick={() => handleFilterChange('availability', 'all')}
                                        >
                                            All Products
                                        </button>
                                        <button
                                            className={`bkf-search__filter-pill ${filters.availability === 'in-stock' ? 'is-selected' : ''}`}
                                            onClick={() => handleFilterChange('availability', 'in-stock')}
                                        >
                                            In Stock
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products Content Area */}
                        <div className="bkf-search__products-area">
                            {/* Sorting and Filter Trigger Controls */}
                            <div className="bkf-search__controls">
                                <div className="bkf-search__controls-left">
                                    <span className="bkf-search__results-count">
                                        Showing <strong>{filteredProducts.length}</strong> luxurious matches
                                    </span>
                                </div>
                                <div className="bkf-search__controls-right">
                                    <button
                                        className={`bkf-search__filter-trigger ${showFilters ? 'is-active' : ''}`}
                                        onClick={() => setShowFilters(!showFilters)}
                                    >
                                        <Filter size={15} />
                                        <span>Filters</span>
                                        {Object.values(filters).some(v => v !== '' && v !== 'all' && (typeof v === 'object' ? (v.min !== 0 || v.max !== 100000) : v !== 0)) && (
                                            <span className="filter-badge">•</span>
                                        )}
                                    </button>

                                    <div className="bkf-search__sort-wrapper">
                                        <span className="bkf-search__sort-label">Sort</span>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="bkf-search__sort-select"
                                        >
                                            <option value="relevance">Recommended</option>
                                            <option value="price-low">Price: Low to High</option>
                                            <option value="price-high">Price: High to Low</option>
                                            <option value="rating">Highest Rated</option>
                                            <option value="name">Name: A to Z</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="bkf-search__view-tabs" role="tablist" aria-label="Search result views">
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={activeView === 'gallery'}
                                    className={`bkf-search__view-tab ${activeView === 'gallery' ? 'is-active' : ''}`}
                                    onClick={() => setActiveView('gallery')}
                                >
                                    <Images size={17} />
                                    <span>Gallery</span>
                                    <em>{galleryImages.length}</em>
                                </button>
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={activeView === 'products'}
                                    className={`bkf-search__view-tab ${activeView === 'products' ? 'is-active' : ''}`}
                                    onClick={() => setActiveView('products')}
                                >
                                    <Grid3X3 size={17} />
                                    <span>Products</span>
                                    <em>{filteredProducts.length}</em>
                                </button>
                            </div>

                            {(recommendedProducts.length > 0 || aiRecommendationLoading || aiRecommendationError) && (
                                <section className="bkf-search__ai-advisor" aria-label="AI product recommendations">
                                    <div className="bkf-search__ai-copy">
                                        <span className="bkf-search__ai-kicker"><Sparkles size={15} /> AI Furniture Advisor</span>
                                        <h2>Best matches for "{searchQuery}"</h2>
                                        {aiRecommendationLoading && <p>Reading your search and comparing the closest products...</p>}
                                        {aiRecommendationError && <p className="bkf-search__ai-error">{aiRecommendationError}</p>}
                                        {aiRecommendation && <p>{aiRecommendation}</p>}
                                    </div>
                                    <div className="bkf-search__ai-products">
                                        {recommendedProducts.map((product) => (
                                            <a href={`/product/${product.id || product._id}`} className="bkf-search__ai-product" key={product.id || product._id}>
                                                <img src={product.imageUrl} alt={product.name} loading="lazy" />
                                                <span>
                                                    <strong>{product.name}</strong>
                                                    <small>Rs. {Number(product.price || 0).toLocaleString('en-IN')} · {product.availability === 'in-stock' ? 'In stock' : 'Out of stock'}</small>
                                                </span>
                                                <ArrowRight size={16} />
                                            </a>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {activeView === 'gallery' && (
                                <motion.div
                                    className="bkf-search__gallery-priority"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.28 }}
                                >
                                    <div className="bkf-search__gallery-head">
                                        <span>Visual results first</span>
                                        <h2>Gallery matches for "{searchQuery}"</h2>
                                        <p>Open any image to view the product details, price, stock, and full product gallery.</p>
                                    </div>

                                    {galleryImages.length === 0 ? (
                                        <div className="bkf-search__gallery-empty">
                                            <Images size={34} />
                                            <h3>No gallery images found</h3>
                                            <p>Try clearing filters or searching a broader furniture keyword.</p>
                                        </div>
                                    ) : (
                                        <div className="bkf-search__gallery-grid">
                                            {galleryImages.map((item) => (
                                                <a href={`/product/${item.productId}`} className="bkf-search__gallery-card" key={item.id}>
                                                    <span className="bkf-search__gallery-image">
                                                        <img src={item.image} alt={`${item.name} gallery result`} loading="lazy" />
                                                    </span>
                                                    <span className="bkf-search__gallery-meta">
                                                        <strong>{item.name}</strong>
                                                        <small>{item.sku || item.category}</small>
                                                    </span>
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Products Grid */}
                            {activeView === 'products' && <motion.div
                                className="bkf-search__products-grid"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {filteredProducts.length === 0 ? (
                                    <div className="bkf-search__no-results">
                                        <div className="bkf-search__no-results-icon">✦</div>
                                        <h3>No Masterpieces Found</h3>
                                        <p>We couldn't find any designs matching "{searchQuery}". Try adjusting your keywords or clearing active filters.</p>
                                        <button
                                            className="bkf-search__reset-search-btn"
                                            onClick={() => {
                                                setFilters({
                                                    category: '',
                                                    priceRange: { min: 0, max: 100000 },
                                                    rating: 0,
                                                    availability: 'all'
                                                });
                                            }}
                                        >
                                            Clear All Filters
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="bkf-search__grid">
                                            <AnimatePresence mode="popLayout">
                                                {currentProducts.map(product => (
                                                    <motion.div
                                                        key={product.id || product._id}
                                                        layout
                                                        variants={itemVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="hidden"
                                                        className="bkf-search__grid-item"
                                                    >
                                                        <ProductCard product={product} />
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>

                                        {/* Pagination */}
                                        {totalPages > 1 && (
                                            <div className="bkf-search__pagination">
                                                <button
                                                    className="bkf-search__pagination-arrow"
                                                    disabled={currentPage === 1}
                                                    onClick={() => setCurrentPage(currentPage - 1)}
                                                >
                                                    Previous
                                                </button>

                                                <div className="bkf-search__pagination-numbers">
                                                    {Array.from({ length: totalPages }, (_, index) => (
                                                        <button
                                                            key={index + 1}
                                                            className={`bkf-search__pagination-number ${currentPage === index + 1 ? 'is-active' : ''}`}
                                                            onClick={() => setCurrentPage(index + 1)}
                                                        >
                                                            {index + 1}
                                                        </button>
                                                    ))}
                                                </div>

                                                <button
                                                    className="bkf-search__pagination-arrow"
                                                    disabled={currentPage === totalPages}
                                                    onClick={() => setCurrentPage(currentPage + 1)}
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </motion.div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResults;
