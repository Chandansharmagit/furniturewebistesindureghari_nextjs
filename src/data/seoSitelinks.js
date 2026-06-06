import { SITE_URL, prioritySitelinks } from "./enterpriseSeo";

export { SITE_URL };

export const seoSitelinks = [
  ...prioritySitelinks.map((item, index) => ({
    name: item.name,
    path: item.path,
    description: item.metaDescription,
    priority: Math.max(0.88, 0.98 - index * 0.02),
  })),
  {
    name: "All Furniture Products",
    path: "/products",
    description: "Browse sofas, beds, dining tables, wardrobes, lighting and office furniture online in Nepal.",
    priority: 0.96,
  },
  {
    name: "Office Furniture",
    path: "/office-furniture-nepal",
    description: "Study tables, office chairs, executive desks and storage for workspaces.",
    priority: 0.9,
  },
  {
    name: "Special Offers",
    path: "/special-offers-all",
    description: "Current furniture deals, seasonal offers, coupons and discounted collections.",
    priority: 0.9,
  },
  {
    name: "New Products",
    path: "/new-products",
    description: "Latest handcrafted furniture arrivals from Sindureghari Furniture Nepal.",
    priority: 0.88,
  },
  {
    name: "Furniture Showrooms",
    path: "/stores",
    description: "Visit Sindureghari Furniture showroom and find store location, hours and contact details.",
    priority: 0.86,
  },
  {
    name: "Track Order",
    path: "/orders",
    description: "Track your Sindureghari Furniture order status and delivery progress.",
    priority: 0.74,
  },
  {
    name: "Help Center",
    path: "/help-and-support",
    description: "Get help with delivery, EMI, warranty, custom furniture and customer support.",
    priority: 0.72,
  },
  {
    name: "Contact",
    path: "/contact",
    description: "Call, message or visit Sindureghari Furniture for sales and support.",
    priority: 0.72,
  },
];

export const getSeoSitelinkUrl = (path) => `${SITE_URL}${path}`;
