import { Suspense } from "react";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { getSiteNavigationJsonLd } from "@/component/seo/SiteLinksJsonLd";
import { enterpriseCategories } from "@/data/enterpriseSeo";

const SITE_URL = "https://sinduregharifurniture.shop";
const SITE_NAME = "Sindureghari Furniture";
const SITE_ICON_URL = `${SITE_URL}/icon-512.png`;
const SITE_SOCIAL_IMAGE = `${SITE_URL}/assets/aurelian-hero.png`;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  referrer: "origin-when-cross-origin",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
  },
  title: {
    default: `${SITE_NAME} - Premium Furniture Store in Nepal`,
    template: `%s | ${SITE_NAME} Nepal`,
  },
  description:
    "Shop premium sofas, beds, dining tables, wardrobes, office furniture and custom furniture from Sindureghari Furniture with delivery support across Nepal.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: `${SITE_NAME} - Premium Furniture Store in Nepal`,
    description:
      "Explore premium sofas, beds, dining sets, wardrobes, lighting and custom furniture with delivery support across Nepal.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_NP",
    images: [
      {
        url: SITE_SOCIAL_IMAGE,
        width: 1200,
        height: 630,
        alt: "Sindureghari Furniture showroom - premium wooden furniture in Nepal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Premium Furniture Store in Nepal`,
    description:
      "Shop premium furniture for Nepali homes with delivery and assembly support.",
    images: [SITE_SOCIAL_IMAGE],
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
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
    "application-name": SITE_NAME,
    "apple-mobile-web-app-title": SITE_NAME,
    "og:site_name": SITE_NAME,
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
      name: SITE_NAME,
      legalName: "New Sindureghari Furniture Pvt Ltd",
      alternateName: ["Sindureghari Furniture Nepal", "New Sindureghari Furniture", "Sindureghari Furniture Showroom"],
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: SITE_ICON_URL,
        width: 512,
        height: 512,
      },
      description:
        "Nepal's premium handcrafted wooden furniture brand for sofas, beds, dining tables, wardrobes, lighting, office furniture and custom interiors.",
      telephone: "+977-9845427041",
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
      name: SITE_NAME,
      alternateName: ["New Sindureghari Furniture Pvt Ltd", "Sindureghari Furniture Showroom"],
      url: SITE_URL,
      logo: SITE_ICON_URL,
      image: SITE_SOCIAL_IMAGE,
      description:
        "Visit Sindureghari Furniture showroom for solid wood sofa sets, beds, dining tables, wardrobes, office furniture, lighting and custom furniture in Nepal.",
      telephone: "+977-9845427041",
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
        itemListElement: enterpriseCategories.map((category) => ({
          "@type": "OfferCatalog",
          name: category.name,
          url: `${SITE_URL}${category.path}`,
          itemListElement: category.children.map((child) => ({
            "@type": "OfferCatalog",
            name: child.name,
            url: `${SITE_URL}${child.path}`,
          })),
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      alternateName: ["Sindureghari Furniture Nepal", "New Sindureghari Furniture"],
      description: "Buy premium handcrafted wooden furniture online in Nepal.",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-NP",
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
