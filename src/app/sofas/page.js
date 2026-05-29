import CategoryPage from '@/pages/CategoryPage';

const SITE_URL = "https://sinduregharifurniture.shop";

export const metadata = {
  title: "Best Sofa Sets in Nepal | Teak & Wooden Sofa Designs | Sindureghari Furniture",
  description: "Buy premium solid wood sofa sets in Nepal at factory-direct prices. Discover luxury L-shape sofas, teak wood sofa designs, and comfortable recliners. Free home delivery and assembly to Kathmandu, Lalitpur, Pokhara.",
  keywords: "best sofa set Nepal, wooden sofa design, L-shape sofa price in Nepal, living room furniture Kathmandu, best sofa Nepal, teak wood sofa design, bishwokarma furniture, local furniture showroom",
  alternates: {
    canonical: `${SITE_URL}/sofas`,
  },
  openGraph: {
    title: "Best Sofa Sets in Nepal | Teak & Wooden Sofa Designs | Sindureghari Furniture",
    description: "Buy premium solid wood sofa sets in Nepal at factory-direct prices. Discover luxury L-shape sofas, teak wood sofa designs, and comfortable recliners. Free home delivery and assembly.",
    url: `${SITE_URL}/sofas`,
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
      {
        "@type": "ListItem",
        position: 3,
        name: "Sofas",
        item: `${SITE_URL}/sofas`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CategoryPage categoryOverride="living-room" subcategoryOverride="sofas" />
    </>
  );
}
