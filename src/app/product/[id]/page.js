import ProductDetails from "@/component/productdetails/Productdetails";
import { slugifyText } from "@/data/nepalSeo";
import { redirect } from "next/navigation";
import { cache } from "react";

const SITE_URL = "https://sinduregharifurniture.shop";
const API_URL =
  process.env.NEXT_PUBLIC_DEV_API_URL ||
  process.env.REACT_APP_PROD_API_URL ||
  "https://furnituresinduregharibackend.vercel.app";

const getProduct = cache(async (id) => {
  try {
    const res = await fetch(`${API_URL}/api/products/${id}?fresh=1`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
});

const generateImageAlt = (product, name) => {
  if (product.image_alt) return product.image_alt;
  const color = product.product_color ? `${product.product_color} ` : '';
  const material = product.wooden_type ? `${product.wooden_type} ` : '';
  return `${color}${material}${name}`.trim() || "Sindureghari Furniture";
};

const normalizeProductImages = (product = {}, name = "Sindureghari Furniture") => {
  const images = [];
  let parsedImageUrls = [];
  const altText = generateImageAlt(product, name);

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
      if (url) images.push({ url, width: 1200, height: 630, alt: altText });
    });
  }

  if (product.imageUrl) {
    images.push({ url: product.imageUrl, width: 1200, height: 630, alt: altText });
  }

  if (Array.isArray(product.image_paths)) {
    product.image_paths.forEach((path) => {
      if (!path) return;
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      images.push({ url: `${API_URL}${cleanPath}`, width: 1200, height: 630, alt: altText });
    });
  }

  if (product.image) {
    images.push({ url: product.image, width: 1200, height: 630, alt: altText });
  }

  return images;
};

const generateSmartTitle = (product, name) => {
  if (product.seo_title) return product.seo_title;
  
  let title = name;
  if (product.product_color) title = `${product.product_color} ${title}`;
  if (product.wooden_type) title = `${title} in ${product.wooden_type}`;
  
  const categoryStr = product.categoryName || product.categorySlug ? ` — ${product.categoryName || (product.categorySlug && product.categorySlug.replace(/-/g, ' '))}` : '';
  return `${title}${categoryStr} | Sindureghari Furniture Nepal`;
};

const generateSmartDescription = (product, name) => {
  if (product.seo_description) return product.seo_description;
  
  const price = product.new_price || product.salePrice || product.price;
  const priceStr = price ? ` at Rs. ${price}` : '';
  const colorStr = product.product_color ? ` in ${product.product_color}` : '';
  const materialStr = product.wooden_type ? ` made of ${product.wooden_type}` : '';
  const categoryStr = product.categoryName ? ` Explore our ${product.categoryName} collection.` : '';
  
  return `Buy ${name}${colorStr}${materialStr}${priceStr} from Sindureghari Furniture Nepal.${categoryStr} Delivery across Nepal.`;
};

export async function generateMetadata({ params }) {
  const { id, slug } = await params;

  try {
    const data = await getProduct(id);
    if (!data) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
        robots: { index: false, follow: false },
      };
    }

    const product = data.product || data;
    const name = product.name || product.title || "Furniture";
    const description = generateSmartDescription(product, name);
    const images = normalizeProductImages(product, name);
    const title = generateSmartTitle(product, name);
    const cleanTitle = title.length > 60 ? `${title.substring(0, 57)}...` : title;
    const canonicalSlug = `${slugifyText(name)}-price-in-nepal`;
    const canonicalUrl = `${SITE_URL}/product/${id}/${canonicalSlug}`;

    return {
      title: cleanTitle,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: cleanTitle,
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
  let canonicalRedirectPath = null;

  try {
    const data = await getProduct(id);

    if (data) {
      const product = data.product || data;
      const name = product.name || product.title || "Furniture";
      const price = product.new_price || product.salePrice || product.price || "0";
      const description = generateSmartDescription(product, name);
      const canonicalSlug = `${slugifyText(name)}-price-in-nepal`;
      const canonicalUrl = `${SITE_URL}/product/${id}/${canonicalSlug}`;
      const images = normalizeProductImages(product, name);
      const imageUrl = images[0]?.url || `${SITE_URL}/logo.png`;

      if (slug !== canonicalSlug) {
        canonicalRedirectPath = `/product/${id}/${canonicalSlug}`;
      }

      productJsonLd = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name,
        image: imageUrl,
        description,
        sku: product.sku || "SKU-DEFAULT",
        color: product.product_color || undefined,
        material: product.wooden_type || undefined,
        category: product.categoryName || product.categorySlug || undefined,
        brand: {
          "@type": "Brand",
          name: product.manufacturer || "Sindureghari Furniture",
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

  if (canonicalRedirectPath) {
    redirect(canonicalRedirectPath);
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
