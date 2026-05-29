/**
 * SiteLinksJsonLd — Renders SiteNavigationElement structured data
 * This helps Google show sitelinks with dropdown navigation
 * in search results (like WoodenStreet and other big furniture sites).
 * 
 * Rendered server-side in layout.js
 */

const SITE_URL = 'https://sinduregharifurniture.shop';

const navigationItems = [
  {
    '@type': 'SiteNavigationElement',
    name: 'Living Room Furniture',
    url: `${SITE_URL}/living-room-furniture`,
    description: 'Handcrafted sofas, TV units & lounge furniture in Nepal',
  },
  {
    '@type': 'SiteNavigationElement',
    name: 'Bedroom Furniture',
    url: `${SITE_URL}/category/bedroom`,
    description: 'Luxury beds, wardrobes & dressing tables in Nepal',
  },
  {
    '@type': 'SiteNavigationElement',
    name: 'Dining Room Furniture',
    url: `${SITE_URL}/category/dining-room`,
    description: 'Dining sets, crockery units & bar cabinets',
  },
  {
    '@type': 'SiteNavigationElement',
    name: 'Office Furniture',
    url: `${SITE_URL}/office-furniture`,
    description: 'Desks, ergonomic chairs & office storage',
  },
  {
    '@type': 'SiteNavigationElement',
    name: 'Modular Kitchens',
    url: `${SITE_URL}/category/modular-kitchens`,
    description: 'Custom kitchen cabinets, pantry & countertops',
  },
  {
    '@type': 'SiteNavigationElement',
    name: 'Sofa Sets',
    url: `${SITE_URL}/sofas`,
    description: 'Royal teak & sisau wooden sofa sets in Nepal',
  },
  {
    '@type': 'SiteNavigationElement',
    name: 'Wooden Beds',
    url: `${SITE_URL}/beds`,
    description: 'King & queen size solid wood beds in Nepal',
  },
  {
    '@type': 'SiteNavigationElement',
    name: 'Wardrobes',
    url: `${SITE_URL}/wardrobes`,
    description: 'Spacious wooden wardrobes and storage cabinets',
  },
  {
    '@type': 'SiteNavigationElement',
    name: 'Dining Tables',
    url: `${SITE_URL}/dining-tables`,
    description: '4, 6 & 8 seater wooden dining sets',
  },
  {
    '@type': 'SiteNavigationElement',
    name: 'Special Offers',
    url: `${SITE_URL}/category/offers`,
    description: 'Upto 50% OFF on premium furniture in Nepal',
  },
  {
    '@type': 'SiteNavigationElement',
    name: 'Our Stores',
    url: `${SITE_URL}/stores`,
    description: 'Visit Sindureghari Furniture showrooms in Nepal',
  },
  {
    '@type': 'SiteNavigationElement',
    name: 'Contact Us',
    url: `${SITE_URL}/contact`,
    description: 'Get in touch with Sindureghari Furniture',
  },
  {
    '@type': 'SiteNavigationElement',
    name: 'Blog',
    url: `${SITE_URL}/blog`,
    description: 'Furniture tips, interior design ideas & buying guides',
  },
];

export function getSiteNavigationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: navigationItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SiteNavigationElement',
        name: item.name,
        url: item.url,
        description: item.description,
      },
    })),
  };
}

export default navigationItems;
