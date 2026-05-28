import React from "react";
import './policy.css';
import { 
  FaCouch, FaHome, FaLightbulb, FaTree, FaBed, FaUtensils, 
  FaCubes, FaPaintBrush, FaPalette, FaRulerCombined, FaTag, 
  FaComment, FaShieldAlt, FaCreditCard, FaPhone, FaEnvelope, 
  FaAngleRight, FaStar, FaHammer, FaWrench, FaTools
} from "react-icons/fa";

const Policy = () => {
  return (
    <div className="wooden-policy-container-main">
      <div className="wooden-policy-content">
        {/* Main Content Area */}
        <div className="wooden-policy-main">
          {/* Welcome Banner */}
          <section className="wooden-policy-section">
            <h2>
              Buy <span className="wooden-policy-highlight">Furniture</span> Online at Sindureghari Furniture - Nepal's Premier Woodcraft Shop
            </h2>
            <p>
              Furnishing your home with premium wooden <span className="wooden-policy-highlight">furniture</span> in Nepal is now an effortless experience. 
              <span className="wooden-policy-brand-name"> Sindureghari Furniture</span> brings you exquisite, hand-carved, seasoned solid wood creations directly to your doorstep. We are committed to serving our clients with an exclusive registry of luxury home pieces—ranging from gorgeous <span className="wooden-policy-highlight">sofa sets</span> and elegant <span className="wooden-policy-highlight">coffee tables</span> to spacious <span className="wooden-policy-highlight">wardrobes</span> and royal <span className="wooden-policy-highlight">dining sets</span>.
            </p>
            <p>
              Beyond core furnishings, we provide curated room integrations including customized <span className="wooden-policy-highlight">wall art</span>, structural <span className="wooden-policy-highlight">photo frames</span>, decorative lighting elements, and complete kitchen setups. Every product is constructed from premium-grade materials by Nepal's master craftsmen.
            </p>
            <p>
              Browse our diverse inventory by timber finish, size specifications, or design architecture. Whether your taste leans toward traditional Royal carvings, contemporary minimalist structures, or space-saving modular fixtures, we customize every piece to reflect your unique home vision.
            </p>
          </section>

          {/* Core Offerings */}
          <section className="wooden-policy-section">
            <h2>Explore Our Premium Collections</h2>
            <p>
              Discover the distinct collections that make <span className="wooden-policy-brand-name">Sindureghari Furniture</span> the leading choice for high-end woodcraft across Nepal. Visit our physical showrooms or check our live online catalog to view:
            </p>

            <div className="wooden-policy-product-categories">
              <div className="wooden-policy-category-card">
                <div className="wooden-policy-category-icon">
                  <FaCouch />
                </div>
                <h3>Living Room Elite</h3>
                <p>
                  Create standard-setting living spaces. Explore handcrafted royal sofas, lounge seating, and polished solid wood cabinets designed for maximum comfort.
                </p>
              </div>

              <div className="wooden-policy-category-card">
                <div className="wooden-policy-category-icon">
                  <FaBed />
                </div>
                <h3>Bespoke Bedrooms</h3>
                <p>
                  Rest on premium king-size beds, structural wardrobes, and elegant nightstands carved out of high-grade teak and rosewood.
                </p>
              </div>

              <div className="wooden-policy-category-card">
                <div className="wooden-policy-category-icon">
                  <FaUtensils />
                </div>
                <h3>Dining & Kitchen</h3>
                <p>
                  Bring family together around custom dining tables and state-of-the-art modular kitchen assemblies crafted for ultimate utility.
                </p>
              </div>

              <div className="wooden-policy-category-card">
                <div className="wooden-policy-category-icon">
                  <FaTree />
                </div>
                <h3>Outdoor & Garden</h3>
                <p>
                  Weatherproof balcony sets, garden swings, and premium lounge fixtures structured to endure various Nepalese weather seasons.
                </p>
              </div>
            </div>
          </section>

          {/* Genuine Materials Showcase */}
          <section className="wooden-policy-section">
            <h2>Authentic Materials We Master</h2>
            <p>
              Quality begins at the lumber selection phase. We use only sustainably sourced, chemically seasoned, and kiln-dried woods:
            </p>
            
            <div className="wooden-policy-materials-grid">
              <div className="wooden-policy-material-item">
                <div className="material-placeholder-icon"><FaTree /></div>
                <h4>Premium Teak Wood</h4>
              </div>
              <div className="wooden-policy-material-item">
                <div className="material-placeholder-icon"><FaHammer /></div>
                <h4>Rosewood (Sissoo)</h4>
              </div>
              <div className="wooden-policy-material-item">
                <div className="material-placeholder-icon"><FaWrench /></div>
                <h4>Sal Wood (Sakhuwa)</h4>
              </div>
              <div className="wooden-policy-material-item">
                <div className="material-placeholder-icon"><FaTools /></div>
                <h4>Modern Alloys & Glass</h4>
              </div>
            </div>
          </section>

          {/* Shopping Checklist */}
          <section className="wooden-policy-section">
            <h2>Key Elements to Consider Before Ordering</h2>
            
            <div className="wooden-policy-buying-guide">
              <div className="wooden-policy-guide-item">
                <div className="wooden-policy-guide-icon">
                  <FaCubes />
                </div>
                <div className="wooden-policy-guide-content">
                  <h3>Timber Origin</h3>
                  <p>Understand the grain, weight, and climate durability of teak compared to rosewood to select the best match for your room humidity.</p>
                </div>
              </div>
              
              <div className="wooden-policy-guide-item">
                <div className="wooden-policy-guide-icon">
                  <FaPaintBrush />
                </div>
                <div className="wooden-policy-guide-content">
                  <h3>Design Compatibility</h3>
                  <p>Pick traditional wood carvings or clean-cut modern aesthetics that blend seamlessly with your interior colors.</p>
                </div>
              </div>
              
              <div className="wooden-policy-guide-item">
                <div className="wooden-policy-guide-icon">
                  <FaRulerCombined />
                </div>
                <div className="wooden-policy-guide-content">
                  <h3>Sizing & Transit</h3>
                  <p>Carefully measure your room clearance, hallway entries, and elevator sizes before finalizing large scale sectional items.</p>
                </div>
              </div>
              
              <div className="wooden-policy-guide-item">
                <div className="wooden-policy-guide-icon">
                  <FaShieldAlt />
                </div>
                <div className="wooden-policy-guide-content">
                  <h3>Warranty Policies</h3>
                  <p>Inquire about structural termite treatment guarantees, joint protection, and polish services for peace of mind.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sticky Interactive Sidebar */}
        <aside className="wooden-policy-sidebar">
          {/* Support Widget */}
          <div className="wooden-policy-sidebar-widget wooden-policy-customer-support">
            <h3>Need Help?</h3>
            <p>Our expert support desk is available to assist you with custom quotes, fabric selections, or delivery inquiries.</p>
            <div className="wooden-policy-contact-info">
              <div><FaPhone /> +977-9867332731</div>
              <div><FaEnvelope /> support@sinduregharifurniture.shop</div>
            </div>
            <a 
              href="/contact" 
              className="wooden-policy-contact-btn" 
              style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
            >
              Contact Us
            </a>
          </div>

          {/* Categories list widget */}
          <div className="wooden-policy-sidebar-widget wooden-policy-popular-categories">
            <h3>Popular Spaces</h3>
            <ul>
              <li><a href="/category/living-room"><FaAngleRight /> Living Room Furniture</a></li>
              <li><a href="/category/bedroom"><FaAngleRight /> Bedroom Furniture</a></li>
              <li><a href="/category/dining-room"><FaAngleRight /> Dining Room Sets</a></li>
              <li><a href="/category/office-and-study"><FaAngleRight /> Corporate Office Range</a></li>
              <li><a href="/category/modular-kitchens"><FaAngleRight /> Custom Kitchens</a></li>
            </ul>
          </div>

          {/* Testimonial Widget */}
          <div className="wooden-policy-sidebar-widget wooden-policy-testimonial">
            <h3>Customer Reviews</h3>
            <div className="wooden-policy-testimonial-content">
              <p>"The custom royal sofa set from Sindureghari exceeded my expectations. The Sissoo wood quality and the premium lacquer finish are spectacular!"</p>
              <div className="wooden-policy-testimonial-author">
                <img src="/images/avatar-sample.jpg" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80" }} alt="Aarav Sharma" />
                <div>
                  <h4>Aarav Sharma</h4>
                  <div className="wooden-policy-rating">
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Policy;