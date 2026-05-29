import CategoryPage from '@/pages/CategoryPage';

const SITE_URL = "https://sinduregharifurniture.shop";

export const metadata = {
  title: "Ergonomic Office Chairs & Study Table Designs in Nepal | Sindureghari Furniture",
  description: "Shop premium office & study furniture in Nepal. Discover ergonomic office chairs, solid wood study tables, executive desks, and functional storage cabinet designs. High-end workspace solutions.",
  keywords: "office chair Nepal, study table Kathmandu, office furniture price, executive desks Nepal, study desk designs, office table Nepal, bishwokarma, ergonomic chair Kathmandu",
  alternates: {
    canonical: `${SITE_URL}/office-furniture`,
  },
  openGraph: {
    title: "Ergonomic Office Chairs & Study Table Designs in Nepal | Sindureghari Furniture",
    description: "Shop premium office & study furniture in Nepal. Discover ergonomic office chairs, solid wood study tables, executive desks, and functional storage cabinet designs.",
    url: `${SITE_URL}/office-furniture`,
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
        name: "Office & Study Furniture",
        item: `${SITE_URL}/office-furniture`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CategoryPage categoryOverride="office-and-study" />
    </>
  );
}
