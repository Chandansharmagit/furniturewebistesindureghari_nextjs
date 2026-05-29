/**
 * Dynamic robots.txt — Next.js App Router
 * Access at: /robots.txt
 */
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/dashboard/",
          "/api/",
          "/cart/",
          "/checkout/",
          "/login/",
          "/register/",
          "/profile/",
          "/forgot-password/",
          "/reset-password/",
          "/debug/",
          "/upload/",
          "/orders/",
          "/favorites/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        crawlDelay: 2,
      },
      {
        userAgent: "facebookexternalhit",
        allow: "/",
      },
      {
        userAgent: "Twitterbot",
        allow: "/",
      },
      {
        userAgent: "DotBot",
        disallow: "/",
      },
    ],
    sitemap: "https://sinduregharifurniture.shop/sitemap.xml",
  };
}
