/**
 * Dynamic Sitemap Generator — Next.js App Router
 * Fetches all products from the API and combines with static routes.
 * Access at: /sitemap.xml
 */

import { seoSitelinks } from "@/data/seoSitelinks";

const SITE_URL = "https://sinduregharifurniture.shop";
const API_URL = process.env.NEXT_PUBLIC_PROD_API_URL || "https://furnituresinduregharibackend.vercel.app";

const SEO_MONEY_PAGES = [
  "/sofa-set-price-nepal",
  "/wooden-bed-nepal",
  "/wardrobe-price-nepal",
  "/dining-table-nepal",
  "/office-furniture-nepal",
  "/wooden-furniture-nepal",
  "/custom-furniture-nepal",
  "/sofa-set-nepal",
  "/wooden-bed-design-nepal",
  "/furniture-price-guide-nepal-2026",
];

const CITY_PAGES = [
  "/furniture-shop-kathmandu",
  "/furniture-shop-lalitpur",
  "/furniture-shop-bhaktapur",
  "/furniture-shop-pokhara",
  "/furniture-shop-butwal",
  "/furniture-shop-chitwan",
  "/furniture-shop-biratnagar",
];

const STATIC_PAGES = [
  { loc: "/", priority: 1.0, changefreq: "daily" },
  { loc: "/blog", priority: 0.7, changefreq: "weekly" },
  { loc: "/ceo", priority: 0.6, changefreq: "monthly" },
  { loc: "/careers", priority: 0.5, changefreq: "monthly" },
  { loc: "/search", priority: 0.5, changefreq: "weekly" },
  { loc: "/privacy-policy", priority: 0.3, changefreq: "yearly" },
  { loc: "/terms-conditions", priority: 0.3, changefreq: "yearly" },
  ...seoSitelinks.map((item) => ({
    loc: item.path,
    priority: item.priority,
    changefreq: item.path === "/products" || item.path === "/special-offers-all" || item.path === "/new-products"
      ? "daily"
      : "weekly",
  })),
  ...SEO_MONEY_PAGES.map((loc) => ({ loc, priority: 0.92, changefreq: "weekly" })),
  ...CITY_PAGES.map((loc) => ({ loc, priority: 0.86, changefreq: "weekly" })),
];

const flattenCategories = (categories = [], parent = null, list = []) => {
  categories.forEach((category) => {
    const item = {
      ...category,
      parent,
      slug: category.slug || String(category.name || "")
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    };
    list.push(item);
    if (Array.isArray(category.children)) {
      flattenCategories(category.children, item, list);
    }
  });
  return list;
};

const uniqueSitemapEntries = (entries) => {
  const seen = new Map();
  entries.forEach((entry) => {
    if (!seen.has(entry.url)) {
      seen.set(entry.url, entry);
      return;
    }

    const existing = seen.get(entry.url);
    seen.set(entry.url, {
      ...existing,
      priority: Math.max(existing.priority || 0, entry.priority || 0),
    });
  });
  return Array.from(seen.values());
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

  // 2. Dynamic category pages from Admin taxonomy
  let categoryEntries = [];
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      next: { revalidate: 1800 },
    });
    if (res.ok) {
      const categoryTree = await res.json();
      categoryEntries = flattenCategories(Array.isArray(categoryTree) ? categoryTree : [])
        .filter((category) => category.status !== "inactive")
        .map((category) => ({
          url: `${SITE_URL}${category.parent ? `/category/${category.parent.slug}/${category.slug}` : `/category/${category.slug}`}`,
          lastModified: category.updated_at
            ? new Date(category.updated_at).toISOString().split("T")[0]
            : today,
          changeFrequency: "weekly",
          priority: category.parent ? 0.75 : 0.9,
        }));
    }
  } catch (error) {
    console.error("Sitemap: Failed to fetch categories from API:", error.message);
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
    let res = await fetch(`${API_URL}/api/products`, {
      next: { revalidate: 86400 }, // Revalidate daily
    });
    if (!res.ok) {
      res = await fetch(`${API_URL}/products`, {
        next: { revalidate: 86400 },
      });
    }
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

      const productSlugEntries = products
        .filter((p) => p && (p._id || p.id) && (p.name || p.title))
        .map((product) => {
          const productName = product.name || product.title || "furniture";
          const slug = productName
            .toString()
            .toLowerCase()
            .replace(/&/g, " and ")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 80);
          return {
            url: `${SITE_URL}/product/${product._id || product.id}/${slug}-price-in-nepal`,
            lastModified: product.updated_at
              ? new Date(product.updated_at).toISOString().split("T")[0]
              : today,
            changeFrequency: "weekly",
            priority: 0.82,
          };
        });

      productEntries.push(...productSlugEntries);
    }
  } catch (error) {
    console.error("Sitemap: Failed to fetch products from API:", error.message);
  }

  return uniqueSitemapEntries([
    ...staticEntries,
    ...categoryEntries,
    ...seoEntries,
    ...productEntries,
  ]);
}
