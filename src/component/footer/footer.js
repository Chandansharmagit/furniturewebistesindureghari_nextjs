import React, { useState } from "react";
import "./footer.css";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
// import { useNavigate } from "react-router-dom";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn,
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope,
  FaAward, FaGem, FaShieldAlt, FaAndroid, FaGooglePlay, FaQrcode, FaTimes
} from "react-icons/fa";

const Footer = () => {
  // const navigate = useNavigate();
  const [formdata, setFormdata] = useState({
    email: "",
  });
  const [messages, setMessage] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const androidAccessUrl = "https://wa.me/9779845427041?text=Hi%20Sindureghari%2C%20I%20want%20to%20download%20your%20Android%20furniture%20store%20app.";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({
      ...formdata,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formdata.email)) {
      setMessage("Please enter a valid email address");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/customer-data/subscribe`,
        { ...formdata, source: 'footer' }
      );
      if (response.status === 200) {
        setMessage("Welcome to the Royal Circle!");
        setIsSubscribed(true);
        setTimeout(() => {
          setIsSubscribed(false);
          setFormdata({ email: "" });
        }, 3000);
      }
    } catch (error) {
      setMessage("Failed to join. Please try again.");
    }
  };

  return (
    <footer className="royal-footer">
      <div className="footer-luxury-border"></div>
      <div className="footer-kathmandu-marquee" aria-hidden="true">
        <div className="footer-kathmandu-track"></div>
      </div>

      <motion.div
        className="royal-footer-container"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {/* Top Section: Branding & Newsletter */}
        <div className="footer-brand-newsletter">
          <motion.div variants={itemVariants} className="footer-royal-branding">
            <div className="royal-logo-wrapper">
              <FaGem className="royal-crest-icon" />
              <div className="branding-text">
                <span className="royal-pre-title">Elite Living</span>
                <h2 className="royal-main-title">Sindureghari</h2>
                <span className="royal-post-title">Furniture & Decor</span>
              </div>
            </div>
            <p className="royal-motto">Crafting timeless legacies since 1995. Every piece tells a story of royal heritage and unparalleled craftsmanship.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="footer-newsletter-premium">
            <h4>Join The Royal Circle</h4>
            <p>Subscribe for exclusive previews of our limited collections.</p>
            <form onSubmit={handleSubmit} className="premium-subscribe-form">
              <div className="premium-input-group">
                <input
                  type="email"
                  name="email"
                  value={formdata.email}
                  onChange={handleChange}
                  placeholder="Your Imperial Email"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                >
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </motion.button>
              </div>
              {messages && <p className={`subscription-status ${isSubscribed ? 'success' : 'error'}`}>{messages}</p>}
            </form>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="footer-app-download-card">
          <div className="footer-app-icon">
            <FaAndroid />
          </div>
          <div className="footer-app-copy">
            <span>Android App</span>
            <strong>Shop Sindureghari from your phone</strong>
            <p>Scan the QR code for faster furniture browsing, order help, and premium offers.</p>
          </div>
          <motion.button
            type="button"
            className="footer-app-download-btn"
            onClick={() => setIsAppModalOpen(true)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaGooglePlay />
            Download App
          </motion.button>
        </motion.div>

        {/* Middle Section: Links Grid */}
        <div className="footer-links-grid">
          <motion.div variants={itemVariants} className="footer-link-col">
            <h3>Quick Access</h3>
            <ul>
              <li><Link href="/">Grand Home</Link></li>
              <li><Link href="/ceo">Our Legacy (CEO)</Link></li>
              <li><Link href="/our-vision">Our Vision & Plan</Link></li>
              <li><Link href="/contact">Imperial Contact</Link></li>
              <li><Link href="/help-and-support">Help & Support</Link></li>
              <li><Link href="/careers">Royal Careers</Link></li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="footer-link-col">
            <h3>Collections</h3>
            <ul>
              <li><Link href="/sofas">Luxury Sofa Sets</Link></li>
              <li><Link href="/beds">Solid Wood Beds</Link></li>
              <li><Link href="/dining-tables">Dining Table Sets</Link></li>
              <li><Link href="/wardrobes">Wooden Wardrobes</Link></li>
              <li><Link href="/living-room-furniture">Living Room Furniture</Link></li>
              <li><Link href="/office-furniture">Office & Study Tables</Link></li>
              <li><Link href="/lighting">Crystal Chandeliers</Link></li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="footer-link-col">
            <h3>Mastery</h3>
            <ul>
              <li><Link href="/help-and-support#materials">Artisan Finishes</Link></li>
              <li><Link href="/help-and-support#warranty">Royal Warranty</Link></li>
              <li><Link href="/help-and-support#assembly">Curated Setup</Link></li>
              <li><a href="https://wa.me/9779845427041" target="_blank" rel="noopener noreferrer">Custom Commissions</a></li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="footer-link-col contact-col">
            <h3>Registry</h3>
            <div className="contact-info-list">
              <div className="contact-info-item">
                <FaMapMarkerAlt />
                <span>Chandrapur, Rautahat, Nepal</span>
              </div>
              <div className="contact-info-item">
                <FaPhoneAlt />
                <span>+977-9845427041</span>
              </div>
              <div className="contact-info-item">
                <FaEnvelope />
                <span>support@sinduregharifurniture.shop</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Social & Accolades Section */}
        <motion.div variants={itemVariants} className="footer-accolades-social">
          <div className="footer-accolades">
            <div className="accolade-item">
              <FaAward />
              <span>National Craft Award</span>
            </div>
            <div className="accolade-item">
              <FaShieldAlt />
              <span>100% Guaranteed Teak</span>
            </div>
          </div>
          <div className="royal-social-hub">
            <Link href="https://www.facebook.com/bishwokarmafurniture" target="_blank" rel="noopener noreferrer" className="social-link"><FaFacebookF /></Link>
            <Link href="https://www.instagram.com/sinduregharifurniture" target="_blank" rel="noopener noreferrer" className="social-link"><FaInstagram /></Link>
            <Link href="/" className="social-link"><FaTwitter /></Link>
            <Link href="/" className="social-link"><FaLinkedinIn /></Link>
          </div>
        </motion.div>

        {/* Bottom Section: Copyright */}
        <motion.div variants={itemVariants} className="royal-footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; {new Date().getFullYear()} Sindureghari Furniture Showroom | All Rights Reserved</p>
            <div className="legal-links">
              <Link href="/terms-conditions">Terms of Excellence</Link>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {isAppModalOpen && (
        <div className="android-app-modal-overlay" onClick={() => setIsAppModalOpen(false)}>
          <motion.div
            className="android-app-bottom-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="android-app-modal-title"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="android-app-close"
              onClick={() => setIsAppModalOpen(false)}
              aria-label="Close Android app download"
            >
              <FaTimes />
            </button>

            <div className="android-app-sheet-handle"></div>

            <div className="android-app-modal-content">
              <div className="android-app-modal-text">
                <span className="android-app-eyebrow"><FaAndroid /> Android App</span>
                <h2 id="android-app-modal-title">Download Sindureghari Furniture</h2>
                <p>Scan the QR code with your phone to open the Android app download flow. You can also request the app link directly on WhatsApp.</p>

                <div className="android-app-benefits">
                  <span>Premium offers</span>
                  <span>Fast order request</span>
                  <span>Furniture browsing</span>
                </div>

                <a className="android-app-whatsapp" href={androidAccessUrl} target="_blank" rel="noopener noreferrer">
                  <FaGooglePlay />
                  Get Android App Link
                </a>
              </div>

              <div className="android-app-qr-panel">
                <div className="android-app-qr-frame">
                  <img src="/images/android-app-qr.svg" alt="QR code for Sindureghari Android app download" />
                </div>
                <small><FaQrcode /> Scan to download</small>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
