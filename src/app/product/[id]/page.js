import ProductDetails from '@/component/productdetails/Productdetails';

const SITE_URL = "https://sinduregharifurniture.shop";
const API_URL = process.env.NEXT_PUBLIC_DEV_API_URL || process.env.REACT_APP_PROD_API_URL || "https://furnituresinduregharibackend.vercel.app";

/**
 * Dynamic metadata for individual product pages.
 * Fetches product data from the API at build/request time for SSR SEO.
 */
export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      next: { revalidate: 3600 }, // ISR: revalidate every hour
    });

    if (!res.ok) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
      };
    }

    const data = await res.json();
    const product = data.product || data;

    const name = product.name || "Furniture";
    const price = product.new_price || product.salePrice || product.price || "";
    const description = product.description
      ? product.description.substring(0, 155) + "…"
      : `Buy ${name} online at Sindureghari Furniture Nepal. Handcrafted solid wood. Free delivery to Kathmandu.`;

    const images = [];
    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => {
        const url = typeof img === "string" ? img : img.url || img.secure_url;
        if (url) images.push({ url, width: 1200, height: 630, alt: name });
      });
    } else if (product.image) {
      images.push({ url: product.image, width: 1200, height: 630, alt: name });
    }

    const titleStr = price
      ? `${name} — Rs ${Number(price).toLocaleString("en-NP")} | Buy Online`
      : `${name} | Buy Online Nepal`;

    return {
      title: titleStr.length > 60 ? titleStr.substring(0, 57) + "…" : titleStr,
      description,
      alternates: {
        canonical: `${SITE_URL}/product/${id}`,
      },
      openGraph: {
        title: `${name} — Sindureghari Furniture Nepal`,
        description,
        url: `${SITE_URL}/product/${id}`,
        type: "product",
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
  } catch {
    return {
      title: "Premium Furniture | Sindureghari Nepal",
      description: "Shop handcrafted wooden furniture online. Free delivery across Nepal.",
    };
  }
}

export default function Page() {
  return <ProductDetails />;
}
