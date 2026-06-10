import CategoryPage from '@/pages/CategoryPage';
import CategoryAuthorityContent, { getCategorySchema } from '@/component/seo/CategoryAuthorityContent';
import { findEnterpriseCategory } from '@/data/enterpriseSeo';

const SITE_URL = "https://sinduregharifurniture.shop";

/* Human-friendly category labels & SEO descriptions */
const CATEGORY_META = {
  "living-room": {
    label: "Best Sofa Sets & Living Room Furniture Design",
    desc: "Shop premium sofa sets and luxury living room furniture designs in Nepal, including solid wood sofas, L-shape sofas, coffee tables and recliners.",
  },
  bedroom: {
    label: "Solid Wood Beds & Bedroom Furniture Design",
    desc: "Buy solid wood beds and elegant bedroom furniture designs in Nepal, including king size beds, wardrobes, dressing tables and bedside tables.",
  },
  "dining-room": {
    label: "Best Dining Table Sets & Dining Room Furniture Design",
    desc: "Shop premium dining room furniture designs in Nepal, including handcrafted 4, 6 and 8-seater solid wood dining tables and chairs.",
  },
  "office-and-study": {
    label: "Ergonomic Office Chairs & Study Table Designs",
    desc: "Shop premium office furniture in Nepal. Discover ergonomic office chairs, solid wood study tables, executive desks, and storage cabinet designs for modern workspaces.",
  },
  "modular-kitchens": {
    label: "Modern Modular Kitchen Design & Cabinets",
    desc: "Premium modular kitchen designs and custom kitchen cabinet installation in Nepal, including U-shaped, L-shaped, parallel and island kitchen layouts.",
  },
  bathroom: {
    label: "Premium Bathroom Vanity Sets & Furniture",
    desc: "Premium bathroom vanity sets, LED touch mirrors, moisture-proof storage cabinets & modern bath accessories. High-end bathroom furniture in Kathmandu & Nepal.",
  },
  lightings: {
    label: "Grand Chandeliers & Luxury Home Lightings",
    desc: "Grand crystal chandeliers, decorative table lamps, floor lamps, wall sconces & modern ceiling light fixtures. Elevate your home interiors with premium lighting in Nepal.",
  },
  decor: {
    label: "Premium Home Décor & Handwoven Rugs",
    desc: "Handcrafted canvas wall art, luxury handwoven rugs, ceramic vases, cushions & decorative home accents. Elevate your space with premium home decor in Nepal.",
  },
  outdoor: {
    label: "Teak Garden Swings & Outdoor Furniture",
    desc: "Weather-proof teak garden swings, patio chairs, outdoor dining sets & planters. Premium outdoor furniture handcrafted to withstand Nepal's climate.",
  },
  "all-products": {
    label: "Premium Furniture Catalogue & Collections",
    desc: "Browse our complete catalog of premium handcrafted wooden furniture in Nepal — sofas, beds, dining sets, modular kitchens, wardrobes & office chairs at best prices.",
  },
  offers: {
    label: "Exclusive Furniture Sales, Offers & Deals",
    desc: "Get exclusive discounts on premium handcrafted furniture. Special seasonal sales, clearance packages & custom bundle deals. Save big on sofas, beds & dining tables in Nepal.",
  },
};

export async function generateMetadata({ params }) {
  const slug = (await params).category;
  const enterpriseMeta = findEnterpriseCategory(slug);
  const meta = CATEGORY_META[slug] || {
    label: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    desc: `Explore premium ${slug.replace(/-/g, " ")} furniture from Sindureghari Furniture Nepal, with design support and delivery coordination for Nepali homes.`,
  };
  const title = enterpriseMeta?.title || `${meta.label} | Sindureghari Furniture Nepal`;
  const description = enterpriseMeta?.metaDescription || meta.desc;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}${enterpriseMeta?.path || `/category/${slug}`}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${enterpriseMeta?.path || `/category/${slug}`}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
  const enterpriseMeta = findEnterpriseCategory(slug);
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
        name: enterpriseMeta?.name || meta.label,
        item: `${SITE_URL}${enterpriseMeta?.path || `/category/${slug}`}`,
      },
    ],
  };
  const schema = enterpriseMeta ? [breadcrumbJsonLd, ...getCategorySchema(enterpriseMeta)] : [breadcrumbJsonLd];

  return (
    <>
      {schema.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
      <CategoryPage />
      <CategoryAuthorityContent category={enterpriseMeta} />
    </>
  );
}
