"use client";

import React from 'react';
import { Eye, Rocket, Compass, Milestone, Sparkles, Trees, ShieldAlert, Award, Globe } from 'lucide-react';
import './vision.css';

export default function VisionPage() {
  const pillars = [
    {
      icon: <Trees size={22} className="pillar-icon" />,
      title: "100% Sustainably Sourced",
      description: "We work directly with certified regional forest divisions in Nepal to source mature, government-approved Sisau and Teak, ensuring zero illegal logging."
    },
    {
      icon: <Globe size={22} className="pillar-icon" />,
      title: "Globalizing Nepalese Artistry",
      description: "Our dream is to place hand-carved Nepalese royal beds and luxury dining sets in global luxury exhibitions from Dubai to New York."
    },
    {
      icon: <Award size={22} className="pillar-icon" />,
      title: "Precision Wood Seasoning",
      description: "We are phasing out raw/wet wood usage entirely. By using state-of-the-art computerized kiln chambers, we guarantee a lifetime warp-free promise."
    },
    {
      icon: <Sparkles size={22} className="pillar-icon" />,
      title: "Empowering Rural Master Carvers",
      description: "We support local Nepalese craftsmen and traditional Vishwokarma carpenters with fair wages, modern safety kits, and pension security plans."
    }
  ];

  const timelineSteps = [
    {
      years: "Years 1 - 2",
      title: "The Digital & Direct-to-Consumer Relaunch",
      desc: "Perfecting online purchasing, 3-click bank EMI checkouts, white-glove shipping to major cities, and custom 3D design consultations for homeowners."
    },
    {
      years: "Years 3 - 5",
      title: "Regional Showroom Expansion",
      desc: "Opening 15+ high-end, premium franchise showrooms across Pokhara, Kathmandu, Lalitpur, Hetauda, Biratnagar, and Narayangarh."
    },
    {
      years: "Years 6 - 8",
      title: "Sindureghari Reforestation Reserve",
      desc: "Acquiring private reserve land in Rautahat to plant 50,000 Teak & Sisau trees, maintaining a strict 10-to-1 planting ratio for every set sold."
    },
    {
      years: "Years 9 - 10",
      title: "World-Class Heritage Exports",
      desc: "Earning international certifications for timber processing and exporting luxury solid wood custom furniture collections globally to royal styling lovers."
    }
  ];

  return (
    <div className="vision-page-container">
      {/* Editorial Header */}
      <header className="vision-hero">
        <div className="vision-hero-inner">
          <div className="vision-badge">
            <Compass size={14} className="gold-icon" />
            <span>Our Future Manifesto</span>
          </div>
          <h1>Crafting Luxury Solid Wood For Generations</h1>
          <p className="vision-intro">
            Rooted in traditional heritage, powered by technological engineering, and bound by sustainable love. 
            Discover our strategic 10-year master plan to elevate Nepalese woodcraft.
          </p>
        </div>
      </header>

      {/* Main Vision Statement */}
      <section className="manifesto-card max-w-4xl mx-auto">
        <div className="manifesto-inner">
          <Eye size={40} className="manifesto-gold-icon" />
          <h2 className="serif">Our Ultimate Vision</h2>
          <p>
            "To establish **Sindureghari Furniture** as Nepal's most revered, sustainably-aligned luxury brand, 
            blending absolute raw timber durability with the computerized precision of tomorrow, ensuring 
            every home inherits heirloom-grade wooden artistry that lasts over a century."
          </p>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="vision-section">
        <div className="section-header">
          <span className="section-tag">Foundation</span>
          <h2>The Four Pillars of Our Vision</h2>
          <p>How we ensure quality, protect the environment, and uplift our community.</p>
        </div>

        <div className="pillars-bento-grid">
          {pillars.map((p, idx) => (
            <div key={idx} className="vision-pillar-card">
              <div className="pillar-icon-box">{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="vision-section timeline-section-wrapper">
        <div className="section-header">
          <span className="section-tag">Roadmap</span>
          <h2>The 10-Year Master Plan</h2>
          <p>A transparent, high-performance roadmap outlining our growth and ecological impact from 2026 to 2036.</p>
        </div>

        <div className="timeline-journey">
          {timelineSteps.map((step, idx) => (
            <div key={idx} className="timeline-step-node">
              <div className="step-badge">{step.years}</div>
              <div className="step-details-card">
                <div className="step-indicator">
                  <Milestone size={18} className="milestone-icon" />
                  <div className="step-line"></div>
                </div>
                <div className="step-text">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Closing Call to Action */}
      <section className="vision-closing-banner max-w-4xl mx-auto">
        <div className="closing-content">
          <Rocket size={32} className="gold-icon" />
          <h3 className="serif">Join Us on this Journey</h3>
          <p>
            Every piece of furniture you purchase from us helps plant certified timber reserves, supports local master carvers, 
            and fuels the dream of making Nepal-made luxury famous worldwide.
          </p>
        </div>
      </section>
    </div>
  );
}
