'use client';

/**
 * BreadcrumbJsonLd — Renders BreadcrumbList structured data
 * This helps Google show breadcrumb navigation in search results
 * instead of showing the raw URL/domain.
 * 
 * Usage:
 *   <BreadcrumbJsonLd items={[
 *     { name: 'Home', url: '/' },
 *     { name: 'Living Room', url: '/category/living-room' },
 *     { name: 'Sofa Sets', url: '/category/living-room?type=sofa-sets' },
 *   ]} />
 */

const SITE_URL = 'https://sinduregharifurniture.shop';

export default function BreadcrumbJsonLd({ items }) {
  if (!items || items.length === 0) return null;

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
    />
  );
}
