import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://sinduregharifurniture.shop';
const SITE_NAME = 'Sindureghari Furniture';
const DEFAULT_OG_IMAGE = 'https://res.cloudinary.com/db5okniim/image/upload/v1758082708/furniture-products/images/rh4ajiavzh4tazx6qmlo.jpg';

const SEOComponent = ({
  title = "Sindureghari Furniture | Nepal's #1 Premium Handcrafted Furniture Store",
  description = "Shop Nepal's finest handcrafted furniture at Sindureghari Furniture. Premium wooden sofas, beds, dining tables and office furniture. Free Delivery, EMI Available and Custom Designs from Sindureghari, Chandrapur.",
  keywords = "sindureghari furniture, bishwokarma furniture, furniture Nepal, sofa set Nepal, dining table Nepal, bedroom furniture Nepal, office furniture Nepal, wooden furniture Nepal, modern furniture Nepal, custom furniture Nepal, furniture Chandrapur, furniture Rautahat, buy furniture online Nepal",
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  twitterTitle,
  twitterDescription,
  twitterImage,
  structuredData,
  noIndex = false,
  noFollow = false,
  price,
  priceCurrency = "NPR",
  sku,
  availability = "https://schema.org/InStock",
  children
}) => {
  // Use provided OG values or fallback to main title/description
  const finalOgTitle = ogTitle || title;
  const finalOgDescription = ogDescription || description;
  const finalTwitterTitle = twitterTitle || title;
  const finalTwitterDescription = twitterDescription || description;
  const finalTwitterImage = twitterImage || ogImage;
  const finalCanonicalUrl = canonicalUrl || SITE_URL;

  // Construct robots meta content with modern directives
  const robotsContent = `${noIndex ? 'noindex' : 'index'}, ${noFollow ? 'nofollow' : 'follow'}, max-snippet:-1, max-image-preview:large, max-video-preview:-1`;

  // Local Business Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    "name": SITE_NAME,
    "legalName": "New Sindureghari Furniture Pvt Ltd",
    "alternateName": ["Sindureghari Furniture Nepal", "New Sindureghari Furniture", "Sindureghari Furniture Showroom"],
    "image": ogImage,
    "@id": SITE_URL,
    "url": SITE_URL,
    "telephone": "+977-9845427041",
    "priceRange": "Rs.5,000 - Rs.500,000",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sindureghari, Chandrapur Municipality",
      "addressLocality": "Chandrapur",
      "addressRegion": "Madhesh Province",
      "postalCode": "44600",
      "addressCountry": "NP"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 27.1667,
      "longitude": 85.3167
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "paymentAccepted": ["Cash", "Bank Transfer", "eSewa", "Khalti", "EMI"],
    "currenciesAccepted": "NPR",
    "sameAs": [
      "https://www.facebook.com/bishwokarmafurniture",
      "https://www.instagram.com/sinduregharifurniture"
    ]
  };

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content={robotsContent} />
        <link rel="canonical" href={finalCanonicalUrl} />

        {/* Global SEO Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#8B4513" />
        <meta name="author" content={SITE_NAME} />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={finalOgTitle} />
        <meta property="og:description" content={finalOgDescription} />
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={finalCanonicalUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${finalOgTitle} — Sindureghari Furniture`} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={finalTwitterTitle} />
        <meta name="twitter:description" content={finalTwitterDescription} />
        <meta name="twitter:image" content={finalTwitterImage} />
        <meta name="twitter:image:alt" content={`${finalTwitterTitle} — Sindureghari Furniture`} />
        <meta name="twitter:site" content="@SindureghariF" />

        {/* Location Data for Local SEO */}
        <meta name="geo.region" content="NP-P2" />
        <meta name="geo.placename" content="Sindureghari, Chandrapur" />
        <meta name="geo.position" content="27.1667;85.3167" />
        <meta name="ICBM" content="27.1667, 85.3167" />

        {/* Structured Data: Local Business */}
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>

        {/* Structured Data: Dynamic */}
        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}

        {/* Additional children elements */}
        {children}
      </Helmet>
    </>
  );
};

export default SEOComponent;
