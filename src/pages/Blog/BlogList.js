"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SEOComponent from '../../components/SEO/SEOComponent';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { APP_ENDPOINTS, buildApiUrl } from '../../config/api';
import { buildGalleryBlogPosts } from '../../data/galleryBlogPosts';
import './blog.css';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(buildApiUrl(APP_ENDPOINTS.GALLERY), { cache: 'no-store' });
        const data = await response.json();
        const products = Array.isArray(data) ? data : data.products || data.data || [];
        setPosts(buildGalleryBlogPosts(products));
      } catch (err) {
        setError('No gallery products are available for the Journal yet.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <div className="blog-loading-container"><LoadingSpinner message="Opening the Journal..." /></div>;
  if (error) return <div className="blog-error-container"><h2>Unable to load Journal</h2><p>{error}</p></div>;

  const heroPosts = posts.slice(0, 3);

  return (
    <div className="blog-page">
      <SEOComponent 
        title="Sindureghari Furniture Blog - Interior Design & Furniture Insights"
        description="Expert advice on interior design, furniture craftsmanship, and home styling from the masters at Sindureghari Furniture."
        keywords="interior design blog nepal, furniture tips, teak wood benefits, home decor trends 2024"
      />

      <header className="blog-hero">
        <div className="container">
          <div className="blog-hero-layout">
            <div className="blog-hero-copy">
              <span className="blog-eyebrow">Sindureghari Furniture Journal</span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="serif"
              >
                Product stories from the showroom floor.
              </motion.h1>
              <p className="blog-subtitle">Real gallery images, buying notes, room-fit ideas, and SEO guides built around Sindureghari furniture collections.</p>
              <div className="blog-hero-metrics" aria-label="Journal highlights">
                <span><strong>{posts.length}</strong> gallery stories</span>
                <span><strong>100%</strong> product images</span>
                <span><strong>Nepal</strong> buying guides</span>
              </div>
            </div>

            {heroPosts.length > 0 && (
              <div className="blog-hero-preview" aria-label="Featured gallery stories">
                {heroPosts.map((post, index) => (
                  <Link
                    href={`/blog/${post.slug}`}
                    className={`blog-hero-tile tile-${index + 1}`}
                    key={post.slug}
                  >
                    <img src={post.image_url} alt={post.title} />
                    <span>{post.category}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container">
        {posts.length === 0 ? (
          <div className="blog-empty">
            <h3 className="serif">The Journal is currently quiet.</h3>
            <p>Check back soon for new insights into the world of luxury design.</p>
          </div>
        ) : (
          <div className="blog-bento-grid">
            {posts.map((post, index) => (
              <motion.article 
                key={post.id || post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`blog-card ${index % 7 === 0 ? 'blog-card-featured' : ''} ${index % 7 === 3 ? 'blog-card-tall' : ''}`}
              >
                <Link href={`/blog/${post.slug}`} className="blog-card-image">
                  <img src={post.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80'} alt={post.title} />
                  <span className="blog-category">{post.category}</span>
                </Link>
                <div className="blog-card-body">
                  <span className="blog-date">
                    {new Date(post.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <h2 className="serif">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p>{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="read-more">Read Article</Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
