import CategoryPage from '@/pages/CategoryPage';

const SITE_URL = "https://sinduregharifurniture.shop";

export const metadata = {
  title: "Premium Solid Wood Dining Table Sets | Wooden Dining Tables Nepal",
  description: "Shop premium solid wood dining table sets & chairs in Nepal. Handcrafted 4, 6 & 8-seater dining tables in seasoned teak wood at factory prices with free shipping to Kathmandu, Lalitpur, Pokhara.",
  alternates: {
    canonical: `${SITE_URL}/dining-tables`,
  },
  openGraph: {
    title: "Premium Solid Wood Dining Table Sets | Wooden Dining Tables Nepal",
    description: "Shop premium solid wood dining table sets & chairs in Nepal. Handcrafted 4, 6 & 8-seater dining tables in seasoned teak wood at factory prices with free shipping.",
    url: `${SITE_URL}/dining-tables`,
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
        name: "Dining Room Furniture",
        item: `${SITE_URL}/category/dining-room`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Dining Tables",
        item: `${SITE_URL}/dining-tables`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CategoryPage categoryOverride="dining-room" subcategoryOverride="dining-tables" />
    </>
  );
}
