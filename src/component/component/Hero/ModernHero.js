import Link from 'next/link';
import Image from 'next/image';
import { FaStar, FaTruckFast, FaShieldHalved, FaArrowRight, FaWhatsapp } from 'react-icons/fa6';
import './ModernHero.css';

const U = (id, w) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=75&w=${w}`;

export default function ModernHero() {
  return (
    <section className="pro-hero" aria-label="Sindureghari Furniture">
      <div className="pro-hero__inner">
        <div className="pro-hero__text">
          <span className="pro-hero__eyebrow">Handcrafted in Nepal since 2010</span>
          <h1>
            Furniture that makes
            <em> your house a home.</em>
          </h1>
          <p>
            Solid teak and sisau wood sofas, beds and dining sets. Built by master
            craftsmen, delivered to your door.
          </p>

          <div className="pro-hero__actions">
            <Link href="/products" className="pro-btn pro-btn--dark">
              Shop Collection <FaArrowRight />
            </Link>
            <a
              href="https://wa.me/9779845427041?text=Hi%20Sindureghari%20Furniture,%20I%20would%20like%20to%20inquire%20about%20your%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="pro-btn pro-btn--outline"
            >
              <FaWhatsapp /> Talk to Us
            </a>
          </div>

          <ul className="pro-hero__trust">
            <li><FaTruckFast /> Free delivery</li>
            <li><FaShieldHalved /> 10-year guarantee</li>
            <li><FaStar /> 4.9 customer rating</li>
          </ul>
        </div>

        <div className="pro-hero__visual">
          <div className="pro-hero__frame">
            <Image
              src={U('photo-1555041469-a586c61ea9bc', 1100)}
              alt="Handcrafted solid wood sofa in a modern living room"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 50vw"
              className="pro-hero__img"
            />
          </div>
          <div className="pro-hero__chip pro-hero__chip--top">
            <strong>2,500+</strong>
            <span>Happy homes</span>
          </div>
          <div className="pro-hero__chip pro-hero__chip--bottom">
            <strong>100% Solid Wood</strong>
            <span>Termite treated</span>
          </div>
        </div>
      </div>
    </section>
  );
}
