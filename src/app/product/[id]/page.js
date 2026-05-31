import ProductDetails from '@/component/productdetails/Productdetails';
import { slugifyText } from '@/data/nepalSeo';

const SITE_URL = "https://sinduregharifurniture.shop";
const API_URL = process.env.NEXT_PUBLIC_DEV_API_URL || process.env.REACT_APP_PROD_API_URL || "https://furnituresinduregharibackend.vercel.app";

export async function generateMetadata({ params }) {
  const { id, slug } = await params;

  try {
    // Corrected backend endpoint from /products/:id to /api/products/:id
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      next: { revalidate: 3600 }, // ISR: revalidate every hour
    });

    if (!res.ok) {
      console.warn(`Product metadata fetch failed for ID: ${id}. Status: ${res.status}`);
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
      };
    }

    const data = await res.json();
    const product = data.product || data;

    const name = product.name || product.title || "Furniture";
    const price = product.new_price || product.salePrice || product.price || "";
    const description = product.description
      ? product.description.substring(0, 155).trim() + "…"
      : `Buy ${name} online at Sindureghari Furniture Nepal. Handcrafted solid wood. Free delivery to Kathmandu.`;

    // Robust image URL parsing to feed Open Graph og:image
    const images = [];
    let parsedImageUrls = [];
    
    if (product.imageUrls) {
      try {
        parsedImageUrls = typeof product.imageUrls === 'string'
          ? JSON.parse(product.imageUrls)
          : product.imageUrls;
      } catch (e) {
        console.error('Error parsing product.imageUrls in metadata generation:', e);
      }
    }
    
    if (!Array.isArray(parsedImageUrls)) {
      parsedImageUrls = [];
    }

    if (parsedImageUrls.length > 0) {
      parsedImageUrls.forEach((imgUrl) => {
        if (imgUrl) {
          images.push({ url: imgUrl, width: 1200, height: 630, alt: name });
        }
      });
    } else if (product.imageUrl) {
      images.push({ url: product.imageUrl, width: 1200, height: 630, alt: name });
    } else if (product.image_paths && product.image_paths.length > 0) {
      product.image_paths.forEach((path) => {
        if (path) {
          const cleanPath = path.startsWith('/') ? path : `/${path}`;
          images.push({ url: `${API_URL}${cleanPath}`, width: 1200, height: 630, alt: name });
        }
      });
    } else if (product.image) {
      images.push({ url: product.image, width: 1200, height: 630, alt: name });
    }

    const titleStr = `${name} Price in Nepal | Sindureghari Furniture`;

    const cleanTitle = titleStr.length > 60 ? titleStr.substring(0, 57) + "…" : titleStr;
    const canonicalSlug = slug || `${slugifyText(name)}-price-in-nepal`;
    const canonicalUrl = `${SITE_URL}/product/${id}/${canonicalSlug}`;

    return {
      title: cleanTitle,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${name} — Sindureghari Furniture Nepal`,
        description,
        url: canonicalUrl,
        type: "website",
        images: images.length > 0 ? images : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: name,
        description,
        images: images.length > 0 ? [images[0].url] : undefined,
      },
      robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    };
  } catch (error) {
    console.error("Product metadata generation fallback triggered:", error);
    const fallbackTitle = "Premium Handcrafted Furniture | Sindureghari Nepal";
    const fallbackDesc = "Shop premium handcrafted wooden furniture online. Free delivery across Nepal. High quality solid wood beds, sofas, and dining sets.";
    const fallbackImage = `${SITE_URL}/logo.png`; // Fallback image if absolute path fails

    return {
      title: fallbackTitle,
      description: fallbackDesc,
      alternates: {
        canonical: `${SITE_URL}/product/${id}`,
      },
      openGraph: {
        title: fallbackTitle,
        description: fallbackDesc,
        url: `${SITE_URL}/product/${id}`,
        type: "website",
        images: [{ url: fallbackImage, width: 1200, height: 630, alt: "Sindureghari Furniture" }],
      },
      twitter: {
        card: "summary_large_image",
        title: fallbackTitle,
        description: fallbackDesc,
        images: [fallbackImage],
      },
    };
  }
}

export default async function Page({ params }) {
  const { id, slug } = await params;
  
  let productJsonLd = null;
  let breadcrumbJsonLd = null;

  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const product = data.product || data;
      
      const name = product.name || product.title || "Furniture";
      const price = product.new_price || product.salePrice || product.price || "0";
      const description = product.description
        ? product.description.substring(0, 155).trim() + "…"
        : `Buy ${name} online at Sindureghari Furniture Nepal.`;
      const canonicalSlug = slug || `${slugifyText(name)}-price-in-nepal`;
      const canonicalUrl = `${SITE_URL}/product/${id}/${canonicalSlug}`;
      
      let imageUrl = `${SITE_URL}/logo.png`;
      if (product.imageUrl) {
        imageUrl = product.imageUrl;
      } else if (product.image) {
        imageUrl = product.image;
      }
      
      productJsonLd = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": name,
        "image": imageUrl,
        "description": description,
        "brand": {
          "@type": "Brand",
          "name": "Sindureghari Furniture"
        },
        "offers": {
          "@type": "Offer",
          "url": canonicalUrl,
          "priceCurrency": "NPR",
          "price": price,
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition"
        }
      };

      breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": SITE_URL
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": `${SITE_URL}/products`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": name,
            "item": canonicalUrl
          }
        ]
      };
    }
  } catch (error) {
    console.error("Failed to generate Product JSON-LD:", error);
  }

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      <ProductDetails productId={id} />
    </>
  );
}
