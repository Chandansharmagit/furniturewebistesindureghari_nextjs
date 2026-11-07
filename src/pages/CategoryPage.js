"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SEOComponent from '../components/SEO/SEOComponent';
import { BreadcrumbStructuredData } from '../components/SEO/StructuredData';
import {
  Filter,
  ChevronRight,
  Truck,
  ShieldCheck,
  Ruler,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  MessageCircle,
  Check,
} from 'lucide-react';
import { PRODUCT_ENDPOINTS, fetchWithFallback } from '../config/api';
import ProductCard from '../component/common/ProductCard/ProductCard';
import { findCategoryBySlug, slugifyCategory, titleFromSlug } from '../utils/categoryHelpers';
import './CategoryPage.css';

/* --------------------------------------------------------------------------
   Rich Category Copywriting (replaces raw admin debug strings)
   -------------------------------------------------------------------------- */
const categoryInfo = {
  'sofa-section': {
    eyebrow: 'Signature Living Collection',
    title: 'Sofa Section & Luxury Loungers',
    description:
      'Handcrafted L-shape sectionals, 3+1+1 solid teak sofa suites, and plush upholstered seating engineered with high-density orthopedic cushioning for Nepali homes.',
    keywords: 'sofa section Nepal, L shape sofa Nepal, wooden sofa set Nepal, living room sofa Sindureghari',
  },
  'sofa': {
    eyebrow: 'Living Room Seating',
    title: 'Handcrafted Sofas & Couches',
    description:
      'Explore 3-seater fabric sofas, carved solid timber couches, and modern lounge seating built from kiln-dried hardwood.',
    keywords: 'sofa Nepal, 3 seater sofa price in Nepal, solid wood sofa Nepal',
  },
  'living-room': {
    eyebrow: 'Living Room Atelier',
    title: 'Living Room Furniture',
    description:
      'Transform your living space with our handcrafted collection of solid wood sofas, center coffee tables, TV consoles, and lounge seating.',
    keywords: 'living room furniture Nepal, sofas Nepal, coffee tables Nepal, TV units Nepal',
  },
  'modern-beds': {
    eyebrow: 'Bedroom Sanctuary',
    title: 'Modern Beds & Hydraulic Suites',
    description:
      'King and queen size solid timber beds, silent hydraulic box-storage frames, and tufted upholstered headboards built for decades of restful sleep.',
    keywords: 'modern beds Nepal, hydraulic bed price in Nepal, king size bed Nepal',
  },
  'bedroom': {
    eyebrow: 'Master Bedroom Collection',
    title: 'Bedroom Furniture',
    description:
      'Create a serene bedroom sanctuary with our solid teak and sisau beds, multi-door wardrobes, vanity dressing tables, and nightstands.',
    keywords: 'bedroom furniture Nepal, beds Nepal, wardrobes Nepal, dressing tables Nepal',
  },
  'dining-room': {
    eyebrow: 'Family & Hosting',
    title: 'Dining Room Sets & Tables',
    description:
      'Gather around heirloom 4, 6, and 8-seater solid sisau and teak dining tables paired with ergonomic cushioned chairs.',
    keywords: 'dining room furniture Nepal, 6 seater dining table Nepal, wooden dining set Nepal',
  },
  'study-tables': {
    eyebrow: 'Home Office & Study',
    title: 'Study Tables & Executive Desks',
    description:
      'Productive workspaces crafted from seasoned timber—featuring computer desks with cable management, drawer storage, and ergonomic chairs.',
    keywords: 'study table price in Nepal, computer desk Nepal, office table Nepal',
  },
  'study-room': {
    eyebrow: 'Workspace Collection',
    title: 'Study & Office Furniture',
    description:
      'Shop solid wood study tables, ergonomic high-back office chairs, and bookshelves designed for modern home offices in Nepal.',
    keywords: 'study room furniture Nepal, study table Nepal, office chair Nepal',
  },
  'wardrobes': {
    eyebrow: 'Smart Bedroom Storage',
    title: 'Solid Wood Wardrobes & Almirahs',
    description:
      'Spacious 2, 3, and 4-door wardrobes and shoe cabinets featuring full-length mirrors, hanging compartments, and secure lock drawers.',
    keywords: 'wardrobe price in Nepal, wooden almirah Nepal, 3 door wardrobe Nepal',
  },
  'dashainoffer': {
    eyebrow: 'Limited Festive Bundles',
    title: 'Festive Room Combo Offers',
    description:
      'Save up to 29% with complete living room, bedroom, and whole-home furniture combo bundles with free delivery across Nepal.',
    keywords: 'furniture combo offer Nepal, Dashain Diwali furniture offer Nepal',
  },
  'offers': {
    eyebrow: 'Special Savings',
    title: 'Exclusive Offers & Festive Deals',
    description:
      'Enjoy special seasonal discounts and flat 5% OFF with code DIWALI5 across our handcrafted solid wood furniture collections.',
    keywords: 'furniture offers Nepal, furniture deals Nepal, discount furniture Nepal',
  },
  'outdoor-furniture': {
    eyebrow: 'Terrace & Garden',
    title: 'Outdoor & Patio Furniture',
    description:
      'Weather-sealed teakwood garden swings, balcony chairs, and patio table sets built to handle Nepal’s climate.',
    keywords: 'outdoor furniture Nepal, garden swing Nepal, patio furniture Nepal',
  },
  'lighting': {
    eyebrow: 'Warm Ambience',
    title: 'Architectural Chandeliers & Lighting',
    description:
      'Illuminate your wooden interiors with statement chandeliers, warm floor lamps, and decorative pendant lighting.',
    keywords: 'lighting Nepal, chandeliers Nepal, floor lamps Nepal',
  },
};

const QUICK_CATEGORY_PILLS = [
  { label: 'All Collections', slug: 'all-products', path: '/products' },
  { label: 'Sofa Section', slug: 'sofa-section', path: '/category/sofa-section' },
  { label: 'Sofas', slug: 'sofa', path: '/category/sofa' },
  { label: 'Modern Beds', slug: 'modern-beds', path: '/category/modern-beds' },
  { label: 'Dining Room', slug: 'dining-room', path: '/category/dining-room' },
  { label: 'Wardrobes', slug: 'wardrobes', path: '/category/wardrobes' },
  { label: 'Study Tables', slug: 'study-tables', path: '/category/study-tables' },
  { label: 'Festive Combos', slug: 'dashainoffer', path: '/category/dashainoffer' },
];

const MATERIAL_FILTERS = [
  { label: 'Teak Wood', token: 'teak' },
  { label: 'Sheesham / Sisau', token: 'sheesham' },
  { label: 'Engineered Hardwood', token: 'engineered' },
  { label: 'Velvet & Fabric', token: 'cotton' },
  { label: 'Pine & Solid Wood', token: 'pine' },
];

const PRICE_PRESETS = [
  { label: 'All Budgets', min: '', max: '' },
  { label: 'Under Rs. 30,000', min: '0', max: '30000' },
  { label: 'Rs. 30,000 – 75,000', min: '30000', max: '75000' },
  { label: 'Rs. 75,000 – 1,50,000', min: '75000', max: '150000' },
  { label: 'Above Rs. 1,50,000', min: '150000', max: '' },
];

// Related category keyword matcher so /category/sofa-section matches "Sofa Section", "Sofa", etc.
const matchesCategorySlug = (product, targetSlug) => {
  if (!targetSlug || targetSlug === 'all-products') return true;
  const prodCatSlug = slugifyCategory(product.categoryName || product.category || '');
  const prodName = String(product.name || product.title || '').toLowerCase();

  if (prodCatSlug === targetSlug) return true;

  const familyMap = {
    'sofa-section': ['sofa-section', 'sofa', 'living-room', 'sofa-sets'],
    'sofa': ['sofa', 'sofa-section', 'sofa-sets'],
    'living-room': ['living-room', 'sofa-section', 'sofa', 'coffee-tables', 'tv-units'],
    'modern-beds': ['modern-beds', 'bedroom', 'beds'],
    'bedroom': ['bedroom', 'modern-beds', 'wardrobes', 'dressing-tables'],
    'dining-room': ['dining-room', 'dining-sets', 'dining-tables'],
    'study-tables': ['study-tables', 'study-room', 'office-and-study'],
    'study-room': ['study-room', 'study-tables', 'office-and-study'],
    'wardrobes': ['wardrobes', 'almirah'],
    'dashainoffer': ['dashainoffer', 'offers', 'royal'],
    'offers': ['offers', 'dashainoffer', 'royal'],
  };

  const allowedSlugs = familyMap[targetSlug] || [targetSlug];
  if (allowedSlugs.includes(prodCatSlug)) return true;

  // Keyword match in product title for specialized slugs
  if (targetSlug === 'sofa-section' || targetSlug === 'sofa') {
    return prodName.includes('sofa') || prodName.includes('couch') || prodName.includes('living room');
  }
  if (targetSlug === 'modern-beds') {
    return prodName.includes('bed');
  }
  if (targetSlug === 'dining-room') {
    return prodName.includes('dining');
  }
  if (targetSlug === 'wardrobes') {
    return prodName.includes('wardrobe') || prodName.includes('shoe rack') || prodName.includes('cabinet');
  }
  if (targetSlug === 'study-tables' || targetSlug === 'study-room') {
    return prodName.includes('desk') || prodName.includes('study') || prodName.includes('office chair');
  }
  if (targetSlug === 'offers' || targetSlug === 'dashainoffer') {
    const oldP = Number(product.old_price || product.price || 0);
    const newP = Number(product.new_price || product.salePrice || 0);
    return prodCatSlug.includes('offer') || (oldP > newP && newP > 0);
  }

  return false;
};

const ProductSkeleton = () => (
  <div className="bkf-skeleton-card">
    <div className="bkf-skeleton-image">
      <div className="bkf-skeleton-shimmer" />
    </div>
    <div className="bkf-skeleton-content">
      <div className="bkf-skeleton-line meta" />
      <div className="bkf-skeleton-line title" />
      <div className="bkf-skeleton-line price" />
    </div>
  </div>
);

const defaultSEOContent = {
  guideTitle: 'Handcrafted Solid Wood Craftsmanship by Sindureghari Furniture',
  guideText:
    'Every piece in our showroom is crafted from kiln-dried Teak, Sisau (Sheesham), and Sal timber in our Rautahat workshop. By seasoning our wood to optimal moisture levels and finishing with protective polyurethane coatings, our sofas, beds, dining sets, and wardrobes resist warping and termites for decades.',
  faqs: [
    {
      q: 'Can I customize the size, wood type, or fabric color?',
      a: 'Yes. Share your room measurements or preferred upholstery shade with our team on WhatsApp (+977-9845427041) and our craftsmen will build it to your exact specifications.',
    },
    {
      q: 'Do you provide delivery and installation across Nepal?',
      a: 'We provide safe home delivery and professional on-site assembly across Kathmandu Valley, Pokhara, Chitwan, Chandrapur, and major cities in Nepal.',
    },
    {
      q: 'What warranty is included with solid wood furniture?',
      a: 'Our solid hardwood furniture frames carry up to a 10-year structural and termite-resistance warranty.',
    },
  ],
};

const CategorySEOSection = ({ title }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  return (
    <section className="bkf-category__seo-section">
      <div className="bkf-category__seo-container">
        <div className="bkf-category__seo-guide">
          <span className="bkf-seo-kicker">Atelier Quality Standard</span>
          <h2 className="bkf-category__seo-guide-title">
            {title ? `Why Choose Sindureghari for ${title}` : defaultSEOContent.guideTitle}
          </h2>
          <p className="bkf-category__seo-guide-text">{defaultSEOContent.guideText}</p>
        </div>

        <div className="bkf-category__seo-faqs">
          <h3 className="bkf-category__seo-faqs-title">Frequently Asked Questions</h3>
          <div className="bkf-category__faq-list">
            {defaultSEOContent.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className={`bkf-category__faq-item ${isOpen ? 'active' : ''}`}>
                  <button
                    type="button"
                    className="bkf-category__faq-question"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  >
                    <span>{faq.q}</span>
                    <span className="bkf-category__faq-toggle-icon">{isOpen ? '−' : '+'}</span>
                  </button>
                  <div className={`bkf-category__faq-answer ${isOpen ? 'open' : ''}`}>
                    <p>{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const CategoryPage = ({ categoryOverride, subcategoryOverride, keywordOverride } = {}) => {
  const params = useParams();
  const rawCategory = categoryOverride !== undefined ? categoryOverride : params.category;
  const category = slugifyCategory(rawCategory || 'all-products');
  const subcategory = subcategoryOverride !== undefined ? subcategoryOverride : params.subcategory;
  const keyword = keywordOverride !== undefined ? keywordOverride : params.keyword;
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [adminCategories, setAdminCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & sorting
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);

  // Fetch categories + products using resilient fetchWithFallback
  useEffect(() => {
    let isMounted = true;

    const loadCatalog = async () => {
      setLoading(true);
      setError(null);

      try {
        const [catRes, prodRes] = await Promise.allSettled([
          fetchWithFallback(PRODUCT_ENDPOINTS.CATEGORIES),
          keyword
            ? fetchWithFallback(`/api/search?q=${encodeURIComponent(keyword)}&limit=150`)
            : fetchWithFallback(`${PRODUCT_ENDPOINTS.LIST}?limit=200`),
        ]);

        if (isMounted && catRes.status === 'fulfilled' && catRes.value.ok) {
          const catData = await catRes.value.json();
          if (Array.isArray(catData)) setAdminCategories(catData);
        }

        if (prodRes.status === 'fulfilled' && prodRes.value.ok) {
          const prodData = await prodRes.value.json();
          const rawList = Array.isArray(prodData)
            ? prodData
            : prodData.products || prodData.data || [];
          if (isMounted) {
            setAllProducts(rawList);
          }
        } else {
          throw new Error('Unable to load products right now.');
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCatalog();

    return () => {
      isMounted = false;
    };
  }, [keyword]);

  // Reset pagination count when category or filter changes
  useEffect(() => {
    setVisibleCount(24);
  }, [category, subcategory, keyword, sortBy, priceRange, selectedMaterials, inStockOnly, onSaleOnly]);

  // Match products for current category/subcategory
  const { categoryProducts, isShowingFallback } = useMemo(() => {
    if (keyword) {
      return { categoryProducts: allProducts, isShowingFallback: false };
    }

    const targetSlug = subcategory ? slugifyCategory(subcategory) : category;
    const matched = allProducts.filter((p) => matchesCategorySlug(p, targetSlug));

    if (matched.length > 0) {
      return { categoryProducts: matched, isShowingFallback: false };
    }

    // If subcategory had 0 direct hits, try parent category
    if (subcategory && category) {
      const parentMatched = allProducts.filter((p) => matchesCategorySlug(p, category));
      if (parentMatched.length > 0) {
        return { categoryProducts: parentMatched, isShowingFallback: false };
      }
    }

    return { categoryProducts: allProducts, isShowingFallback: allProducts.length > 0 };
  }, [allProducts, category, subcategory, keyword]);

  // Apply user sidebar filters & sorting
  const filteredProducts = useMemo(() => {
    return categoryProducts
      .filter((product) => {
        const price = parseFloat(product.new_price ?? product.salePrice ?? product.price ?? 0);
        const oldPrice = parseFloat(product.old_price ?? product.price ?? 0);

        if (priceRange.min !== '' && Number.isFinite(Number(priceRange.min))) {
          if (price < Number(priceRange.min)) return false;
        }
        if (priceRange.max !== '' && Number.isFinite(Number(priceRange.max))) {
          if (price > Number(priceRange.max)) return false;
        }

        if (selectedMaterials.length > 0) {
          const haystack = `${product.wooden_type || ''} ${product.material || ''} ${product.name || ''} ${product.description || ''}`.toLowerCase();
          const hasMatch = selectedMaterials.some((token) => haystack.includes(token.toLowerCase()));
          if (!hasMatch) return false;
        }

        if (inStockOnly) {
          const stockVal = product.stock;
          if (stockVal !== undefined && stockVal !== null && Number(stockVal) <= 0) return false;
        }

        if (onSaleOnly) {
          if (!(oldPrice > price && price > 0)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = parseFloat(a.new_price ?? a.salePrice ?? a.price ?? 0);
        const priceB = parseFloat(b.new_price ?? b.salePrice ?? b.price ?? 0);

        switch (sortBy) {
          case 'price-low':
            return priceA - priceB;
          case 'price-high':
            return priceB - priceA;
          case 'name-asc':
            return String(a.name || '').localeCompare(String(b.name || ''));
          case 'name-desc':
            return String(b.name || '').localeCompare(String(a.name || ''));
          case 'newest':
          default:
            return Number(b.id || 0) - Number(a.id || 0);
        }
      });
  }, [categoryProducts, priceRange, selectedMaterials, inStockOnly, onSaleOnly, sortBy]);

  // Resolve clean display title & description
  const activeAdminCategory = findCategoryBySlug(adminCategories, category);
  const activeAdminSubcategory = subcategory ? findCategoryBySlug(adminCategories, subcategory) : null;

  const getCurrentCategoryInfo = () => {
    if (keyword) {
      const cleanKeyword = keyword.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
      return {
        eyebrow: 'Curated Selection',
        title: `Best ${cleanKeyword} in Nepal`,
        description: `Shop handcrafted solid wood ${cleanKeyword.toLowerCase()} with direct showroom delivery across Kathmandu and Nepal.`,
        keywords: `best ${cleanKeyword.toLowerCase()} Nepal, Sindureghari Furniture`,
      };
    }

    const lookupSlug = subcategory ? slugifyCategory(subcategory) : category;
    if (categoryInfo[lookupSlug]) {
      return categoryInfo[lookupSlug];
    }

    const cleanName =
      activeAdminSubcategory?.name ||
      activeAdminCategory?.name ||
      titleFromSlug(lookupSlug || 'Furniture');

    const formattedTitle = String(cleanName)
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return {
      eyebrow: 'Sindureghari Showroom',
      title: formattedTitle,
      description: `Explore our handcrafted ${formattedTitle.toLowerCase()} collection—built from seasoned solid timber with custom sizing and free delivery across Nepal.`,
      keywords: `${formattedTitle.toLowerCase()} Nepal, buy ${formattedTitle.toLowerCase()} Sindureghari Furniture`,
    };
  };

  const currentCategoryInfo = getCurrentCategoryInfo();
  const categoryLabel = currentCategoryInfo.title;
  const subcategoryLabel = activeAdminSubcategory?.name || (subcategory ? titleFromSlug(subcategory) : '');

  const toggleMaterial = (token) => {
    setSelectedMaterials((prev) =>
      prev.includes(token) ? prev.filter((item) => item !== token) : [...prev, token]
    );
  };

  const clearAllFilters = () => {
    setPriceRange({ min: '', max: '' });
    setSelectedMaterials([]);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSortBy('newest');
  };

  const hasActiveFilters =
    priceRange.min !== '' ||
    priceRange.max !== '' ||
    selectedMaterials.length > 0 ||
    inStockOnly ||
    onSaleOnly;

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = filteredProducts.length > visibleCount;

  const breadcrumbsList = [
    { name: 'Home', url: 'https://sinduregharifurniture.shop/' },
    { name: categoryLabel, url: `https://sinduregharifurniture.shop/category/${category}` },
  ];
  if (subcategory) {
    breadcrumbsList.push({
      name: subcategoryLabel,
      url: `https://sinduregharifurniture.shop/category/${category}/${subcategory}`,
    });
  }

  return (
    <>
      <SEOComponent
        title={`${currentCategoryInfo.title} | Sindureghari Furniture Nepal`}
        description={currentCategoryInfo.description}
        keywords={currentCategoryInfo.keywords}
        ogTitle={`${currentCategoryInfo.title} | Sindureghari Furniture`}
        ogDescription={currentCategoryInfo.description}
        canonicalUrl={`https://sinduregharifurniture.shop/category/${category}${subcategory ? `/${subcategory}` : ''}`}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbsList} />

      <div className="bkf-category-page">
        {/* ── Warm Architectural Editorial Header (Aligned with 1600px Navbar Logo) ── */}
        <header className="bkf-cat-hero">
          <div className="bkf-category__container">
            {/* Breadcrumb Row */}
            <nav className="bkf-cat-breadcrumb" aria-label="Breadcrumb">
              <button type="button" onClick={() => navigate('/')} className="bkf-crumb-link">
                Home
              </button>
              <ChevronRight size={13} className="bkf-crumb-sep" />
              <button type="button" onClick={() => navigate('/products')} className="bkf-crumb-link">
                Collections
              </button>
              <ChevronRight size={13} className="bkf-crumb-sep" />
              <span className="bkf-crumb-current">
                {subcategory ? subcategoryLabel : currentCategoryInfo.title}
              </span>
            </nav>

            <div className="bkf-cat-hero__grid">
              <div className="bkf-cat-hero__text">
                <span className="bkf-cat-hero__eyebrow">
                  <Sparkles size={13} />
                  {currentCategoryInfo.eyebrow || 'Handcrafted Collection'}
                </span>
                <h1 className="bkf-cat-hero__title">{currentCategoryInfo.title}</h1>
                <p className="bkf-cat-hero__desc">{currentCategoryInfo.description}</p>
              </div>

              {/* Assurance Badges Card */}
              <div className="bkf-cat-hero__assurances">
                <div className="bkf-assurance-item">
                  <div className="bkf-assurance-icon">
                    <Truck size={18} />
                  </div>
                  <div>
                    <strong>Free Home Delivery</strong>
                    <span>Safe dispatch across Nepal</span>
                  </div>
                </div>
                <div className="bkf-assurance-item">
                  <div className="bkf-assurance-icon">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <strong>10-Year Timber Warranty</strong>
                    <span>Kiln-dried & termite treated</span>
                  </div>
                </div>
                <div className="bkf-assurance-item">
                  <div className="bkf-assurance-icon">
                    <Ruler size={18} />
                  </div>
                  <div>
                    <strong>Custom Room Sizing</strong>
                    <span>Tailored to your floor plan</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Category Switcher Bar */}
            <div className="bkf-cat-pills-bar" role="navigation" aria-label="Quick category switch">
              {QUICK_CATEGORY_PILLS.map((pill) => {
                const isCurrent = category === pill.slug;
                return (
                  <button
                    key={pill.slug}
                    type="button"
                    className={`bkf-cat-nav-pill ${isCurrent ? 'active' : ''}`}
                    onClick={() => navigate(pill.path)}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* ── Main Catalog Workspace ── */}
        <div className="bkf-category__main-content">
          <div className="bkf-category__container">
            <div className="bkf-category__content-wrapper">
              {/* Left Filter Sidebar */}
              <aside className="bkf-category__sidebar" aria-label="Product Filters">
                <div className="bkf-category__sidebar-header">
                  <div className="bkf-sidebar-title-group">
                    <Filter size={16} />
                    <h3>Refine Collection</h3>
                  </div>
                  {hasActiveFilters && (
                    <button type="button" onClick={clearAllFilters} className="bkf-category__clear-all">
                      <RotateCcw size={12} /> Reset
                    </button>
                  )}
                </div>

                {/* Availability & Offers */}
                <div className="bkf-category__filter-section">
                  <h4 className="bkf-category__filter-title">Availability & Deals</h4>
                  <div className="bkf-filter-toggles">
                    <label className={`bkf-toggle-row ${inStockOnly ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                      />
                      <span className="bkf-check-box">
                        {inStockOnly && <Check size={12} />}
                      </span>
                      <span className="bkf-toggle-label">In Stock Ready to Ship</span>
                    </label>

                    <label className={`bkf-toggle-row ${onSaleOnly ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={onSaleOnly}
                        onChange={(e) => setOnSaleOnly(e.target.checked)}
                      />
                      <span className="bkf-check-box">
                        {onSaleOnly && <Check size={12} />}
                      </span>
                      <span className="bkf-toggle-label">Special Discount Offers</span>
                    </label>
                  </div>
                </div>

                {/* Price Budget Filter */}
                <div className="bkf-category__filter-section">
                  <h4 className="bkf-category__filter-title">Price Budget</h4>
                  <div className="bkf-category__price-presets">
                    {PRICE_PRESETS.map((tier, idx) => {
                      const isSelected = priceRange.min === tier.min && priceRange.max === tier.max;
                      return (
                        <button
                          key={idx}
                          type="button"
                          className={`bkf-category__preset-pill ${isSelected ? 'active' : ''}`}
                          onClick={() => setPriceRange({ min: tier.min, max: tier.max })}
                        >
                          <span>{tier.label}</span>
                          {isSelected && <Check size={14} />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="bkf-category__custom-price-inputs">
                    <div className="price-input-wrapper">
                      <span className="price-currency">Rs.</span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                        className="bkf-category__price-num-input"
                      />
                    </div>
                    <span className="price-input-to">–</span>
                    <div className="price-input-wrapper">
                      <span className="price-currency">Rs.</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                        className="bkf-category__price-num-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Timber & Material Filter */}
                <div className="bkf-category__filter-section">
                  <h4 className="bkf-category__filter-title">Timber & Upholstery</h4>
                  <div className="bkf-filter-toggles">
                    {MATERIAL_FILTERS.map((mat) => {
                      const isChecked = selectedMaterials.includes(mat.token);
                      return (
                        <label key={mat.token} className={`bkf-toggle-row ${isChecked ? 'checked' : ''}`}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleMaterial(mat.token)}
                          />
                          <span className="bkf-check-box">
                            {isChecked && <Check size={12} />}
                          </span>
                          <span className="bkf-toggle-label">{mat.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Bespoke Custom Order Card */}
                <div className="bkf-sidebar-bespoke-card">
                  <span className="bkf-bespoke-tag">Bespoke Atelier</span>
                  <h4>Need Custom Size or Fabric?</h4>
                  <p>We craft sofas, beds & wardrobes to your exact room dimensions.</p>
                  <a
                    href="https://wa.me/9779845427041?text=Hi%20Sindureghari%20Furniture,%20I%20would%20like%20to%20inquire%20about%20customizing%20furniture."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bkf-bespoke-btn"
                  >
                    <MessageCircle size={15} />
                    <span>Chat with Artisan</span>
                  </a>
                </div>
              </aside>

              {/* Right Products Area */}
              <div className="bkf-category__products-section">
                {/* Top Control Bar */}
                <div className="bkf-category__controls">
                  <div className="bkf-controls-summary">
                    <SlidersHorizontal size={15} className="bkf-controls-icon" />
                    {!loading ? (
                      <span>
                        Showing <strong>{visibleProducts.length}</strong> of{' '}
                        <strong>{filteredProducts.length}</strong> handcrafted pieces
                      </span>
                    ) : (
                      <span>Loading showroom catalogue...</span>
                    )}
                  </div>

                  <div className="bkf-category__controls-right">
                    <label htmlFor="bkf-sort-select" className="bkf-category__sort-label">
                      Sort by:
                    </label>
                    <select
                      id="bkf-sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bkf-category__sort-select"
                    >
                      <option value="newest">Featured & Newest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name-asc">Name: A to Z</option>
                    </select>
                  </div>
                </div>

                {/* Active Filter Chips */}
                {hasActiveFilters && (
                  <div className="bkf-active-filters-bar">
                    {inStockOnly && (
                      <button type="button" className="bkf-filter-chip" onClick={() => setInStockOnly(false)}>
                        In Stock <span>✕</span>
                      </button>
                    )}
                    {onSaleOnly && (
                      <button type="button" className="bkf-filter-chip" onClick={() => setOnSaleOnly(false)}>
                        On Sale <span>✕</span>
                      </button>
                    )}
                    {(priceRange.min || priceRange.max) && (
                      <button
                        type="button"
                        className="bkf-filter-chip"
                        onClick={() => setPriceRange({ min: '', max: '' })}
                      >
                        Price: {priceRange.min || '0'} – {priceRange.max || 'Any'} <span>✕</span>
                      </button>
                    )}
                    {selectedMaterials.map((token) => (
                      <button
                        key={token}
                        type="button"
                        className="bkf-filter-chip"
                        onClick={() => toggleMaterial(token)}
                      >
                        {MATERIAL_FILTERS.find((m) => m.token === token)?.label || token} <span>✕</span>
                      </button>
                    ))}
                    <button type="button" className="bkf-chip-reset-link" onClick={clearAllFilters}>
                      Clear all
                    </button>
                  </div>
                )}

                {isShowingFallback && !loading && (
                  <div className="bkf-category__fallback-notice">
                    <div>
                      <span className="bkf-fallback-kicker">Showroom Catalogue</span>
                      <p>
                        Showing our complete handcrafted furniture collection while new{' '}
                        <strong>{currentCategoryInfo.title}</strong> pieces are being photographed.
                      </p>
                    </div>
                  </div>
                )}

                {/* Product Grid */}
                {loading ? (
                  <div className="bkf-category__products-grid">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <ProductSkeleton key={i} />
                    ))}
                  </div>
                ) : error ? (
                  <div className="bkf-category__error-state">
                    <h3>Unable to load catalogue</h3>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className="bkf-category__retry-btn">
                      Retry Loading
                    </button>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="bkf-category__empty-state">
                    <h3>No matching furniture pieces found</h3>
                    <p>Try clearing one of your active price or material filters to see more options.</p>
                    <button type="button" onClick={clearAllFilters} className="bkf-category__retry-btn">
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="bkf-category__products-grid">
                      {visibleProducts.map((product) => (
                        <ProductCard key={product.id || product._id} product={product} />
                      ))}
                    </div>

                    {hasMore && (
                      <div className="bkf-category__load-more-wrap">
                        <button
                          type="button"
                          className="bkf-category__load-more-btn"
                          onClick={() => setVisibleCount((prev) => prev + 24)}
                        >
                          Show More Furniture ({filteredProducts.length - visibleCount} remaining)
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Clean Editorial Buying Guide & FAQ */}
            <CategorySEOSection title={currentCategoryInfo.title} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
