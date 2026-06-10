import FurnitureProductCatalog from '@/component/component/products/Homeproducts';

const SITE_URL = "https://sinduregharifurniture.shop";

export const metadata = {
  title: "Shop Furniture Online in Nepal",
  description:
    "Browse sofas, beds, dining tables, wardrobes, office furniture, lighting and home collections from Sindureghari Furniture Nepal.",
  alternates: {
    canonical: `${SITE_URL}/products`,
  },
  openGraph: {
    title: "Shop All Furniture | Sindureghari Furniture Nepal",
    description:
      "Explore premium furniture collections for Nepali homes, including sofas, beds, dining tables, wardrobes and office furniture.",
    url: `${SITE_URL}/products`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Furniture Online in Nepal",
    description:
      "Browse premium furniture collections from Sindureghari Furniture Nepal.",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
};

export default function Page() {
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
        name: "All Furniture",
        item: `${SITE_URL}/products`,
      },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Sindureghari Furniture Catalogue",
    url: `${SITE_URL}/products`,
    description:
      "Furniture catalogue for sofas, beds, dining tables, wardrobes, office furniture and lighting.",
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  return (
    <>
      {[breadcrumbJsonLd, collectionJsonLd].map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
      <FurnitureProductCatalog />
    </>
  );
}
