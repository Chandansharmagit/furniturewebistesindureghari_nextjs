import CategoryPage from '@/pages/CategoryPage';

const SITE_URL = "https://sinduregharifurniture.shop";

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
    desc: "Shop best sofa sets and luxury couch designs in Nepal. Discover L-shape sofas, wooden sofa designs, and modular sofa sets handcrafted in premium teak wood with free delivery.",
    keywords: "best sofa set Nepal, wooden sofa design, L-shape sofa price in Nepal, modern sofas Kathmandu, teak wood sofa"
  },
  recliners: {
    label: "Luxury Recliner Sofa Chairs & Single Seaters",
    desc: "Buy luxury recliner sofa chairs and ergonomic single-seaters in Nepal. Power recliners and manual reclining chairs in premium leatherette and fabric.",
    keywords: "recliner price in Nepal, single seater recliner, buy recliner Kathmandu, modern recliner chair"
  },
  "coffee-tables": {
    label: "Premium Wooden Coffee Tables & Center Tables",
    desc: "Shop premium wooden coffee tables and center designs in Nepal. Handcrafted solid teak wood coffee tables with glass tops and storage options.",
    keywords: "coffee table Nepal, center table price Kathmandu, wooden coffee table design"
  },
  "tv-units": {
    label: "Modern TV Cabinets & TV Wall Unit Designs",
    desc: "Buy modern TV cabinets, TV consoles, and elegant TV wall unit designs in Nepal. Made with seasoned solid wood to suit your designer living room.",
    keywords: "tv cabinet Nepal, tv unit design Kathmandu, wooden tv stand, modern tv wall design"
  },
  "living-chairs": {
    label: "Designer Living Room Chairs & Lounge Chairs",
    desc: "Premium living room chairs, wingback chairs, accent lounge chairs, and wooden armchairs in Nepal. Enhance your interior layout with designer seating.",
    keywords: "accent chair Kathmandu, lounge chair price Nepal, wooden living chairs, wingback chair"
  },
  "living-storage": {
    label: "Solid Wood Shoe Racks, Bookshelves & Cabinets",
    desc: "Premium living room storage solutions in Nepal. Handcrafted solid wood shoe racks, designer bookshelves, display cabinets & sideboards.",
    keywords: "shoe rack Kathmandu, bookshelf price Nepal, wooden cabinet design, display console"
  },
  
  // Bedroom Subcategories
  beds: {
    label: "Solid Wood Beds, King & Queen Size Bed Designs",
    desc: "Explore solid wood beds and the best king & queen size bed designs in Nepal. Handcrafted in teak & sheesham wood with built-in storage boxes.",
    keywords: "wooden bed design Nepal, king size bed Kathmandu, luxury bed price Nepal, bed showroom, double bed design"
  },
  wardrobes: {
    label: "Luxury Wooden Wardrobes & Almirahs",
    desc: "Premium solid wood wardrobes and luxury bedroom almirahs in Nepal. Custom 2, 3, and 4-door wardrobe designs with spacious modular layouts.",
    keywords: "wardrobe price Nepal, almirah design Kathmandu, wooden wardrobe 3 door"
  },
  "dressing-tables": {
    label: "Designer Dressing Tables & Vanity Mirrors",
    desc: "Buy designer dressing tables with LED vanity mirrors and solid wood drawers in Nepal. Premium handcrafted bedroom dressing tables.",
    keywords: "dressing table price Nepal, luxury dressing table design, bedroom vanity mirror"
  },
  "bedside-tables": {
    label: "Solid Wood Bedside Tables & Nightstands",
    desc: "Premium solid wood bedside tables and nightstands in Nepal. Handcrafted sheesham & teak wood small drawers to match your luxury bed.",
    keywords: "bedside table Kathmandu, nightstand price Nepal, wooden bedside drawer"
  },
  mattresses: {
    label: "Orthopedic Mattresses & Memory Foam Beds",
    desc: "Buy orthopedic mattresses, memory foam beds, and premium pocket spring mattresses online in Nepal. High comfort sleeping solutions.",
    keywords: "orthopedic mattress price Nepal, spring mattress Kathmandu, memory foam mattress"
  },
  "study-tables": {
    label: "Designer Study Tables & Writing Desks",
    desc: "Premium solid wood study tables, home writing desks, and computer tables in Nepal. Ergonomic layouts with drawer storage.",
    keywords: "study table Kathmandu, computer table price Nepal, wooden writing desk"
  },
  
  // Dining Room Subcategories
  "dining-sets": {
    label: "Best Dining Table Sets & Luxury Dining Room Designs",
    desc: "Discover the best dining table sets and dining room designs in Nepal. Shop premium 4, 6 & 8-seater dining table sets in solid wood with free delivery.",
    keywords: "best dining table sets Nepal, wooden dining set price, luxury dining table design Kathmandu, 6 seater dining table"
  },
  "dining-tables": {
    label: "Solid Wood Dining Tables & Luxury Dining Room Designs",
    desc: "Buy solid wood dining tables handcrafted in premium teak wood and rosewood. Elegant dining room furniture design in Nepal with factory-direct warranty.",
    keywords: "dining room furniture design, wooden dining table Nepal, dining table design, luxury teak table"
  },
  "dining-chairs": {
    label: "Premium Wooden Dining Chairs & Cushioned Seats",
    desc: "Shop premium wooden dining chairs and luxury cushioned dining seats in Nepal. Crafted in seasoned solid wood with premium fabric options.",
    keywords: "dining chair price Nepal, wooden dining chairs Kathmandu, cushioned dining seat"
  },
  "dining-benches": {
    label: "Modern Dining Benches & Long Seats",
    desc: "Buy modern dining benches and handcrafted wooden dining table long seats in Nepal. Add a stylish touch to your dining room layouts.",
    keywords: "dining bench Kathmandu, wooden table bench price, dining room bench Nepal"
  },
  "kitchen-accessories": {
    label: "Luxury Wooden Crockery Units & Bar Cabinets",
    desc: "Premium solid wood crockery units, luxury glass display cabinets, and bar cabinets in Nepal. Handcrafted dining room storage accessories.",
    keywords: "crockery unit price Nepal, bar cabinet Kathmandu, wooden display cabinet"
  },
  
  // Office Subcategories
  "office-chairs": {
    label: "Ergonomic Office Chairs & Executive Seating",
    desc: "Buy ergonomic office chairs, executive high-back mesh chairs, and task seats in Nepal. High lumbar support designed for long working hours.",
    keywords: "office chair Nepal, ergonomic chair price Kathmandu, executive chair Nepal"
  },
  "office-tables": {
    label: "Executive Desks & Modular Office Table Designs",
    desc: "Premium executive desks, modular office tables, study desks & workstation designs in Nepal. Handcrafted solid wood and engineered wood designs.",
    keywords: "executive office table Kathmandu, office desk price Nepal, study desk designs"
  },
  "storage-solutions": {
    label: "Office Bookcases, Filing Cabinets & Pedestals",
    desc: "Shop heavy-duty office bookcases, filing cabinets, key drawers, and mobile pedestals in Nepal. Organize your workspace files efficiently.",
    keywords: "filing cabinet Kathmandu, office bookshelf price, storage cabinet Nepal"
  },
  "reception-furniture": {
    label: "Modern Reception Desks & Lounge Furniture",
    desc: "Designer reception desks, lobby counters, and office waiting area sofas in Nepal. Create an outstanding first impression for your corporate space.",
    keywords: "reception table Kathmandu, office waiting sofa, reception desk price Nepal"
  },
  "conference-tables": {
    label: "Executive Conference Tables & Boardroom Tables",
    desc: "Executive conference tables and luxury boardroom meeting tables in Nepal. Premium solid wood modular designs from 6-seater up to 24-seater.",
    keywords: "conference table price Nepal, boardroom meeting table Kathmandu, wooden meeting table"
  },

  // Modular Kitchens Subcategories
  "l-shaped": {
    label: "L-Shaped Modular Kitchen Layouts & Designs",
    desc: "Elegant L-shaped modular kitchen layouts and cabinets in Nepal. Space-saving designs customized for Nepalese homes. Heavy-duty hardware included.",
    keywords: "l shaped modular kitchen Nepal, kitchen cabinets Kathmandu, modern kitchen design"
  },
  "u-shaped": {
    label: "U-Shaped Modular Kitchen Cabinets & Designs",
    desc: "Luxury U-shaped modular kitchen designs and modular drawers in Nepal. Maximize cooking productivity with premium custom storage.",
    keywords: "u shaped kitchen design price Nepal, modular kitchen showroom, luxury kitchen cabinet"
  },
  "parallel": {
    label: "Parallel Modular Kitchen & Galley Layouts",
    desc: "Explore parallel modular kitchen and galley layout designs in Nepal. Dual counter spaces for high-efficiency cooking spaces.",
    keywords: "parallel modular kitchen Kathmandu, galley kitchen cabinets Nepal, modern modular kitchen price"
  },
  "island": {
    label: "Island Modular Kitchen Designs & Breakfast Counters",
    desc: "Luxury island modular kitchen designs and breakfast counter setups in Nepal. Handcrafted with heavy timber and engineered granite countertops.",
    keywords: "island kitchen design Kathmandu, kitchen island table, modular kitchen price Nepal"
  },
  "kitchen-acc": {
    label: "Premium Kitchen Cabinet Fittings & Drawers",
    desc: "Durable kitchen cabinet fittings, pull-out wire baskets, tandem boxes & corner mechanisms in Nepal. Termite-proof, heavy-duty accessories.",
    keywords: "kitchen basket Kathmandu, modular kitchen accessories price, pantry cabinet pullout"
  },

  // Bathroom Subcategories
  "vanity-units": {
    label: "Luxury Bathroom Vanity Cabinets & Washbasins",
    desc: "Luxury bathroom vanity cabinets, integrated ceramic washbasins, and storage units in Nepal. Moisture-proof, designer bathroom units.",
    keywords: "bathroom vanity price Nepal, vanity cabinet Kathmandu, washbasin cabinet"
  },
  "bathroom-cabinets": {
    label: "Moisture-Proof Bathroom Storage Cabinets",
    desc: "Moisture-proof bathroom storage cabinets, wall cabinets, and under-sink storage in Nepal. Keep your bath space organized and beautiful.",
    keywords: "bathroom wall cabinet Kathmandu, moisture proof cabinet, bathroom storage price"
  },
  "bathroom-mirrors": {
    label: "LED Touch Mirrors & Smart Bathroom Mirrors",
    desc: "Smart LED touch mirrors, anti-fog bathroom mirrors, and decorative vanity mirrors in Nepal. Elegant ambient lighting for premium bathrooms.",
    keywords: "led mirror price Nepal, bathroom mirror Kathmandu, touch mirror bathroom"
  },
  "bathroom-storage": {
    label: "Bathroom Storage Baskets & Corner Racks",
    desc: "Buy premium bathroom storage baskets, stainless steel corner racks, and wall organizers in Nepal. High durability rust-proof bath accessories.",
    keywords: "bathroom corner rack price Nepal, shower caddy Kathmandu, bath organizers"
  },
  "bathroom-accessories": {
    label: "Modern Chrome Bathroom Fittings & Towel Rails",
    desc: "Premium chrome bathroom fittings, towel rails, soap dispensers, and luxury fixtures in Nepal. Durable anti-corrosive brass bath hardware.",
    keywords: "bathroom accessories set price Nepal, towel rail Kathmandu, soap holder"
  }
};

export async function generateMetadata({ params }) {
  const { category, subcategory } = await params;
  
  const subMeta = SUBCATEGORY_META[subcategory];
  const catMeta = CATEGORY_META[category] || {
    label: category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  };
  
  let label = "";
  let desc = "";
  let keywords = "";
  
  if (subMeta) {
    label = `${subMeta.label} — ${catMeta.label}`;
    desc = subMeta.desc;
    keywords = subMeta.keywords;
  } else {
    const parsedSub = subcategory.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const parsedCat = category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    label = `Premium ${parsedSub} — ${parsedCat} Collection`;
    desc = `Shop premium ${parsedSub} in the ${parsedCat} collection online in Nepal. Handcrafted solid wood furniture with free delivery.`;
    keywords = `${parsedSub} Nepal, buy ${parsedSub} Kathmandu, ${parsedSub} price Nepal, ${parsedSub} bishwokarma`;
  }
  
  return {
    title: `${label} | Sindureghari Furniture Nepal`,
    description: desc,
    keywords: keywords,
    alternates: {
      canonical: `${SITE_URL}/category/${category}/${subcategory}`,
    },
    openGraph: {
      title: `${label} | Sindureghari Furniture Nepal`,
      description: desc,
      url: `${SITE_URL}/category/${category}/${subcategory}`,
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
