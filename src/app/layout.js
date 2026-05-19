import { Suspense } from "react";
import "./globals.css";
import ClientLayout from "./ClientLayout";

/* ─────────────────────────────────────────────
   SECTION A — Global SSR Metadata (Next.js App Router)
   ───────────────────────────────────────────── */
export const metadata = {
  metadataBase: new URL("https://sinduregharifurniture.shop"),

  title: {
    default: "Sindureghari Furniture — Buy Sofas, Beds & Wooden Furniture Online Nepal",
    template: "%s | Sindureghari Furniture Nepal",
  },

  description:
    "Nepal's #1 handcrafted furniture store. Buy premium wooden sofas, beds, dining tables, wardrobes & office furniture online. Free delivery to Kathmandu, Lalitpur, Bhaktapur & Pokhara. Visit our Chandrapur showroom.",

  keywords: [
    "furniture", "furniture Nepal", "furniture in Kathmandu",
    "buy furniture online Nepal", "furniture shop near me", "wooden furniture Nepal",
    "sofa", "bed", "dining table", "wardrobe", "office chair", "lounge chair",
    "L-shape sofa price in Nepal", "king size bed Kathmandu",
    "sindureghari furniture", "bishwokarma furniture",
    "handcrafted sofa set Nepal", "luxury bed online Nepal",
    "modular kitchen Nepal", "teak wood furniture Nepal",
    "furniture store Lalitpur", "furniture store Bhaktapur", "furniture Pokhara",
  ],

  openGraph: {
    title: "Sindureghari Furniture — Premium Handcrafted Wooden Furniture Nepal",
    description:
      "Shop handcrafted teak & rosewood royal sofas, luxury beds, dining sets and modular kitchens. Free delivery across Nepal.",
    url: "https://sinduregharifurniture.shop/",
    siteName: "Sindureghari Furniture",
    type: "website",
    locale: "en_NP",
    images: [
      {
        url: "/images/showroom-exterior.jpg",
        width: 1200,
        height: 630,
        alt: "Sindureghari Furniture Showroom — Premium Wooden Furniture in Nepal",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Sindureghari Furniture — Buy Wooden Furniture Online Nepal",
    description:
      "Shop custom handcrafted royal furniture. Free shipping and white-glove setup all over Nepal.",
    images: ["/images/showroom-exterior.jpg"],
  },

  alternates: {
    canonical: "https://sinduregharifurniture.shop/",
  },

  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },

  verification: {
    // Add your real verification codes here after registering
    google: "YOUR_GOOGLE_SEARCH_CONSOLE_CODE",
    // yandex: "",
    // bing: "YOUR_BING_WEBMASTER_CODE",
  },

  other: {
    "geo.region": "NP",
    "geo.placename": "Chandrapur, Rautahat",
    "geo.position": "27.1352;85.2023",
    "ICBM": "27.1352, 85.2023",
  },
};

/* ─────────────────────────────────────────────
   SECTION B — Sitewide JSON-LD Structured Data
   Organization + WebSite + FurnitureStore + LocalBusiness
   ───────────────────────────────────────────── */
const SITE_URL = "https://sinduregharifurniture.shop";

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    /* ── Organization ── */
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Sindureghari Furniture (Bishwokarma Woodcraft)",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
      },
      description:
        "Nepal's premium handcrafted wooden furniture brand. Sofas, beds, dining tables, wardrobes, modular kitchens & home appliances.",
      telephone: "+977-9855040000",
      email: "support@sinduregharifurniture.shop",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Showroom Highway Road, Chandrapur",
        addressLocality: "Chandrapur",
        addressRegion: "Rautahat",
        postalCode: "44500",
        addressCountry: "NP",
      },
      sameAs: [
        "https://www.facebook.com/bishwokarmafurniture",
        "https://www.instagram.com/sinduregharifurniture",
      ],
      foundingDate: "2015",
      founder: {
        "@type": "Person",
        name: "Chandan Sharma",
      },
    },

    /* ── FurnitureStore / LocalBusiness ── */
    {
      "@type": ["FurnitureStore", "LocalBusiness"],
      "@id": `${SITE_URL}/#furniturestore`,
      name: "Sindureghari Furniture Showroom",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      image: `${SITE_URL}/images/showroom-exterior.jpg`,
      description:
        "Visit Nepal's largest handcrafted wooden furniture showroom. Over 10,000 sq ft of teak & rosewood royal sofa sets, luxury beds, dining tables, wardrobes and modular kitchens.",
      telephone: "+977-9855040000",
      priceRange: "Rs 5,000 – Rs 5,00,000",
      currenciesAccepted: "NPR",
      paymentAccepted: "Cash, Bank Transfer, eSewa, Khalti, EMI",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Showroom Highway Road, Chandrapur",
        addressLocality: "Chandrapur",
        addressRegion: "Rautahat",
        postalCode: "44500",
        addressCountry: "NP",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 27.1352,
        longitude: 85.2023,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "08:00",
          closes: "20:00",
        },
      ],
      areaServed: [
        { "@type": "City", name: "Kathmandu" },
        { "@type": "City", name: "Lalitpur" },
        { "@type": "City", name: "Bhaktapur" },
        { "@type": "City", name: "Pokhara" },
        { "@type": "City", name: "Chandrapur" },
        { "@type": "Country", name: "Nepal" },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Sindureghari Furniture Collection",
        itemListElement: [
          { "@type": "OfferCatalog", name: "Living Room Furniture", url: `${SITE_URL}/category/living-room` },
          { "@type": "OfferCatalog", name: "Bedroom Furniture", url: `${SITE_URL}/category/bedroom` },
          { "@type": "OfferCatalog", name: "Dining Room Furniture", url: `${SITE_URL}/category/dining-room` },
          { "@type": "OfferCatalog", name: "Office & Study Furniture", url: `${SITE_URL}/category/office-and-study` },
          { "@type": "OfferCatalog", name: "Modular Kitchens", url: `${SITE_URL}/category/modular-kitchens` },
        ],
      },
    },

    /* ── WebSite with SearchAction ── */
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Sindureghari Furniture",
      description: "Buy premium handcrafted wooden furniture online in Nepal",
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-NP" className="h-full antialiased">
      <head>
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />

        {/* Preload hero font for LCP */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          as="style"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />

        {/* Sitewide JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
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
