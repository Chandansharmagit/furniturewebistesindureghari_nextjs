import CategoryPage from '@/pages/CategoryPage';
import CategoryAuthorityContent, { getCategorySchema } from '@/component/seo/CategoryAuthorityContent';
import { findEnterpriseCategory } from '@/data/enterpriseSeo';
import { cache } from 'react';

const SITE_URL = "https://sinduregharifurniture.shop";
const API_URL =
  process.env.NEXT_PUBLIC_DEV_API_URL ||
  process.env.REACT_APP_PROD_API_URL ||
  "https://furnituresinduregharibackend.vercel.app";

const fetchCategorySeo = cache(async (slug) => {
  try {
    const res = await fetch(`${API_URL}/api/categories/slug/${slug}`, {
      next: { revalidate: 1800 }
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.error("Error fetching category seo", err);
  }
  return null;
});

const CATEGORY_META = {
  "living-room": { label: "Living Room Furniture" },
  "bedroom": { label: "Bedroom Furniture" },
  "dining-room": { label: "Dining Room Furniture" },
  "office-and-study": { label: "Office & Study Furniture" },
  "modular-kitchens": { label: "Modular Kitchens" },
  "bathroom": { label: "Bathroom Furniture" },
  "lightings": { label: "Lightings" },
  "decor": { label: "Decor" },
  "outdoor": { label: "Outdoor" },
  "all-products": { label: "All Products" },
  "offers": { label: "Special Offers" }
};

const SUBCATEGORY_META = {
  // Living Room Subcategories
  sofas: {
    label: "Best Sofa Sets, L-Shape & Wooden Sofa Designs",
    desc: "Shop premium sofa sets and luxury couch designs in Nepal, including L-shape sofas, wooden sofa designs and modular sofa sets.",
  },
  recliners: {
    label: "Luxury Recliner Sofa Chairs & Single Seaters",
    desc: "Buy luxury recliner sofa chairs and ergonomic single-seaters in Nepal. Power recliners and manual reclining chairs in premium leatherette and fabric.",
  },
  "coffee-tables": {
    label: "Premium Wooden Coffee Tables & Center Tables",
    desc: "Shop premium wooden coffee tables and center designs in Nepal. Handcrafted solid teak wood coffee tables with glass tops and storage options.",
  },
  "tv-units": {
    label: "Modern TV Cabinets & TV Wall Unit Designs",
    desc: "Buy modern TV cabinets, TV consoles, and elegant TV wall unit designs in Nepal. Made with seasoned solid wood to suit your designer living room.",
  },
  "living-chairs": {
    label: "Designer Living Room Chairs & Lounge Chairs",
    desc: "Premium living room chairs, wingback chairs, accent lounge chairs, and wooden armchairs in Nepal. Enhance your interior layout with designer seating.",
  },
  "living-storage": {
    label: "Solid Wood Shoe Racks, Bookshelves & Cabinets",
    desc: "Premium living room storage solutions in Nepal. Handcrafted solid wood shoe racks, designer bookshelves, display cabinets & sideboards.",
  },
  
  // Bedroom Subcategories
  beds: {
    label: "Solid Wood Beds, King & Queen Size Bed Designs",
    desc: "Explore solid wood beds and the best king & queen size bed designs in Nepal. Handcrafted in teak & sheesham wood with built-in storage boxes.",
  },
  wardrobes: {
    label: "Luxury Wooden Wardrobes & Almirahs",
    desc: "Premium solid wood wardrobes and luxury bedroom almirahs in Nepal. Custom 2, 3, and 4-door wardrobe designs with spacious modular layouts.",
  },
  "dressing-tables": {
    label: "Designer Dressing Tables & Vanity Mirrors",
    desc: "Buy designer dressing tables with LED vanity mirrors and solid wood drawers in Nepal. Premium handcrafted bedroom dressing tables.",
  },
  "bedside-tables": {
    label: "Solid Wood Bedside Tables & Nightstands",
    desc: "Premium solid wood bedside tables and nightstands in Nepal. Handcrafted sheesham & teak wood small drawers to match your luxury bed.",
  },
  mattresses: {
    label: "Orthopedic Mattresses & Memory Foam Beds",
    desc: "Buy orthopedic mattresses, memory foam beds, and premium pocket spring mattresses online in Nepal. High comfort sleeping solutions.",
  },
  "study-tables": {
    label: "Designer Study Tables & Writing Desks",
    desc: "Premium solid wood study tables, home writing desks, and computer tables in Nepal. Ergonomic layouts with drawer storage.",
  },
  
  // Dining Room Subcategories
  "dining-sets": {
    label: "Best Dining Table Sets & Luxury Dining Room Designs",
    desc: "Discover premium dining table sets and dining room designs in Nepal, including 4, 6 and 8-seater dining table sets in solid wood.",
  },
  "dining-tables": {
    label: "Solid Wood Dining Tables & Luxury Dining Room Designs",
    desc: "Buy solid wood dining tables handcrafted in premium teak wood and rosewood. Elegant dining room furniture design in Nepal with factory-direct warranty.",
  },
  "dining-chairs": {
    label: "Premium Wooden Dining Chairs & Cushioned Seats",
    desc: "Shop premium wooden dining chairs and luxury cushioned dining seats in Nepal. Crafted in seasoned solid wood with premium fabric options.",
  },
  "dining-benches": {
    label: "Modern Dining Benches & Long Seats",
    desc: "Buy modern dining benches and handcrafted wooden dining table long seats in Nepal. Add a stylish touch to your dining room layouts.",
  },
  "kitchen-accessories": {
    label: "Luxury Wooden Crockery Units & Bar Cabinets",
    desc: "Premium solid wood crockery units, luxury glass display cabinets, and bar cabinets in Nepal. Handcrafted dining room storage accessories.",
  },
  
  // Office Subcategories
  "office-chairs": {
    label: "Ergonomic Office Chairs & Executive Seating",
    desc: "Buy ergonomic office chairs, executive high-back mesh chairs, and task seats in Nepal. High lumbar support designed for long working hours.",
  },
  "office-tables": {
    label: "Executive Desks & Modular Office Table Designs",
    desc: "Premium executive desks, modular office tables, study desks & workstation designs in Nepal. Handcrafted solid wood and engineered wood designs.",
  },
  "storage-solutions": {
    label: "Office Bookcases, Filing Cabinets & Pedestals",
    desc: "Shop heavy-duty office bookcases, filing cabinets, key drawers, and mobile pedestals in Nepal. Organize your workspace files efficiently.",
  },
  "reception-furniture": {
    label: "Modern Reception Desks & Lounge Furniture",
    desc: "Designer reception desks, lobby counters, and office waiting area sofas in Nepal. Create an outstanding first impression for your corporate space.",
  },
  "conference-tables": {
    label: "Executive Conference Tables & Boardroom Tables",
    desc: "Executive conference tables and luxury boardroom meeting tables in Nepal. Premium solid wood modular designs from 6-seater up to 24-seater.",
  },

  // Modular Kitchens Subcategories
  "l-shaped": {
    label: "L-Shaped Modular Kitchen Layouts & Designs",
    desc: "Elegant L-shaped modular kitchen layouts and cabinets in Nepal. Space-saving designs customized for Nepalese homes. Heavy-duty hardware included.",
  },
  "u-shaped": {
    label: "U-Shaped Modular Kitchen Cabinets & Designs",
    desc: "Luxury U-shaped modular kitchen designs and modular drawers in Nepal. Maximize cooking productivity with premium custom storage.",
  },
  "parallel": {
    label: "Parallel Modular Kitchen & Galley Layouts",
    desc: "Explore parallel modular kitchen and galley layout designs in Nepal. Dual counter spaces for high-efficiency cooking spaces.",
  },
  "island": {
    label: "Island Modular Kitchen Designs & Breakfast Counters",
    desc: "Luxury island modular kitchen designs and breakfast counter setups in Nepal. Handcrafted with heavy timber and engineered granite countertops.",
  },
  "kitchen-acc": {
    label: "Premium Kitchen Cabinet Fittings & Drawers",
    desc: "Durable kitchen cabinet fittings, pull-out wire baskets, tandem boxes & corner mechanisms in Nepal. Termite-proof, heavy-duty accessories.",
  },

  // Bathroom Subcategories
  "vanity-units": {
    label: "Luxury Bathroom Vanity Cabinets & Washbasins",
    desc: "Luxury bathroom vanity cabinets, integrated ceramic washbasins, and storage units in Nepal. Moisture-proof, designer bathroom units.",
  },
  "bathroom-cabinets": {
    label: "Moisture-Proof Bathroom Storage Cabinets",
    desc: "Moisture-proof bathroom storage cabinets, wall cabinets, and under-sink storage in Nepal. Keep your bath space organized and beautiful.",
  },
  "bathroom-mirrors": {
    label: "LED Touch Mirrors & Smart Bathroom Mirrors",
    desc: "Smart LED touch mirrors, anti-fog bathroom mirrors, and decorative vanity mirrors in Nepal. Elegant ambient lighting for premium bathrooms.",
  },
  "bathroom-storage": {
    label: "Bathroom Storage Baskets & Corner Racks",
    desc: "Buy premium bathroom storage baskets, stainless steel corner racks, and wall organizers in Nepal. High durability rust-proof bath accessories.",
  },
  "bathroom-accessories": {
    label: "Modern Chrome Bathroom Fittings & Towel Rails",
    desc: "Premium chrome bathroom fittings, towel rails, soap dispensers, and luxury fixtures in Nepal. Durable anti-corrosive brass bath hardware.",
  }
};

export async function generateMetadata({ params }) {
  const { category, subcategory } = await params;
  const enterpriseMeta = findEnterpriseCategory(category, subcategory);
  const dbCategory = await fetchCategorySeo(subcategory);
  
  const subMeta = SUBCATEGORY_META[subcategory];
  const catMeta = CATEGORY_META[category] || {
    label: category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  };
  
  let label = "";
  let desc = "";
  
  if (subMeta) {
    label = `${subMeta.label} — ${catMeta.label}`;
    desc = subMeta.desc;
  } else {
    const parsedSub = subcategory.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const parsedCat = category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    label = `Premium ${parsedSub} — ${parsedCat} Collection`;
    desc = `Explore premium ${parsedSub} in the ${parsedCat} collection from Sindureghari Furniture Nepal, with design support and delivery coordination.`;
  }
  
  const title = dbCategory?.seo_title || enterpriseMeta?.title || `${dbCategory?.name || label} | Sindureghari Furniture Nepal`;
  const description = dbCategory?.seo_description || enterpriseMeta?.metaDescription || desc;
  
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}${enterpriseMeta?.path || `/category/${category}/${subcategory}`}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${enterpriseMeta?.path || `/category/${category}/${subcategory}`}`,
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
  const { category, subcategory } = await params;
  const enterpriseMeta = findEnterpriseCategory(category, subcategory);
  const dbCategory = await fetchCategorySeo(subcategory);
  const parent = enterpriseMeta?.parent;

  const subMeta = SUBCATEGORY_META[subcategory];
  const catMeta = CATEGORY_META[category] || {
    label: category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  };
  
  let label = "";
  if (subMeta) {
    label = `${subMeta.label} — ${catMeta.label}`;
  } else {
    const parsedSub = subcategory.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const parsedCat = category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    label = `Premium ${parsedSub} — ${parsedCat} Collection`;
  }

  const name = dbCategory?.name || enterpriseMeta?.name || label;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Furniture", item: `${SITE_URL}/products` },
      parent && {
        "@type": "ListItem",
        position: 3,
        name: parent.name,
        item: `${SITE_URL}${parent.path}`
      },
      {
        "@type": "ListItem",
        position: parent ? 4 : 3,
        name: name,
        item: `${SITE_URL}${enterpriseMeta?.path || `/category/${category}/${subcategory}`}`
      }
    ].filter(Boolean)
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
      <CategoryAuthorityContent category={enterpriseMeta || parent} />
    </>
  );
}
