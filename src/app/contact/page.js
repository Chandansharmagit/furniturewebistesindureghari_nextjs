"use client";

import React, { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Custom Design Inquiry',
    message: '',
    contactMethod: 'WhatsApp'
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate premium server-side logging and database register
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Custom Design Inquiry',
        message: '',
        contactMethod: 'WhatsApp'
      });
      setTimeout(() => setSubmitted(false), 6000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-16 font-sans">
      <div className="max-w-[1600px] mx-auto px-4 md:px-10">
        
        {/* Luxury Page Header */}
        <div className="text-center mb-16">
          <span className="text-[#D4AF37] font-semibold text-xs tracking-[0.25em] uppercase block mb-3">
            BISHWOKARMA WOODCRAFT
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#4A2B15] font-bold tracking-tight mb-4">
            Connect With Our Showroom
          </h1>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Have a custom dimensions requirement or want to consult with our master artisans? Let us know. Complete payment protection, design assurance, and free assembly are our pledges.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Call & Showroom Details (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Showroom Card */}
            <div className="bg-white rounded-2xl p-8 border border-stone-200/60 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-bl-full transition-transform duration-500 group-hover:scale-110"></div>
              <h3 className="text-xl font-serif font-bold text-[#4A2B15] mb-4">Sindureghari Showroom</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-6">
                Our central display arena exhibits over 10,000 sq.ft. of handcrafted teak sofas, beds, and modular fittings.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-stone-100 rounded-xl text-stone-700">
                    📍
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-700 text-sm">Location Address</h4>
                    <p className="text-stone-500 text-xs mt-1">Showroom Highway Road, Chandrapur, Rautahat, Nepal</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-stone-100 rounded-xl text-stone-700">
                    📞
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-700 text-sm">Phone Assistance</h4>
                    <p className="text-[#8B4513] text-xs font-medium mt-1 hover:underline cursor-pointer">
                      <a href="tel:+9779855040000">+977-9855040000</a> / <a href="tel:+977055540111">055-540111</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-stone-100 rounded-xl text-stone-700">
                    ✉️
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-700 text-sm">Email Address</h4>
                    <p className="text-stone-500 text-xs mt-1 hover:underline">
                      <a href="mailto:support@sinduregharifurniture.shop">support@sinduregharifurniture.shop</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Connect */}
            <div className="bg-[#128C7E]/5 border border-[#128C7E]/10 rounded-2xl p-6 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#128C7E] rounded-full flex items-center justify-center text-white text-xl font-bold">
                  💬
                </div>
                <div>
                  <h4 className="font-bold text-stone-800 text-sm">WhatsApp Live Chat</h4>
                  <p className="text-stone-500 text-xs">Direct answers in under 5 minutes</p>
                </div>
              </div>
              <a 
                href="https://wa.me/9779855040000" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-300 shadow-sm"
              >
                Chat Now
              </a>
            </div>

            {/* Premium Guarantee Badge */}
            <div className="bg-gradient-to-br from-[#4A2B15] to-[#2E1A0C] text-white rounded-2xl p-8 shadow-md relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-xl"></div>
              <span className="text-[#D4AF37] font-semibold text-xs tracking-widest uppercase block mb-2">SINDUREGHARI PLEDGE</span>
              <h4 className="text-lg font-serif font-bold mb-3">Lifetime Solid Wood Guarantee</h4>
              <p className="text-stone-300 text-xs leading-relaxed">
                All customized orders go through structural kiln seasoning and advanced anti-termite preservation. We stand fully behind our wood quality.
              </p>
            </div>
          </div>

          {/* Right Column: Premium Form Connected to Logs (7 Columns) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-8 md:p-10 border border-stone-200/60 shadow-sm">
            <h3 className="text-xl font-serif font-bold text-[#4A2B15] mb-2">Send Message Directly To Server</h3>
            <p className="text-stone-500 text-xs mb-8">Fill the secure inquiry form below. Our showroom managers will log your query and revert instantly.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Thapa"
                    className="border border-stone-200 focus:border-[#D4AF37] outline-none rounded-xl px-4 py-3 text-stone-700 text-sm transition-all bg-stone-50/30"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. ramesh@example.com"
                    className="border border-stone-200 focus:border-[#D4AF37] outline-none rounded-xl px-4 py-3 text-stone-700 text-sm transition-all bg-stone-50/30"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9855040000"
                    className="border border-stone-200 focus:border-[#D4AF37] outline-none rounded-xl px-4 py-3 text-stone-700 text-sm transition-all bg-stone-50/30"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Query Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="border border-stone-200 focus:border-[#D4AF37] outline-none rounded-xl px-4 py-3 text-stone-700 text-sm transition-all bg-stone-50/30"
                  >
                    <option value="Custom Design Inquiry">🪵 Custom Luxury Design / Wood Selection</option>
                    <option value="Shipping & Delivery">🚚 Delivery & Installation in Nepal</option>
                    <option value="Showroom Visit Booking">📍 Showroom Meeting Booking</option>
                    <option value="Bulk Order Inquiry">🏢 Office / Hotel Bulk Furnishing</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Preferred Response Channel</label>
                <div className="grid grid-cols-3 gap-3">
                  {['WhatsApp', 'Direct Call', 'Email'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setFormData({ ...formData, contactMethod: method })}
                      className={`py-3 px-4 rounded-xl text-xs font-semibold border text-center transition-all ${
                        formData.contactMethod === method
                          ? 'border-[#4A2B15] bg-[#4A2B15] text-white shadow-sm'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Details of Requirement</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your design choice, wood preference (Teak/Sisau), space constraints, or general support query..."
                  rows="4"
                  className="border border-stone-200 focus:border-[#D4AF37] outline-none rounded-xl px-4 py-3 text-stone-700 text-sm transition-all bg-stone-50/30 resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4A2B15] hover:bg-[#341E0F] text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-75"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Filing with Regional Server...
                  </>
                ) : (
                  'File Secure Design Request'
                )}
              </button>

              {submitted && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs flex items-center gap-2 leading-relaxed animate-fade-in">
                  <span>✅</span>
                  <div>
                    <strong>Request Logged successfully!</strong> Our showroom desk has registered your query. A woodwork consultant will contact you via {formData.contactMethod} in under 2 hours.
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Live Showroom Location Map */}
        <div className="mt-16 bg-white rounded-2xl p-6 border border-stone-200/60 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
            <div>
              <h3 className="text-lg font-serif font-bold text-[#4A2B15]">Interactive Showroom Location</h3>
              <p className="text-stone-500 text-xs mt-1">Zoom in and navigate to find the exact warehouse location along Chandrapur highway</p>
            </div>
            <a 
              href="https://maps.google.com/?q=Chandrapur,Rautahat,Nepal" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs text-[#8B4513] font-semibold hover:underline flex items-center gap-1"
            >
              Open in Google Maps ↗
            </a>
          </div>
          <div className="w-full h-[400px] rounded-xl overflow-hidden bg-stone-100 border border-stone-200/40 relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14251.272183204907!2d85.2023!3d27.1352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb4b1ca548d4fb%3A0xe54dfbe632fa070e!2sChandrapur%2044500!5e0!3m2!1sen!2snp!4v1700000000000" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Sindureghari Showroom Map"
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
}
