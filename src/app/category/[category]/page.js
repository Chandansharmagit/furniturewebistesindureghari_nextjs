import CategoryPage from '@/pages/CategoryPage';

const SITE_URL = "https://sinduregharifurniture.shop";

/* Human-friendly category labels & SEO descriptions */
const CATEGORY_META = {
  "living-room": {
    label: "Living Room Furniture",
    desc: "Shop premium living room furniture in Nepal — royal sofa sets, L-shape sofas, coffee tables, TV cabinets & recliners. Handcrafted in teak & rosewood. Free delivery Kathmandu.",
    keywords: "sofa set Nepal, L-shape sofa price in Nepal, living room furniture Kathmandu, coffee table Nepal",
  },
  bedroom: {
    label: "Bedroom Furniture",
    desc: "Buy king size beds, queen beds, luxury wardrobes, dressing tables & bedside tables online. Solid wood bedroom furniture with free delivery across Nepal.",
    keywords: "king size bed Kathmandu, wooden bed Nepal, wardrobe price Nepal, bedroom furniture Nepal",
  },
  "dining-room": {
    label: "Dining Room Furniture",
    desc: "Discover handcrafted 4, 6 & 8-seater dining table sets, dining chairs, crockery units & bar cabinets. Premium wooden dining furniture delivered free in Nepal.",
    keywords: "dining table Nepal, 6 seater dining table price, wooden dining set Kathmandu",
  },
  "office-and-study": {
    label: "Office & Study Furniture",
    desc: "Shop executive desks, ergonomic office chairs, bookshelves & filing cabinets. Durable office furniture for home & commercial spaces in Nepal.",
    keywords: "office chair Nepal, study table Kathmandu, office furniture price Nepal, executive desk",
  },
  "modular-kitchens": {
    label: "Modular Kitchen Design",
    desc: "Custom modular kitchen cabinets, pantry units, granite counters & kitchen accessories. Professional kitchen design & installation in Kathmandu, Lalitpur & across Nepal.",
    keywords: "modular kitchen Nepal, kitchen cabinet price Kathmandu, kitchen design Nepal",
  },
  bathroom: {
    label: "Bathroom Furniture",
    desc: "Premium bathroom vanity sets, LED mirrors, moisture-proof cabinets & bath accessories. Modern bathroom furniture in Nepal.",
    keywords: "bathroom vanity Nepal, bathroom mirror Kathmandu, bathroom furniture Nepal",
  },
  lightings: {
    label: "Lighting & Chandeliers",
    desc: "Grand chandeliers, decorative table lamps, floor lamps, wall sconces & ceiling light fixtures for premium home interiors in Nepal.",
    keywords: "chandelier Nepal, decorative lights Kathmandu, ceiling light Nepal, table lamp",
  },
  decor: {
    label: "Home Décor & Accessories",
    desc: "Canvas wall art, handwoven rugs, ceramic vases, cushions & decorative home accents. Elevate your interiors with premium décor from Nepal.",
    keywords: "home decor Nepal, wall art Kathmandu, rugs Nepal, decorative vase",
  },
  outdoor: {
    label: "Outdoor & Garden Furniture",
    desc: "Weather-resistant garden chairs, teak porch swings, planters & outdoor storage. Premium patio furniture made for Nepal's climate.",
    keywords: "garden furniture Nepal, outdoor chair Kathmandu, patio furniture Nepal",
  },
  "all-products": {
    label: "All Furniture Products",
    desc: "Browse our complete furniture catalogue — sofas, beds, dining tables, wardrobes, office chairs, kitchen fittings & more. Best prices in Nepal.",
    keywords: "furniture Nepal, all furniture, buy furniture online Nepal",
  },
  offers: {
    label: "Special Offers & Deals",
    desc: "Exclusive discounts on premium handcrafted furniture. Seasonal sales, clearance deals & special bundle offers. Save big on sofas, beds & dining sets in Nepal.",
    keywords: "furniture sale Nepal, furniture discount Kathmandu, cheap furniture Nepal",
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
    title: `${meta.label} — Buy Online Nepal`,
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

export default function Page() {
  return <CategoryPage />;
}
