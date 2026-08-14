"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import ProductCard from '../../components/common/ProductCard/ProductCard';
import { buildApiUrl, PRODUCT_ENDPOINTS } from '../../config/api';
import './Homeappliances.css';

export default function Homeappliances() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const url = buildApiUrl(`${PRODUCT_ENDPOINTS.LIST}?categoryName=homeappliances`);
                const response = await axios.get(url);

                let data = response.data || [];
                
                if (data.length === 0) {
                    const altUrl = buildApiUrl(`${PRODUCT_ENDPOINTS.LIST}?categoryName=appliances`);
                    const altResponse = await axios.get(altUrl);
                    data = altResponse.data || [];
                }

                // Transform with grid metadata for editorial look
                const transformedData = data.slice(0, 12).map((product, index) => ({
                    ...product,
                    gridSize: index === 0 ? 'large' : 'regular' // First item is featured large
                }));

                setProducts(transformedData);
            } catch (error) {
                console.error('Error fetching home appliances:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="homeappliances-loading">
                <div className="skeleton-loader"></div>
                <p>Curating Home Collection...</p>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <section className="homeappliances-section">
            <div className="homeappliances-container">
                <header className="homeappliances-header">
                    <div className="header-content">
                        <div className="editorial-badge">Collection 2024</div>
                        <h1 className="homeappliances-title">
                            The Modern Appliance
                        </h1>
                        <p className="homeappliances-subtitle">
                            Elevating everyday living with a curated selection of high-performance appliances, 
                            where sophisticated engineering meets elegant editorial style.
                        </p>
                    </div>
                    <Link href="/home-appliances" className="homeappliances-view-all">
                        Explore Collection
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </header>

                <div className="homeappliances-grid">
                    {products.map((product) => (
                        <div key={product.id} className={`grid-item ${product.gridSize}`}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
