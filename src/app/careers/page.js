"use client";

import React, { useState } from 'react';

export default function CareersPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: 'Senior Master Carpenter / Wood Carver',
    experience: '3-5 Years',
    portfolioLink: '',
    coverLetter: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const positions = [
    {
      id: 'carpenter',
      title: 'Senior Master Carpenter / Wood Carver',
      department: 'Workshop & Production',
      location: 'Chandrapur Main Workshop, Rautahat',
      type: 'Full-Time (On-site)',
      experience: '5+ Years in solid-wood carving',
      desc: 'Lead our hand-carving production line. Requires expertise in detailed Royal Sofa crowns, intricate floral borders, and traditional rosewood joints (Chuka-Danda).'
    },
    {
      id: 'designer',
      title: 'Interior & 3D Kitchen Designer',
      department: 'Creative Design Studio',
      location: 'Chandrapur & Kathmandu (Hybrid)',
      type: 'Full-Time',
      experience: '2+ Years in SketchUp / AutoCad',
      desc: 'Collaborate with premium home builders to design modular layouts, wardrobes, and custom dimensions. Render high-fidelity 3D interior design proposals for clients.'
    },
    {
      id: 'sales',
      title: 'Luxury Showroom Sales Consultant',
      department: 'Client Relations',
      location: 'Sindureghari Main Showroom, Rautahat',
      type: 'Full-Time',
      experience: '1+ Years in Premium Retail Sales',
      desc: 'Act as the primary host for visiting luxury clients, explain teak vs. sisau timber advantages, maintain customized logs, and facilitate EMI checkout options.'
    }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate direct secure application registration log
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: 'Senior Master Carpenter / Wood Carver',
        experience: '3-5 Years',
        portfolioLink: '',
        coverLetter: ''
      });
      setTimeout(() => setSubmitted(false), 8000);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-16 font-sans">
      <div className="max-w-[1600px] mx-auto px-4 md:px-10">
        
        {/* Luxury Hero Banner */}
        <div className="text-center mb-16">
          <span className="text-[#D4AF37] font-semibold text-xs tracking-[0.25em] uppercase block mb-3">
            BISHWOKARMA WOODCRAFT CAREERS
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#4A2B15] font-bold tracking-tight mb-4">
            Join the Legacy of Master Woodcraft
          </h1>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Every piece we craft is a handcarved testament to Nepali heritage. We are looking for passionate wood carvers, creative designers, and customer-first sales managers who share our dedication to absolute purity.
          </p>
        </div>

        {/* Culture & Values Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          
          <div className="bg-white rounded-2xl p-8 border border-stone-200/60 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-bl-full transition-transform duration-500 group-hover:scale-110"></div>
            <span className="text-3xl mb-4 block">🪓</span>
            <h3 className="text-lg font-serif font-bold text-[#4A2B15] mb-2">Artisanal Honor</h3>
            <p className="text-stone-500 text-xs md:text-sm leading-relaxed">
              We respect traditional skills. Our master carvers are treated with the highest dignity, working with state-of-the-art tools and premium seasoned timber.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-stone-200/60 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-bl-full transition-transform duration-500 group-hover:scale-110"></div>
            <span className="text-3xl mb-4 block">📈</span>
            <h3 className="text-lg font-serif font-bold text-[#4A2B15] mb-2">Lifelong Growth</h3>
            <p className="text-stone-500 text-xs md:text-sm leading-relaxed">
              Fair base salary levels, comprehensive safety gear, yearly production bonuses, and absolute job stability across our expanding showrooms and digital channels.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-stone-200/60 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-bl-full transition-transform duration-500 group-hover:scale-110"></div>
            <span className="text-3xl mb-4 block">🤝</span>
            <h3 className="text-lg font-serif font-bold text-[#4A2B15] mb-2">Purity Standards</h3>
            <p className="text-stone-500 text-xs md:text-sm leading-relaxed">
              Zero tolerance for duplicate materials or fake timber. Join a workplace that takes pride in delivering 100% authentic Sagwan & Sisau wood to our clients.
            </p>
          </div>

        </div>

        {/* Layout Grid: Jobs & Application Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Active Positions List (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl font-serif font-bold text-[#4A2B15] mb-6">Open Opportunities</h2>
            
            {positions.map((pos) => (
              <div key={pos.id} className="bg-white rounded-2xl p-6 md:p-8 border border-stone-200/60 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <span className="bg-[#D4AF37]/10 text-[#8B4513] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {pos.department}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#4A2B15] mt-2">{pos.title}</h3>
                  </div>
                  <div className="text-right sm:text-right">
                    <p className="text-xs font-semibold text-stone-600">📍 {pos.location}</p>
                    <p className="text-[11px] text-stone-400 mt-1">💼 {pos.type}</p>
                  </div>
                </div>

                <p className="text-stone-600 text-xs md:text-sm mb-4 leading-relaxed">{pos.desc}</p>
                
                <div className="bg-stone-50/50 rounded-xl p-4 border border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span><strong>Experience required:</strong> {pos.experience}</span>
                  <button 
                    onClick={() => {
                      setFormData(prev => ({ ...prev, position: pos.title }));
                      document.getElementById('apply-form').scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-[#8B4513] font-bold hover:underline cursor-pointer"
                  >
                    Quick Apply ↓
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Quick Application Form (5 Columns) */}
          <div id="apply-form" className="lg:col-span-5 bg-white rounded-2xl p-8 border border-stone-200/60 shadow-sm relative">
            <h3 className="text-xl font-serif font-bold text-[#4A2B15] mb-2">Imperial Career Registry</h3>
            <p className="text-stone-400 text-xs mb-8">Send your details directly. Our operations manager will schedule a live meeting or practical test.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-xs font-semibold text-stone-600 uppercase">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Shyam Bishwokarma"
                  className="border border-stone-200 focus:border-[#D4AF37] outline-none rounded-xl px-4 py-3 text-stone-700 text-xs transition-all bg-stone-50/30"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-stone-600 uppercase">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. shyam@example.com"
                    className="border border-stone-200 focus:border-[#D4AF37] outline-none rounded-xl px-4 py-3 text-stone-700 text-xs transition-all bg-stone-50/30"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-xs font-semibold text-stone-600 uppercase">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 98550XXXXX"
                    className="border border-stone-200 focus:border-[#D4AF37] outline-none rounded-xl px-4 py-3 text-stone-700 text-xs transition-all bg-stone-50/30"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="position" className="text-xs font-semibold text-stone-600 uppercase">Target Role</label>
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="border border-stone-200 focus:border-[#D4AF37] outline-none rounded-xl px-4 py-3 text-stone-700 text-xs transition-all bg-stone-50/30"
                >
                  <option value="Senior Master Carpenter / Wood Carver">🪓 Senior Master Carpenter / Wood Carver</option>
                  <option value="Interior & 3D Kitchen Designer">📐 Interior & 3D Kitchen Designer</option>
                  <option value="Luxury Showroom Sales Consultant">🏢 Luxury Showroom Sales Consultant</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="experience" className="text-xs font-semibold text-stone-600 uppercase">Total Experience</label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="border border-stone-200 focus:border-[#D4AF37] outline-none rounded-xl px-4 py-3 text-stone-700 text-xs transition-all bg-stone-50/30"
                >
                  <option value="1-3 Years">1-3 Years</option>
                  <option value="3-5 Years">3-5 Years</option>
                  <option value="5-10 Years">5-10 Years</option>
                  <option value="10+ Years (Senior Legend)">10+ Years (Master Level)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="portfolioLink" className="text-xs font-semibold text-stone-600 uppercase">Portfolio / CV Link (Optional)</label>
                <input
                  type="url"
                  id="portfolioLink"
                  name="portfolioLink"
                  value={formData.portfolioLink}
                  onChange={handleChange}
                  placeholder="Link to previous carpentry photos or Google Drive PDF"
                  className="border border-stone-200 focus:border-[#D4AF37] outline-none rounded-xl px-4 py-3 text-stone-700 text-xs transition-all bg-stone-50/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="coverLetter" className="text-xs font-semibold text-stone-600 uppercase">Explain your passion</label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  placeholder="Tell us about the woodcraft designs you take pride in carving or representing..."
                  rows="3"
                  className="border border-stone-200 focus:border-[#D4AF37] outline-none rounded-xl px-4 py-3 text-stone-700 text-xs transition-all bg-stone-50/30 resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4A2B15] hover:bg-[#341E0F] text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-75 text-xs uppercase tracking-wider"
              >
                {loading ? 'Submitting Application Registry...' : 'File Application Registry'}
              </button>

              {submitted && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs flex items-start gap-2 leading-relaxed">
                  <span>✅</span>
                  <div>
                    <strong>Application Registered successfully!</strong> Your information is saved in our career database log. Our workshop superintendent will call you to schedule a woodwork layout testing session.
                  </div>
                </div>
              )}

            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
