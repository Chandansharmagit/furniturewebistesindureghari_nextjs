// MetaTagManager.js - Utility for generating dynamic meta tags

const SITE_URL = 'https://sinduregharifurniture.shop';
const SITE_NAME = 'Sindureghari Furniture';
const BRAND_FULL = 'Sindureghari Furniture';

export class MetaTagManager {
  static generateProductMeta(product) {
    if (!product) return {};

    const title = `${product.name} — Premium ${product.category} | ${SITE_NAME}`;
    const description = `${product.name} — ${product.description || 'Handcrafted premium furniture'} at ${SITE_NAME}. ${product.price ? `Starting from NPR ${product.price.toLocaleString()}` : 'Best prices in Nepal'}. ✓ Free delivery across Nepal ✓ EMI available.`;
    const keywords = `${product.name}, ${product.category}, sindureghari furniture, ${product.brand || 'Bishwokarma'}, buy ${product.category} Nepal, ${product.name} price Nepal, furniture Nepal`;
    
    return {
      title,
      description,
      keywords,
      canonicalUrl: `${SITE_URL}/product/${product.id || product._id}`,
      ogTitle: title,
      ogDescription: description,
      ogImage: product.images?.[0] || product.image,
      ogType: 'product',
      structuredData: this.generateProductStructuredData(product)
    };
  }

  static generateCategoryMeta(category, products = []) {
    const title = `${category} Furniture | ${SITE_NAME} Nepal`;
    const description = `Explore premium ${category.toLowerCase()} furniture at ${SITE_NAME}. ${products.length > 0 ? `${products.length}+ handcrafted pieces available` : 'Wide range of designs'}. ✓ Free delivery across Nepal ✓ EMI options ✓ Custom designs available.`;
    const keywords = `${category} furniture Nepal, sindureghari ${category.toLowerCase()} furniture, buy ${category} Nepal, ${category} furniture price Nepal, premium ${category} furniture, Chandrapur furniture`;
    
    return {
      title,
      description,
      keywords,
      canonicalUrl: `${SITE_URL}/category/${category.toLowerCase().replace(/\s+/g, '-')}`,
      ogTitle: title,
      ogDescription: description,
      ogType: 'website',
      structuredData: this.generateCategoryStructuredData(category, products)
    };
  }

  static generateSearchMeta(query, resultsCount = 0) {
    const title = `Search: "${query}" | ${SITE_NAME}`;
    const description = `Found ${resultsCount} furniture items matching "${query}" at ${SITE_NAME}. Premium handcrafted furniture with free delivery across Nepal.`;
    const keywords = `${query}, sindureghari furniture, ${query} furniture Nepal, buy ${query} Nepal`;
    
    return {
      title,
      description,
      keywords,
      canonicalUrl: `${SITE_URL}/search?q=${encodeURIComponent(query)}`,
      ogTitle: title,
      ogDescription: description,
      noIndex: resultsCount === 0, // Don't index empty search results
    };
  }

  static generateHomeMeta() {
    return {
      title: `${SITE_NAME} | Nepal's #1 Premium Handcrafted Furniture Store`,
      description: "Shop Nepal's finest handcrafted furniture at Sindureghari Furniture. Premium wooden sofas, beds, dining tables & office furniture. ✓ Free Delivery ✓ EMI Available ✓ Custom Designs. Sindureghari, Chandrapur.",
      keywords: "sindureghari furniture, bishwokarma furniture, furniture Nepal, sofa set Nepal, dining table Nepal, bedroom furniture Nepal, office furniture Nepal, wooden furniture Nepal, modern furniture Nepal, custom furniture Nepal, furniture Chandrapur",
      canonicalUrl: SITE_URL,
      structuredData: this.generateBusinessStructuredData()
    };
  }

  static generateProductStructuredData(product) {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description || `Premium ${product.category} from ${BRAND_FULL} — handcrafted in Nepal`,
      "image": product.images || [product.image],
      "brand": {
        "@type": "Brand",
        "name": product.brand || SITE_NAME
      },
      "category": product.category,
      "sku": product.sku || product.id || product._id,
      "manufacturer": {
        "@type": "Organization",
        "name": BRAND_FULL,
        "url": SITE_URL
      },
      "offers": {
        "@type": "Offer",
        "price": product.price,
        "priceCurrency": "NPR",
        "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "itemCondition": "https://schema.org/NewCondition",
        "seller": {
          "@type": "Organization",
          "name": SITE_NAME,
          "url": SITE_URL
        },
        "url": `${SITE_URL}/product/${product.id || product._id}`,
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
          }
        }
      },
      "aggregateRating": product.rating ? {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviewCount || 1,
        "bestRating": 5,
        "worstRating": 1
      } : undefined
    };
  }

  static generateCategoryStructuredData(category, products) {
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `${category} Furniture — ${SITE_NAME}`,
      "description": `Premium ${category.toLowerCase()} furniture collection at ${SITE_NAME}, Nepal`,
      "url": `${SITE_URL}/category/${category.toLowerCase().replace(/\s+/g, '-')}`,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": products.length,
        "itemListElement": products.slice(0, 10).map((product, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Product",
            "name": product.name,
            "url": `${SITE_URL}/product/${product.id || product._id}`
          }
        }))
      }
    };
  }

  static generateBusinessStructuredData() {
    return {
      "@context": "https://schema.org",
      "@type": "FurnitureStore",
      "name": BRAND_FULL,
      "alternateName": ["Sindureghari", "सिन्दुरेघारी फर्निचर"],
      "description": "Nepal's premium handcrafted furniture store in Sindureghari, Chandrapur. Specializing in wooden sofas, beds, dining sets, office furniture & custom designs with free delivery across Nepal.",
      "url": SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo192.png`,
        "width": 192,
        "height": 192
      },
      "image": {
        "@type": "ImageObject",
        "url": "https://res.cloudinary.com/db5okniim/image/upload/v1758082708/furniture-products/images/rh4ajiavzh4tazx6qmlo.jpg",
        "width": 1200,
        "height": 630
      },
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
        "latitude": 27.1667,
        "longitude": 85.3167
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
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Sindureghari Furniture Collection",
        "itemListElement": [
          {
            "@type": "OfferCatalog",
            "name": "Living Room Furniture",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Premium Sofa Sets" } },
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Coffee Tables" } },
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "TV Units" } }
            ]
          },
          {
            "@type": "OfferCatalog",
            "name": "Bedroom Furniture",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "King & Queen Beds" } },
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Wardrobes" } },
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Dressing Tables" } }
            ]
          },
          {
            "@type": "OfferCatalog",
            "name": "Dining Room Furniture",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Dining Table Sets" } },
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Dining Chairs" } }
            ]
          },
          {
            "@type": "OfferCatalog",
            "name": "Office Furniture",
            "itemListElement": [
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Executive Desks" } },
              { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Office Chairs" } }
            ]
          }
        ]
      },
      "areaServed": [
        { "@type": "Country", "name": "Nepal" },
        { "@type": "City", "name": "Chandrapur" },
        { "@type": "City", "name": "Kathmandu" },
        { "@type": "AdministrativeArea", "name": "Rautahat District" }
      ],
      "sameAs": [
        "https://www.facebook.com/furnituresindureghari",
        "https://www.instagram.com/furnituresindureghari"
      ],
      "foundingDate": "2020",
      "foundingLocation": "Sindureghari, Chandrapur, Nepal"
    };
  }

  static generateBreadcrumbStructuredData(breadcrumbs) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    };
  }
}

export default MetaTagManager;