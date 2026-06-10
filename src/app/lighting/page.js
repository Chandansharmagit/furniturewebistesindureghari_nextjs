import CategoryPage from '@/pages/CategoryPage';

const SITE_URL = "https://sinduregharifurniture.shop";

export const metadata = {
  title: "Grand Chandeliers & Luxury Home Lightings in Nepal | Sindureghari Furniture",
  description: "Explore crystal chandeliers, decorative table lamps, floor lamps, wall sconces & modern ceiling light fixtures. Elevate your home interiors with premium lighting in Nepal.",
  alternates: {
    canonical: `${SITE_URL}/lighting`,
  },
  openGraph: {
    title: "Grand Chandeliers & Luxury Home Lightings in Nepal | Sindureghari Furniture",
    description: "Explore crystal chandeliers, decorative table lamps, floor lamps, wall sconces & modern ceiling light fixtures. Elevate your home interiors with premium lighting in Nepal.",
    url: `${SITE_URL}/lighting`,
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
        name: "Home Lighting",
        item: `${SITE_URL}/lighting`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CategoryPage categoryOverride="lightings" />
    </>
  );
}
