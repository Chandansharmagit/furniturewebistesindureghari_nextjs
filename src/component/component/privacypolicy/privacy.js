import React from "react";
import './policy.css';
import { FaCouch, FaHome, FaLightbulb, FaTree, FaBed, FaUtensils, FaCubes, FaPaintBrush, FaPalette, FaRulerCombined, FaTag, FaComment, FaShieldAlt, FaCreditCard, FaPhone, FaEnvelope, FaAngleRight, FaStar } from "react-icons/fa";

const Policy = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="wooden-policy-container-main">
      <div className="wooden-policy-content">
        <div className="wooden-policy-main">
          <section className="wooden-policy-section">
            <h2>Buy <span className="wooden-policy-highlight">Furniture</span> Online at Wooden Nepal - Nepal's One-Stop Solution</h2>
            <p>
              Getting wooden <span className="wooden-policy-highlight">furniture</span> online in Nepal that perfectly blends with your home decor is now easy. 
              <span className="wooden-policy-brand-name"> Wooden Nepal</span> provides you with ready-made and customized solid wood <span className="wooden-policy-highlight">furniture</span> online. We are committed to serving our customers an exclusive range of home 
              <span className="wooden-policy-highlight"> furniture</span> products like <span className="wooden-policy-highlight"> sofa sets</span>, <span className="wooden-policy-highlight"> coffee tables</span>,
              <span className="wooden-policy-highlight"> wardrobes</span>, <span className="wooden-policy-highlight"> dining tables</span>, all crafted from premium-quality solid wood.
            </p>
            <p>
              Along with this, explore our home decor range, including <span className="wooden-policy-highlight"> wall art</span>, 
              <span className="wooden-policy-highlight"> photo frames</span>, <span className="wooden-policy-highlight"> indoor plants</span>, <span className="wooden-policy-highlight"> tableware</span>, 
              <span className="wooden-policy-highlight"> glassware</span>, <span className="wooden-policy-highlight"> kitchen organizers</span>, and many more, just a few clicks away.
              We offer a huge variety of online <span className="wooden-policy-highlight"> furniture</span> to choose from.
            </p>
            <p>
              Browse various <span className="wooden-policy-highlight"> designs</span>, <span className="wooden-policy-highlight"> dimensions</span>, <span className="wooden-policy-highlight"> colors</span>, and 
              <span className="wooden-policy-highlight"> finish options</span>. From modern to traditional styles, contemporary to loft ones, and space-saving 
              <span className="wooden-policy-highlight"> furniture</span> pieces to larger statement pieces, we provide every type of modern <span className="wooden-policy-highlight"> furniture</span> to match your home needs.
              Take a pick from our exquisite collection or get it customized as per your requirements.
            </p>
          </section>

          <section className="wooden-policy-section">
            <h2>Explore Different Products at <span className="wooden-policy-brand-name">Wooden Nepal</span></h2>
            <p>
              <span className="wooden-policy-brand-name">Wooden Nepal</span> houses an extensive range of <span className="wooden-policy-highlight">furniture</span> and furnishings, available in various designs to meet every preference. 
              Once you visit our <span className="wooden-policy-highlight">furniture</span> store or check our website, you'll discover how diverse our designs are.
              Here's what you can expect on visiting our stores or website:
            </p>

            <div className="wooden-policy-product-categories">
              <div className="wooden-policy-category-card">
                <div className="wooden-policy-category-icon">
                  <FaCouch />
                </div>
                <h3>Home Decor</h3>
                <p>
                  Explore how minimal elements like home decor bring beautiful changes to your space while staying on budget.
                  From statement wall decor to vibrant indoor planters, make your space look luxurious while keeping the view subtle.
                </p>
              </div>

              <div className="wooden-policy-category-card">
                <div className="wooden-policy-category-icon">
                  <FaHome />
                </div>
                <h3>Furnishing</h3>
                <p>
                  Find the most luxurious and finest quality furnishings. From velvety curtains to unique cushion covers, 
                  decorate your space to your liking without exceeding your budget.
                </p>
              </div>

              <div className="wooden-policy-category-card">
                <div className="wooden-policy-category-icon">
                  <FaLightbulb />
                </div>
                <h3>Lamps and Lights</h3>
                <p>
                  Lighting is crucial in creating a comforting ambiance. From <span className="wooden-policy-highlight">lamps</span> to <span className="wooden-policy-highlight">chandeliers</span> to designer 
                  indoor lights, create drama and depth for your home with our wide range.
                </p>
              </div>

              <div className="wooden-policy-category-card">
                <div className="wooden-policy-category-icon">
                  <FaTree />
                </div>
                <h3>Outdoor Furniture</h3>
                <p>
                  For gardens, backyards, or balconies, find economical and durable outdoor <span className="wooden-policy-highlight">furniture</span> and decor
                  to create a designer structure for your outdoors.
                </p>
              </div>

              <div className="wooden-policy-category-card">
                <div className="wooden-policy-category-icon">
                  <FaBed />
                </div>
                <h3>Mattresses</h3>
                <p>
                  A crucial investment that needs to serve you for a long time. We offer the best types of mattresses from various top-quality brands.
                </p>
              </div>

              <div className="wooden-policy-category-card">
                <div className="wooden-policy-category-icon">
                  <FaUtensils />
                </div>
                <h3>Modular Kitchen</h3>
                <p>
                  Invest in a modular kitchen design to double the beauty and utility of your space, aligning with your modern needs for convenience and storage.
                </p>
              </div>
            </div>
          </section>

          <section className="wooden-policy-section">
            <h2>Furniture Materials Available at <span className="wooden-policy-brand-name">Wooden Nepal</span></h2>
            <p>
              Find a range of <span className="wooden-policy-highlight">furniture</span> materials in our collection. Each type, whether wood or metal, has its distinctive beauty and quality.
              Pick the best one that blends with your needs and comfort from our wide selection:
            </p>
            
            <div className="wooden-policy-materials-grid">
              <div className="wooden-policy-material-item">
                <img src="/api/placeholder/150/100" alt="Sheesham Wood" />
                <h4>Sheesham Wood</h4>
              </div>
              <div className="wooden-policy-material-item">
                <img src="/api/placeholder/150/100" alt="Mango Wood" />
                <h4>Mango Wood</h4>
              </div>
              <div className="wooden-policy-material-item">
                <img src="/api/placeholder/150/100" alt="Acacia Wood" />
                <h4>Acacia Wood</h4>
              </div>
              <div className="wooden-policy-material-item">
                <img src="/api/placeholder/150/100" alt="Metal Furniture" />
                <h4>Metal Furniture</h4>
              </div>
            </div>
          </section>

          <section className="wooden-policy-section">
            <h2>Things to Consider Before Buying <span className="wooden-policy-highlight">Furniture</span> Online</h2>
            
            <div className="wooden-policy-buying-guide">
              <div className="wooden-policy-guide-item">
                <div className="wooden-policy-guide-icon">
                  <FaCubes />
                </div>
                <div className="wooden-policy-guide-content">
                  <h3>Material</h3>
                  <p>Check the product description to understand the material used. Learn about the quality of craftsmanship, durability, and finishes from the product overview.</p>
                </div>
              </div>
              
              <div className="wooden-policy-guide-item">
                <div className="wooden-policy-guide-icon">
                  <FaPaintBrush />
                </div>
                <div className="wooden-policy-guide-content">
                  <h3>Design</h3>
                  <p>Choose the perfect design that complements your existing décor and fits your style. To get a better idea, look for product reviews.</p>
                </div>
              </div>
              
              <div className="wooden-policy-guide-item">
                <div className="wooden-policy-guide-icon">
                  <FaPalette />
                </div>
                <div className="wooden-policy-guide-content">
                  <h3>Color</h3>
                  <p>Color is essential when purchasing online. Images may appear slightly different compared to the original. Look for detailed images to get a better glance.</p>
                </div>
              </div>
              
              <div className="wooden-policy-guide-item">
                <div className="wooden-policy-guide-icon">
                  <FaRulerCombined />
                </div>
                <div className="wooden-policy-guide-content">
                  <h3>Size</h3>
                  <p>Check the measurements provided and consider the space where your furniture will fit, as well as doorways, staircases, and hallways for delivery and assembly.</p>
                </div>
              </div>
              
              <div className="wooden-policy-guide-item">
                <div className="wooden-policy-guide-icon">
                  <FaTag />
                </div>
                <div className="wooden-policy-guide-content">
                  <h3>Price</h3>
                  <p>Balance quality and price. Take advantage of sales and discounts when available. Ensure you get a fair deal for the quality you receive.</p>
                </div>
              </div>
              
              <div className="wooden-policy-guide-item">
                <div className="wooden-policy-guide-icon">
                  <FaComment />
                </div>
                <div className="wooden-policy-guide-content">
                  <h3>Reviews</h3>
                  <p>Read genuine reviews about quality, comfort, durability, and assembly process. Pay attention to customer experiences to make informed decisions.</p>
                </div>
              </div>
              
              <div className="wooden-policy-guide-item">
                <div className="wooden-policy-guide-icon">
                  <FaShieldAlt />
                </div>
                <div className="wooden-policy-guide-content">
                  <h3>Warranty</h3>
                  <p>Understand what the warranty covers—whether it offers repair, replacement, or a refund. Ask about this when you buy furniture online.</p>
                </div>
              </div>
              
              <div className="wooden-policy-guide-item">
                <div className="wooden-policy-guide-icon">
                  <FaCreditCard />
                </div>
                <div className="wooden-policy-guide-content">
                  <h3>Payment</h3>
                  <p>Ensure the website uses secure payment methods that protect your financial information. Double-check before making any payments.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="wooden-policy-sidebar">
          <div className="wooden-policy-sidebar-widget wooden-policy-customer-support">
            <h3>Need Help?</h3>
            <p>Our customer support team is available to assist you with any questions</p>
            <div className="wooden-policy-contact-info">
              <div><FaPhone /> +977 1234567890</div>
              <div><FaEnvelope /> support@woodennepal.com</div>
            </div>
            <button className="wooden-policy-contact-btn">Contact Us</button>
          </div>

          <div className="wooden-policy-sidebar-widget wooden-policy-popular-categories">
            <h3>Popular Categories</h3>
            <ul>
              <li><a href="/"><FaAngleRight /> Living Room Furniture</a></li>
              <li><a href="/"><FaAngleRight /> Bedroom Furniture</a></li>
              <li><a href="/"><FaAngleRight /> Dining Sets</a></li>
              <li><a href="/"><FaAngleRight /> Office Furniture</a></li>
              <li><a href="/"><FaAngleRight /> Home Decor</a></li>
            </ul>
          </div>

          <div className="wooden-policy-sidebar-widget wooden-policy-testimonial">
            <h3>What Our Customers Say</h3>
            <div className="wooden-policy-testimonial-content">
              <p>"The quality of furniture from Wooden Nepal exceeded my expectations. The craftsmanship is excellent!"</p>
              <div className="wooden-policy-testimonial-author">
                <img src="/api/placeholder/50/50" alt="Customer" />
                <div>
                  <h4>Aarav Sharma</h4>
                  <div className="wooden-policy-rating">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
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