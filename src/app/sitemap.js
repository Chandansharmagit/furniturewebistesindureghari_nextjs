/**
 * Dynamic Sitemap Generator — Next.js App Router
 * Fetches all products from the API and combines with static routes.
 * Access at: /sitemap.xml
 */

const SITE_URL = "https://sinduregharifurniture.shop";
const API_URL = process.env.NEXT_PUBLIC_PROD_API_URL || "https://furnituresinduregharibackend.vercel.app";

const STATIC_PAGES = [
  { loc: "/", priority: 1.0, changefreq: "daily" },
  { loc: "/sofas", priority: 0.95, changefreq: "daily" },
  { loc: "/beds", priority: 0.95, changefreq: "daily" },
  { loc: "/dining-tables", priority: 0.95, changefreq: "daily" },
  { loc: "/wardrobes", priority: 0.95, changefreq: "daily" },
  { loc: "/living-room-furniture", priority: 0.95, changefreq: "daily" },
  { loc: "/office-furniture", priority: 0.95, changefreq: "daily" },
  { loc: "/lighting", priority: 0.95, changefreq: "daily" },
  { loc: "/products", priority: 0.9, changefreq: "daily" },
  { loc: "/new-products", priority: 0.8, changefreq: "daily" },
  { loc: "/home-appliances", priority: 0.8, changefreq: "weekly" },
  { loc: "/special-offers-all", priority: 0.8, changefreq: "daily" },
  { loc: "/blog", priority: 0.7, changefreq: "weekly" },
  { loc: "/contact", priority: 0.7, changefreq: "monthly" },
  { loc: "/stores", priority: 0.7, changefreq: "monthly" },
  { loc: "/ceo", priority: 0.6, changefreq: "monthly" },
  { loc: "/help-and-support", priority: 0.6, changefreq: "monthly" },
  { loc: "/careers", priority: 0.5, changefreq: "monthly" },
  { loc: "/search", priority: 0.5, changefreq: "weekly" },
  { loc: "/privacy-policy", priority: 0.3, changefreq: "yearly" },
  { loc: "/terms-conditions", priority: 0.3, changefreq: "yearly" },
];

const CATEGORY_PAGES = [
  "living-room", "bedroom", "dining-room", "office-and-study",
  "modular-kitchens", "bathroom", "lightings", "decor",
  "outdoor", "all-products", "offers",
];

const SUB_CATEGORIES = {
  "living-room": ["sofa-sets", "coffee-tables", "tv-cabinets", "recliners", "showcases"],
  "bedroom": ["beds", "wardrobes", "bedside-tables", "dressing-tables", "mattresses"],
  "dining-room": ["dining-sets", "dining-chairs", "crockery-units", "bar-cabinets"],
  "office-and-study": ["desks", "chairs", "bookshelves", "storage"],
  "modular-kitchens": ["cabinets", "pantry", "counters", "accessories"],
  "bathroom": ["vanities", "mirrors", "cabinets"],
  "lightings": ["chandeliers", "lamps", "wall-sconces", "ceiling"],
  "decor": ["wall-art", "rugs", "vases"],
  "outdoor": ["garden-sets", "swings", "planters"],
};

export default async function sitemap() {
  const today = new Date().toISOString().split("T")[0];

  // 1. Static pages
  const staticEntries = STATIC_PAGES.map((page) => ({
    url: `${SITE_URL}${page.loc}`,
    lastModified: today,
    changeFrequency: page.changefreq,
    priority: page.priority,
  }));

  // 2. Category pages
  const categoryEntries = CATEGORY_PAGES.map((cat) => ({
    url: `${SITE_URL}/category/${cat}`,
    lastModified: today,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // 3. Sub-category pages
  const subCategoryEntries = [];
  for (const [cat, subs] of Object.entries(SUB_CATEGORIES)) {
    for (const sub of subs) {
      subCategoryEntries.push({
        url: `${SITE_URL}/category/${cat}/${sub}`,
        lastModified: today,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  // 3.5 Programmatic SEO pages (Keywords)
  const seoKeywords = [
    "sofas",
    "sofa-sets",
    "beds",
    "wardrobes",
    "dining-sets",
    "dining-tables",
    "dining-chairs",
    "dressing-tables",
    "study-tables",
    "office-chairs",
    "office-tables",
    "tv-units",
    "coffee-tables",
    "mattresses",
    "modular-kitchens",
    "shoe-racks",
    "computer-tables",
    "wooden-beds",
    "cupboards"
  ];

  const seoEntries = seoKeywords.map((keyword) => ({
    url: `${SITE_URL}/best-${keyword}-nepal`,
    lastModified: today,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 4. Dynamic product pages from API
  let productEntries = [];
  try {
    const res = await fetch(`${API_URL}/products`, {
      next: { revalidate: 86400 }, // Revalidate daily
    });
    if (res.ok) {
      const data = await res.json();
      const products = Array.isArray(data) ? data : data.products || [];
      productEntries = products
        .filter((p) => p && (p._id || p.id))
        .map((product) => ({
          url: `${SITE_URL}/product/${product._id || product.id}`,
          lastModified: product.updated_at
            ? new Date(product.updated_at).toISOString().split("T")[0]
            : today,
          changeFrequency: "weekly",
          priority: 0.8,
        }));
    }
  } catch (error) {
    console.error("Sitemap: Failed to fetch products from API:", error.message);
  }

  return [
    ...staticEntries,
    ...categoryEntries,
    ...subCategoryEntries,
    ...seoEntries,
    ...productEntries,
  ];
}
