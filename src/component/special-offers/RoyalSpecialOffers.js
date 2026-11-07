"use client";

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Link from "next/link";
import { BadgePercent, ChevronRight, Gem, ShieldCheck, Truck, Wrench } from "lucide-react";
import { PRODUCT_ENDPOINTS, fetchWithFallback } from "../../config/api";
import "./RoyalSpecialOffers.css";

const FALLBACK_OFFERS = [
  {
    id: 91,
    name: "Dashain Room Furniture Offer - Sofa, Bed & Table Combo",
    description: "Handcrafted solid wood living & bedroom furniture suite for festive comfort.",
    price: 88500,
    originalPrice: 122000,
    discount: 27,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    category: "DASHAINOFFER",
  },
  {
    id: 92,
    name: "Dashain Furniture Mega Combo Nepal - Sofa, Bed and Dining Bundle",
    description: "Complete 3-room solid sisau timber bundle with 10-year warranty.",
    price: 135000,
    originalPrice: 190000,
    discount: 29,
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
    category: "DASHAINOFFER",
  },
  {
    id: 93,
    name: "Dashain Bedroom Upgrade Combo - Storage Bed and Wardrobe Set",
    description: "Hydraulic lift-up storage king bed with matching 3-door wardrobe.",
    price: 98000,
    originalPrice: 138000,
    discount: 29,
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80",
    category: "DASHAINOFFER",
  },
  {
    id: 94,
    name: "Dashain Living Room Combo - Sofa, Center Table and Side Stools",
    description: "Luxury upholstered solid teakwood 3+1+1 set with coffee table.",
    price: 78000,
    originalPrice: 108000,
    discount: 28,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    category: "DASHAINOFFER",
  },
];

export default function RoyalSpecialOffers({ compact = false }) {
  const [products, setProducts] = useState(FALLBACK_OFFERS);
  const [loading, setLoading] = useState(false);
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
      const response = await fetchWithFallback(PRODUCT_ENDPOINTS.LIST, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const responseData = await response.json();
      const allProducts = Array.isArray(responseData) ? responseData : responseData.products || [];

      let filteredProducts = allProducts.filter((product) => {
        const catName = (product.categoryName || product.category || "").toLowerCase();
        return catName.includes("offer") || catName.includes("royal") || catName.includes("dashain");
      });

      if (filteredProducts.length === 0) {
        filteredProducts = allProducts.slice(0, 8);
      }

      if (filteredProducts.length === 0) {
        return; // Retain fallback offers
      }

      const transformedProducts = filteredProducts.map((product) => {
        let imageUrl = product.imageUrl;

        if (!imageUrl && product.imageUrls) {
          try {
            const imageUrls = typeof product.imageUrls === "string" ? JSON.parse(product.imageUrls) : product.imageUrls;
            imageUrl = Array.isArray(imageUrls) ? imageUrls[0] : imageUrls;
          } catch (e) {
            // Ignore parse error
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
        setProducts(transformedProducts.sort((a, b) => b.id - a.id));
      }
    } catch (err) {
      // Gracefully silent on dev fallback to keep UX smooth
      console.warn("Notice: Live offer sync unavailable, displaying curated royal offers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialProducts();
  }, []);

  const displayProducts = products.length > 0 ? products : FALLBACK_OFFERS;
  const maxDiscount = Math.max(...displayProducts.map((p) => p.discount || 25));

  // If compact mode (for Home page integration), render strictly the clean 4-card showcase
  if (compact) {
    return (
      <section className="royal-special-products-section royal-special-container" aria-label="Royal Special Offers">
        <div className="royal-special-section-header">
          <div>
            <span className="royal-special-section-kicker">Featured Offers</span>
            <h2 className="royal-special-section-title">Royal Special Offers</h2>
            <p className="royal-special-section-subtitle">
              {displayProducts.length} selected furniture deals available now
            </p>
          </div>
          <Link href="/special-offers-all" className="royal-special-view-all-btn">
            View All Offers <ChevronRight size={16} />
          </Link>
        </div>

        <div className="royal-special-products-grid">
          {displayProducts.slice(0, 4).map((product) => (
            <article key={product.id} className="royal-special-product-card">
              <Link href={`/product/${product.id}`} className="royal-special-product-image-wrapper">
                <img
                  src={product.image}
                  alt={product.name}
                  className="royal-special-product-image"
                  loading="lazy"
                />
                <span className="royal-special-discount-badge">{product.discount}% OFF</span>
              </Link>
              <div className="royal-special-product-info">
                <div className="royal-special-product-meta">
                  <span>{product.category}</span>
                  <span><ShieldCheck size={14} /> In stock</span>
                </div>
                <h3 className="royal-special-product-title">
                  <Link href={`/product/${product.id}`}>
                    {product.name.length > 72 ? `${product.name.substring(0, 72)}...` : product.name}
                  </Link>
                </h3>
                <div className="royal-special-product-pricing">
                  <span className="royal-special-current-price">{formatPrice(product.price)}</span>
                  {product.originalPrice > product.price && (
                    <span className="royal-special-original-price">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="royal-special-container">
      <Helmet>
        <title>{pageData.title}</title>
        <meta name="description" content={pageData.description} />
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

      <div className="royal-special-products-section">
        <div className="royal-special-section-header">
          <div>
            <span className="royal-special-section-kicker">Featured Offers</span>
            <h2 className="royal-special-section-title">Royal Special Offers</h2>
            <p className="royal-special-section-subtitle">{displayProducts.length} selected furniture deals available now</p>
          </div>
          <Link href="/special-offers-all" className="royal-special-view-all-btn">
            View All Offers <ChevronRight size={16} />
          </Link>
        </div>

        <div className="royal-special-products-grid">
          {displayProducts.slice(0, 4).map((product) => (
            <article key={product.id} className="royal-special-product-card">
              <Link href={`/product/${product.id}`} className="royal-special-product-image-wrapper">
                <img src={product.image} alt={product.name} className="royal-special-product-image" loading="lazy" />
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
    </div>
  );
}
