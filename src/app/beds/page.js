import CategoryPage from '@/pages/CategoryPage';

const SITE_URL = "https://sinduregharifurniture.shop";

export const metadata = {
  title: "Best Solid Wood Bed Designs in Nepal | King & Queen Size Beds | Sindureghari Furniture",
  description: "Discover premium solid wood double beds and hydraulic storage beds in Nepal. Browse handcrafted king and queen size bed designs with delivery and assembly support.",
  alternates: {
    canonical: `${SITE_URL}/beds`,
  },
  openGraph: {
    title: "Best Solid Wood Bed Designs in Nepal | King & Queen Size Beds | Sindureghari Furniture",
    description: "Discover premium solid wood double beds and hydraulic storage beds in Nepal. Browse handcrafted king and queen size bed designs with delivery and assembly support.",
    url: `${SITE_URL}/beds`,
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
        name: "Bedroom Furniture",
        item: `${SITE_URL}/category/bedroom`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Beds",
        item: `${SITE_URL}/beds`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CategoryPage categoryOverride="bedroom" subcategoryOverride="beds" />
    </>
  );
}
