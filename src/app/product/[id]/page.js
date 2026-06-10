import ProductDetails from "@/component/productdetails/Productdetails";
import { slugifyText } from "@/data/nepalSeo";

const SITE_URL = "https://sinduregharifurniture.shop";
const API_URL =
  process.env.NEXT_PUBLIC_DEV_API_URL ||
  process.env.REACT_APP_PROD_API_URL ||
  "https://furnituresinduregharibackend.vercel.app";

const normalizeProductImages = (product = {}, name = "Sindureghari Furniture") => {
  const images = [];
  let parsedImageUrls = [];

  if (product.imageUrls) {
    try {
      parsedImageUrls =
        typeof product.imageUrls === "string"
          ? JSON.parse(product.imageUrls)
          : product.imageUrls;
    } catch (error) {
      console.error("Error parsing product.imageUrls in metadata generation:", error);
    }
  }

  if (Array.isArray(parsedImageUrls)) {
    parsedImageUrls.forEach((url) => {
      if (url) images.push({ url, width: 1200, height: 630, alt: name });
    });
  }

  if (product.imageUrl) {
    images.push({ url: product.imageUrl, width: 1200, height: 630, alt: name });
  }

  if (Array.isArray(product.image_paths)) {
    product.image_paths.forEach((path) => {
      if (!path) return;
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      images.push({ url: `${API_URL}${cleanPath}`, width: 1200, height: 630, alt: name });
    });
  }

  if (product.image) {
    images.push({ url: product.image, width: 1200, height: 630, alt: name });
  }

  return images;
};

const productDescription = (product = {}, name = "Furniture") =>
  product.description
    ? `${String(product.description).substring(0, 155).trim()}...`
    : `Explore ${name} at Sindureghari Furniture Nepal with product details, pricing and delivery support.`;

export async function generateMetadata({ params }) {
  const { id, slug } = await params;

  try {
    const res = await fetch(`${API_URL}/api/products/${id}?fresh=1`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`Product metadata fetch failed for ID: ${id}. Status: ${res.status}`);
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const data = await res.json();
    const product = data.product || data;
    const name = product.name || product.title || "Furniture";
    const description = productDescription(product, name);
    const images = normalizeProductImages(product, name);
    const title = `${name} | Sindureghari Furniture Nepal`;
    const cleanTitle = title.length > 60 ? `${title.substring(0, 57)}...` : title;
    const canonicalSlug = slug || `${slugifyText(name)}-price-in-nepal`;
    const canonicalUrl = `${SITE_URL}/product/${id}/${canonicalSlug}`;

    return {
      title: cleanTitle,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${name} | Sindureghari Furniture Nepal`,
        description,
        url: canonicalUrl,
        type: "website",
        images: images.length > 0 ? images : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: cleanTitle,
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
    const fallbackDesc =
      "Shop premium handcrafted wooden furniture online from Sindureghari Furniture Nepal, including sofas, beds, dining sets and custom home furniture.";
    const fallbackImage = `${SITE_URL}/logo.png`;

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
    const res = await fetch(`${API_URL}/api/products/${id}?fresh=1`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      const product = data.product || data;
      const name = product.name || product.title || "Furniture";
      const price = product.new_price || product.salePrice || product.price || "0";
      const description = productDescription(product, name);
      const canonicalSlug = slug || `${slugifyText(name)}-price-in-nepal`;
      const canonicalUrl = `${SITE_URL}/product/${id}/${canonicalSlug}`;
      const images = normalizeProductImages(product, name);
      const imageUrl = images[0]?.url || `${SITE_URL}/logo.png`;

      productJsonLd = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name,
        image: imageUrl,
        description,
        brand: {
          "@type": "Brand",
          name: "Sindureghari Furniture",
        },
        offers: {
          "@type": "Offer",
          url: canonicalUrl,
          priceCurrency: "NPR",
          price,
          availability:
            Number(product.stock || 0) > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
        },
      };

      breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Products",
            item: `${SITE_URL}/products`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name,
            item: canonicalUrl,
          },
        ],
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
