"use client";

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
// import { motion } from 'framer-motion'; // Removed due to unused warning
// import FavoriteButton from '../common/FavoriteButton'; // Removed due to unused warning
import { buildApiUrl, PRODUCT_ENDPOINTS } from '../../config/api';
import ProductCard from '../common/ProductCard/ProductCard';
import './Newproduct.css';

const Newproduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const gettingproducts = async () => {
        try {
            setLoading(true);
            // Use centralized API config - Sofa Section for "New Products"
            const url = buildApiUrl(`${PRODUCT_ENDPOINTS.LIST}?categoryName=Sofa%20Section`);
            const response = await axios.get(url);
            setProducts(response.data);
            console.log('New Products API Response:', response.data);
        } catch (error) {
            console.error('Error fetching new products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        gettingproducts();
    }, []);



    // Drag to scroll functionality
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    if (loading) {
        return (
            <div className="newproduct-loading">
                <div className="royal-spinner"></div>
                <p>Establishing New Royal Arrivals...</p>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return null; // Don't show the section if no products
    }
    return (
        <section className="newproduct-royal-section">
            <div className="newproduct-watermark">MASTERPIECE</div>
            <div className="newproduct-container">
            <div className="newproduct-header-editorial">
                <div className="editorial-left">
                    <span className="editorial-eyebrow">The Royal Collection</span>
                    <h2 className="newproduct-title">Exquisite Living <br/>Masterpieces</h2>
                    <div className="title-gold-accent"></div>
                </div>
                
                <div className="editorial-right">
                    <p className="newproduct-subtitle">
                        Sophisticated sofa collections designed for the modern royal residence,
                        featuring hand-crafted textures and timeless silhouettes.
                    </p>
                    <Link href="/new-products" className="newproduct-view-all">
                        Explore Collection
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>

                <div
                    className="newproduct-scroll-wrapper"
                    ref={scrollRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    <div className="newproduct-grid">
                        {products.map((product, index) => (
                            <ProductCard key={product.id || index} product={product} />
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Newproduct;