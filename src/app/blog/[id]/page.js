import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchGalleryBlogPosts, getGalleryBlogBySlug } from "@/data/galleryBlogPosts";
import "@/pages/Blog/blog.css";

const SITE_URL = "https://sinduregharifurniture.shop";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const posts = await fetchGalleryBlogPosts();
  const post = getGalleryBlogBySlug(posts, id);

  if (!post) {
    return {
      title: "Furniture Journal | Sindureghari Furniture",
      robots: { index: true, follow: true },
    };
  }

  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: post.meta_title || `${post.title} | Sindureghari Furniture`,
    description: post.meta_description || post.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      images: post.image_url ? [{ url: post.image_url, alt: post.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.image_url ? [post.image_url] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

function StaticSeoBlogPost({ post }) {
  const readTime = `${Math.ceil(post.content.replace(/<[^>]+>/g, " ").split(/\s+/).length / 200)} min read`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    headline: post.title,
    description: post.excerpt,
    image: post.image_url ? [post.image_url] : [],
    author: {
      "@type": "Organization",
      name: "Sindureghari Furniture",
    },
    publisher: {
      "@type": "Organization",
      name: "Sindureghari Furniture",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
  };

  return (
    <article className="blog-post-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <header className="post-header post-header-editorial">
        <div className="post-hero-editorial">
          <div className="post-hero-copy">
            <Link href="/blog" className="back-link">
              <span>Back to Journal</span>
            </Link>
            <div className="post-meta">
              <span className="post-category-badge">{post.category}</span>
              <div className="post-meta-items">
                <span className="meta-item">Sindureghari Furniture</span>
                <span className="meta-item">{new Date(post.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                <span className="meta-item">{readTime}</span>
              </div>
            </div>
            <h1 className="post-title serif">{post.title}</h1>
            <p className="post-hero-summary">{post.excerpt}</p>
          </div>

          {post.image_url && (
            <div className="post-hero-image">
              <img src={post.image_url} alt={post.title} />
            </div>
          )}
        </div>
      </header>

      <main className="post-content-section">
        <div className="container-narrow">
          <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }} />
          <div className="post-footer">
            <div className="post-tags">
              <span>#SindureghariFurniture</span>
              <span>#FurnitureNepal</span>
              <span>#WoodenFurniture</span>
            </div>
            <Link href="/products" className="read-more">Browse Furniture</Link>
          </div>
        </div>
      </main>
    </article>
  );
}

export default async function Page({ params }) {
  const { id } = await params;
  const posts = await fetchGalleryBlogPosts();
  const post = getGalleryBlogBySlug(posts, id);

  if (post) {
    return <StaticSeoBlogPost post={post} />;
  }

  notFound();
}
