import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* ── SEO: Trailing Slash Normalization ── */
  trailingSlash: false,

  /* ── Performance: Image Optimization ── */
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "furnituresinduregharibackend.vercel.app",
      },
      {
        protocol: "https",
        hostname: "sinduregharifurniture.shop",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 24 hours
  },

  /* ── Performance: Compression ── */
  compress: true,

  /* ── Performance: React strict mode ── */
  reactStrictMode: true,

  /* ── SEO: Custom Headers ── */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  /* ── SEO: Redirects ── */
  async redirects() {
    return [
      // Normalize www to apex
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.sinduregharifurniture.shop" }],
        destination: "https://sinduregharifurniture.shop/:path*",
        permanent: true,
      },
      {
        source: "/sofas",
        destination: "/sofa-set-price-nepal",
        permanent: true,
      },
      {
        source: "/beds",
        destination: "/wooden-bed-nepal",
        permanent: true,
      },
      {
        source: "/wardrobes",
        destination: "/wardrobe-price-nepal",
        permanent: true,
      },
      {
        source: "/dining-tables",
        destination: "/dining-table-nepal",
        permanent: true,
      },
      {
        source: "/office-furniture",
        destination: "/office-furniture-nepal",
        permanent: true,
      },
    ];
  },

  /* ── SEO: Rewrites ── */
  async rewrites() {
    return [
      {
        source: "/best-:keyword-nepal",
        destination: "/best/:keyword",
      },
    ];
  },

  /* ── Webpack Aliases ── */
  webpack: (config) => {
    config.resolve.alias['react-router-dom'] = path.resolve(__dirname, 'src/utils/routerShim.js');
    config.resolve.alias['react-helmet'] = path.resolve(__dirname, 'src/utils/helmetShim.js');
    config.resolve.alias['react-helmet-async'] = path.resolve(__dirname, 'src/utils/helmetShim.js');
    return config;
  },
};

export default nextConfig;
