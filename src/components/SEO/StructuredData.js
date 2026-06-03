import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://sinduregharifurniture.shop';
const SITE_NAME = 'Sindureghari Furniture';
const SITE_ICON_URL = `${SITE_URL}/sf-icon.png`;

const StructuredData = ({ data, type = "default" }) => {
  if (!data) return null;

  // Ensure data is properly formatted
  const structuredData = typeof data === 'string' ? data : JSON.stringify(data);

  return (
    <Helmet>
      <script type="application/ld+json">
        {structuredData}
      </script>
    </Helmet>
  );
};

// Specific structured data components for different page types
export const ProductStructuredData = ({ product }) => {
  if (!product) return null;

  const productData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || `Premium ${product.category} from Sindureghari Furniture — handcrafted in Nepal`,
    "image": product.images || [product.image],
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Sindureghari Furniture"
    },
    "category": product.category,
    "sku": product.sku || product.id,
    "manufacturer": {
      "@type": "Organization",
      "name": "Sindureghari Furniture",
      "url": SITE_URL
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "NPR",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": SITE_NAME,
        "url": SITE_URL
      },
      "url": `${SITE_URL}/product/${product.id || product._id}`,
      "priceValidUntil": new Date(new Date().getFullYear() + 1, 0, 1).toISOString().split('T')[0],
      "itemCondition": "https://schema.org/NewCondition",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "NPR"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "NP"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 3,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 2,
            "maxValue": 7,
            "unitCode": "DAY"
          }
        }
      }
    }
  };

  // Add rating if available
  if (product.rating) {
    productData.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount || 1,
      "bestRating": 5,
      "worstRating": 1
    };
  }

  return <StructuredData data={productData} type="product" />;
};

export const BreadcrumbStructuredData = ({ breadcrumbs }) => {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": {
        "@type": "WebPage",
        "@id": crumb.url
      }
    }))
  };

  return <StructuredData data={breadcrumbData} type="breadcrumb" />;
};

export const OrganizationStructuredData = () => {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE_NAME,
    "alternateName": ["Sindureghari", "सिन्दुरेघारी फर्निचर"],
    "url": SITE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": SITE_ICON_URL,
      "width": 512,
      "height": 512
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+977-9800000000",
        "contactType": "customer service",
        "areaServed": "NP",
        "availableLanguage": ["English", "Nepali", "Hindi"]
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sindureghari, Chandrapur Municipality",
      "addressLocality": "Chandrapur",
      "addressRegion": "Madhesh Province",
      "postalCode": "44600",
      "addressCountry": "NP"
    },
    "sameAs": [
      "https://www.facebook.com/furnituresindureghari",
      "https://www.instagram.com/furnituresindureghari"
    ],
    "foundingDate": "2020",
    "foundingLocation": "Sindureghari, Chandrapur, Nepal"
  };

  return <StructuredData data={organizationData} type="organization" />;
};

export const WebsiteStructuredData = () => {
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "alternateName": "Sindureghari",
    "url": SITE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_URL}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return <StructuredData data={websiteData} type="website" />;
};

export const LocalBusinessStructuredData = () => {
  const businessData = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    "name": "Sindureghari Furniture Showroom",
    "alternateName": "सिन्दुरेघारी फर्निचर",
    "description": "Nepal's premium handcrafted furniture store in Sindureghari, Chandrapur. Specializing in wooden sofas, beds, dining sets, office furniture & custom designs with free delivery across Nepal.",
    "url": SITE_URL,
    "telephone": "+977-9800000000",
    "email": "info@sinduregharifurniture.shop",
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
      "latitude": "27.1667",
      "longitude": "85.3167"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "09:00",
      "closes": "18:00"
    },
    "priceRange": "Rs.5,000 - Rs.500,000",
    "paymentAccepted": ["Cash", "Bank Transfer", "eSewa", "Khalti", "EMI"],
    "currenciesAccepted": "NPR",
    "areaServed": {
      "@type": "Country",
      "name": "Nepal"
    }
  };

  return <StructuredData data={businessData} type="local-business" />;
};

export default StructuredData;
