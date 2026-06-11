// Dynamic Sitemap Generator for SEO

import SEOHelpers from './seoHelpers';

export class SitemapGenerator {
  static baseUrl = 'https://sinduregharifurniture.shop';

  // Generate sitemap for static pages
  static generateStaticPages() {
    const staticPages = [
      {
        url: '/',
        changefreq: 'daily',
        priority: '1.0',
        lastmod: new Date().toISOString()
      },
      {
        url: '/about',
        changefreq: 'monthly',
        priority: '0.7',
        lastmod: new Date().toISOString()
      },
      {
        url: '/contact',
        changefreq: 'monthly',
        priority: '0.7',
        lastmod: new Date().toISOString()
      },
      {
        url: '/privacy-policy',
        changefreq: 'yearly',
        priority: '0.3',
        lastmod: new Date().toISOString()
      },
      {
        url: '/terms-of-service',
        changefreq: 'yearly',
        priority: '0.3',
        lastmod: new Date().toISOString()
      }
    ];

    return staticPages.map(page => ({
      ...page,
      loc: `${this.baseUrl}${page.url}`
    }));
  }

  // Generate sitemap for product categories
  static generateCategoryPages(categories = []) {
    return categories.map(category => {
      const name = typeof category === 'string' ? category : category.name;
      const slug = typeof category === 'string' ? SEOHelpers.generateSlug(category) : (category.slug || SEOHelpers.generateSlug(name));
      return {
        loc: `${this.baseUrl}/category/${slug}`,
        changefreq: 'weekly',
        priority: '0.8',
        lastmod: category.updated_at || new Date().toISOString()
      };
    });
  }

  // Generate sitemap for products
  static generateProductPages(products = []) {
    return products.map(product => {
      const slug = SEOHelpers.generateSlug(product.name);
      return {
        loc: `${this.baseUrl}/product/${product.id || product._id}/${slug}`,
        changefreq: 'weekly',
        priority: '0.6',
        lastmod: product.updatedAt || product.createdAt || new Date().toISOString(),
        images: product.images ? product.images.map(img => ({
          loc: img,
          caption: product.name,
          title: product.name
        })) : []
      };
    });
  }

  // Generate complete sitemap
  static async generateSitemap(products = [], categories = []) {
    const staticPages = this.generateStaticPages();
    const categoryPages = this.generateCategoryPages(categories);
    const productPages = this.generateProductPages(products);

    const allPages = [...staticPages, ...categoryPages, ...productPages];

    return this.generateSitemapXML(allPages);
  }

  // Generate XML sitemap content
  static generateSitemapXML(pages) {
    const urlElements = pages.map(page => {
      let urlXml = `
  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>`;

      // Add image sitemap if images exist
      if (page.images && page.images.length > 0) {
        const imageElements = page.images.map(img => `
    <image:image>
      <image:loc>${img.loc}</image:loc>
      <image:caption>${img.caption}</image:caption>
      <image:title>${img.title}</image:title>
    </image:image>`).join('');
        urlXml += imageElements;
      }

      urlXml += `
  </url>`;
      return urlXml;
    }).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlElements}
</urlset>`;
  }

  // Generate sitemap index for large sites
  static generateSitemapIndex(sitemaps) {
    const sitemapElements = sitemaps.map(sitemap => `
  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapElements}
</sitemapindex>`;
  }

  // Generate robots.txt content
  static generateRobotsTxt() {
    return `User-agent: *
Allow: /

# Important pages
Allow: /product/
Allow: /category/
Allow: /search
Allow: /about
Allow: /contact

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /_next/
Disallow: /static/js/
Disallow: /static/css/
Disallow: /checkout/
Disallow: /cart/
Disallow: /account/
Disallow: /login/
Disallow: /register/

# Allow CSS and JS for better rendering
Allow: /static/css/
Allow: /static/js/

# Sitemap location
Sitemap: ${this.baseUrl}/sitemap.xml

# Crawl delay for different bots
User-agent: Googlebot
Crawl-delay: 1

User-agent: Bingbot
Crawl-delay: 2

User-agent: Slurp
Crawl-delay: 2

# Block aggressive crawlers
User-agent: AhrefsBot
Crawl-delay: 10

User-agent: SemrushBot
Crawl-delay: 10

User-agent: MJ12bot
Crawl-delay: 10`;
  }

  // Save sitemap to public directory (for build process)
  static async saveSitemap(products = [], categories = []) {
    try {
      const sitemapContent = await this.generateSitemap(products, categories);
      const robotsContent = this.generateRobotsTxt();

      // In a real application, you would save these files to the public directory
      // For now, we'll return the content for manual saving
      return {
        sitemap: sitemapContent,
        robots: robotsContent
      };
    } catch (error) {
      console.error('Error generating sitemap:', error);
      throw error;
    }
  }

  // Generate news sitemap for recent products/updates
  static generateNewsSitemap(recentProducts = []) {
    const newsItems = recentProducts.map(product => `
  <url>
    <loc>${this.baseUrl}/product/${product.id}/${SEOHelpers.generateSlug(product.name)}</loc>
    <news:news>
      <news:publication>
        <news:name>Sindureghari Furniture</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${product.createdAt || new Date().toISOString()}</news:publication_date>
      <news:title>${product.name} - New Arrival at Sindureghari Furniture</news:title>
    </news:news>
  </url>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsItems}
</urlset>`;
  }

  // Generate video sitemap if products have videos
  static generateVideoSitemap(productsWithVideos = []) {
    const videoItems = productsWithVideos.map(product => {
      if (!product.videos || product.videos.length === 0) return '';

      return product.videos.map(video => `
  <url>
    <loc>${this.baseUrl}/product/${product.id}/${SEOHelpers.generateSlug(product.name)}</loc>
    <video:video>
      <video:thumbnail_loc>${video.thumbnail}</video:thumbnail_loc>
      <video:title>${product.name} - Product Video</video:title>
      <video:description>${product.description || `Watch ${product.name} in detail`}</video:description>
      <video:content_loc>${video.url}</video:content_loc>
      <video:duration>${video.duration || 60}</video:duration>
    </video:video>
  </url>`).join('');
    }).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${videoItems}
</urlset>`;
  }
}

export default SitemapGenerator;
