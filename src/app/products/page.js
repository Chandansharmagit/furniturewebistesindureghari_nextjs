import FurnitureProductCatalog from '@/component/component/products/Homeproducts';

/* ── SSR Metadata for /products ── */
export const metadata = {
  title: "Buy Furniture Online Nepal — Sofas, Beds, Tables",
  description:
    "Browse 500+ handcrafted wooden furniture pieces. Shop sofas, beds, dining tables, wardrobes & office chairs online. Free delivery to Kathmandu, Lalitpur, Pokhara. Best prices in Nepal.",
  alternates: {
    canonical: "https://sinduregharifurniture.shop/products",
  },
  openGraph: {
    title: "Shop All Furniture — Sindureghari Furniture Nepal",
    description:
      "Explore our complete collection of premium handcrafted wooden furniture. Royal sofa sets, king size beds, dining tables & more.",
    url: "https://sinduregharifurniture.shop/products",
    type: "website",
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
        item: "https://sinduregharifurniture.shop",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "All Furniture",
        item: "https://sinduregharifurniture.shop/products",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <FurnitureProductCatalog />
    </>
  );
}
