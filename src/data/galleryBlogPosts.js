import { APP_ENDPOINTS, buildApiUrl } from "@/config/api";

export const slugify = (value = "") => String(value)
  .toLowerCase()
  .replace(/&/g, " and ")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .slice(0, 90);

export const parseGalleryImages = (product = {}) => {
  const images = [];
  if (Array.isArray(product.images)) images.push(...product.images);
  if (product.imageUrl) images.push(product.imageUrl);
  if (product.image_url) images.push(product.image_url);
  if (product.image1) images.push(product.image1);
  if (product.imageUrls) {
    try {
      const parsed = typeof product.imageUrls === "string" ? JSON.parse(product.imageUrls) : product.imageUrls;
      if (Array.isArray(parsed)) images.push(...parsed);
    } catch {
      // Older products may store malformed image JSON.
    }
  }
  return [...new Set(images.filter(Boolean))];
};

const productId = (product = {}) => product.id || product._id || product.productId || product.sku || product.name;

const categoryName = (product = {}) => product.categoryName || product.category || "Furniture";

const buildContent = (product, image) => {
  const name = product.name || product.title || "Premium Furniture";
  const category = categoryName(product);
  return `
    <p><strong>${name}</strong> is part of the Sindureghari Furniture gallery, selected for customers looking for premium ${category.toLowerCase()} in Nepal.</p>
    <h2>${name} design and use</h2>
    <p>This design is useful for buyers comparing real product photos, room fit, finish, and material style before visiting the showroom or placing an order request. Product-gallery images help customers understand scale, color, texture, and how the furniture may look inside a Nepalese home.</p>
    <h2>Buying checklist for ${category.toLowerCase()}</h2>
    <p>Before choosing this type of furniture, check the available size, wood or material, polish, upholstery, storage options, delivery access, and warranty support. For large items, measure doors, stairs, room width, and walking space.</p>
    <h2>Why order from Sindureghari Furniture?</h2>
    <p>Sindureghari Furniture helps customers compare gallery products, request custom sizes, and choose furniture that matches daily use, home style, and budget. Visit the showroom or browse the product catalog for current availability.</p>
    ${image ? `<p><img src="${image}" alt="${name} by Sindureghari Furniture" /></p>` : ""}
  `;
};

export const buildGalleryBlogPosts = (products = []) => products
  .flatMap((product) => {
    const images = parseGalleryImages(product);
    const image = images[0];
    const name = product.name || product.title;
    if (!name || !image) return [];

    const id = productId(product);
    const category = categoryName(product);
    const slug = `${slugify(name)}-${slugify(id)}`;

    return [{
      id: `gallery-blog-${id}`,
      product_id: id,
      slug,
      title: name,
      excerpt: `Explore ${name} from Sindureghari Furniture with product photos, buying tips, room-fit advice, and SEO-friendly furniture guidance for Nepal.`,
      content: buildContent(product, image),
      category,
      image_url: image,
      created_at: product.created_at || product.createdAt || "2026-06-10T00:00:00.000Z",
      updated_at: product.updated_at || product.updatedAt || product.created_at || "2026-06-10T00:00:00.000Z",
      first_name: "Sindureghari",
      last_name: "Furniture",
      meta_title: `${name} in Nepal | Sindureghari Furniture`,
      meta_description: `View ${name} product photos, furniture buying tips, and showroom guidance from Sindureghari Furniture Nepal.`,
    }];
  })
  .slice(0, 48);

export const getGalleryBlogBySlug = (posts = [], slug) => posts.find((post) => post.slug === slug);

export async function fetchGalleryBlogPosts() {
  const endpoint = APP_ENDPOINTS.GALLERY;
  const candidates = [
    process.env.NODE_ENV === "development" ? `${process.env.NEXT_PUBLIC_DEV_API_URL || "http://localhost:5000"}${endpoint}` : null,
    buildApiUrl(endpoint),
    `${process.env.NEXT_PUBLIC_PROD_API_URL || "https://furnituresinduregharibackend.vercel.app"}${endpoint}`,
  ].filter(Boolean);

  for (const url of [...new Set(candidates)]) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) continue;
      const data = await response.json();
      const products = Array.isArray(data) ? data : data.products || data.data || [];
      const posts = buildGalleryBlogPosts(products);
      if (posts.length) return posts;
    } catch {
      // Try the next configured API URL.
    }
  }

  return [];
}
