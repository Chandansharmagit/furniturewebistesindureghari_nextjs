"use client";

import Link from "next/link";
import { ArrowRight, Images, Sparkles } from "lucide-react";
import "./GalleryEntryPoint.css";

const previewImages = [
  {
    src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=900&auto=format&fit=crop",
    label: "Living rooms"
  },
  {
    src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=900&auto=format&fit=crop",
    label: "Beds"
  },
  {
    src: "https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=900&auto=format&fit=crop",
    label: "Dining"
  }
];

export default function GalleryEntryPoint() {
  return (
    <section className="home-gallery-entry" aria-labelledby="home-gallery-entry-title">
      <div className="home-gallery-entry__inner">
        <div className="home-gallery-entry__copy">
          <span className="home-gallery-entry__kicker">
            <Sparkles size={15} />
            Real Product Views
          </span>
          <h2 id="home-gallery-entry-title">See the full furniture gallery before you choose.</h2>
          <p>
            Browse uploaded product photos in one place, then open any image to view its product details.
          </p>
          <div className="home-gallery-entry__actions">
            <Link href="/product-gallery" className="home-gallery-entry__primary">
              <Images size={18} />
              View Product Gallery
              <ArrowRight size={17} />
            </Link>
            <Link href="/products" className="home-gallery-entry__secondary">
              Shop Products
            </Link>
          </div>
        </div>

        <Link href="/product-gallery" className="home-gallery-entry__visual" aria-label="Open product gallery">
          {previewImages.map((image, index) => (
            <span className={`home-gallery-entry__tile tile-${index + 1}`} key={image.src}>
              <img src={image.src} alt={`${image.label} gallery preview`} loading={index === 0 ? "eager" : "lazy"} />
              <em>{image.label}</em>
            </span>
          ))}
        </Link>
      </div>
    </section>
  );
}
