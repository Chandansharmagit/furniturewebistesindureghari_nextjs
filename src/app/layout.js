import { Suspense } from "react";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { getSiteNavigationJsonLd } from "@/component/seo/SiteLinksJsonLd";

const SITE_URL = "https://sinduregharifurniture.shop";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Sindureghari Furniture",
  manifest: "/manifest.json",
  title: {
    default: "Sindureghari Furniture - Buy Sofas, Beds & Wooden Furniture Online Nepal",
    template: "%s | Sindureghari Furniture Nepal",
  },
  description:
    "Nepal's premium handcrafted furniture store. Buy wooden sofas, beds, dining tables, wardrobes, lighting and office furniture online with delivery to Kathmandu, Lalitpur, Bhaktapur, Pokhara and across Nepal.",
  keywords: [
    "sindureghari furniture",
    "bishwokarma furniture",
    "furniture Nepal",
    "buy furniture online Nepal",
    "wooden furniture Nepal",
    "sofa set Nepal",
    "wooden bed Nepal",
    "dining table Nepal",
    "wardrobe Nepal",
    "office furniture Nepal",
    "furniture shop Kathmandu",
    "furniture shop Lalitpur",
    "custom furniture Nepal",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Sindureghari Furniture - Premium Handcrafted Wooden Furniture Nepal",
    description:
      "Shop handcrafted solid wood sofas, luxury beds, dining sets, wardrobes, lighting and office furniture with delivery across Nepal.",
    url: SITE_URL,
    siteName: "Sindureghari Furniture",
    type: "website",
    locale: "en_NP",
    images: [
      {
        url: "/images/showroom-exterior.jpg",
        width: 1200,
        height: 630,
        alt: "Sindureghari Furniture showroom - premium wooden furniture in Nepal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sindureghari Furniture - Buy Wooden Furniture Online Nepal",
    description:
      "Shop custom handcrafted furniture for Nepali homes with delivery and assembly support.",
    images: ["/images/showroom-exterior.jpg"],
  },
  appleWebApp: {
    capable: true,
    title: "Sindureghari Furniture",
    statusBarStyle: "default",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  other: {
    "application-name": "Sindureghari Furniture",
    "apple-mobile-web-app-title": "Sindureghari Furniture",
    "geo.region": "NP",
    "geo.placename": "Chandrapur, Rautahat",
    "geo.position": "27.1352;85.2023",
    ICBM: "27.1352, 85.2023",
  },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Sindureghari Furniture",
      alternateName: ["Bishwokarma Furniture", "Bishwokarma Woodcraft", "Sindureghari Furniture Nepal"],
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
      },
      description:
        "Nepal's premium handcrafted wooden furniture brand for sofas, beds, dining tables, wardrobes, lighting, office furniture and custom interiors.",
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
    },
    {
      "@type": ["FurnitureStore", "LocalBusiness"],
      "@id": `${SITE_URL}/#furniturestore`,
      name: "Sindureghari Furniture Showroom",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      image: `${SITE_URL}/images/showroom-exterior.jpg`,
      description:
        "Visit Sindureghari Furniture showroom for solid wood sofa sets, beds, dining tables, wardrobes, office furniture, lighting and custom furniture in Nepal.",
      telephone: "+977-9855040000",
      priceRange: "Rs 5,000 - Rs 5,00,000",
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
          { "@type": "OfferCatalog", name: "Living Room Furniture", url: `${SITE_URL}/living-room-furniture` },
          { "@type": "OfferCatalog", name: "Sofas", url: `${SITE_URL}/sofas` },
          { "@type": "OfferCatalog", name: "Beds", url: `${SITE_URL}/beds` },
          { "@type": "OfferCatalog", name: "Dining Tables", url: `${SITE_URL}/dining-tables` },
          { "@type": "OfferCatalog", name: "Special Offers", url: `${SITE_URL}/special-offers-all` },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Sindureghari Furniture",
      alternateName: ["Bishwokarma Furniture", "Sindureghari Furniture Nepal"],
      description: "Buy premium handcrafted wooden furniture online in Nepal.",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          as="style"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getSiteNavigationJsonLd()) }}
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
