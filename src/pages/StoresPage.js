"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Navigation, Mail } from 'lucide-react';
import './StoresPage.css';

const StoresPage = () => {
  const storeLocations = [
    {
      city: "Kathmandu",
      name: "The Grand Sanctuary — Kathmandu",
      address: "Sindureghari Heights, Opposite Furniture Plaza, Kathmandu, Nepal",
      phone: "+977-1-4567890",
      email: "kathmandu@sinduregharifurniture.shop",
      hours: "Sun - Fri: 9:00 AM - 7:00 PM",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop",
      isPremium: true
    },
    {
      city: "Pokhara",
      name: "Lakeside Minimalist Gallery",
      address: "Pokhara Lakeside, Street No. 4, Pokhara, Nepal",
      phone: "+977-61-543210",
      email: "pokhara@sinduregharifurniture.shop",
      hours: "Sun - Fri: 10:00 AM - 6:00 PM",
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop",
      isPremium: false
    },
    {
      city: "Lalitpur",
      name: "The Design Foundry",
      address: "Lalitpur Creative District, Jhamsikhel, Lalitpur, Nepal",
      phone: "+977-1-5556677",
      email: "lalitpur@sinduregharifurniture.shop",
      hours: "Sun - Fri: 10:00 AM - 8:00 PM",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
      isPremium: true
    }
  ];

  return (
    <div className="stores-page">
      {/* Hero Section */}
      <section className="stores-hero">
        <div className="stores-hero-overlay"></div>
        <div className="stores-container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="stores-hero-content"
          >
            <span className="stores-badge">Our Locations</span>
            <h1 className="stores-main-title serif">
              Visit Our <span className="serif-italic">Sanctuaries</span>
            </h1>
            <p className="stores-main-subtitle">
              Experience the touch of pure craftsmanship in person. Explore our beautifully curated showrooms across Nepal.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="stores-grid-section">
        <div className="stores-container">
          <div className="stores-grid">
            {storeLocations.map((store, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className={`store-card ${store.isPremium ? 'premium' : ''}`}
              >
                <div className="store-card-image">
                  <img src={store.image} alt={store.name} loading="lazy" />
                  {store.isPremium && <span className="premium-tag">Flagship Store</span>}
                </div>
                
                <div className="store-card-content">
                  <h3 className="store-name serif">{store.name}</h3>
                  <div className="store-info-list">
                    <div className="store-info-item">
                      <MapPin size={18} />
                      <span>{store.address}</span>
                    </div>
                    <div className="store-info-item">
                      <Phone size={18} />
                      <span>{store.phone}</span>
                    </div>
                    <div className="store-info-item">
                      <Mail size={18} />
                      <span>{store.email}</span>
                    </div>
                    <div className="store-info-item highlight">
                      <Clock size={18} />
                      <span>{store.hours}</span>
                    </div>
                  </div>
                  
                  <button className="store-directions-btn">
                    <Navigation size={18} />
                    <span>Get Directions</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="stores-cta-section">
        <div className="stores-container">
          <div className="stores-cta-card">
            <h2 className="serif">Can&apos;t visit in person?</h2>
            <p>Our design consultants are available for virtual appointments and home visits.</p>
            <button className="consultation-btn">Book a Design Consultation</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StoresPage;
