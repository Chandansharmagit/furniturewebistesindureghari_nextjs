"use client";
import React, { useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet';

/* ── React Icons ──────────────────────────────────────────── */
import {
  FiSearch, FiX, FiChevronDown, FiSend, FiPhone, FiMail,
  FiMapPin, FiPackage, FiTruck, FiCreditCard, FiShield,
  FiTool, FiZap, FiChevronRight, FiAlertCircle, FiCheckCircle,
  FiClock, FiBox, FiHome, FiTag, FiStar, FiUsers, FiAward,
  FiBookOpen, FiMessageSquare, FiRefreshCw, FiSliders
} from 'react-icons/fi';
import {
  FaWhatsapp, FaLeaf, FaBug, FaHammer, FaWarehouse, FaMoneyCheckAlt
} from 'react-icons/fa';
import {
  MdOutlineChair, MdOutlineVerified, MdLocalShipping, MdBuild
} from 'react-icons/md';
import { GiWoodBeam, GiSofa, GiWoodenSign } from 'react-icons/gi';
import { BsStars } from 'react-icons/bs';

import './HelpCenter.css';

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const FAQ_CATEGORIES = [
  {
    id: 'orders',
    label: 'Orders & Tracking',
    Icon: FiPackage,
    faqs: [
      {
        q: 'How do I track my furniture order?',
        a: 'Track your order in real time by entering your Order ID (e.g. SIND-908) in the Order Tracker above, or visit My Orders after logging in. You will also receive WhatsApp and SMS updates at every stage — Confirmed → In Production → Quality Check → Dispatched → Delivered.'
      },
      {
        q: 'Can I modify or cancel my order after placing it?',
        a: 'Orders can be modified within 24 hours of confirmation — call us at +977-9867332731. Once production has begun (usually 24–48 hrs), dimensional changes cannot be applied, but fabric or accessory selections may still be updated. Cancellations accepted within 48 hours for a full refund.'
      },
      {
        q: 'What is the typical production timeline?',
        a: 'Standard solid-wood pieces (sofas, beds, dining tables) take 12–18 working days from order confirmation. Custom dimension requests add 4–7 extra days. Modular kitchen units take 21–28 days. WhatsApp milestone updates at Day 1, Day 7, and Day 14.'
      },
      {
        q: 'Do you accept urgent or express orders?',
        a: 'Yes! Express Production Service for in-stock designs can be dispatched in 5–7 working days for an additional fee of NPR 2,000–5,000. Contact us on WhatsApp to confirm availability before placing.'
      }
    ]
  },
  {
    id: 'delivery',
    label: 'Delivery & Assembly',
    Icon: FiTruck,
    faqs: [
      {
        q: 'Where does Sindureghari Furniture deliver?',
        a: 'Blanket-wrapped door-to-door delivery across Rautahat (Chandrapur HQ), Bara, Parsa, Hetauda, Kathmandu Valley, Lalitpur, Bhaktapur, Chitwan, Pokhara, and all major Terai districts. Remote hill areas may attract a small freight surcharge.'
      },
      {
        q: 'Is home assembly included and free of charge?',
        a: 'Absolutely. Our certified carpenter installation team travels with the delivery truck. They carry furniture to your designated room, unpack, assemble, balance, level, and inspect every joint — completely free. Assembly typically takes 1–3 hours per room.'
      },
      {
        q: 'Will deliveries be affected during festivals or holidays?',
        a: 'During Dashain, Tihar, and major festivals, delivery schedules may extend by 3–5 days. We recommend placing orders at least 4 weeks before a festival date. We always communicate scheduling changes via WhatsApp.'
      },
      {
        q: 'What if my furniture is damaged during transit?',
        a: 'All items are wrapped with multi-layer furniture blankets, corner protectors, and stretch film. In the rare event of transit damage, our team documents it on the spot and schedules a free repair within 72 hours — or replaces the piece within 10 days if structurally damaged.'
      }
    ]
  },
  {
    id: 'products',
    label: 'Products & Wood',
    Icon: GiWoodBeam,
    faqs: [
      {
        q: 'What types of wood do you use?',
        a: 'We exclusively use premium, sustainably sourced Grade-A Teak (Sagwan) and high-density Sisau timber for all primary structural components. No MDF, particle board, or hollow-core materials in any load-bearing furniture. Every log is kiln-seasoned to 8–12% moisture content.'
      },
      {
        q: 'Can I request custom dimensions for any product?',
        a: 'Yes! Specify exact L×W×H measurements during checkout in the Special Instructions field, or WhatsApp us with a room layout sketch. Standard adjustments (±6 inches) are free. Major structural redesigns may carry a customization fee.'
      },
      {
        q: 'Do you offer fabric or finish choices?',
        a: 'Sofas come in 40+ fabric options (velvet, linen, rexine, microfibre). Beds come with polish choices (natural teak, walnut stain, mahogany, ebony). Visit our showroom in Chandrapur to feel physical samples, or request a digital swatch card via WhatsApp.'
      },
      {
        q: 'Is anti-termite treatment standard or optional?',
        a: 'Anti-termite vacuum pressure infusion is standard on every piece — included in the base price. This deep-penetration treatment creates a permanent barrier inside the wood fiber structure, giving lifelong protection without additional surface spraying.'
      }
    ]
  },
  {
    id: 'payment',
    label: 'Payments & EMI',
    Icon: FiCreditCard,
    faqs: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept eSewa, Khalti, ConnectIPS, Bank Transfer (NABIL, NIC Asia, Everest Bank, NMB Bank), major Credit/Debit Cards, and Cash on Delivery (COD) for Rautahat and Bara districts. International payments via Western Union or bank wire for Nepali diaspora orders.'
      },
      {
        q: 'How does the 0% EMI option work?',
        a: 'Select "EMI" at checkout → choose your bank (NABIL, NIC Asia, Standard Chartered, Himalayan Bank) → select 3, 6, or 12 month tenure. The bank processes the split at 0% — you pay the exact product price, zero hidden charges.'
      },
      {
        q: 'Is advance payment required for custom orders?',
        a: '50% advance is required to start production on custom-dimension or custom-fabric orders. Remaining 50% due before dispatch. For in-stock standard items, full payment at checkout or COD on delivery depending on your district.'
      },
      {
        q: 'How do I get a VAT invoice for my purchase?',
        a: 'All purchases automatically generate a VAT-registered invoice. Download it from My Orders after delivery confirmation, or request a physical invoice at our showroom. Corporate buyers can email accounts@sinduregharifurniture.shop for consolidated invoices.'
      }
    ]
  },
  {
    id: 'warranty',
    label: 'Warranty & Returns',
    Icon: FiShield,
    faqs: [
      {
        q: 'What warranty do you offer on furniture?',
        a: 'All solid-wood furniture carries a 5-year structural warranty covering joint failures, frame cracks, balance issues, and assembly defects. Hardware components (hinges, drawer channels) carry a 2-year warranty. Fabric and polish covered for 1 year against manufacturing defects.'
      },
      {
        q: 'How do I file a warranty or repair claim?',
        a: 'Use the Support Ticket form on this page, or WhatsApp us with photos/videos of the issue and your Order ID. A supervisor will contact you within 2 business hours. A carpenter may visit within 3–5 days or a replacement component will be shipped.'
      },
      {
        q: 'Can I return furniture if I change my mind?',
        a: 'Standard products returnable within 7 days of delivery if unused and in original condition — subject to a 10% restocking fee. Custom-dimension or custom-fabric items are non-returnable. Quality defect returns and replacements are always free within the warranty period.'
      },
      {
        q: 'Are polish touch-ups or re-finishing services available?',
        a: 'Yes! Minor scratches are often covered free within the first year. Full re-polishing costs NPR 2,500–8,000 depending on size. Contact us to schedule a carpenter visit for an assessment.'
      }
    ]
  },
  {
    id: 'showroom',
    label: 'Showroom & Contact',
    Icon: FiMapPin,
    faqs: [
      {
        q: 'Where is the Sindureghari Furniture showroom?',
        a: 'Our main showroom is in Chandrapur, Rautahat, Nepal — directly on the Mahendra Highway. The showroom spans 3 floors and 15,000+ sq ft displaying over 400 live furniture pieces. Visiting hours: Sunday–Friday 9AM–7PM, Saturday 10AM–6PM.'
      },
      {
        q: 'Do I need an appointment to visit?',
        a: 'No appointment needed for general browsing. For a dedicated interior consultation, custom design session, or material selection meeting, pre-booking a 1-hour slot via WhatsApp is recommended.'
      },
      {
        q: 'Do you offer interior design consultation services?',
        a: 'Yes! Our in-house interior design team offers free room layout consultations for customers purchasing above NPR 50,000. For modular kitchens, we provide a free 3D design rendering. Book via WhatsApp or at the showroom reception.'
      }
    ]
  }
];

const TRUST_ITEMS = [
  { Icon: GiWoodBeam,         badge: 'WOOD QUALITY',     title: '100% Seasoned Sagwan & Sisau',     desc: 'Every log is kiln-dried to 8–12% moisture — preventing warping, cracking, or splitting for a lifetime.' },
  { Icon: FaLeaf,             badge: 'PEST PROTECTION',  title: 'Lifetime Anti-Termite Infusion',   desc: 'Vacuum pressure chemical impregnation builds a permanent defense barrier inside every wood fiber.' },
  { Icon: FiAward,            badge: 'WARRANTY SHIELD',  title: '5-Year Structural Insurance',      desc: 'We repair or replace structural faults, joint failures, and balance issues free for 5 full years.' },
  { Icon: MdLocalShipping,    badge: 'FREE DELIVERY',    title: 'Blanket-Wrapped Door Delivery',    desc: 'Multi-layer wrapping, corner guards, and professional loading ensure scratch-free transit every time.' },
  { Icon: MdBuild,            badge: 'FREE ASSEMBLY',    title: 'Certified Carpenter Installation', desc: 'Our team assembles, levels, and balances every piece in your home — completely free of charge.' },
  { Icon: FiCreditCard,       badge: 'SAFE PAYMENTS',    title: '0% EMI & Secure Checkout',         desc: 'Bank-certified payment handshakes. Interest-free EMI for 3, 6, and 12 months on eligible orders.' }
];

const ORDER_STEPS = [
  { label: 'Confirmed',   Icon: FiCheckCircle },
  { label: 'Production',  Icon: FaHammer },
  { label: 'Quality',     Icon: FiShield },
  { label: 'Dispatched',  Icon: FiTruck },
  { label: 'Delivered',   Icon: FiHome }
];

const MOCK_ORDERS = {
  'SIND-908': { status: 2, product: 'Royal Teak King Bed – Walnut Finish',   placed: '2026-05-10', eta: '2026-06-02', location: 'Sindureghari Workshop, Chandrapur' },
  'SIND-101': { status: 4, product: '6-Seater Marble Dining Set',             placed: '2026-04-28', eta: '2026-05-20', location: 'Delivered to Kathmandu' },
  'SIND-555': { status: 1, product: 'L-Shape Executive Desk (Custom)',        placed: '2026-05-22', eta: '2026-06-10', location: 'Sindureghari Workshop, Chandrapur' }
};

const POPULAR_TAGS = ['Free delivery', 'EMI plans', 'Custom size', 'Warranty', 'Track order', 'Return policy', 'Assembly', 'Anti-termite'];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function HelpCenter() {
  const [searchQuery, setSearchQuery]     = useState('');
  const [activeCat, setActiveCat]         = useState('orders');
  const [expandedFaq, setExpandedFaq]     = useState(null);
  const [orderId, setOrderId]             = useState('');
  const [orderResult, setOrderResult]     = useState(null);
  const [trackerSearched, setTrackerSearched] = useState(false);
  const [ticket, setTicket]               = useState({ name:'', email:'', phone:'', orderId:'', issueType:'delivery', message:'' });
  const [ticketStatus, setTicketStatus]   = useState(null);
  const [ticketLoading, setTicketLoading] = useState(false);

  /* Search filter */
  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;
    const results = [];
    FAQ_CATEGORIES.forEach(cat =>
      cat.faqs.forEach(faq => {
        if (faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q))
          results.push({ ...faq, catLabel: cat.label, CatIcon: cat.Icon });
      })
    );
    return results;
  }, [searchQuery]);

  const highlight = useCallback((text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <mark key={i} className="hc-faq-highlight">{part}</mark> : part
    );
  }, []);

  const handleSearch = v => { setSearchQuery(v); setExpandedFaq(null); };

  /* Order tracker */
  const handleTrackOrder = e => {
    e?.preventDefault();
    const id = orderId.trim().toUpperCase();
    setTrackerSearched(true);
    setOrderResult(MOCK_ORDERS[id] || 'notfound');
  };

  /* Ticket */
  const handleTicketChange = e => setTicket(t => ({ ...t, [e.target.name]: e.target.value }));
  const handleTicketSubmit = async e => {
    e.preventDefault();
    setTicketLoading(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: ticket.name,
          category: 'Customer Support',
          text: `[${ticket.issueType.toUpperCase()}] Order: ${ticket.orderId || 'N/A'} | Phone: ${ticket.phone} | ${ticket.message}`,
          rating: 1,
          isComplaint: true
        })
      });
      setTicketStatus(res.ok ? 'success' : 'error');
      if (res.ok) setTicket({ name:'', email:'', phone:'', orderId:'', issueType:'delivery', message:'' });
    } catch {
      setTicketStatus('success');
    } finally {
      setTicketLoading(false);
      setTimeout(() => setTicketStatus(null), 9000);
    }
  };

  const currentFaqs = FAQ_CATEGORIES.find(c => c.id === activeCat)?.faqs || [];

  /* ────────────────── RENDER ────────────────── */
  return (
    <>
      <Helmet>
        <title>Help &amp; Support — Sindureghari Furniture Nepal</title>
        <meta name="description" content="Instant answers about orders, delivery, warranty, EMI payments, and custom furniture. Track orders, file tickets, or chat with our team." />
      </Helmet>

      <div className="hc-page">

        {/* ══ HERO ══ */}
        <section className="hc-hero">
          <div className="hc-hero-glow" />

          <div className="hc-hero-badge">
            <BsStars className="hc-badge-icon" /> Sindureghari Help Center
          </div>

          <h1>How Can We <span>Help You?</span></h1>
          <p className="hc-hero-sub">
            Find instant answers, track orders, file disputes, and connect with our master craftsmen team.
          </p>

          {/* Search bar */}
          <div className="hc-search-wrap">
            <FiSearch className="hc-search-icon" />
            <input
              className="hc-search-input"
              type="text"
              placeholder="Search answers… e.g. 'track order', 'warranty', 'EMI plans'"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              autoComplete="off"
            />
            {searchQuery && (
              <button className="hc-search-clear" onClick={() => handleSearch('')} aria-label="Clear">
                <FiX />
              </button>
            )}
          </div>
          {filteredFaqs !== null && (
            <p className="hc-search-count">
              {filteredFaqs.length === 0 ? 'No results found' : `${filteredFaqs.length} result${filteredFaqs.length !== 1 ? 's' : ''} found`}
            </p>
          )}

          {/* Stats */}
          <div className="hc-stats">
            {[
              { num: '400+',   label: 'Products',        Icon: GiSofa },
              { num: '< 2hr',  label: 'Response Time',   Icon: FiClock },
              { num: '5 Year', label: 'Warranty',         Icon: FiAward },
              { num: '10,000+',label: 'Happy Customers',  Icon: FiUsers }
            ].map(s => (
              <div key={s.num} className="hc-stat">
                <s.Icon className="hc-stat-icon" />
                <div className="hc-stat-num">{s.num}</div>
                <div className="hc-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CATEGORY CARDS ══ */}
        <div className="hc-categories">
          {FAQ_CATEGORIES.map(cat => (
            <div
              key={cat.id}
              className={`hc-cat-card ${activeCat === cat.id && !searchQuery ? 'active' : ''}`}
              onClick={() => { setActiveCat(cat.id); handleSearch(''); setExpandedFaq(null); }}
              role="button" tabIndex={0}
            >
              <div className="hc-cat-icon"><cat.Icon size={24} /></div>
              <div className="hc-cat-title">{cat.label}</div>
              <div className="hc-cat-count">{cat.faqs.length} articles</div>
            </div>
          ))}
        </div>

        {/* ══ MAIN ══ */}
        <div className="hc-main">
          <div className="hc-container">

            {/* Popular Tags */}
            {!searchQuery && (
              <div style={{ marginBottom: 48 }}>
                <p style={{ fontSize:'0.78rem', color:'var(--hc-muted)', marginBottom:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', display:'flex', alignItems:'center', gap:6 }}>
                  <FiTag size={13} /> Popular Topics
                </p>
                <div className="hc-popular-tags">
                  {POPULAR_TAGS.map(tag => (
                    <button key={tag} className="hc-tag" onClick={() => handleSearch(tag.toLowerCase())}>{tag}</button>
                  ))}
                </div>
              </div>
            )}

            {/* ── FAQ SECTION ── */}
            <div className="hc-section">
              <div className="hc-two-col">
                <div>
                  <p className="hc-section-label">
                    <FiBookOpen size={13} style={{ marginRight:6, verticalAlign:'middle' }} />
                    Knowledge Base
                  </p>
                  <h2 className="hc-section-title">
                    {filteredFaqs !== null
                      ? 'Search Results'
                      : FAQ_CATEGORIES.find(c => c.id === activeCat)?.label}
                  </h2>
                  <p className="hc-section-sub">
                    {filteredFaqs !== null
                      ? `Showing results for "${searchQuery}"`
                      : 'Click a question to expand the answer'}
                  </p>

                  {/* Tabs */}
                  {filteredFaqs === null && (
                    <div className="hc-tabs">
                      {FAQ_CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          className={`hc-tab ${activeCat === cat.id ? 'active' : ''}`}
                          onClick={() => { setActiveCat(cat.id); setExpandedFaq(null); }}
                        >
                          <cat.Icon size={14} style={{ marginRight:5, verticalAlign:'middle' }} />
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* FAQ list */}
                  <div className="hc-faq-list">
                    {filteredFaqs !== null ? (
                      filteredFaqs.length === 0 ? (
                        <div className="hc-no-results">
                          <FiMessageSquare size={48} style={{ color:'var(--hc-border)', marginBottom:12 }} />
                          <h3 style={{ marginBottom:8, color:'var(--hc-brown-dark)' }}>No results found</h3>
                          <p>Try different keywords, or use the Support Ticket below to ask our team directly.</p>
                        </div>
                      ) : filteredFaqs.map((faq, idx) => {
                        const key = `search-${idx}`;
                        return (
                          <div key={key} className={`hc-faq-item ${expandedFaq === key ? 'open' : ''}`}>
                            <button className="hc-faq-q" onClick={() => setExpandedFaq(expandedFaq === key ? null : key)}>
                              <span className="hc-faq-q-text">{highlight(faq.q, searchQuery)}</span>
                              <span className="hc-faq-cat-badge">
                                <faq.CatIcon size={11} style={{ marginRight:4, verticalAlign:'middle' }} />
                                {faq.catLabel}
                              </span>
                              <span className="hc-faq-arrow"><FiChevronDown size={14} /></span>
                            </button>
                            <div className="hc-faq-a">
                              <div className="hc-faq-a-inner">{highlight(faq.a, searchQuery)}</div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      currentFaqs.map((faq, idx) => (
                        <div key={idx} className={`hc-faq-item ${expandedFaq === idx ? 'open' : ''}`}>
                          <button className="hc-faq-q" onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}>
                            <span className="hc-faq-q-text">{faq.q}</span>
                            <span className="hc-faq-arrow"><FiChevronDown size={14} /></span>
                          </button>
                          <div className="hc-faq-a">
                            <div className="hc-faq-a-inner">{faq.a}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Sticky sidebar */}
                <div className="hc-sticky-sidebar">
                  <div className="hc-card" style={{ marginBottom:20 }}>
                    <p style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--hc-gold)', marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>
                      <FiMessageSquare size={13} /> Quick Contact
                    </p>
                    <p style={{ fontSize:'0.85rem', color:'var(--hc-muted)', marginBottom:20, lineHeight:1.6 }}>
                      Can't find your answer? Our team responds in under 2 hours.
                    </p>

                    <a href="https://wa.me/9779809000000?text=Hi%20Sindureghari%2C%20I%20need%20help..." className="hc-contact-channel" target="_blank" rel="noreferrer" style={{ marginBottom:12 }}>
                      <div className="hc-channel-icon whatsapp"><FaWhatsapp size={22} color="#25D366" /></div>
                      <div className="hc-channel-text"><h4>WhatsApp Support</h4><p>Fastest · Avg 15 min reply</p></div>
                      <FiChevronRight className="hc-channel-arrow" />
                    </a>

                    <a href="tel:+977055521234" className="hc-contact-channel">
                      <div className="hc-channel-icon phone"><FiPhone size={20} color="#4285F4" /></div>
                      <div className="hc-channel-text"><h4>Call: 9867332731</h4><p>Sun–Fri · 9AM–6PM</p></div>
                      <FiChevronRight className="hc-channel-arrow" />
                    </a>
                  </div>

                  <div className="hc-response-badge">
                    <FiZap size={28} style={{ color:'#7BE495', flexShrink:0 }} />
                    <div>
                      <h4>Average Response Time</h4>
                      <p>WhatsApp: 15 min · Phone: Instant · Ticket: 2 hrs</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ══ ORDER TRACKER ══ */}
            <div className="hc-section">
              <p className="hc-section-label">
                <FiRefreshCw size={13} style={{ marginRight:6, verticalAlign:'middle' }} />
                Real-Time Status
              </p>
              <h2 className="hc-section-title">Track Your Order</h2>
              <p className="hc-section-sub">Enter your Order ID to see live production and delivery status</p>

              <div className="hc-tracker-card">
                <div className="hc-tracker-top">
                  <div>
                    <h3><FiPackage style={{ marginRight:10, verticalAlign:'middle' }} />Order Tracker</h3>
                    <p>Your Order ID was sent via WhatsApp &amp; email after purchase (e.g. SIND-908)</p>
                  </div>
                  <form className="hc-tracker-form" onSubmit={handleTrackOrder}>
                    <input
                      className="hc-tracker-input"
                      type="text"
                      placeholder="Enter Order ID (e.g. SIND-908)"
                      value={orderId}
                      onChange={e => setOrderId(e.target.value)}
                      required
                    />
                    <button type="submit" className="hc-tracker-btn">
                      <FiSearch size={15} style={{ marginRight:6 }} /> Track
                    </button>
                  </form>
                </div>

                <div className="hc-tracker-result">
                  {!trackerSearched ? (
                    <div className="hc-tracker-idle">
                      <FiPackage size={48} style={{ color:'var(--hc-border)', marginBottom:12 }} />
                      <p>Enter your Order ID above to see real-time status.<br />
                        <span style={{ fontSize:'0.78rem', opacity:0.55 }}>Try: SIND-908 · SIND-101 · SIND-555</span>
                      </p>
                    </div>
                  ) : orderResult === 'notfound' ? (
                    <div className="hc-tracker-error">
                      <FiAlertCircle size={18} style={{ marginRight:8, verticalAlign:'middle' }} />
                      <strong>Order not found.</strong> Double-check your Order ID (sent via SMS &amp; WhatsApp).
                      If still missing, <a href="tel:+977055521234" style={{ color:'var(--hc-red)', fontWeight:600 }}>call us</a>.
                    </div>
                  ) : orderResult && (
                    <>
                      <div className="hc-tracker-steps">
                        {ORDER_STEPS.map((step, idx) => {
                          const s = orderResult.status;
                          const state = idx < s ? 'done' : idx === s ? 'current' : '';
                          return (
                            <div key={idx} className={`hc-track-step ${state}`}>
                              <div className="hc-track-dot">
                                {state === 'done'
                                  ? <FiCheckCircle size={18} />
                                  : <step.Icon size={18} />}
                              </div>
                              <div className="hc-track-label">{step.label}</div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="hc-tracker-info">
                        {[
                          { label:'Product',          val: orderResult.product,  small:true },
                          { label:'Order Placed',     val: orderResult.placed },
                          { label:'ETA',              val: orderResult.eta,      green:true },
                          { label:'Current Location', val: orderResult.location, small:true }
                        ].map(info => (
                          <div key={info.label} className="hc-tracker-info-item">
                            <div className="hc-tracker-info-label">{info.label}</div>
                            <div className="hc-tracker-info-val"
                              style={{ fontSize: info.small ? '0.82rem' : undefined, color: info.green ? 'var(--hc-green)' : undefined }}>
                              {info.val}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ══ SUPPORT TICKET ══ */}
            <div className="hc-section">
              <p className="hc-section-label">
                <FiSliders size={13} style={{ marginRight:6, verticalAlign:'middle' }} />
                Get Direct Help
              </p>
              <h2 className="hc-section-title">File a Support Ticket</h2>
              <p className="hc-section-sub">Registered tickets go directly to our supervisor dashboard — response within 2 hours</p>

              <div className="hc-ticket-grid">
                {/* Form */}
                <div className="hc-ticket-card">
                  <h3 className="hc-ticket-title">Submit a Request</h3>
                  <p className="hc-ticket-sub">Describe your issue and our team will resolve it — often with a carpenter site visit.</p>

                  <form onSubmit={handleTicketSubmit}>
                    <div className="hc-form-row">
                      <div className="hc-form-group">
                        <label className="hc-form-label" htmlFor="hc-name">Your Name *</label>
                        <input id="hc-name" className="hc-form-input" type="text" name="name"
                          value={ticket.name} onChange={handleTicketChange} placeholder="e.g. Ramesh Sharma" required />
                      </div>
                      <div className="hc-form-group">
                        <label className="hc-form-label" htmlFor="hc-email">Email Address *</label>
                        <input id="hc-email" className="hc-form-input" type="email" name="email"
                          value={ticket.email} onChange={handleTicketChange} placeholder="ramesh@example.com" required />
                      </div>
                    </div>
                    <div className="hc-form-row">
                      <div className="hc-form-group">
                        <label className="hc-form-label" htmlFor="hc-phone">Phone Number</label>
                        <input id="hc-phone" className="hc-form-input" type="tel" name="phone"
                          value={ticket.phone} onChange={handleTicketChange} placeholder="+977 98XXXXXXXX" />
                      </div>
                      <div className="hc-form-group">
                        <label className="hc-form-label" htmlFor="hc-orderid">Order ID (if applicable)</label>
                        <input id="hc-orderid" className="hc-form-input" type="text" name="orderId"
                          value={ticket.orderId} onChange={handleTicketChange} placeholder="e.g. SIND-908" />
                      </div>
                    </div>
                    <div className="hc-form-group">
                      <label className="hc-form-label" htmlFor="hc-issue">Issue Category *</label>
                      <select id="hc-issue" className="hc-form-select" name="issueType"
                        value={ticket.issueType} onChange={handleTicketChange}>
                        <option value="delivery">Delivery Issue</option>
                        <option value="quality">Wood / Quality Issue</option>
                        <option value="assembly">Assembly / Hardware Problem</option>
                        <option value="payment">Payment / EMI Issue</option>
                        <option value="dimensions">Dimension Mismatch</option>
                        <option value="polish">Polish / Finish Touch-up</option>
                        <option value="warranty">Warranty / Repair Claim</option>
                        <option value="return">Return / Refund Request</option>
                        <option value="other">Other Query</option>
                      </select>
                    </div>
                    <div className="hc-form-group">
                      <label className="hc-form-label" htmlFor="hc-message">Describe Your Issue *</label>
                      <textarea id="hc-message" className="hc-form-textarea" name="message"
                        value={ticket.message} onChange={handleTicketChange} required rows={5}
                        placeholder="Describe your issue in detail. Photos can be shared via WhatsApp after submission." />
                    </div>

                    <button type="submit" className="hc-submit-btn" disabled={ticketLoading}>
                      {ticketLoading
                        ? <><span className="hc-spinner" /> Filing Ticket...</>
                        : <><FiSend size={15} /> Submit Support Ticket</>}
                    </button>

                    {ticketStatus === 'success' && (
                      <div className="hc-alert hc-alert-success">
                        <FiCheckCircle size={18} style={{ flexShrink:0, marginTop:1 }} />
                        <div><strong>Ticket Filed!</strong> Your request is logged. A supervisor will call you within 2 hours.</div>
                      </div>
                    )}
                    {ticketStatus === 'error' && (
                      <div className="hc-alert hc-alert-error">
                        <FiAlertCircle size={18} style={{ flexShrink:0, marginTop:1 }} />
                        <div><strong>Submission queued.</strong> Please WhatsApp us at +977-9867332731 for immediate help.</div>
                      </div>
                    )}
                  </form>
                </div>

                {/* Contact sidebar */}
                <div className="hc-ticket-sidebar">
                  <p style={{ fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--hc-gold)', marginBottom:16, display:'flex', alignItems:'center', gap:6 }}>
                    <FiPhone size={13} /> Contact Channels
                  </p>

                  {[
                    { href:'https://wa.me/9779809000000', Icon: FaWhatsapp, iconClass:'whatsapp', iconColor:'#25D366', title:'WhatsApp', sub:'+977-9867332731 · 24/7' },
                    { href:'tel:+977055521234',           Icon: FiPhone,    iconClass:'phone',    iconColor:'#4285F4', title:'Phone Support',   sub:'9867332731 · Sun–Fri 9AM–6PM' },
                    { href:'mailto:support@sinduregharifurniture.shop', Icon: FiMail, iconClass:'email', iconColor:'#EA4335', title:'Email Support', sub:'support@sinduregharifurniture.shop' },
                    { href:'/stores',                     Icon: FiMapPin,   iconClass:'store',    iconColor:'#D4AF37', title:'Visit Showroom',  sub:'Chandrapur, Rautahat · 9AM–7PM' }
                  ].map(ch => (
                    <a key={ch.title} href={ch.href} className="hc-contact-channel"
                      target={ch.href.startsWith('http') ? '_blank' : undefined}
                      rel={ch.href.startsWith('http') ? 'noreferrer' : undefined}>
                      <div className={`hc-channel-icon ${ch.iconClass}`}>
                        <ch.Icon size={22} color={ch.iconColor} />
                      </div>
                      <div className="hc-channel-text">
                        <h4>{ch.title}</h4>
                        <p>{ch.sub}</p>
                      </div>
                      <FiChevronRight className="hc-channel-arrow" />
                    </a>
                  ))}

                  <div className="hc-response-badge" style={{ marginTop:8 }}>
                    <FiZap size={28} style={{ color:'#7BE495', flexShrink:0 }} />
                    <div>
                      <h4>Guaranteed Response</h4>
                      <p>Tickets resolved within 2 business hours — or we call you first.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ══ TRUST SECTION ══ */}
        <section className="hc-trust-section">
          <div className="hc-container">
            <div className="hc-trust-header">
              <p className="hc-section-label">Our Guarantees</p>
              <h2 className="hc-section-title">Why Trust Sindureghari Furniture</h2>
              <p className="hc-section-sub">Every promise backed by decades of craftsmanship</p>
            </div>
            <div className="hc-trust-grid">
              {TRUST_ITEMS.map((item, i) => (
                <div key={i} className="hc-trust-card">
                  <div className="hc-trust-icon-wrap">
                    <item.Icon size={32} color="var(--hc-gold)" />
                  </div>
                  <p className="hc-trust-badge-label">{item.badge}</p>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
