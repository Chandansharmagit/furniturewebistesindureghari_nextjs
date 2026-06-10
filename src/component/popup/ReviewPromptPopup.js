"use client";

import { useEffect, useState } from "react";
import { FaGoogle, FaQrcode, FaStar, FaTimes } from "react-icons/fa";
import "./ReviewPromptPopup.css";

const GOOGLE_REVIEW_URL = "https://g.page/r/CSk9ke0-YPVyEBM/review";
const GOOGLE_REVIEW_QR = "/images/google-review-qr.png";

export default function ReviewPromptPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const openTimer = window.setTimeout(() => {
      setIsOpen(true);
    }, 900);

    return () => window.clearTimeout(openTimer);
  }, []);

  if (!isOpen) {
    return (
      <button
        type="button"
        className="review-prompt-launcher"
        onClick={() => setIsOpen(true)}
        aria-label="Open Google review prompt"
      >
        <FaStar />
        <span>Review</span>
      </button>
    );
  }

  return (
    <aside className="review-prompt-card" aria-label="Google review request">
      <div className="review-prompt-header">
        <span className="review-prompt-badge">
          <FaStar />
          Google review
        </span>
        <button
          type="button"
          className="review-prompt-close"
          onClick={() => setIsOpen(false)}
          aria-label="Minimize Google review prompt"
        >
          <FaTimes />
        </button>
      </div>

      <h2>Loved your Sindureghari furniture?</h2>
      <p>
        Your public Google review helps new customers trust our handcrafted
        furniture, delivery, and showroom service.
      </p>

      <div className="review-prompt-actions">
        <a
          className="review-prompt-primary"
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGoogle />
          Review us on Google
        </a>
        <button
          type="button"
          className="review-prompt-secondary"
          onClick={() => setIsOpen(false)}
        >
          Later
        </button>
      </div>

      <a
        className="review-prompt-qr"
        href={GOOGLE_REVIEW_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Scan QR code to open Google review page"
      >
        <span>
          <FaQrcode />
          Scan for review
        </span>
        <img src={GOOGLE_REVIEW_QR} alt="QR code for Sindureghari Google review" />
      </a>
    </aside>
  );
}
