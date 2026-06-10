import CategoryPage from '@/pages/CategoryPage';

const SITE_URL = "https://sinduregharifurniture.shop";

export const metadata = {
  title: "Best Sofa Sets & Living Room Furniture Design in Nepal",
  description: "Shop premium sofa sets and living room furniture designs in Nepal, including solid wood sofas, L-shape sofas, coffee tables and recliners.",
  alternates: {
    canonical: `${SITE_URL}/living-room-furniture`,
  },
  openGraph: {
    title: "Best Sofa Sets & Living Room Furniture Design in Nepal",
    description: "Shop premium sofa sets and living room furniture designs in Nepal, including solid wood sofas, L-shape sofas, coffee tables and recliners.",
    url: `${SITE_URL}/living-room-furniture`,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
};

export default async function Page() {
  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Living Room Furniture",
        item: `${SITE_URL}/living-room-furniture`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CategoryPage categoryOverride="living-room" />
    </>
  );
}
