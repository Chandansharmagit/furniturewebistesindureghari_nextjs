"use client";

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Link from "next/link";
import { BadgePercent, ChevronRight, Gem, ShieldCheck, Truck, Wrench } from "lucide-react";
import { buildApiUrl, PRODUCT_ENDPOINTS } from "../../config/api";
import "./RoyalSpecialOffers.css";

export default function RoyalSpecialOffers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageData, setPageData] = useState({
    title: "Royal Special Collection - Exclusive Furniture Offers | Furniture Sindureghari",
    description:
      "Discover our exclusive Royal Special furniture collection. Transform your home with elegant designs and premium savings on quality furniture.",
    keywords:
      "Special offers, premium furniture, royal collection, Nepal furniture, exclusive collection, home decor, quality furniture, premium savings",
    ogImage: "https://sinduregharifurniture.shop/images/special-premium-collection.jpg",
  });

  const formatPrice = (price) => {
    const amount = Number(price || 0);
    return `Rs. ${new Intl.NumberFormat("en-IN").format(Math.max(0, Math.round(amount)))}`;
  };

  const fetchSpecialProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(buildApiUrl(PRODUCT_ENDPOINTS.LIST), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const responseData = await response.json();
      const allProducts = Array.isArray(responseData) ? responseData : responseData.products || [];

      const filteredProducts = allProducts.filter((product) => {
        const catName = (product.categoryName || product.category || "").toLowerCase();
        return catName.includes("offer") || catName.includes("royal") || catName.includes("dashain");
      });

      if (filteredProducts.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const transformedProducts = filteredProducts.map((product) => {
        let imageUrl = product.imageUrl;

        if (!imageUrl && product.imageUrls) {
          try {
            const imageUrls = typeof product.imageUrls === "string" ? JSON.parse(product.imageUrls) : product.imageUrls;
            imageUrl = Array.isArray(imageUrls) ? imageUrls[0] : imageUrls;
          } catch (e) {
            console.warn("Failed to parse imageUrls:", product.imageUrls);
          }
        }

        const price = parseFloat(product.new_price) || 0;
        const originalPrice = parseFloat(product.old_price) || price * 1.25;
        const discount = originalPrice > price
          ? Math.round(((originalPrice - price) / originalPrice) * 100)
          : 20;

        return {
          id: product.id,
          name: product.name || product.title || "Unnamed Product",
          description: product.description || `Premium ${product.categoryName || "furniture"} for your home`,
          price,
          originalPrice,
          discount,
          image: imageUrl || "/api/placeholder/600/400",
          category: product.categoryName || product.category || "Furniture",
        };
      });

      if (transformedProducts.length > 0) {
        const firstProduct = transformedProducts[0];
        setPageData({
          title: `Royal Special Collection - ${transformedProducts.length} Exclusive Offers | Furniture Sindureghari`,
          description: `Discover ${transformedProducts.length} premium furniture pieces in our Royal Special collection. Starting from Rs. ${Math.min(...transformedProducts.map((p) => p.price)).toLocaleString()} with up to ${Math.max(...transformedProducts.map((p) => p.discount))}% off.`,
          keywords: `${transformedProducts.map((p) => p.name).slice(0, 5).join(", ")}, premium furniture, Nepal furniture, royal offers`,
          ogImage: firstProduct.image.startsWith("http") ? firstProduct.image : `https://sinduregharifurniture.shop${firstProduct.image}`,
        });
      }

      setProducts(transformedProducts.sort((a, b) => b.id - a.id));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching special offer products:", err);
      setError(err.message);
      setProducts([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSpecialProducts();
  }, []);

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

  if (error || products.length === 0) {
    return (
      <div className="royal-special-container">
        <Helmet>
          <title>Exclusive Offers - Furniture Sindureghari</title>
          <meta name="description" content="Exclusive furniture offers currently unavailable. Please check back soon for royal deals." />
        </Helmet>
        <div className="royal-special-error">
          <h2>{error ? "Exclusive Offers Currently Unavailable" : "No Special Offers Found"}</h2>
          <p>{error || "We do not have any specific offers available at the moment."}</p>
          {error && (
            <button onClick={fetchSpecialProducts} className="royal-special-retry-btn">
              Try Again
            </button>
          )}
          <div style={{ marginTop: "20px" }}>
            <Link href="/products" className="royal-special-breadcrumb-link">
              Browse All Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const maxDiscount = Math.max(...products.map((product) => product.discount));

  return (
    <div className="royal-special-container">
      <Helmet>
        <title>{pageData.title}</title>
        <meta name="description" content={pageData.description} />
        <meta name="keywords" content={pageData.keywords} />
        <meta property="og:title" content={pageData.title} />
        <meta property="og:description" content={pageData.description} />
        <meta property="og:image" content={pageData.ogImage} />
        <meta property="og:url" content={typeof window !== "undefined" ? window.location.href : "https://sinduregharifurniture.shop"} />
        <meta name="twitter:title" content={pageData.title} />
        <meta name="twitter:description" content={pageData.description} />
        <meta name="twitter:image" content={pageData.ogImage} />
      </Helmet>

      <div className="royal-special-header">
        <div className="royal-special-header-content">
          <span className="royal-special-eyebrow">
            <BadgePercent size={16} />
            Limited-Time Furniture Deals
          </span>
          <h1 className="royal-special-title">Royal Special Collection</h1>
          <p className="royal-special-subtitle">
            Curated premium furniture offers with stronger savings, room-ready designs,
            and support for delivery, EMI and installation.
          </p>
        </div>
      </div>

      <div className="royal-special-hero-section">
        <div className="royal-special-hero-content">
          <div className="royal-special-hero-text">
            <span className="royal-special-hero-kicker">Premium Royal Collection</span>
            <h2>Style your home with smarter savings</h2>
            <p>
              Choose from handpicked sofas, beds, wardrobes and dining pieces selected for
              better value, stronger finishes and everyday comfort.
            </p>
            <div className="royal-special-hero-features">
              <div className="royal-special-feature">
                <Gem size={18} className="royal-special-feature-icon" />
                <span>Premium quality materials</span>
              </div>
              <div className="royal-special-feature">
                <BadgePercent size={18} className="royal-special-feature-icon" />
                <span>Up to {maxDiscount}% royal discount</span>
              </div>
              <div className="royal-special-feature">
                <Truck size={18} className="royal-special-feature-icon" />
                <span>Delivery support</span>
              </div>
              <div className="royal-special-feature">
                <Wrench size={18} className="royal-special-feature-icon" />
                <span>Installation guidance</span>
              </div>
            </div>
          </div>

          <div className="royal-special-hero-images">
            {[products[0], products[1] || products[0]].map((product, index) => (
              <Link href={`/product/${product.id}`} className="royal-special-hero-image-card" key={`${product.id}-${index}`}>
                <img src={product.image} alt={product.name} />
                <span>{product.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="royal-special-products-section">
        <div className="royal-special-section-header">
          <div>
            <span className="royal-special-section-kicker">Featured Offers</span>
            <h2 className="royal-special-section-title">Royal Special Offers</h2>
            <p className="royal-special-section-subtitle">{products.length} selected furniture deals available now</p>
          </div>
          {products.length > 4 && (
            <Link href="/special-offers-all" className="royal-special-view-all-btn">
              View All Offers <ChevronRight size={16} />
            </Link>
          )}
        </div>

        <div className="royal-special-products-grid">
          {products.slice(0, 4).map((product) => (
            <article key={product.id} className="royal-special-product-card">
              <Link href={`/product/${product.id}`} className="royal-special-product-image-wrapper">
                <img src={product.image} alt={product.name} className="royal-special-product-image" />
                <span className="royal-special-discount-badge">{product.discount}% OFF</span>
              </Link>
              <div className="royal-special-product-info">
                <div className="royal-special-product-meta">
                  <span>{product.category}</span>
                  <span><ShieldCheck size={14} /> In stock</span>
                </div>
                <h3 className="royal-special-product-title">
                  <Link href={`/product/${product.id}`}>
                    {product.name.length > 78 ? `${product.name.substring(0, 78)}...` : product.name}
                  </Link>
                </h3>
                <div className="royal-special-product-pricing">
                  <span className="royal-special-current-price">{formatPrice(product.price)}</span>
                  <span className="royal-special-original-price">{formatPrice(product.originalPrice)}</span>
                </div>
                <div className="royal-special-savings">
                  You save {formatPrice(product.originalPrice - product.price)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="royal-special-banner-section">
        <div className="royal-special-banner-content">
          <div className="royal-special-banner-text">
            <h2>Special financing available</h2>
            <p>Ask about EMI options on selected furniture purchases above Rs. 50,000.</p>
          </div>
          <Link href="/contact" className="royal-special-banner-button">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
