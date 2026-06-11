"use client";

import React, { useState, useMemo } from 'react';
import './TermsConditions.css';

const TermsConditions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('sec-1');

  // Interactive sections data list
  const sections = useMemo(() => [
    {
      id: 'sec-1',
      title: '1. Introduction',
      shortTitle: 'Introduction',
      content: 'Welcome to Sindureghari Furniture. These Terms and Conditions govern your use of our website and the purchase of products from us. By accessing our website and placing an order, you accept these terms and conditions in full. If you disagree with any part of these terms, please do not use our website.',
      bullets: []
    },
    {
      id: 'sec-2',
      title: '2. Definitions',
      shortTitle: 'Definitions',
      content: 'To clarify the legal bounds, the following definitions apply across our service agreements:',
      bullets: [
        '<strong>"We", "Us", "Our":</strong> Refers to Sindureghari Furniture.',
        '<strong>"You", "Your":</strong> Refers to the user, guest visitor, or registered customer.',
        '<strong>"Products":</strong> Refers to furniture, appliances, custom carpentry, and related accessories sold on our website.',
        '<strong>"Website":</strong> Refers to sinduregharifurniture.shop and associated subdomains.',
        '<strong>"Order":</strong> Refers to your purchase request of products initiated via our platform.'
      ]
    },
    {
      id: 'sec-3',
      title: '3. Products & Pricing',
      shortTitle: 'Products & Pricing',
      content: 'All handcrafted furniture is subject to raw material availability. We reserve the right to discontinue items or modify their design specifications without prior announcement.',
      bullets: [
        'All prices listed on the site are in Nepalese Rupees (NPR).',
        'Tax evaluations are calculated at checkout in compliance with Nepalese local tax laws.',
        'Product dimensions and photographic representations are highly accurate illustrative guides. Minor grain and timber shade variations are natural and part of the rustic, hand-carved charm.',
        'Custom configurations might receive tailored quotes valid for 15 days.'
      ]
    },
    {
      id: 'sec-4',
      title: '4. Ordering & Payment',
      shortTitle: 'Ordering & Payment',
      content: 'Placing an order constitutes a purchasing contract offer. No contract is active until confirmation and payment terms are satisfied.',
      bullets: [
        'We require credit authorization, online gateway verification, or an official deposit receipt to initiate order processing.',
        'Payments are securely accepted via standard digital options (eSewa, Khalti, ConnectIPS), direct bank transfers, or Cash on Delivery (COD) for selected regional areas.',
        'All corporate invoices require verified PAN/VAT registrations.'
      ]
    },
    {
      id: 'sec-5',
      title: '5. Delivery & Setup',
      shortTitle: 'Delivery & Setup',
      content: 'We take massive pride in secure transit. Our white-glove logistics team delivers furniture across key cities in Nepal.',
      bullets: [
        'Free door-to-door shipping applies to Kathmandu Valley, Pokhara, and Rautahat regions for orders surpassing threshold values.',
        'Delivery timelines are estimates. Custom orders usually require 15 to 25 business days for completion.',
        'A recipient of legal age must be present to sign off on quality checks upon delivery.',
        'Professional assembly by our carpenters is complimentary on standard wooden sets.'
      ]
    },
    {
      id: 'sec-6',
      title: '6. Returns & Warranty',
      shortTitle: 'Returns & Warranty',
      content: 'We guarantee the structural integrity of every seasoned wood product we ship.',
      bullets: [
        'Standard stock items can be exchanged or returned within 7 days of delivery if maintained in original condition.',
        'Personalized, bespoke designs, or custom upholstery choices are not eligible for general returns.',
        'Manufacturing defects (such as seasoning issues, joint separations, or premature foam degradation) are covered under our 1 to 5 years warranty schemes.'
      ]
    },
    {
      id: 'sec-7',
      title: '7. Governing Law',
      shortTitle: 'Governing Law',
      content: 'These terms and conditions are formulated in strict compliance with the Electronic Transactions Act, Consumer Protection Act, and other prevailing corporate laws of Nepal. Any legal action or dispute arising from this platform will fall exclusively under the jurisdiction of the district courts of Nepal.',
      bullets: []
    }
  ], []);

  // Filter sections based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery) return sections;
    return sections.filter(sec => 
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.bullets.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, sections]);

  // Scroll to section handler
  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Dynamic search highlighter
  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="search-highlight">{part}</mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="terms-conditions-page">
      {/* Premium Hero Header */}
      <header className="terms-hero">
        <div className="terms-hero-content">
          <span className="terms-badge">Legal Hub</span>
          <h1>Terms & Conditions</h1>
          <p>
            Welcome to Sindureghari Furniture. Please read these terms carefully. They outline the rights, rules, and guidelines that govern our premium services.
          </p>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="terms-main-container">
        {/* Left Column: Interactive Sidebar */}
        <aside className="terms-sidebar">
          {/* Real-time search filter */}
          <div className="terms-search-box">
            <span className="terms-search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search legal terms..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <h3 className="terms-nav-title">Documents</h3>
          <div className="terms-nav-list">
            {filteredSections.map((sec) => (
              <div 
                key={sec.id} 
                className={`terms-nav-item ${activeSection === sec.id ? 'active' : ''}`}
              >
                <button onClick={() => scrollToSection(sec.id)}>
                  {sec.shortTitle}
                  <span className="terms-nav-arrow">→</span>
                </button>
              </div>
            ))}
            {filteredSections.length === 0 && (
              <p style={{ fontSize: '0.9rem', color: 'var(--aether-text-muted)', textAlign: 'center', padding: '20px 0' }}>
                No sections matched your search term.
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="terms-actions-card">
            <button className="action-btn primary-btn" onClick={handlePrint}>
              Print Document 📄
            </button>
            <a 
              href="mailto:support@sinduregharifurniture.shop" 
              className="action-btn"
            >
              Get Legal Copy ✉️
            </a>
          </div>
        </aside>

        {/* Right Column: Terms Content Panel */}
        <article className="terms-content-panel">
          {filteredSections.map((sec) => (
            <section 
              key={sec.id} 
              id={sec.id} 
              className="terms-section-block"
            >
              <h2>{highlightText(sec.title, searchQuery)}</h2>
              <p>{highlightText(sec.content, searchQuery)}</p>
              
              {sec.bullets.length > 0 && (
                <ul>
                  {sec.bullets.map((bullet, idx) => (
                    <li 
                      key={idx}
                      dangerouslySetInnerHTML={{ 
                        __html: searchQuery 
                          ? bullet.replace(new RegExp(`(${searchQuery})`, 'gi'), '<mark class="search-highlight">$1</mark>')
                          : bullet 
                      }}
                    />
                  ))}
                </ul>
              )}
            </section>
          ))}

          {/* Contact Section */}
          <section id="sec-contact" className="terms-section-block">
            <h2>Contact Our Legal Office</h2>
            <p>
              For corporate partnerships, retail complaints, invoice verifications, or other legal inquiries, please contact our administrative desk:
            </p>
            <div className="contact-grid">
              <div className="contact-card">
                <div className="contact-card-title">Corporate Office</div>
                <div className="contact-card-value">Chandrapur Showroom, Rautahat</div>
              </div>
              <div className="contact-card">
                <div className="contact-card-title">Support Helpline</div>
                <div className="contact-card-value">+977-9867332731</div>
              </div>
              <div className="contact-card">
                <div className="contact-card-title">Legal Email</div>
                <div className="contact-card-value">support@sinduregharifurniture.shop</div>
              </div>
            </div>
          </section>

          {/* Acceptance Box */}
          <div className="acceptance-banner">
            <div className="acceptance-icon-wrapper">
              ✓
            </div>
            <h3>Agreement Acknowledgement</h3>
            <p>
              By accessing the store catalog, booking custom carpentry work, or processing digital checkout orders, you declare full compliance with our listed terms and conditions.
            </p>
          </div>
        </article>
      </main>
    </div>
  );
};

export default TermsConditions;
