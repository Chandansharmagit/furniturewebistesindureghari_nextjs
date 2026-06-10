"use client";

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, User, Share2 } from 'lucide-react';
import SEOComponent from '../../components/SEO/SEOComponent';
import blogService from '../../services/blogService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './blog.css';

const BlogPost = () => {
  const { id: slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const result = await blogService.getBlogBySlug(slug);
        if (result.success) {
          setPost(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('An unexpected error occurred while loading the article.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return <div className="blog-loading-container"><LoadingSpinner message="Unfolding the story..." /></div>;
  if (error || !post) return (
    <div className="blog-error-container">
      <h2 className="serif">Article Lost in Time</h2>
      <p>{error || 'We couldn\'t find the article you were looking for.'}</p>
      <Link to="/blog" className="back-link">Return to Journal</Link>
    </div>
  );

  const readTime = Math.ceil(post.content.split(' ').length / 200) + ' min read';

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://sinduregharifurniture.shop/blog/${slug}`
    },
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image_url ? [post.image_url] : [],
    "author": {
      "@type": "Person",
      "name": `${post.first_name || ''} ${post.last_name || ''}`.trim() || 'Bishwokarma Furniture'
    },
    "publisher": {
      "@type": "Organization",
      "name": "Bishwokarma Furniture",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sinduregharifurniture.shop/logo.png"
      }
    },
    "datePublished": post.created_at,
    "dateModified": post.updated_at || post.created_at
  };

  return (
    <div className="blog-post-page">
      <SEOComponent 
        title={`${post.title} | Bishwokarma Furniture Journal`}
        description={post.excerpt}
        ogImage={post.image_url}
        ogType="article"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="blog-progress-bar"></div>

      <header className="post-header">
        <div className="container-narrow">
          <Link to="/blog" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to Journal</span>
          </Link>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="post-meta"
          >
            <span className="post-category-badge">{post.category}</span>
            <div className="post-meta-items">
              <span className="meta-item"><User size={14} /> {post.first_name} {post.last_name}</span>
              <span className="meta-item"><Calendar size={14} /> {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span className="meta-item"><Clock size={14} /> {readTime}</span>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="post-title serif"
          >
            {post.title}
          </motion.h1>
        </div>
      </header>

      {post.image_url && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="post-hero-image"
        >
          <img src={post.image_url} alt={post.title} />
        </motion.div>
      )}

      <main className="post-content-section">
        <div className="container-narrow">
          <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }}></div>
          
          <div className="post-footer">
            <div className="post-tags">
              <span>#BishwokarmaDesign</span>
              <span>#FurnitureJournal</span>
              <span>#NepalCraft</span>
            </div>
            <button className="share-article-btn" onClick={() => {
              if (navigator.share) {
                navigator.share({ title: post.title, url: window.location.href });
              }
            }}>
              <Share2 size={18} />
              <span>Share Article</span>
            </button>
          </div>
        </div>
      </main>

      <section className="newsletter-cta">
        <div className="container-narrow">
          <div className="cta-card">
            <h3 className="serif">Join the Curation</h3>
            <p>Get exclusive interior design tips and first access to our new collections.</p>
            <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email address" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
