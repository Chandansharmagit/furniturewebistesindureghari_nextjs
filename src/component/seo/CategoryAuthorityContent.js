import Link from "next/link";
import { enterpriseCategories, SITE_URL } from "@/data/enterpriseSeo";
import "./CategoryAuthorityContent.css";

const fallbackText = {
  intro:
    "Sindureghari Furniture creates premium wooden furniture in Nepal with a focus on durability, practical design and handmade detail. Every collection is planned around real Nepali homes, from compact city apartments to larger family interiors.",
  buyingGuide:
    "Before buying furniture, measure the room, note walking space and choose pieces that support daily use. Prioritize strong frames, useful storage, comfortable proportions and a finish that matches existing interiors.",
  materialGuide:
    "Seasoned hardwood, quality plywood, durable hardware and protective polish make furniture last longer in Nepal's climate. Solid wood frames and well-sealed surfaces are especially important for premium furniture.",
  maintenance:
    "Dust furniture regularly with a soft cloth, avoid standing water, protect surfaces from direct heat and clean upholstery according to fabric type.",
  faqs: [
    ["Do you deliver furniture in Nepal?", "Yes. Sindureghari Furniture delivers to major cities across Nepal."],
    ["Can furniture be customized?", "Custom sizing, polish, layout and selected material options are available for many furniture categories."],
    ["Where should I start when buying furniture?", "Start with the room size, required storage, preferred material and budget range."]
  ]
};

export function getCategorySchema(category) {
  const pageUrl = `${SITE_URL}${category.path}`;
  const children = category.children || [];

  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${pageUrl}#collection`,
      name: category.h1 || category.name,
      url: pageUrl,
      description: category.metaDescription,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: category.keywords?.map((keyword) => ({ "@type": "Thing", name: keyword })),
      mainEntity: {
        "@type": "ItemList",
        name: `${category.name} subcategories`,
        itemListElement: children.map((child, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "CollectionPage",
            name: child.name,
            url: `${SITE_URL}${child.path}`,
            description: child.metaDescription
          }
        }))
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: (category.faqs || fallbackText.faqs).map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer
        }
      }))
    }
  ];
}

export default function CategoryAuthorityContent({ category }) {
  if (!category) return null;

  const children = category.children || [];
  const related = (category.relatedPaths || [])
    .map((path) => enterpriseCategories.flatMap((item) => [item, ...item.children]).find((item) => item.path === path) || { path, name: path.replace(/^\//, "").replace(/-/g, " ") });

  return (
    <section className="seo-authority" aria-labelledby="seo-authority-title">
      <div className="seo-authority__inner">
        <div className="seo-authority__header">
          <span>Furniture Nepal Buying Guide</span>
          <h2 id="seo-authority-title">{category.h1 || category.name}</h2>
          <p>{category.intro || fallbackText.intro}</p>
        </div>

        {children.length > 0 && (
          <nav className="seo-authority__sitelinks" aria-label={`${category.name} subcategory links`}>
            {children.map((child) => (
              <Link href={child.path} key={child.path}>
                <strong>{child.name}</strong>
                <span>{child.metaDescription}</span>
              </Link>
            ))}
          </nav>
        )}

        <div className="seo-authority__grid">
          <article>
            <h3>Buying Guide</h3>
            <p>{category.buyingGuide || fallbackText.buyingGuide}</p>
          </article>
          <article>
            <h3>Material Guide</h3>
            <p>{category.materialGuide || fallbackText.materialGuide}</p>
          </article>
          <article>
            <h3>Maintenance Tips</h3>
            <p>{category.maintenance || fallbackText.maintenance}</p>
          </article>
        </div>

        <div className="seo-authority__links">
          <div>
            <h3>Related Furniture Categories</h3>
            <ul>
              {related.map((item) => (
                <li key={item.path}>
                  <Link href={item.path}>{item.name}</Link>
                </li>
              ))}
              <li><Link href="/wooden-furniture-nepal">Wooden Furniture Nepal</Link></li>
              <li><Link href="/furniture-shop-kathmandu">Furniture Shop Kathmandu</Link></li>
            </ul>
          </div>
          <div>
            <h3>Frequently Asked Questions</h3>
            {(category.faqs || fallbackText.faqs).map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
