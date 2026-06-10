"use client";

import { FaGoogle, FaQrcode, FaStar } from "react-icons/fa";
import "./LandingReviewRequest.css";

const GOOGLE_REVIEW_URL = "https://g.page/r/CSk9ke0-YPVyEBM/review";
const GOOGLE_REVIEW_QR = "/images/google-review-qr.png";

export default function LandingReviewRequest() {
  return (
    <section className="landing-review-request" aria-label="Google review request">
      <div className="landing-review-copy">
        <span className="landing-review-eyebrow">
          <FaStar />
          Customer reviews matter
        </span>
        <h2>Happy with your furniture? Help others choose Sindureghari.</h2>
        <p>
          A public Google review builds trust for new customers looking for
          handcrafted furniture, delivery support, and showroom service in Nepal.
        </p>
        <a
          className="landing-review-button"
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGoogle />
          Review us on Google
        </a>
      </div>

      <a
        className="landing-review-qr-card"
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
    </section>
  );
}
