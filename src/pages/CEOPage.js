"use client";
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Quote, Award, Sparkles, ShieldCheck, ArrowRight, Mail } from 'lucide-react';
import SEOComponent from '../components/SEO/SEOComponent';
import './CEOPage.css';

const CEOPage = () => {
  const ceoStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Chandan Sharma",
    "jobTitle": "Founder & Chief Executive Officer",
    "worksFor": {
      "@type": "FurnitureStore",
      "name": "Sindureghari Furniture (Bishwokarma)",
      "url": "https://sinduregharifurniture.shop"
    },
    "description": "Founder & CEO of Sindureghari Furniture, pioneering luxury Nepalese woodcraft with modern design and customized royal collections.",
    "sameAs": [
      "https://www.facebook.com/furnituresindureghari",
      "https://www.instagram.com/furnituresindureghari"
    ],
    "image": "https://res.cloudinary.com/db5okniim/image/upload/v1758082708/furniture-products/images/rh4ajiavzh4tazx6qmlo.jpg"
  };

  return (
    <div className="ceo-page">
      <SEOComponent
        title="Chandan Sharma — Founder & CEO | Sharma Furniture"
        description="Meet Chandan Sharma, the visionary Founder & CEO behind Sharma & Sindureghari Furniture. Discover his journey of combining Nepalese woodcraft heritage with modern luxury."
        keywords="Chandan Sharma, Founder Sharma Furniture, CEO Sindureghari Furniture, premium woodcraft Nepal, luxury furniture brand Nepal"
        ogTitle="Chandan Sharma — Founder & CEO | Sharma Furniture"
        ogDescription="Read the story of how Chandan Sharma is revolutionizing Nepalese woodcraft with modern design principles and custom-tailored royal collections."
        canonicalUrl="https://sinduregharifurniture.shop/ceo"
        structuredData={ceoStructuredData}
      />

      {/* Editorial Header Section */}
      <section className="ceo-editorial-header">
        <div className="ceo-container">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="editorial-header-content"
          >
            <span className="editorial-pre-title">THE VISIONARY LEADERSHIP</span>
            <h1 className="editorial-title serif">
              Crafting Sanctuaries of <span className="serif-italic">Comfort & Legacy</span>
            </h1>
            <p className="editorial-subtitle">
              Founder & Chief Executive Officer — Chandan Sharma
            </p>
            <div className="editorial-line-divider"></div>
          </motion.div>
        </div>
      </section>

      {/* Main Profile Grid Section */}
      <section className="ceo-profile-section">
        <div className="ceo-container">
          {/* Row 1: Executive Legacy (Image Left, Text Right) */}
          <div className="ceo-grid">
            
            {/* Left Column: Portrait */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="ceo-image-wrapper"
            >
              <div className="ceo-image-card">
                <img 
                  src="/assets/images/ceo.jpg" 
                  alt="Chandan Sharma - Founder & CEO of Sharma Furniture" 
                  className="ceo-img"
                />
                <div className="ceo-img-border-top"></div>
                <div className="ceo-img-border-bottom"></div>
                <div className="ceo-image-badge">
                  <span className="badge-year">Est. 1995</span>
                  <span className="badge-text">Legacy Refined</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Bio Content */}
            <div className="ceo-bio-content">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="ceo-quote-box"
              >
                <Quote className="quote-icon" size={40} />
                <p className="ceo-quote serif-italic">
                  "We do not merely shape wood; we sculpt sanctuaries of comfort and legacy. Every grain holds a story, and every piece of furniture is a testament to timeless Nepalese craftsmanship."
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="ceo-bio-text"
              >
                <h3 className="serif">Bridging Heritage and Modernity</h3>
                <p>
                  As the leader of Sharma Furniture, Chandan Sharma represents a new era of fine living in Nepal. Having grown up in the fragrance of seasoned teak and solid rosewood, Chandan witnessed firsthand the dedication of generational master carpenters who turned raw timber into royal masterpieces.
                </p>
                <p>
                  However, Chandan saw a deeper calling. His vision was to take this unmatched 30-year legacy of family carpentry in Rautahat and elevate it into a modern, direct-to-consumer luxury experience. Under his leadership, the brand launched <strong>Sindureghari Furniture</strong>, marrying traditional joinery and 100% solid-wood longevity with contemporary minimalist geometry, ergonomic comfort, and premium glassmorphic accents.
                </p>
                <p>
                  "Our mission is to replace disposable, mass-produced furniture with heritage items that you'll proudly pass down through generations," Chandan explains. "We source only premium, responsibly seasoned wood like Grade-A Teak and Sisau, ensuring each sofa, bed, and dining table stands as a monument of durability."
                </p>
              </motion.div>
            </div>

          </div>

          {/* Row 2: Modern Design Visionary (Text Left, Image Right) */}
          <div className="ceo-grid creative-grid">
            
            {/* Left Column: Creative Bio Content */}
            <div className="ceo-bio-content">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="ceo-bio-text"
              >
                <h3 className="serif">Designing the Future of Fine Living</h3>
                <p>
                  Innovation is at the heart of our operations. In his modern workspace, Chandan leads design sessions, reviews digital 3D models of bespoke customer commissions, and ensures every detail is in sync with modern standards. He actively collaborates with international design consultants to bring a global perspective to local wood species.
                </p>
                <p>
                  "We believe your home should be an extension of your character," Chandan notes. "By leveraging digital visualizations and direct customer feedback, we allow our clients to co-design their spaces. It's not just about selling furniture; it's about curated, personal experiences that start from the very first click on our website."
                </p>
                <p>
                  Under his tech-enabled leadership, Bishwokarma / Sharma Furniture has expanded its presence across Nepal, introducing premium virtual catalog consulting, digital material previews, and a sophisticated customization portal.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="ceo-signature-block"
              >
                <div className="ceo-signature">
                  <span className="signature-font">Chandan Sharma</span>
                </div>
                <div className="ceo-signature-title">
                  <strong>Chandan Sharma</strong>
                  <span>Founder & CEO, Sharma Furniture Group</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Creative Workspace Portrait */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="ceo-image-wrapper"
            >
              <div className="ceo-image-card">
                <img 
                  src="/assets/images/ceo_workspace.jpg" 
                  alt="Chandan Sharma in his creative workspace" 
                  className="ceo-img"
                />
                <div className="ceo-img-border-top"></div>
                <div className="ceo-img-border-bottom"></div>
                <div className="ceo-image-badge">
                  <span className="badge-year">Design Lab</span>
                  <span className="badge-text">Modern Tech</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Bento Grid: Key Philosophies */}
      <section className="ceo-philosophies-section">
        <div className="ceo-container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-header text-center"
          >
            <span className="section-subtitle">THE THREE PILLARS</span>
            <h2 className="section-title serif">My Design & Business Philosophy</h2>
            <div className="gold-divider"></div>
          </motion.div>

          <div className="philosophies-grid">
            {/* Bento Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="philosophy-card bento-1"
            >
              <div className="card-icon-wrapper">
                <Award size={30} className="gold-icon" />
              </div>
              <h3 className="serif">1. Absolute Craftsmanship</h3>
              <p>
                We never compromise on materials. By using seasoned, plantation-grade wood and employing hand-carving techniques passed down through generations, we build furniture that breathes with life and maintains structural integrity for decades.
              </p>
            </motion.div>

            {/* Bento Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="philosophy-card bento-2"
            >
              <div className="card-icon-wrapper">
                <Sparkles size={30} className="gold-icon" />
              </div>
              <h3 className="serif">2. Functional Aesthetics</h3>
              <p>
                A beautiful piece must serve its purpose flawlessly. We focus on premium luxury ergonomics, sourcing elite fabrics, high-density comfort foams, and state-of-the-art modular hardware to ensure our products feel as divine as they look.
              </p>
            </motion.div>

            {/* Bento Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="philosophy-card bento-3"
            >
              <div className="card-icon-wrapper">
                <ShieldCheck size={30} className="gold-icon" />
              </div>
              <h3 className="serif">3. Transparent Integrity</h3>
              <p>
                Purchasing high-end furniture is an investment. We honor this by providing transparent pricing, easy zero-interest EMI financing options, free white-glove setup all over Nepal, and an ironclad guarantee on all solid wood works.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="ceo-cta-section">
        <div className="ceo-cta-bg"></div>
        <div className="ceo-container">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="ceo-cta-card"
          >
            <h2 className="serif">Let's Co-Create Your Sanctuary</h2>
            <p>
              Whether you want to furnish a majestic penthouse, design an elegant office space, or commission a fully customized royal teak sofa set, our dedicated design team and I are ready to bring your vision to life.
            </p>
            <div className="ceo-cta-actions">
              <Link to="/contact" className="ceo-btn primary">
                <span>Commission Custom Work</span>
                <ArrowRight size={18} />
              </Link>
              <a href="mailto:ceo@Sharma.com" className="ceo-btn secondary">
                <Mail size={18} />
                <span>Contact Office</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CEOPage;
