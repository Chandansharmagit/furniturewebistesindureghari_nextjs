// SEO Helper Utilities

export class SEOHelpers {
  static baseUrl = 'https://sinduregharifurniture.shop';

  // Generate clean URLs for SEO
  static generateSlug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  // Generate canonical URLs
  static generateCanonicalUrl(path) {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseUrl}${cleanPath}`;
  }

  // Generate product URL
  static generateProductUrl(product) {
    const slug = this.generateSlug(product.name);
    return this.generateCanonicalUrl(`/product/${product.id || product._id}/${slug}`);
  }

  // Generate category URL
  static generateCategoryUrl(category) {
    const slug = this.generateSlug(category);
    return this.generateCanonicalUrl(`/category/${slug}`);
  }

  // Generate search URL
  static generateSearchUrl(query) {
    return this.generateCanonicalUrl(`/search?q=${encodeURIComponent(query)}`);
  }

  // Extract keywords from text
  static extractKeywords(text, maxKeywords = 10) {
    if (!text) return [];

    const commonWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
      'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 
      'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
      'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
    ]);

    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.has(word));

    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, maxKeywords)
      .map(([word]) => word);
  }

  // Generate meta description from content
  static generateMetaDescription(content, maxLength = 160) {
    if (!content) return '';

    const cleanContent = content
      .replace(/<[^>]*>/g, ' ') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    if (cleanContent.length <= maxLength) {
      return cleanContent;
    }

    // Find the last complete sentence within the limit
    const truncated = cleanContent.substring(0, maxLength);
    const lastSentence = truncated.lastIndexOf('.');
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastSentence > maxLength * 0.7) {
      return cleanContent.substring(0, lastSentence + 1);
    } else if (lastSpace > maxLength * 0.8) {
      return cleanContent.substring(0, lastSpace) + '...';
    } else {
      return truncated + '...';
    }
  }

  // Generate breadcrumb data
  static generateBreadcrumbs(path, customLabels = {}) {
    const segments = path.split('/').filter(Boolean);
    const breadcrumbs = [
      { name: 'Home', url: this.generateCanonicalUrl('/') }
    ];

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = customLabels[segment] || 
                   segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      
      breadcrumbs.push({
        name: label,
        url: this.generateCanonicalUrl(currentPath)
      });
    });

    return breadcrumbs;
  }

  // Generate sitemap URLs
  static generateSitemapUrls(products = [], categories = []) {
    const urls = [
      {
        loc: this.baseUrl,
        changefreq: 'daily',
        priority: '1.0',
        lastmod: new Date().toISOString()
      }
    ];

    // Add category URLs
    categories.forEach(category => {
      urls.push({
        loc: this.generateCategoryUrl(category.name || category),
        changefreq: 'weekly',
        priority: '0.8',
        lastmod: new Date().toISOString()
      });
    });

    // Add product URLs
    products.forEach(product => {
      urls.push({
        loc: this.generateProductUrl(product),
        changefreq: 'weekly',
        priority: '0.6',
        lastmod: product.updatedAt || new Date().toISOString()
      });
    });

    // Add static pages
    const staticPages = [
      { path: '/about', priority: '0.7' },
      { path: '/contact', priority: '0.7' },
      { path: '/privacy-policy', priority: '0.3' },
      { path: '/terms-of-service', priority: '0.3' }
    ];

    staticPages.forEach(page => {
      urls.push({
        loc: this.generateCanonicalUrl(page.path),
        changefreq: 'monthly',
        priority: page.priority,
        lastmod: new Date().toISOString()
      });
    });

    return urls;
  }

  // Generate XML sitemap content
  static generateSitemapXML(urls) {
    const urlElements = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
  }

  // Generate robots.txt content
  static generateRobotsTxt() {
    return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${this.baseUrl}/sitemap.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /_next/
Disallow: /static/

# Allow important pages
Allow: /product/
Allow: /category/
Allow: /search

# Crawl delay for bots
Crawl-delay: 1`;
  }

  // Validate and clean meta tags
  static validateMetaTags(metaTags) {
    const cleaned = { ...metaTags };

    // Ensure title is within limits
    if (cleaned.title && cleaned.title.length > 60) {
      cleaned.title = cleaned.title.substring(0, 57) + '...';
    }

    // Ensure description is within limits
    if (cleaned.description && cleaned.description.length > 160) {
      cleaned.description = this.generateMetaDescription(cleaned.description, 160);
    }

    // Clean keywords
    if (cleaned.keywords) {
      if (Array.isArray(cleaned.keywords)) {
        cleaned.keywords = cleaned.keywords.join(', ');
      }
      // Limit keywords length
      if (cleaned.keywords.length > 255) {
        const keywordArray = cleaned.keywords.split(',').map(k => k.trim());
        cleaned.keywords = keywordArray.slice(0, 10).join(', ');
      }
    }

    return cleaned;
  }

  // Generate hreflang tags for international SEO
  static generateHreflangTags(currentUrl, languages = ['en', 'ne']) {
    // Ensure currentUrl is clean (no query params for base URL)
    const cleanUrl = currentUrl.split('?')[0];
    
    const hreflangTags = languages.map(lang => ({
      hreflang: lang === 'en' ? 'en-np' : 'ne-np',
      href: cleanUrl // Use same URL for all languages since content is the same
    }));

    // Add x-default for international targeting
    hreflangTags.push({
      hreflang: 'x-default',
      href: cleanUrl
    });

    return hreflangTags;
  }

  // Check if URL is indexable
  static isIndexable(path) {
    const noIndexPaths = [
      '/admin',
      '/api',
      '/private',
      '/checkout',
      '/cart',
      '/account',
      '/login',
      '/register',
      '/404',
      '/500'
    ];

    return !noIndexPaths.some(noIndexPath => path.startsWith(noIndexPath));
  }

  // Generate social media sharing URLs
  static generateSocialSharingUrls(url, title, description) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description);

    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`
    };
  }
}

export default SEOHelpers;