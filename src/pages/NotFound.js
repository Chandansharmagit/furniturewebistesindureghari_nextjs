import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="notfound-page">
      <div className="notfound-bg-overlay"></div>
      
      <div className="notfound-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="notfound-card"
        >
          <span className="notfound-badge">Error 404</span>
          <h1 className="notfound-title serif">
            Piece <span className="serif-italic">Not found</span>
          </h1>
          <p className="notfound-text">
            It seems this specific sanctuary doesn't exist yet, or perhaps it has been moved to a more private collection.
          </p>
          
          <div className="notfound-actions">
            <Link to="/" className="notfound-btn primary">
              <Home size={18} />
              <span>Back to Home</span>
            </Link>
            <button 
              onClick={() => window.history.back()} 
              className="notfound-btn secondary"
            >
              <ArrowLeft size={18} />
              <span>Previous Page</span>
            </button>
          </div>
        </motion.div>
      </div>

      <div className="notfound-footer">
        <p>© Sindureghari Furniture — Pure craftsmanship, timeless design.</p>
      </div>
    </div>
  );
};

export default NotFound;
