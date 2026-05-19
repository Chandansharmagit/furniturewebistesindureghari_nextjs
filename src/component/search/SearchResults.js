import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Star, Filter, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEOComponent from '../../components/SEO/SEOComponent';
import { API_BASE_URL } from '../../config/api';
import ProductCard from '../common/ProductCard/ProductCard';
import './SearchResults.css';

const SearchResults = () => {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState(null);

    const [sortBy, setSortBy] = useState('relevance');
    const [showFilters, setShowFilters] = useState(true); // Default to true for premium bento side-by-side view
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);

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

    // Categories for filter
    const categories = [
        'All Categories',
        'Living Room',
        'Bedroom',
        'Dining Room',
        'Office and Study',
        'Modular Kitchens'
    ];

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
                    const imageUrl = product.imageUrl || (product.imageUrls ? JSON.parse(product.imageUrls)[0] : 'https://via.placeholder.com/300x200');

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
                        image1: imageUrl,
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
                const mockProducts = generateMockProducts(searchQuery);
                setProducts(mockProducts);
                setFilteredProducts(mockProducts);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [searchQuery]);

    const generateMockProducts = (query) => {
        const mockData = [
            { id: 1, name: 'Modern Sofa Set', price: 45000, originalPrice: 55000, rating: 4.5, category: 'Living Room', image: 'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=400', availability: 'in-stock' },
            { id: 2, name: 'Dining Table 6 Seater', price: 32000, originalPrice: 38000, rating: 4.2, category: 'Dining Room', image: 'https://images.pexels.com/photos/534172/pexels-photo-534172.jpeg?auto=compress&cs=tinysrgb&w=400', availability: 'in-stock' },
            { id: 3, name: 'Office Chair Executive', price: 15000, originalPrice: 18000, rating: 4.7, category: 'Office and Study', image: 'https://images.pexels.com/photos/569153/pexels-photo-569153.jpeg?auto=compress&cs=tinysrgb&w=400', availability: 'in-stock' },
            { id: 4, name: 'Modular Kitchen L-Shape', price: 85000, originalPrice: 95000, rating: 4.8, category: 'Modular Kitchens', image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=400', availability: 'in-stock' },
            { id: 5, name: 'Coffee Table Glass Top', price: 12000, originalPrice: 15000, rating: 4.3, category: 'Living Room', image: 'https://images.pexels.com/photos/370717/pexels-photo-370717.jpeg?auto=compress&cs=tinysrgb&w=400', availability: 'in-stock' },
            { id: 6, name: 'Wardrobe 3 Door', price: 28000, originalPrice: 35000, rating: 4.4, category: 'Bedroom', image: 'https://images.pexels.com/photos/5998043/pexels-photo-5998043.jpeg?auto=compress&cs=tinysrgb&w=400', availability: 'in-stock' }
        ];

        return mockData.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
    };

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
                title={`Search Results for "${searchQuery}" | Bishwokarma Furniture Nepal`}
                description={`Found ${filteredProducts.length} furniture products matching "${searchQuery}". Browse our collection of sofas, beds, dining sets, and more with competitive prices and free delivery in Nepal.`}
                keywords={`${searchQuery}, furniture search Nepal, ${searchQuery} furniture, furniture store Nepal, buy ${searchQuery} online, furniture shopping Nepal`}
                ogTitle={`Search Results for "${searchQuery}" | Bishwokarma Furniture`}
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

                            {/* Products Grid */}
                            <motion.div
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
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResults;