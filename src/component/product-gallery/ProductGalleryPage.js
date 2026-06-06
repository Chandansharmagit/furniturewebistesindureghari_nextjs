"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ImageIcon, Search, Sparkles } from "lucide-react";
import { buildApiUrl, PRODUCT_ENDPOINTS } from "../../config/api";
import "./ProductGalleryPage.css";

const parseImages = (product) => {
  const images = [];
  if (Array.isArray(product.images)) images.push(...product.images);
  if (product.imageUrl) images.push(product.imageUrl);
  if (product.image_url) images.push(product.image_url);
  if (product.imageUrls) {
    try {
      const parsed = typeof product.imageUrls === "string" ? JSON.parse(product.imageUrls) : product.imageUrls;
      if (Array.isArray(parsed)) images.push(...parsed);
    } catch {
      // Ignore malformed image JSON from older products.
    }
  }
  return [...new Set(images.filter(Boolean))];
};

export default function ProductGalleryPage() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const response = await fetch(buildApiUrl(PRODUCT_ENDPOINTS.LIST), { cache: "no-store" });
        const data = await response.json();
        const productList = Array.isArray(data) ? data : data.products || data.data || [];
        if (isMounted) setProducts(productList);
      } catch (error) {
        console.warn("Product gallery failed to load:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const galleryItems = useMemo(() => products.flatMap((product) => (
    parseImages(product).map((image, index) => ({
      id: `${product.id}-${index}-${image}`,
      image,
      productId: product.id,
      name: product.name,
      sku: product.sku,
      category: product.categoryName || product.category || "Sindureghari Collection",
      price: product.new_price || product.salePrice
    }))
  )), [products]);

  const filteredItems = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return galleryItems;
    return galleryItems.filter((item) => (
      item.name?.toLowerCase().includes(term) ||
      item.sku?.toLowerCase().includes(term) ||
      item.category?.toLowerCase().includes(term)
    ));
  }, [galleryItems, query]);

  return (
    <main className="product-gallery-page">
      <section className="gallery-hero">
        <span className="gallery-kicker">
          <Sparkles size={15} />
          Uploaded Product Gallery
        </span>
        <h1>Every uploaded product image in one visual gallery.</h1>
        <p>Browse all product photos added by the admin team, with quick links back to each product page.</p>
        <div className="gallery-search">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search gallery by product, SKU, or category"
          />
        </div>
      </section>

      <section className="gallery-board">
        <div className="gallery-board-head">
          <div>
            <span>{filteredItems.length} images</span>
            <h2>Product Image Library</h2>
          </div>
        </div>

        {loading ? (
          <div className="gallery-empty">Loading product images...</div>
        ) : filteredItems.length === 0 ? (
          <div className="gallery-empty">
            <ImageIcon size={34} />
            <strong>No product images found</strong>
            <span>Upload product photos from admin products and they will appear here.</span>
          </div>
        ) : (
          <div className="gallery-grid">
            {filteredItems.map((item) => (
              <Link href={`/product/${item.productId}`} className="gallery-card" key={item.id}>
                <span className="gallery-image-wrap">
                  <img src={item.image} alt={`${item.name} product gallery`} loading="lazy" />
                </span>
                <span className="gallery-card-body">
                  <strong>{item.name}</strong>
                  <small>{item.sku || item.category}</small>
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
