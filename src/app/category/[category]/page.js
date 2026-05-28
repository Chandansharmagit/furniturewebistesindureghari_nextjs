import CategoryPage from '@/pages/CategoryPage';

const SITE_URL = "https://sinduregharifurniture.shop";

/* Human-friendly category labels & SEO descriptions */
const CATEGORY_META = {
  "living-room": {
    label: "Best Sofa Sets & Living Room Furniture Design",
    desc: "Shop best sofa sets and luxury living room furniture design in Nepal. Discover premium solid teak wood sofas, L-shape sofas, coffee tables & recliners at factory prices. Free shipping to Kathmandu, Lalitpur, Pokhara.",
    keywords: "best sofa set Nepal, wooden sofa design, L-shape sofa price in Nepal, living room furniture Kathmandu, best sofa Nepal, teak wood sofa design, bishwokarma furniture, local furniture showroom",
  },
  bedroom: {
    label: "Solid Wood Beds & Bedroom Furniture Design",
    desc: "Buy solid wood beds and elegant bedroom furniture designs in Nepal. Browse handcrafted king size beds, luxury wooden wardrobes, dressing tables & bedside tables with free delivery & assembly.",
    keywords: "wooden bed designs Nepal, bedroom furniture design Kathmandu, king size bed price Nepal, luxury bedroom sets Nepal, wardrobe design Nepal, bishwokarma woodcraft",
  },
  "dining-room": {
    label: "Best Dining Table Sets & Dining Room Furniture Design",
    desc: "Shop best dining table sets and premium dining room furniture designs in Nepal. Discover handcrafted 4, 6 & 8-seater solid wood dining tables & chairs in seasoned teak wood with free shipping.",
    keywords: "best dining table sets, dining room furniture design, wooden dining table Nepal, 6 seater dining table price, luxury dining table design Kathmandu, teak wood dining set, custom dining furniture",
  },
  "office-and-study": {
    label: "Ergonomic Office Chairs & Study Table Designs",
    desc: "Shop premium office furniture in Nepal. Discover ergonomic office chairs, solid wood study tables, executive desks, and storage cabinet designs for modern workspaces.",
    keywords: "office chair Nepal, study table Kathmandu, office furniture price, executive desks Nepal, study desk designs, office table Nepal, bishwokarma",
  },
  "modular-kitchens": {
    label: "Modern Modular Kitchen Design & Cabinets",
    desc: "Premium modular kitchen designs and custom kitchen cabinet installation in Nepal. U-shaped, L-shaped, parallel, and island kitchen layouts termite-proofed with free consultation.",
    keywords: "modular kitchen Nepal, kitchen cabinet price Kathmandu, modern kitchen design Nepal, kitchen cabinet installation, modular kitchen design price",
  },
  bathroom: {
    label: "Premium Bathroom Vanity Sets & Furniture",
    desc: "Premium bathroom vanity sets, LED touch mirrors, moisture-proof storage cabinets & modern bath accessories. High-end bathroom furniture in Kathmandu & Nepal.",
    keywords: "bathroom vanity Nepal, bathroom mirror Kathmandu, bathroom furniture Nepal, vanity cabinet Kathmandu",
  },
  lightings: {
    label: "Grand Chandeliers & Luxury Home Lightings",
    desc: "Grand crystal chandeliers, decorative table lamps, floor lamps, wall sconces & modern ceiling light fixtures. Elevate your home interiors with premium lighting in Nepal.",
    keywords: "chandelier Nepal, decorative lights Kathmandu, ceiling light Nepal, table lamp, luxury home lights, lighting showroom Nepal",
  },
  decor: {
    label: "Premium Home Décor & Handwoven Rugs",
    desc: "Handcrafted canvas wall art, luxury handwoven rugs, ceramic vases, cushions & decorative home accents. Elevate your space with premium home decor in Nepal.",
    keywords: "home decor Nepal, wall art Kathmandu, rugs Nepal, decorative vase, interior decoration items Nepal",
  },
  outdoor: {
    label: "Teak Garden Swings & Outdoor Furniture",
    desc: "Weather-proof teak garden swings, patio chairs, outdoor dining sets & planters. Premium outdoor furniture handcrafted to withstand Nepal's climate.",
    keywords: "garden furniture Nepal, outdoor chair Kathmandu, patio furniture Nepal, teak garden swing price, outdoor furniture showroom",
  },
  "all-products": {
    label: "Premium Furniture Catalogue & Collections",
    desc: "Browse our complete catalog of premium handcrafted wooden furniture in Nepal — sofas, beds, dining sets, modular kitchens, wardrobes & office chairs at best prices.",
    keywords: "furniture Nepal, buy furniture online Nepal, wooden furniture store Kathmandu, premium home furniture",
  },
  offers: {
    label: "Exclusive Furniture Sales, Offers & Deals",
    desc: "Get exclusive discounts on premium handcrafted furniture. Special seasonal sales, clearance packages & custom bundle deals. Save big on sofas, beds & dining tables in Nepal.",
    keywords: "furniture sale Nepal, furniture discount Kathmandu, cheap furniture Nepal, buy furniture sale Kathmandu",
  },
};

export async function generateMetadata({ params }) {
  const slug = (await params).category;
  const meta = CATEGORY_META[slug] || {
    label: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    desc: `Shop premium ${slug.replace(/-/g, " ")} furniture in Nepal. Handcrafted with solid wood. Free delivery to Kathmandu, Lalitpur, Pokhara.`,
    keywords: `${slug.replace(/-/g, " ")} furniture Nepal`,
  };

  return {
    title: `${meta.label} | Sindureghari Furniture Nepal`,
    description: meta.desc,
    keywords: meta.keywords,
    alternates: {
      canonical: `${SITE_URL}/category/${slug}`,
    },
    openGraph: {
      title: `${meta.label} | Sindureghari Furniture Nepal`,
      description: meta.desc,
      url: `${SITE_URL}/category/${slug}`,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  };
}

export default async function Page({ params }) {
  const slug = (await params).category;
  const meta = CATEGORY_META[slug] || {
    label: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  };

  // BreadcrumbList JSON-LD — Shows "Sindureghari Furniture > Category" in Google
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
        name: "Furniture",
        item: `${SITE_URL}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: meta.label,
        item: `${SITE_URL}/category/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CategoryPage />
    </>
  );
}
