"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SEOComponent from '../components/SEO/SEOComponent';
import { BreadcrumbStructuredData } from '../components/SEO/StructuredData';
import { Filter, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import ProductCard from '../component/common/ProductCard/ProductCard';
import { findCategoryBySlug, slugifyCategory, titleFromSlug } from '../utils/categoryHelpers';
import './CategoryPage.css';

// Category mapping for API calls - moved outside component to avoid re-creation
const categoryMapping = {};

// Subcategory mapping for API calls
const subcategoryMapping = {};

// Hero background images per category
const categoryHeroImages = {};

// Category display names and descriptions
const categoryInfo = {
  'living-room': {
    title: 'Living Room Furniture',
    description: 'Transform your living space with our premium collection of sofas, coffee tables, TV units, and more. Create a comfortable and stylish environment for relaxation and entertainment.',
    keywords: 'living room furniture Nepal, sofas Nepal, coffee tables Nepal, TV units Nepal, recliners Nepal'
  },
  'bedroom': {
    title: 'Bedroom Furniture',
    description: 'Create your perfect sanctuary with our elegant bedroom furniture collection including beds, wardrobes, dressing tables, and bedside furniture.',
    keywords: 'bedroom furniture Nepal, beds Nepal, wardrobes Nepal, dressing tables Nepal, mattresses Nepal'
  },
  'dining-room': {
    title: 'Dining Room Furniture',
    description: 'Gather around beautiful dining sets, tables, and chairs designed to make every meal memorable. Perfect for family dinners and entertaining guests.',
    keywords: 'dining room furniture Nepal, dining sets Nepal, dining tables Nepal, dining chairs Nepal'
  },
  'office-and-study': {
    title: 'Office & Study Furniture',
    description: 'Boost productivity with our ergonomic office chairs, functional desks, and storage solutions designed for modern workspaces.',
    keywords: 'office furniture Nepal, office chairs Nepal, office tables Nepal, study furniture Nepal'
  },
  'modular-kitchens': {
    title: 'Modular Kitchens',
    description: 'Design your dream kitchen with our modular kitchen solutions. Choose from L-shaped, U-shaped, parallel, and island kitchen designs.',
    keywords: 'modular kitchens Nepal, kitchen design Nepal, L-shaped kitchen Nepal, U-shaped kitchen Nepal'
  },
  'bathroom': {
    title: 'Bathroom Furniture',
    description: 'Complete your bathroom with stylish vanity units, storage cabinets, mirrors, and accessories for a functional and beautiful space.',
    keywords: 'bathroom furniture Nepal, vanity units Nepal, bathroom cabinets Nepal, bathroom mirrors Nepal'
  },
  'lightings': {
    title: 'Lighting Solutions',
    description: 'Illuminate your home with our diverse lighting collection including ceiling lights, table lamps, floor lamps, and decorative lighting.',
    keywords: 'lighting Nepal, ceiling lights Nepal, table lamps Nepal, floor lamps Nepal, pendant lights Nepal'
  },
  'decor': {
    title: 'Home Decor',
    description: 'Add personality to your space with our curated collection of wall art, vases, cushions, rugs, and decorative accessories.',
    keywords: 'home decor Nepal, wall art Nepal, vases Nepal, cushions Nepal, rugs Nepal, decorative items Nepal'
  },
  'outdoor': {
    title: 'Outdoor Furniture',
    description: 'Extend your living space outdoors with our weather-resistant garden furniture, outdoor dining sets, and patio accessories.',
    keywords: 'outdoor furniture Nepal, garden furniture Nepal, patio furniture Nepal, outdoor dining Nepal'
  },
  'all-products': {
    title: 'All Furniture Products',
    description: 'Browse our complete collection of premium furniture and home accessories. Find everything you need to furnish your home.',
    keywords: 'furniture Nepal, home furniture Nepal, office furniture Nepal, all products Nepal'
  },
  'offers': {
    title: 'Special Offers & Deals',
    description: 'Discover amazing deals and special offers on premium furniture. Save on your favorite pieces and transform your home for less.',
    keywords: 'furniture offers Nepal, furniture deals Nepal, discount furniture Nepal, sale furniture Nepal'
  }
};

// Modern Skeleton Loader for Product Cards
const ProductSkeleton = () => (
  <div className="bkf-skeleton-card">
    <div className="bkf-skeleton-image">
      <div className="bkf-skeleton-shimmer"></div>
    </div>
    <div className="bkf-skeleton-content">
      <div className="bkf-skeleton-line title"></div>
      <div className="bkf-skeleton-line meta"></div>
      <div className="bkf-skeleton-line price"></div>
    </div>
  </div>
);

// Discount Banner Component
const DiscountBanner = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="bkf-category__discount-banner"
    >
      <div className="bkf-category__discount-content">
        <span className="bkf-category__discount-tag">EXCLUSIVE</span>
        <h2 className="bkf-category__discount-title">Seasonal Refresh</h2>
        <p className="bkf-category__discount-subtitle">Premium Collections up to 40% Off</p>
        <button
          className="bkf-category__discount-cta"
          onClick={() => navigate('/category/offers')}
        >
          Explore Collection
        </button>
      </div>
    </div>
  );
};

// ============================================================
// SEO Keyword-Optimized Buying Guides & Collapsible FAQs
// ============================================================
const seoContentData = {
  'living-room': {
    guideTitle: 'The Ultimate Guide to Selecting the Best Sofa and Living Room Furniture in Nepal',
    guideText: 'Your living room is the center of your home, and finding the perfect sofa set in Nepal is key to balancing comfort, style, and utility. At Sindureghari Furniture (Bishwokarma), we manufacture premium living room sets using seasoned solid wood like Teak and Sheesham (Sisam) sourced from responsible local forestry. When picking a sofa, first evaluate your room dimensions. L-shape sofas are highly efficient for maximizing seating in corners, while traditional 3-1-1 royal sofa designs offer a grand, symmetrical layout. Teak wood frames provide lifelong durability, natural termite resistance, and elegant grain aesthetics. Every piece in our Rautahat factory undergoes modern kiln drying and advanced preservative seasoning, ensuring your furniture remains warp-free and strong for generations across Nepal.',
    faqs: [
      {
        q: 'Which wood is best for sofa sets in Nepal?',
        a: 'Teak Wood (Saj) and Sheesham (Sisam) are highly recommended. Seasoned Teak wood has high natural oil content which provides unmatched termite and moisture resistance, while Sisam offers a beautiful dark grain and exceptional load-bearing strength.'
      },
      {
        q: 'How can I customize my living room furniture dimensions?',
        a: 'You can customize any sofa, TV cabinet, or recliner dimensions at our Chandrapur showroom or online. Share your room blueprint and wood preferences via our WhatsApp support (+977-9845427041) and our master artisans will draft a custom manufacturing design.'
      },
      {
        q: 'Do you provide free home delivery and assembly in Kathmandu?',
        a: 'Yes, we provide free premium home delivery, unloading, and full assembly across Kathmandu, Lalitpur, Pokhara, and major cities in Nepal for our premium collections.'
      }
    ]
  },
  'dining-room': {
    guideTitle: 'Mastering Your Dining Room Furniture Design: A Premium Solid Wood Guide',
    guideText: 'A thoughtfully designed dining area transforms family dinners and guests gatherings into special memories. Finding the best dining table sets in Nepal requires checking the seating count and room shape. A standard 6-seater dining set is the most popular choice for urban Nepalese families, providing spacious comfort without cluttering the room. Rectangular solid wood tables work best in long rooms, whereas round dining sets encourage conversational flow in square layouts. At Sindureghari, our dining sets are handcrafted using thick logs of premium timber. The dining chairs are ergonomically designed with premium heavy-density cushioning to support comfortable upright seating during long meals. Visit our showroom in Chandrapur, Rautahat to feel the premium finish of our wood polishing.',
    faqs: [
      {
        q: 'What dining table sizes are available?',
        a: 'We design 4-seater, 6-seater, and 8-seater dining table sets in standard dimensions. Custom length, width, and matching dining bench seating can be designed based on your room dimensions.'
      },
      {
        q: 'How is the dining table surface treated to prevent heat and water damage?',
        a: 'All our wooden dining tables undergo a multi-layered premium polyurethane (PU) polish treatment. This forms a protective heat-resistant and waterproof barrier, ensuring your wood remains stain-free from hot dishes and accidental liquid spills.'
      },
      {
        q: 'Can I purchase dining chairs separately?',
        a: 'Yes, you can choose custom dining chairs or purchase matching wooden dining benches and cabinets separately to complete your dining room layout.'
      }
    ]
  },
  'bedroom': {
    guideTitle: 'Creating Your Dream Sanctuary: Solid Wood Bed Designs & Bedroom Furniture',
    guideText: 'Your bedroom should be a serene haven of rest and relaxation. Choosing the right bed design in Nepal involves deciding between a king-size bed for maximum space or a queen-size bed for compact rooms. At Sindureghari Furniture, our master carpenters construct heavy-duty double beds and beds with pneumatic hydraulic storage lifts to help keep your room organized and spacious. Matching bedroom furniture sets such as wardrobes, modular almirahs, dressing tables with high-definition LED mirrors, and solid wood bedside nightstands help build a cohesive luxury interior layout. Our sheesham and teak timber beds are fully treated against pests, providing clean, allergen-free comfort for a lifetime of restful sleep.',
    faqs: [
      {
        q: 'What is the standard warranty on solid wood beds?',
        a: 'All our premium handcrafted solid wood beds come with a lifetime guarantee on the timber quality and a 1-year warranty on manufacturing defects and hydraulic lifts.'
      },
      {
        q: 'Do you offer hydraulic storage beds?',
        a: 'Yes, we specialize in high-end hydraulic box storage beds. We use premium heavy-gauge gas lift struts, allowing you to lift the mattress effortlessly to access storage space underneath.'
      },
      {
        q: 'Can I choose a custom wood polish color for my wardrobe?',
        a: 'Yes, we offer custom polish finishes ranging from natural teak, warm honey, deep walnut, to royal mahogany. Tell our design team your preference, and we will custom finish your entire bedroom set.'
      }
    ]
  },
  'office-and-study': {
    guideTitle: 'Ergonomic Office Furniture & Solid Wood Study Tables in Nepal',
    guideText: 'Boost your workspace productivity with ergonomically structured office furniture designed for premium comfort. At Sindureghari Furniture, we engineer office chairs with flexible lumbar adjustments, high-grade mesh backrests, and adjustable armrests to relieve spinal pressure during long desk hours. Our study tables and executive desks are handcrafted using seasoned timber, offering a clean, professional finish with spacious drawers, built-in cable grommets, and filing drawer slides. Whether you are setting up a cozy home workspace in Kathmandu or a corporate conference boardroom, our modular office desks and reception tables deliver executive-level performance.',
    faqs: [
      {
        q: 'Do you supply bulk furniture for corporate offices?',
        a: 'Yes, we specialize in bulk commercial and corporate office furniture supply, including modular cubicles, conference tables, and executive chairs, with fast delivery and assembly throughout Nepal.'
      },
      {
        q: 'How do I pick the right ergonomic office chair?',
        a: 'Look for chairs with adjustable lumbar support, 360-degree swivel, smooth gas lift height controls, and dynamic tilt lock mechanisms. Our team can help you select a model tailored to your height and workspace layout.'
      }
    ]
  },
  'modular-kitchens': {
    guideTitle: 'Termite-Proof Modular Kitchen Cabinet Design & Installation in Nepal',
    guideText: 'Elevate your cooking experience with customized modular kitchen cabinets manufactured for heavy-duty cooking environments in Nepal. We design L-shaped, U-shaped, parallel, and island kitchen layouts using boiling-water-proof (BWP) seasoned solid wood and premium anti-rust stainless steel pullouts. We integrate smart soft-close tandem drawer boxes, corner carousel baskets, and overhead lift-up shutters to maximize kitchen storage. Our team of kitchen consultants works with you from 3D design blueprint rendering to full granite counter fitting and cabinet installation in Rautahat, Kathmandu, and beyond.',
    faqs: [
      {
        q: 'What materials are used for modular kitchen cabinets in Nepal?',
        a: 'We use high-grade seasoned teak wood and solid boiling-water-proof marine grade plywood (BWP) with termite prevention treatments, ensuring your kitchen cabinets withstand heavy moisture and high-heat environments.'
      },
      {
        q: 'How long does modular kitchen installation take?',
        a: 'Once the 3D kitchen layout design is approved, manufacturing takes about 2 to 3 weeks at our factory. The on-site installation, including drawer slides and cabinet alignment, is completed in just 3 to 5 days by our professional carpenters.'
      }
    ]
  }
};

const defaultSEOContent = {
  guideTitle: 'Premium Solid Wood Furniture Handcrafted by Sindureghari Furniture (Bishwokarma)',
  guideText: 'For over three decades, Sindureghari Furniture has been synonymous with premium quality, exquisite woodwork design, and timeless craftsmanship. Handcrafted in our advanced manufacturing workshop along the Chandrapur highway in Rautahat, Nepal, our furniture collections include everything from royal sofa sets, luxury king beds, solid wood dining tables, to modern modular kitchens and ergonomic office spaces. We season all our timber using high-temperature steam kilns to prevent shrinking, splitting, or warping over time. We provide free shipping, lifetime wood assurance, custom design flexibility, and a dedicated team of master artisans to help bring your home interior dreams to life.',
  faqs: [
    {
      q: 'Where is your physical showroom and factory located?',
      a: 'Our main showroom is located along the Highway Road in Chandrapur, Rautahat, Nepal. Our state-of-the-art wood seasoning and manufacturing workshops are situated nearby in the Rautahat district, where we craft and season all solid wood items.'
    },
    {
      q: 'How do I place an order for customized furniture online?',
      a: 'Browse our online catalogue and click the direct WhatsApp button (+977-9845427041) on any product detail page. You can consult with our design assistant, select custom sizing, wood finish (teak/sisam), and confirm your order securely.'
    },
    {
      q: 'Do you offer flexible EMI payment options?',
      a: 'Yes, we offer easy EMI plans to make premium furniture affordable for all homes in Nepal. You can discuss the EMI eligibility and bank partners with our sales desk when placing your custom order.'
    }
  ]
};

const CategorySEOSection = ({ category, subcategory }) => {
  const [openFaqIndex, setOpenFaqIndex] = React.useState(null);
  
  const content = seoContentData[category] || defaultSEOContent;
  
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <div className="bkf-category__seo-section">
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} 
      />
      <div className="bkf-category__seo-container">
        {/* Editorial Buying Guide */}
        <div className="bkf-category__seo-guide">
          <h2 className="bkf-category__seo-guide-title">{content.guideTitle}</h2>
          <p className="bkf-category__seo-guide-text">{content.guideText}</p>
        </div>
        
        {/* Collapsible FAQ Accordion */}
        <div className="bkf-category__seo-faqs">
          <h2 className="bkf-category__seo-faqs-title">Expert Buying Questions & Answers</h2>
          <div className="bkf-category__faq-list">
            {content.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx} 
                  className={`bkf-category__faq-item ${isOpen ? 'active' : ''}`}
                >
                  <div 
                    className="bkf-category__faq-question" 
                    onClick={() => toggleFaq(idx)}
                  >
                    <h3>{faq.q}</h3>
                    <span className="bkf-category__faq-toggle-icon">
                      {isOpen ? '−' : '+'}
                    </span>
                  </div>
                  <div className={`bkf-category__faq-answer ${isOpen ? 'open' : ''}`}>
                    <p>{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryPage = ({ categoryOverride, subcategoryOverride, keywordOverride } = {}) => {
  const params = useParams();
  const category = categoryOverride !== undefined ? categoryOverride : params.category;
  const subcategory = subcategoryOverride !== undefined ? subcategoryOverride : params.subcategory;
  const keyword = keywordOverride !== undefined ? keywordOverride : params.keyword;
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isFallbackActive, setIsFallbackActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [fastDelivery, setFastDelivery] = useState(false);
  const [adminCategories, setAdminCategories] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/categories`);
        if (!response.ok) return;
        const data = await response.json();
        if (isMounted && Array.isArray(data)) {
          setAdminCategories(data);
        }
      } catch (error) {
        console.warn('Category taxonomy fetch failed:', error);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // Subcategories for each main category
  const subcategoriesByCategory = {};

  const getCategoryAndDescendantIds = (categoryNode) => {
    if (!categoryNode?.id) return [];

    const childIds = Array.isArray(categoryNode.children)
      ? categoryNode.children.flatMap(getCategoryAndDescendantIds)
      : [];

    return [categoryNode.id, ...childIds];
  };

  // Fetch products based on category/subcategory or keyword
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      setIsFallbackActive(false);

      try {
        let isFallback = false;
        let fetchedProducts = [];
        let fetchedTotalPages = 1;

        if (keyword) {
          // Programmatic SEO page mode - fetch matching products using the search API
          const searchUrl = `${API_BASE_URL}/api/search?q=${encodeURIComponent(keyword)}&limit=100`;
          const response = await fetch(searchUrl);
          if (response.ok) {
            const data = await response.json();
            const rawProducts = data.products || [];
            fetchedProducts = rawProducts;
            fetchedTotalPages = Math.max(1, Math.ceil(rawProducts.length / 12));
          } else {
            throw new Error('Failed to fetch search results for keyword');
          }
        } else {
          const activeAdminCategory = subcategory
            ? findCategoryBySlug(adminCategories, subcategory)
            : findCategoryBySlug(adminCategories, category);
          const activeCategoryIds = getCategoryAndDescendantIds(activeAdminCategory);
          let categoryName = '';

          if (activeAdminCategory?.id) {
            categoryName = '';
          } else if (subcategory) {
            // If subcategory is provided, use it for API call
            categoryName = subcategoryMapping[subcategory] || subcategory;
          } else if (category) {
            // If only category is provided, use it for API call
            categoryName = categoryMapping[category] || category;
          }

          // Prefer admin taxonomy ID; fallback to legacy category names for old routes.
          const shouldFilterDescendants = activeAdminCategory?.id && activeCategoryIds.length > 1;
          let url = shouldFilterDescendants
            ? `${API_BASE_URL}/api/products?category=${activeAdminCategory.id}&includeChildren=true&page=${currentPage}&limit=12&sort=${sortBy}`
            : activeAdminCategory?.id
            ? `${API_BASE_URL}/api/products?category=${activeAdminCategory.id}&page=${currentPage}&limit=12&sort=${sortBy}`
            : `${API_BASE_URL}/api/products?categoryName=${categoryName}&page=${currentPage}&limit=12&sort=${sortBy}`;

          if (priceRange.min || priceRange.max) {
            url += `&minPrice=${priceRange.min}&maxPrice=${priceRange.max}`;
          }

          // 1. Fetch category products
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) {
              fetchedProducts = data;
            } else {
              fetchedProducts = data.products || [];
              fetchedTotalPages = data.totalPages || 1;
            }
          } else {
            throw new Error('Failed to fetch category products');
          }
        }

        // 2. If no products are found for legacy/fallback routes, fetch general products.
        // Admin-created categories should show their own empty state instead of unrelated products.
        const hasAdminCategoryMatch = !keyword && (
          (subcategory && findCategoryBySlug(adminCategories, subcategory)) ||
          (!subcategory && category && findCategoryBySlug(adminCategories, category))
        );

        if (fetchedProducts.length === 0 && !hasAdminCategoryMatch) {
          isFallback = true;
          // Fetch featured/recent general products
          const fallbackUrl = `${API_BASE_URL}/api/products?page=1&limit=12&sort=newest`;
          const fallbackResponse = await fetch(fallbackUrl);
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            if (Array.isArray(fallbackData)) {
              fetchedProducts = fallbackData;
            } else {
              fetchedProducts = fallbackData.products || [];
              fetchedTotalPages = fallbackData.totalPages || 1;
            }
          }
        }

        setProducts(fetchedProducts);
        setTotalPages(fetchedTotalPages);
        setIsFallbackActive(isFallback);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, subcategory, keyword, currentPage, sortBy, priceRange, adminCategories]);

  // Get current category info
  const getCurrentCategoryInfo = () => {
    if (keyword) {
      const cleanKeyword = keyword.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      return {
        title: `Best ${cleanKeyword} in Nepal`,
        description: `Shop the best ${cleanKeyword} in Nepal. Handcrafted solid wood, premium quality, and free delivery to Kathmandu, Lalitpur, and Bhaktapur.`,
        keywords: `best ${cleanKeyword.toLowerCase()} Nepal, buy ${cleanKeyword.toLowerCase()} online, solid wood ${cleanKeyword.toLowerCase()}`
      };
    }
    if (subcategory) {
      const adminSubcategory = findCategoryBySlug(adminCategories, subcategory);
      if (adminSubcategory) {
        return {
          title: adminSubcategory.name,
          description: `Explore ${adminSubcategory.name} products uploaded by our team. Browse pricing, finishes, stock and product details in one place.`,
          keywords: `${adminSubcategory.name} Nepal, buy ${adminSubcategory.name} Nepal, Sindureghari Furniture`
        };
      }

      const subcatName = subcategory.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      return {
        title: subcatName,
        description: `Explore our premium ${subcatName.toLowerCase()} collection. High-quality furniture designed for comfort, style, and durability.`,
        keywords: `${subcatName.toLowerCase()} Nepal, buy ${subcatName.toLowerCase()} Nepal, ${subcatName.toLowerCase()} furniture Nepal`
      };
    }
    const adminCategory = findCategoryBySlug(adminCategories, category);
    if (adminCategory) {
      return {
        title: adminCategory.name,
        description: `Shop ${adminCategory.name} products uploaded from the admin dashboard. Products shown here follow the same category selected during product upload.`,
        keywords: `${adminCategory.name} Nepal, Sindureghari Furniture, furniture category Nepal`
      };
    }

    return categoryInfo[category] || {
      title: titleFromSlug(category || 'all-products'),
      description: `Shop premium ${titleFromSlug(category || 'furniture').toLowerCase()} products in Nepal.`,
      keywords: `${titleFromSlug(category || 'furniture').toLowerCase()} Nepal`
    };
  };

  const currentCategoryInfo = getCurrentCategoryInfo();
  const activeAdminCategory = findCategoryBySlug(adminCategories, category);
  const activeAdminSubcategory = subcategory ? findCategoryBySlug(adminCategories, subcategory) : null;
  const categoryLabel = activeAdminCategory?.name || categoryMapping[category] || titleFromSlug(category || '');
  const subcategoryLabel = activeAdminSubcategory?.name || (subcategory ? titleFromSlug(subcategory) : '');
  const dynamicSubcategories = !subcategory
    ? (
      Array.isArray(activeAdminCategory?.children) && activeAdminCategory.children.length > 0
        ? activeAdminCategory.children.map((child) => ({
          id: child.slug || slugifyCategory(child.name),
          name: child.name,
        }))
        : subcategoriesByCategory[category] || []
    )
    : [];

  // Handle subcategory click
  const handleSubcategoryClick = (subcatId) => {
    navigate(`/category/${category}/${slugifyCategory(subcatId)}`);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };



  // Pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Available filter options (you can fetch these from API in real implementation)
  const availableMaterials = ['Sheesham Wood', 'Engineered Wood', 'Mango Wood', 'Ash Wood', 'Teak Wood', 'Oak Wood'];
  const availableBrands = ['Wooden Street', 'Urban Ladder', 'Pepperfry', 'IKEA', 'Godrej Interio'];

  // Handle material filter
  const handleMaterialChange = (material) => {
    setSelectedMaterials(prev =>
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
    setCurrentPage(1);
  };

  // Handle brand filter
  const handleBrandChange = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
    setCurrentPage(1);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setPriceRange({ min: '', max: '' });
    setSelectedMaterials([]);
    setSelectedBrands([]);
    setFastDelivery(false);
    setCurrentPage(1);
  };

  // Sidebar Filter Function
  const renderFilterSidebar = () => (
    <aside className="bkf-category__sidebar">
      <div className="bkf-category__sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={18} />
          <h3>Filters</h3>
        </div>
        <button onClick={clearAllFilters} className="bkf-category__clear-all">Reset</button>
      </div>

      {/* Fast Delivery Filter */}
      <div className="bkf-category__filter-section">
        <label className="bkf-category__filter-checkbox">
          <input
            type="checkbox"
            checked={fastDelivery}
            onChange={(e) => setFastDelivery(e.target.checked)}
          />
          <span className="bkf-category__checkmark"></span>
          FAST EXPRESS DELIVERY
        </label>
      </div>

      {/* Price Range Filter */}
      <div className="bkf-category__filter-section">
        <h4 className="bkf-category__filter-title">PRICE BUDGET</h4>
        
        {/* Luxury Price Preset Tiers */}
        <div className="bkf-category__price-presets">
          {[
            { label: 'All Budgets', min: '', max: '' },
            { label: 'Under NPR 25K', min: '0', max: '25000' },
            { label: 'NPR 25K – 75K', min: '25000', max: '75000' },
            { label: 'NPR 75K – 150K', min: '75000', max: '150000' },
            { label: 'Above NPR 150K', min: '150000', max: '999999' }
          ].map((tier, idx) => {
            const isSelected = priceRange.min === tier.min && priceRange.max === tier.max;
            return (
              <button
                key={idx}
                type="button"
                className={`bkf-category__preset-pill ${isSelected ? 'active' : ''}`}
                onClick={() => setPriceRange({ min: tier.min, max: tier.max })}
              >
                {tier.label}
              </button>
            );
          })}
        </div>

        {/* Custom Price Range Inputs */}
        <div className="bkf-category__custom-price-inputs">
          <div className="price-input-wrapper">
            <span className="price-currency">Rs.</span>
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="bkf-category__price-num-input"
            />
          </div>
          <span className="price-input-to">to</span>
          <div className="price-input-wrapper">
            <span className="price-currency">Rs.</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="bkf-category__price-num-input"
            />
          </div>
        </div>
      </div>

      {/* Material Filter */}
      <div className="bkf-category__filter-section">
        <h4 className="bkf-category__filter-title">MATERIAL</h4>
        <div className="bkf-category__filter-options">
          {availableMaterials.map(material => (
            <label key={material} className="bkf-category__filter-option">
              <input
                type="checkbox"
                checked={selectedMaterials.includes(material)}
                onChange={() => handleMaterialChange(material)}
              />
              <span className="bkf-category__option-text">{material}</span>
              <span className="bkf-category__option-count">(25)</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="bkf-category__filter-section">
        <h4 className="bkf-category__filter-title">BRAND</h4>
        <div className="bkf-category__filter-options">
          {availableBrands.map(brand => (
            <label key={brand} className="bkf-category__filter-option">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
              />
              <span className="bkf-category__option-text">{brand}</span>
              <span className="bkf-category__option-count">(15)</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      // Price filter
      const price = parseFloat(product.salePrice || product.price || 0);
      const minPrice = parseFloat(priceRange.min || 1000);
      const maxPrice = parseFloat(priceRange.max || 150000);
      const priceInRange = price >= minPrice && price <= maxPrice;

      // Material filter
      const materialMatch = selectedMaterials.length === 0 ||
        selectedMaterials.some(material =>
          product.material?.toLowerCase().includes(material.toLowerCase()) ||
          product.name.toLowerCase().includes(material.toLowerCase())
        );

      // Brand filter
      const brandMatch = selectedBrands.length === 0 ||
        selectedBrands.some(brand =>
          product.brand?.toLowerCase().includes(brand.toLowerCase()) ||
          product.name.toLowerCase().includes(brand.toLowerCase())
        );

      // Fast delivery filter
      const deliveryMatch = !fastDelivery || product.fastDelivery === true;

      return priceInRange && materialMatch && brandMatch && deliveryMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.salePrice || a.price || 0) - parseFloat(b.salePrice || b.price || 0);
        case 'price-high':
          return parseFloat(b.salePrice || b.price || 0) - parseFloat(a.salePrice || a.price || 0);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'oldest':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case 'newest':
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });


  // Function to render products with discount banner
  const renderProductsWithDiscount = () => {
    // const productsPerRow = 5;
    const discountAfterProducts = 10;
    const result = [];

    filteredProducts.forEach((product, index) => {
      // Add discount banner after every 10 products
      if (index === discountAfterProducts && index < products.length) {
        result.push(
          <DiscountBanner key={`discount-${index}`} />
        );
      }

      result.push(
        <ProductCard key={product.id || product._id} product={product} />
      );
    });

    return result;
  };

  // Generate dynamic breadcrumbs array for JSON-LD schema
  const breadcrumbsList = [
    { name: 'Home', url: 'https://sinduregharifurniture.shop/' }
  ];

  if (keyword) {
    const cleanKeyword = keyword.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    breadcrumbsList.push({
      name: `Best ${cleanKeyword}`,
      url: `https://sinduregharifurniture.shop/best-${keyword}-nepal`
    });
  } else if (category) {
    breadcrumbsList.push({
      name: categoryLabel,
      url: `https://sinduregharifurniture.shop/category/${category}`
    });
    
    if (subcategory) {
      breadcrumbsList.push({
        name: subcategoryLabel,
        url: `https://sinduregharifurniture.shop/category/${category}/${subcategory}`
      });
    }
  }


  return (
    <>
      <SEOComponent
        title={`${currentCategoryInfo.title} | Bishwokarma Furniture - Premium Furniture in Nepal`}
        description={currentCategoryInfo.description}
        keywords={currentCategoryInfo.keywords}
        ogTitle={`${currentCategoryInfo.title} | Bishwokarma Furniture`}
        ogDescription={currentCategoryInfo.description}
        canonicalUrl={keyword ? `https://sinduregharifurniture.shop/best-${keyword}-nepal` : `https://sinduregharifurniture.shop/category/${category}${subcategory ? `/${subcategory}` : ''}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": currentCategoryInfo.title,
          "description": currentCategoryInfo.description,
          "url": keyword ? `https://sinduregharifurniture.shop/best-${keyword}-nepal` : `https://sinduregharifurniture.shop/category/${category}${subcategory ? `/${subcategory}` : ''}`,
          "mainEntity": {
            "@type": "ItemList",
            "name": currentCategoryInfo.title,
            "description": currentCategoryInfo.description,
            "numberOfItems": products.length,
            "itemListElement": products.map((prod, idx) => ({
              "@type": "ListItem",
              "position": idx + 1,
              "url": `https://sinduregharifurniture.shop/product/${prod.id || prod._id}`,
              "name": prod.title || prod.name
            }))
          }
        }}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbsList} />

      <div className="bkf-category-page">
        {/* Breadcrumb */}
        <div className="bkf-category__breadcrumb">
          <div className="bkf-category__container">
            <nav>
              <span onClick={() => navigate('/')} className="bkf-category__breadcrumb-link">Home</span>
              {keyword ? (
                <>
                  <span className="bkf-category__breadcrumb-separator">/</span>
                  <span className="bkf-category__breadcrumb-current">
                    Best {keyword.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </>
              ) : (
                <>
                  <span className="bkf-category__breadcrumb-separator">/</span>
                  <span onClick={() => navigate(`/category/${category}`)} className="bkf-category__breadcrumb-link">
                    {categoryLabel}
                  </span>
                  {subcategory && (
                    <>
                      <span className="bkf-category__breadcrumb-separator">/</span>
                      <span className="bkf-category__breadcrumb-current">
                        {subcategoryLabel}
                      </span>
                    </>
                  )}
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Category Hero Banner */}
        <div className="bkf-category__header">
          {/* Background image */}
          <div className="bkf-category__hero-bg">
            <img
              src={activeAdminCategory?.image || 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=1800'}
              alt={currentCategoryInfo.title}
              loading="eager"
            />
          </div>
          {/* Dark gradient overlay */}
          <div className="bkf-category__hero-overlay" />

          {/* Text content */}
          <div className="bkf-category__hero-content">
            <div className="bkf-category__container">
              <span className="bkf-category__eyebrow">
                Collection
              </span>
              <h1 className="bkf-category__title">
                {currentCategoryInfo.title}
              </h1>
              <p className="bkf-category__description">
                {currentCategoryInfo.description}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="bkf-category__main-content">
          <div className="bkf-category__container">
            <div className="bkf-category__content-wrapper">
              {/* Sidebar Filters */}
              {renderFilterSidebar()}

              {/* Products Section */}
              <div className="bkf-category__products-section">
                {/* Subcategories (only show if on main category page) */}
                {dynamicSubcategories.length > 0 && (
                  <div className="bkf-category__subcategories-section">
                    <h2 className="bkf-category__subcategories-title">Shop by Category</h2>
                    <div className="bkf-category__subcategories-grid">
                      {dynamicSubcategories.map((subcat, idx) => (
                        <div
                          key={subcat.id}
                          className="bkf-category__subcategory-card"
                          onClick={() => handleSubcategoryClick(subcat.id)}
                        >
                          <div className="bkf-category__subcategory-content">
                            <h3 className="bkf-category__subcategory-name">{subcat.name}</h3>
                            <ChevronRight size={16} className="bkf-category__subcategory-arrow-icon" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sort Controls */}
                <div className="bkf-category__controls">
                  <div className="bkf-category__controls-left">
                    <span className="bkf-category__sort-label">Sort By</span>
                    <select value={sortBy} onChange={handleSortChange} className="bkf-category__sort-select">
                      <option value="newest">Recommended</option>
                      <option value="oldest">Oldest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name-asc">Name: A to Z</option>
                      <option value="name-desc">Name: Z to A</option>
                    </select>
                  </div>
                  {!loading && (
                    <span className="bkf-category__results-count">
                      {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                    </span>
                  )}
                </div>

                {/* Products Content */}
                {isFallbackActive && (
                  <div className="bkf-category__fallback-banner" style={{
                    background: 'rgba(197, 160, 89, 0.08)',
                    borderLeft: '4px solid #C5A059',
                    padding: '20px 25px',
                    borderRadius: '8px',
                    marginBottom: '30px',
                    fontFamily: "'Outfit', sans-serif"
                  }}>
                    <span style={{
                      display: 'inline-block',
                      fontSize: '11px',
                      fontWeight: '700',
                      letterSpacing: '1.5px',
                      color: '#C5A059',
                      marginBottom: '6px',
                      textTransform: 'uppercase'
                    }}>RECOMMENDED FOR YOU</span>
                    <h3 style={{
                      margin: 0,
                      fontSize: '1.1rem',
                      fontWeight: '500',
                      color: '#1a1a1a',
                      lineHeight: '1.5'
                    }}>
                      We are currently updating our <strong>{categoryLabel || (keyword ? keyword.replace(/-/g, ' ') : 'furniture')}</strong> collection. In the meantime, explore our finest handcrafted furniture pieces below:
                    </h3>
                  </div>
                )}

                {loading ? (
                  <div className="bkf-category__products-grid">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <ProductSkeleton key={i} />)}
                  </div>
                ) : error ? (
                  <div className="bkf-category__error-state">
                    <p>Error: {error}</p>
                    <button onClick={() => window.location.reload()} className="bkf-category__retry-btn">
                      Try Again
                    </button>
                  </div>
                ) : products.length === 0 ? (
                  <div className="bkf-category__empty-state">
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or browse other categories.</p>
                  </div>
                ) : (
                  <>
                    <div className="bkf-category__products-grid">
                      {filteredProducts.length > 0 ? renderProductsWithDiscount() : (
                        <div className="bkf-category__no-results">
                          <p>No products match your current filters.</p>
                        </div>
                      )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="bkf-category__pagination">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="bkf-category__pagination-btn"
                        >
                          Previous
                        </button>

                        {[...Array(totalPages)].map((_, index) => (
                          <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`bkf-category__pagination-btn ${currentPage === index + 1 ? 'bkf-category__pagination-btn--active' : ''}`}
                          >
                            {index + 1}
                          </button>
                        ))}

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="bkf-category__pagination-btn"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            
            {/* Keyword-Rich SEO Buying Guide & Collapsible FAQ Section */}
            <CategorySEOSection category={category} subcategory={subcategory} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
