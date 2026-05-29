import Link from "next/link";
import ModernHero from "../component/component/Hero/ModernHero";
import RoyalSpecialOffers from "../component/special-offers/RoyalSpecialOffers";
import Homeappliances from "../component/Homeapplicances/Homeappliances";
import InspirationGallery from "../component/home-extensions/InspirationGallery";
import FurnitureBrand from "../component/component/furniturebrand/Furniturebrand";
import Newproduct from "../component/newproducts/Newproducts";
import ShoppableRoom from "../component/home-extensions/ShoppableRoom";
import TopratedBrand from "../component/component/toprated/Toprated";
import InteriorDesignService from "../component/home-extensions/InteriorDesignService";
import Craftsmanship from "../component/home-extensions/Craftsmanship";
import GoogleReviews from "../component/home-extensions/GoogleReviews";
import EMIPromo from "../component/emi-promo/EMIPromo";
import Policy from "../component/component/privacypolicy/privacy";

export default function HomePage() {
  return (
    <>
      <ModernHero />
      <RoyalSpecialOffers />
      <Homeappliances />
      <InspirationGallery />
      {/* <FurnitureBrand /> */}
      <Newproduct />
      <ShoppableRoom />
      {/* <TopratedBrand /> */}
      {/* <InteriorDesignService />
      <Craftsmanship /> */}
      <GoogleReviews />
      <EMIPromo />
      <Policy />

      {/* Premium SEO Content & Quick Category Navigation Block */}
      <section className="homepage-seo-section" style={{
        padding: '80px 0',
        background: '#fcfbf7',
        borderTop: '1px solid #eae6df',
        fontFamily: "'Outfit', sans-serif"
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '20px',
            fontFamily: "'Playfair Display', serif",
            textAlign: 'center'
          }}>
            Sindureghari Furniture — Nepal's Premium Handcrafted Wooden Furniture
          </h1>
          <p style={{
            fontSize: '1.05rem',
            lineHeight: '1.8',
            color: '#4a4a4a',
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto 40px auto'
          }}>
            Welcome to <strong>Sindureghari Furniture (Bishwokarma Woodcraft)</strong>, the leading destination for premium handcrafted wooden furniture in Nepal. From our advanced manufacturing factory and showroom along the highway in Chandrapur, Rautahat, we manufacture lifetime-guaranteed furniture using seasoned solid hardwoods like <strong>Teak (Saj)</strong> and <strong>Sheesham (Sisam)</strong>. Explore our modern and classic designs with free home delivery and white-glove assembly in Kathmandu, Lalitpur, Pokhara, and across all major cities of Nepal.
          </p>

          {/* Quick links grid for search crawlers and users */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginTop: '40px',
            borderTop: '1px solid #eae6df',
            paddingTop: '40px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '12px' }}>Living Room</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <Link href="/sofas" style={{ color: '#C5A059', textDecoration: 'none', fontSize: '0.95rem' }}>Luxury Sofa Sets</Link>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <Link href="/living-room-furniture" style={{ color: '#C5A059', textDecoration: 'none', fontSize: '0.95rem' }}>Living Room Furniture</Link>
                </li>
              </ul>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '12px' }}>Bedroom</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <Link href="/beds" style={{ color: '#C5A059', textDecoration: 'none', fontSize: '0.95rem' }}>Solid Wood Beds</Link>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <Link href="/wardrobes" style={{ color: '#C5A059', textDecoration: 'none', fontSize: '0.95rem' }}>Wooden Wardrobes</Link>
                </li>
              </ul>
            </div>

            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '12px' }}>Dining & Study</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <Link href="/dining-tables" style={{ color: '#C5A059', textDecoration: 'none', fontSize: '0.95rem' }}>Dining Table Sets</Link>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <Link href="/office-furniture" style={{ color: '#C5A059', textDecoration: 'none', fontSize: '0.95rem' }}>Office & Study Tables</Link>
                </li>
              </ul>
            </div>

            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '12px' }}>More Collections</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <Link href="/lighting" style={{ color: '#C5A059', textDecoration: 'none', fontSize: '0.95rem' }}>Crystal Chandeliers & Lighting</Link>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <Link href="/category/modular-kitchens" style={{ color: '#C5A059', textDecoration: 'none', fontSize: '0.95rem' }}>Modular Kitchen Cabinets</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
