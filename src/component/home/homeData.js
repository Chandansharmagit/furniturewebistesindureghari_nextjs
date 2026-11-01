import { cache } from 'react';
import { productSeoPath } from '../../data/nepalSeo';
import { slugifyCategory } from '../../utils/categoryHelpers';

/* ---------- API base (server side) ---------- */
const ENVIRONMENT =
  process.env.NEXT_PUBLIC_ENVIRONMENT ||
  (process.env.NODE_ENV === 'development' ? 'development' : 'production');

const API_BASE =
  ENVIRONMENT === 'production'
    ? process.env.NEXT_PUBLIC_PROD_API_URL || 'https://furnituresinduregharibackend.vercel.app'
    : process.env.NEXT_PUBLIC_DEV_API_URL || 'http://localhost:5000';

const OFFER_CATEGORY = /offer|royal|dashain/i;

/* ---------- helpers ---------- */
function resolveImage(raw, width = 600) {
  if (!raw || typeof raw !== 'string') return '/images/placeholder.svg';
  let url = raw;
  if (url.startsWith('/assets/') || url.startsWith('/images/')) return url;
  if (url.startsWith('/')) url = `${API_BASE}${url}`;

  // Cloudinary: serve a smaller, modern-format image (big bandwidth saving)
  if (url.includes('res.cloudinary.com') && url.includes('/upload/') && !/\/upload\/[a-z]_/.test(url)) {
    url = url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
  }
  return url;
}

function firstImage(product) {
  if (Array.isArray(product.images) && product.images.length) return product.images[0];
  if (product.imageUrl) return product.imageUrl;
  if (product.image_url) return product.image_url;
  if (product.imageUrls) {
    try {
      const parsed = typeof product.imageUrls === 'string' ? JSON.parse(product.imageUrls) : product.imageUrls;
      if (Array.isArray(parsed) && parsed.length) return parsed[0];
    } catch {
      /* ignore bad JSON */
    }
  }
  return null;
}

function normalize(product) {
  const price = Number(product.new_price ?? product.salePrice ?? product.price) || 0;
  const oldPrice = Number(product.old_price ?? product.price) || 0;
  const discount = oldPrice > price && price > 0 ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const category = product.categoryName || product.category || 'Furniture';

  return {
    id: product.id || product._id,
    name: product.name || product.title || 'Furniture',
    price,
    oldPrice: discount > 0 ? oldPrice : 0,
    discount,
    category,
    image: resolveImage(firstImage(product)),
    imageLarge: resolveImage(firstImage(product), 1000),
    href: productSeoPath(product),
  };
}

async function safeFetch(path) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/* ---------- main loader (one fetch, cached per request + 60s revalidate) ---------- */
export const getHomeData = cache(async () => {
  const raw = await safeFetch('/api/products');
  const list = Array.isArray(raw) ? raw : raw?.products || raw?.data || [];

  const products = list
    .map(normalize)
    .filter((p) => p.id && p.price > 0)
    .sort((a, b) => Number(b.id) - Number(a.id));

  const regular = products.filter((p) => !OFFER_CATEGORY.test(p.category));

  const newArrivals = regular.slice(0, 8);

  const deals = [...products]
    .filter((p) => p.discount >= 10)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 8);

  // Top 3 categories with the most products -> one shelf each
  const byCategory = new Map();
  regular.forEach((p) => {
    if (!byCategory.has(p.category)) byCategory.set(p.category, []);
    byCategory.get(p.category).push(p);
  });

  const shelves = [...byCategory.entries()]
    .filter(([, items]) => items.length >= 3)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 3)
    .map(([name, items]) => ({
      name,
      count: items.length,
      href: `/category/${slugifyCategory(name)}`,
      cover: items[0].image,
      items: items.slice(0, 4),
    }));

  return {
    total: products.length,
    maxDiscount: deals[0]?.discount || 0,
    newArrivals,
    deals,
    shelves,
  };
});

export function formatPrice(value) {
  const n = Math.max(0, Math.round(Number(value) || 0));
  return `Rs. ${new Intl.NumberFormat('en-IN').format(n)}`;
}

