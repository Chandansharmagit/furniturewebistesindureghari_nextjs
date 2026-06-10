import CategoryPage from '@/pages/CategoryPage';

const SITE_URL = "https://sinduregharifurniture.shop";

export const metadata = {
  title: "Wooden Wardrobes & Modular Almirah Designs in Nepal | Sindureghari Furniture",
  description: "Buy premium solid wood wardrobes and modern modular almirahs in Nepal. Custom handcrafted wardrobe designs in seasoned teak & sheesham wood with free delivery and assembly in Kathmandu, Lalitpur, Pokhara.",
  alternates: {
    canonical: `${SITE_URL}/wardrobes`,
  },
  openGraph: {
    title: "Wooden Wardrobes & Modular Almirah Designs in Nepal | Sindureghari Furniture",
    description: "Buy premium solid wood wardrobes and modern modular almirahs in Nepal. Custom handcrafted wardrobe designs in seasoned teak & sheesham wood with free delivery and assembly.",
    url: `${SITE_URL}/wardrobes`,
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
        name: "Wardrobes",
        item: `${SITE_URL}/wardrobes`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CategoryPage categoryOverride="bedroom" subcategoryOverride="wardrobes" />
    </>
  );
}
