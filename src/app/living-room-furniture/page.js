import CategoryPage from '@/pages/CategoryPage';

const SITE_URL = "https://sinduregharifurniture.shop";

export const metadata = {
  title: "Best Sofa Sets & Living Room Furniture Design in Nepal",
  description: "Shop the best sofa sets & luxury living room furniture designs in Nepal. Discover premium solid teak wood sofas, L-shape sofas, coffee tables & recliners at factory prices. Free shipping to Kathmandu, Lalitpur, Pokhara.",
  keywords: "best sofa set Nepal, wooden sofa design, L-shape sofa price in Nepal, living room furniture Kathmandu, best sofa Nepal, teak wood sofa design, bishwokarma furniture, local furniture showroom",
  alternates: {
    canonical: `${SITE_URL}/living-room-furniture`,
  },
  openGraph: {
    title: "Best Sofa Sets & Living Room Furniture Design in Nepal",
    description: "Shop the best sofa sets & luxury living room furniture designs in Nepal. Discover premium solid teak wood sofas, L-shape sofas, coffee tables & recliners at factory prices. Free shipping.",
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
