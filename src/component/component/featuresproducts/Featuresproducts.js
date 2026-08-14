'use client';

import React, { useEffect, useState } from "react";
// import useActivityTracking from '../../../hooks/useActivityTracking'; // Removed due to unused warning
import { API_BASE_URL } from '../../../config/api';
import ProductCard from "../../common/ProductCard/ProductCard";
import "./towgrid.css";

const ImageGrid = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null); // Removed due to unused warning
  // const { trackProductClick } = useActivityTracking(); // Removed due to unused warning

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        // setError(null);

        const response = await fetch(`${API_BASE_URL}/api/featured/products?limit=6`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.products) {
          // Standardize product object structure for ProductCard
          const StandardizedProducts = data.products.map(p => ({
            ...p,
            imageUrl: p.image1 || p.imageUrl,
            new_price: p.new_price,
            old_price: p.old_price,
            material: p.category_name
          }));
          setProducts(StandardizedProducts);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        // setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="furniture-showcase-loading">
        <p>Discovering Premium Pieces...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="furniture-trusted-showcase" aria-label="Featured Products">
      <div className="furniture-showcase-header">
        <div className="header-text-group">
          <h2 className="furniture-showcase-title serif">
            Curated <span className="italic">Selection</span>
          </h2>
          <p className="furniture-showcase-subtitle">
            Discover our handpicked collection of premium furniture pieces,
            crafted for those who appreciate the finer details of modern living.
          </p>
        </div>
      </div>

      <div className="furniture-showcase-container">
        <div className="features-grid">
          {products.map((product, index) => (
            <ProductCard key={product.id || index} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageGrid;