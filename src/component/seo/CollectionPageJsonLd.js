'use client';

/**
 * CollectionPageJsonLd — Renders CollectionPage + ItemList structured data
 * for category/product listing pages. This helps Google show rich results
 * with product carousels in search results.
 */

const SITE_URL = 'https://sinduregharifurniture.shop';

export default function CollectionPageJsonLd({ 
  name, 
  description, 
  url, 
  products = [],
  breadcrumbs = [] 
}) {
  const jsonLd = [];

  // CollectionPage schema
  const collectionPage = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: url.startsWith('http') ? url : `${SITE_URL}${url}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Sindureghari Furniture',
      url: SITE_URL,
    },
  };

  // Add ItemList if we have products
  if (products.length > 0) {
    collectionPage.mainEntity = {
      '@type': 'ItemList',
      itemListElement: products.slice(0, 10).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.name || product.product_name,
          url: `${SITE_URL}/product/${product.id || product._id}`,
          image: product.image || product.images?.[0],
          description: product.description?.substring(0, 200),
          offers: {
            '@type': 'Offer',
            priceCurrency: 'NPR',
            price: product.sale_price || product.price,
            availability: product.stock > 0 
              ? 'https://schema.org/InStock' 
              : 'https://schema.org/OutOfStock',
            seller: {
              '@type': 'Organization',
              name: 'Sindureghari Furniture',
            },
          },
        },
      })),
    };
  }

  jsonLd.push(collectionPage);

  // BreadcrumbList
  if (breadcrumbs.length > 0) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
      })),
    });
  }

  return (
    <>
      {jsonLd.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}
