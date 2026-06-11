"use client";

import React, { useEffect, useState } from "react";
import { FaAndroid, FaGooglePlay, FaQrcode, FaTimes } from "react-icons/fa";
import "./AppDownloadPrompt.css";

const androidAccessUrl =
  "https://wa.me/9779845427041?text=Hi%20Sindureghari%20Furniture%2C%20I%20want%20to%20download%20your%20Android%20furniture%20store%20app.";

export default function AppDownloadPrompt() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsVisible(true);
    }, 900);

    return () => window.clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <aside className="app-download-prompt" aria-label="Download Sindureghari Furniture app">
      <button
        type="button"
        className="app-download-close"
        onClick={() => setIsVisible(false)}
        aria-label="Close app download prompt"
      >
        <FaTimes />
      </button>

      <div className="app-download-icon">
        <FaAndroid />
      </div>

      <div className="app-download-copy">
        <span>Android App</span>
        <strong>Shop Sindureghari from your phone</strong>
        <p>Faster browsing, order help, premium offers, and direct showroom support.</p>
      </div>

      <div className="app-download-qr">
        <img src="/images/android-app-qr.svg" alt="QR code for Sindureghari Furniture Android app download" />
        <small><FaQrcode /> Scan</small>
      </div>

      <a className="app-download-action" href={androidAccessUrl} target="_blank" rel="noopener noreferrer">
        <FaGooglePlay />
        Get App Link
      </a>
    </aside>
  );
}
