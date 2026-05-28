"use client";

import React, { useState, useMemo } from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('sec-1');

  // Interactive sections data list for Privacy Policy
  const sections = useMemo(() => [
    {
      id: 'sec-1',
      title: '1. Introduction',
      shortTitle: 'Introduction',
      content: 'Welcome to Bishwokarma Furniture (Sindureghari Furniture). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we collect, handle, and safeguard your personal data when you visit our website, place custom carpentry requests, or communicate with our store representatives, and tell you about your privacy rights and how the law protects you.',
      bullets: []
    },
    {
      id: 'sec-2',
      title: '2. Information We Collect',
      shortTitle: 'Information Collected',
      content: 'We may collect, use, store, and transfer different kinds of personal data about you to fulfill your orders and enhance your site experience:',
      bullets: [
        '<strong>Identity Data:</strong> First name, last name, username, or profile identifiers from social logins.',
        '<strong>Contact Data:</strong> Shipping address, billing address, phone number, and email address.',
        '<strong>Transaction Data:</strong> Details about payments, bank transfer screenshots, and records of products purchased.',
        '<strong>Technical Data:</strong> IP address, device specs, browser types, and cookie session histories.',
        '<strong>Usage Data:</strong> Information showing how you navigate our catalogs, product pages, and checkout workflows.'
      ]
    },
    {
      id: 'sec-3',
      title: '3. How We Use Your Information',
      shortTitle: 'Data Usage',
      content: 'We strictly process data in a lawful, transparent manner. Your personal information is utilized in the following ways:',
      bullets: [
        'To process, manufacture, ship, and setup your handcrafted wooden furniture orders.',
        'To manage secure billing transactions, tax reports, and regional transport charges.',
        'To coordinate with our local carpenters for custom home measurements and white-glove setup.',
        'To notify you about changes in delivery timelines or send you order tracking details via Email/SMS.',
        'To improve our storefront performance, catalog layouts, and personalized customer recommendations.'
      ]
    },
    {
      id: 'sec-4',
      title: '4. Data Security & Storage',
      shortTitle: 'Security Standards',
      content: 'We employ state-of-the-art administrative, logical, and technical protection systems to ensure your details remain strictly confidential.',
      bullets: [
        'All client payment receipts, invoices, and design drafts are backed up on secure databases.',
        'We restrict access to your personal identity to employees and carpenters who require it specifically for custom fabrication or delivery setups.',
        'Secure Socket Layer (SSL) encryption is deployed on all API transactions between your browser and our servers.'
      ]
    },
    {
      id: 'sec-5',
      title: '5. Cookies & Tracking',
      shortTitle: 'Cookies Policy',
      content: 'We use secure cookies and tracking pixels to analyze traffic patterns, remember items added to your shopping cart, and maintain active login sessions.',
      bullets: [
        'Session cookies are deleted automatically as soon as you close your browser.',
        'Persistent cookies remain stored to greet you by name and load custom preferences on repeat visits.',
        'You can configure your browser to reject cookies, though doing so might disable certain checkout features.'
      ]
    },
    {
      id: 'sec-6',
      title: '6. Third-Party Integrations',
      shortTitle: 'Third-Party Links',
      content: 'Our site utilizes trusted third-party integrations (such as Google OAuth for logins, Cloudinary for custom upload drafts, and digital payment gateways) to provide a rich interactive interface.',
      bullets: [
        'These third-party platforms apply their own independent data policies.',
        'We do not control the practices of external web assets and encourage you to review their legal notices when leaving our portal.'
      ]
    },
    {
      id: 'sec-7',
      title: '7. Your Legal Rights',
      shortTitle: 'Your Rights',
      content: 'In compliance with the Electronic Transactions and Consumer Protection Acts, you have full ownership over how your data is treated:',
      bullets: [
        'Right to request access and view all personal records stored in our databases.',
        'Right to edit, update, or correct outdated address lines and phone listings.',
        'Right to request permanent deletion of your profile history (erasure).',
        'Right to opt-out of newsletter list subscriptions and general direct marketing updates.'
      ]
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
    <div className="privacy-policy-page">
      {/* Premium Hero Header */}
      <header className="privacy-hero">
        <div className="privacy-hero-content">
          <span className="privacy-badge">Data Privacy</span>
          <h1>Privacy Policy</h1>
          <p>
            We are fully committed to protecting your personal information. Read our transparent policies detailing how your customer profile and payment records are handled.
          </p>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="privacy-main-container">
        {/* Left Column: Interactive Sidebar */}
        <aside className="privacy-sidebar">
          {/* Real-time search filter */}
          <div className="privacy-search-box">
            <span className="privacy-search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search privacy policy..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <h3 className="privacy-nav-title">Sections</h3>
          <div className="privacy-nav-list">
            {filteredSections.map((sec) => (
              <div 
                key={sec.id} 
                className={`privacy-nav-item ${activeSection === sec.id ? 'active' : ''}`}
              >
                <button onClick={() => scrollToSection(sec.id)}>
                  {sec.shortTitle}
                  <span className="privacy-nav-arrow">→</span>
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
          <div className="privacy-actions-card">
            <button className="action-btn primary-btn" onClick={handlePrint}>
              Print Policy 📄
            </button>
            <a 
              href="mailto:support@sinduregharifurniture.shop" 
              className="action-btn"
            >
              Get Written Copy ✉️
            </a>
          </div>
        </aside>

        {/* Right Column: Privacy Content Panel */}
        <article className="privacy-content-panel">
          {filteredSections.map((sec) => (
            <section 
              key={sec.id} 
              id={sec.id} 
              className="privacy-section-block"
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
          <section id="sec-contact" className="privacy-section-block">
            <h2>Contact Our Privacy Officer</h2>
            <p>
              If you have any questions about this Privacy Policy, wish to access your personal data files, or request permanent deletion of your profile:
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
                <div className="contact-card-title">Privacy Email</div>
                <div className="contact-card-value">support@sinduregharifurniture.shop</div>
              </div>
            </div>
          </section>

          {/* Acceptance Box */}
          <div className="privacy-acceptance-banner">
            <div className="privacy-acceptance-icon-wrapper">
              ✓
            </div>
            <h3>Agreement Acknowledgement</h3>
            <p>
              By continuing to use our website, ordering custom products, or interacting with our store customer care, you acknowledge full consent to our privacy guidelines.
            </p>
          </div>
        </article>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
