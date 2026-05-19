import { Suspense } from "react";
import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "Sindureghari Furniture | Best Wooden Furniture Store Near Me Nepal",
  description: "Looking for the best wooden furniture store near me? Discover premium handcrafted royal sofas, beds, dining sets, modular kitchens, and home appliances at Sindureghari Furniture (Bishwokarma). Showrooms in Chandrapur & free shipping to Kathmandu, Lalitpur, Pokhara and all Nepal.",
  keywords: "furniture near me, furniture store near me, best wooden furniture shop near me, bishwokarma furniture, sindureghari furniture, handcrafted sofa set Nepal, buy luxury bed online Nepal, royal dining table Kathmandu, modular kitchen showroom Nepal, premium wood furniture Rautahat, home decor showroom Nepal",
  openGraph: {
    title: "Sindureghari Furniture | Premium Handcrafted Wooden Furniture Store Near Me",
    description: "handcrafted teak & rosewood royal sofas, luxury beds, dining sets, and kitchens. Visit our premium showroom or shop online with free delivery across Nepal.",
    url: "https://sinduregharifurniture.shop/",
    type: "website",
    images: [
      {
        url: "https://sinduregharifurniture.shop/images/showroom-exterior.jpg",
        width: 1200,
        height: 630,
        alt: "Sindureghari Furniture Showroom Nepal"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Sindureghari Furniture | Premium Handcrafted Wooden Furniture Store",
    description: "Shop custom handcrafted royal furniture. Free shipping and white-glove setup all over Nepal.",
    images: ["https://sinduregharifurniture.shop/images/showroom-exterior.jpg"]
  },
  alternates: {
    canonical: "https://sinduregharifurniture.shop/",
  }
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FurnitureStore",
        "@id": "https://sinduregharifurniture.shop/#furniturestore",
        "name": "Sindureghari Furniture (Bishwokarma Woodcraft Showroom)",
        "url": "https://sinduregharifurniture.shop/",
        "logo": "https://sinduregharifurniture.shop/logo.png",
        "image": "https://sinduregharifurniture.shop/images/showroom-exterior.jpg",
        "description": "Nepal's premium handcrafted wooden furniture brand. Specialized in high-end teak, sisau, and solid rosewood royal sofa sets, luxury beds, modular kitchens, dining sets and home appliances near you.",
        "telephone": "+977-9855040000",
        "priceRange": "$$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Sindureghari Showroom, Chandrapur Main Highway",
          "addressLocality": "Chandrapur",
          "addressRegion": "Rautahat",
          "postalCode": "44500",
          "addressCountry": "NP"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 27.1352,
          "longitude": 85.2023
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday"
            ],
            "opens": "08:00",
            "closes": "20:00"
          }
        ],
        "sameAs": [
          "https://www.facebook.com/bishwokarmafurniture",
          "https://www.instagram.com/sinduregharifurniture"
        ],
        "areaServed": [
          {
            "@type": "AdministrativeArea",
            "name": "Kathmandu"
          },
          {
            "@type": "AdministrativeArea",
            "name": "Lalitpur"
          },
          {
            "@type": "AdministrativeArea",
            "name": "Bhaktapur"
          },
          {
            "@type": "AdministrativeArea",
            "name": "Chandrapur"
          },
          {
            "@type": "AdministrativeArea",
            "name": "Pokhara"
          },
          {
            "@type": "AdministrativeArea",
            "name": "Nepal"
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://sinduregharifurniture.shop/#website",
        "url": "https://sinduregharifurniture.shop/",
        "name": "Sindureghari Furniture",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://sinduregharifurniture.shop/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "ItemList",
        "@id": "https://sinduregharifurniture.shop/#sitelinks",
        "name": "Sindureghari Furniture Navigation",
        "itemListElement": [
          {
            "@type": "SiteNavigationElement",
            "position": 1,
            "name": "Living Room Furniture — Sofas, TV Units & Recliners",
            "description": "Handcrafted wooden sofa sets, designer coffee tables, luxury TV cabinets, premium recliners and showcases for your living room.",
            "url": "https://sinduregharifurniture.shop/category/living-room"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 2,
            "name": "Bedroom Furniture — Royal Beds & Wardrobes",
            "description": "King-size wooden beds, luxury wardrobes, bedside tables, dressing tables and premium mattresses.",
            "url": "https://sinduregharifurniture.shop/category/bedroom"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 3,
            "name": "Dining Room — Handcrafted Dining Sets",
            "description": "4, 6 and 8 seater dining tables, premium chairs, crockery units and luxury bar cabinets.",
            "url": "https://sinduregharifurniture.shop/category/dining-room"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 4,
            "name": "Office & Study — Desks & Ergonomic Chairs",
            "description": "Executive wooden desks, ergonomic office chairs, sturdy bookshelves and filing storage.",
            "url": "https://sinduregharifurniture.shop/category/office-and-study"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 5,
            "name": "Modular Kitchens — Custom Kitchen Design",
            "description": "Elite kitchen cabinets, designer pantry units, granite counters and kitchen accessories.",
            "url": "https://sinduregharifurniture.shop/category/modular-kitchens"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 6,
            "name": "Bathroom Furniture — Vanities & Mirrors",
            "description": "Bathroom vanity sets, LED wall mirrors, moisture-proof storage cabinets and bath accessories.",
            "url": "https://sinduregharifurniture.shop/category/bathroom"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 7,
            "name": "Lightings — Chandeliers & Lamps",
            "description": "Grand chandeliers, decorative table and floor lamps, wall sconces and ceiling light fixtures.",
            "url": "https://sinduregharifurniture.shop/category/lightings"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 8,
            "name": "Decor — Wall Art, Rugs & Vases",
            "description": "Canvas wall art, handwoven rugs, ceramic vases, cushions and decorative home accents.",
            "url": "https://sinduregharifurniture.shop/category/decor"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 9,
            "name": "Outdoor Furniture — Garden & Patio",
            "description": "Weather-resistant garden chairs, teak porch swings, planters and outdoor storage.",
            "url": "https://sinduregharifurniture.shop/category/outdoor"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 10,
            "name": "The Journal — Interior Design Blog",
            "description": "Design tips, furniture care guides, room makeover ideas and the latest trends in Nepal.",
            "url": "https://sinduregharifurniture.shop/blog"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 11,
            "name": "Visionary Leadership — Chandan Sharma (CEO)",
            "description": "Meet our founder & CEO Chandan Sharma and explore the vision driving Nepal's finest woodcraft heritage.",
            "url": "https://sinduregharifurniture.shop/ceo"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 12,
            "name": "Contact Us",
            "description": "Get in touch with Sindureghari Furniture. Visit our showroom or call for custom orders.",
            "url": "https://sinduregharifurniture.shop/contact"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 13,
            "name": "Help & Support",
            "description": "FAQs, warranty claims, delivery tracking and customer support.",
            "url": "https://sinduregharifurniture.shop/help-and-support"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 14,
            "name": "Careers at Bishwokarma",
            "description": "Join our team. Open positions in design, carpentry, sales and management.",
            "url": "https://sinduregharifurniture.shop/careers"
          },
          {
            "@type": "SiteNavigationElement",
            "position": 15,
            "name": "Special Offers & Deals",
            "description": "Exclusive discounts, seasonal sales and royal special furniture collections.",
            "url": "https://sinduregharifurniture.shop/category/offers"
          }
        ]
      }
    ]
  };

  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <ClientLayout>{children}</ClientLayout>
        </Suspense>
      </body>
    </html>
  );
}
