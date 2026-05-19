"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEOComponent from '../../components/SEO/SEOComponent';
import blogService from '../../services/blogService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './blog.css';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const result = await blogService.getAllBlogs();
        if (result.success) {
          setPosts(result.data || []);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('An unexpected error occurred while fetching blogs.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <div className="blog-loading-container"><LoadingSpinner message="Opening the Journal..." /></div>;
  if (error) return <div className="blog-error-container"><h2>Unable to load Journal</h2><p>{error}</p></div>;

  return (
    <div className="blog-page">
      <SEOComponent 
        title="Bishwokarma Blog - Interior Design & Furniture Insights"
        description="Expert advice on interior design, furniture craftsmanship, and home styling from the masters at Bishwokarma Furniture."
        keywords="interior design blog nepal, furniture tips, teak wood benefits, home decor trends 2024"
      />

      <header className="blog-hero">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="serif"
          >
            The <span className="serif-italic">Journal</span>
          </motion.h1>
          <p className="blog-subtitle">Insights from the intersection of tradition and modern design.</p>
        </div>
      </header>

      <div className="container">
        {posts.length === 0 ? (
          <div className="blog-empty">
            <h3 className="serif">The Journal is currently quiet.</h3>
            <p>Check back soon for new insights into the world of luxury design.</p>
          </div>
        ) : (
          <div className="blog-grid">
            {posts.map((post, index) => (
              <motion.article 
                key={post.id || post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="blog-card"
              >
                <Link to={`/blog/${post.slug}`} className="blog-card-image">
                  <img src={post.image_url || 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?q=80&w=2070&auto=format&fit=crop'} alt={post.title} />
                  <span className="blog-category">{post.category}</span>
                </Link>
                <div className="blog-card-body">
                  <span className="blog-date">
                    {new Date(post.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <h2 className="serif">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p>{post.excerpt}</p>
                  <Link to={`/blog/${post.slug}`} className="read-more">Read Article</Link>
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
