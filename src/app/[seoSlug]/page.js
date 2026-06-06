import Link from "next/link";
import { notFound } from "next/navigation";
import {
  findProgrammaticLocalPage,
  getProgrammaticLocalPages,
  SITE_URL
} from "@/data/enterpriseSeo";
import CategoryAuthorityContent from "@/component/seo/CategoryAuthorityContent";
import { enterpriseCategories } from "@/data/enterpriseSeo";

export function generateStaticParams() {
  return getProgrammaticLocalPages().map((page) => ({ seoSlug: page.slug }));
}

export async function generateMetadata({ params }) {
  const { seoSlug } = await params;
  const page = findProgrammaticLocalPage(seoSlug);
  if (!page) {
    return {
      title: "Sindureghari Furniture Nepal",
      robots: { index: false, follow: true }
    };
  }

  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical: `${SITE_URL}${page.path}` },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url: `${SITE_URL}${page.path}`,
      type: "website",
      locale: "en_NP"
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.metaDescription
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large"
    }
  };
}

export default async function ProgrammaticLocalPage({ params }) {
  const { seoSlug } = await params;
  const page = findProgrammaticLocalPage(seoSlug);
  if (!page) notFound();

  const category = enterpriseCategories.find((item) =>
    item.path === page.collection.categoryPath || item.children.some((child) => child.path === page.collection.categoryPath)
  );
  const child = category?.children.find((item) => item.path === page.collection.categoryPath);
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${SITE_URL}${page.path}#collection`,
      name: page.h1,
      url: `${SITE_URL}${page.path}`,
      description: page.metaDescription,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: [
        { "@type": "Thing", name: page.collection.name },
        { "@type": "Place", name: page.city.city },
        { "@type": "Thing", name: "Premium Wooden Furniture Nepal" }
      ],
      mainEntity: {
        "@type": "ItemList",
        name: `${page.collection.name} furniture links in ${page.city.city}`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            item: {
              "@type": "CollectionPage",
              name: page.collection.name,
              url: `${SITE_URL}${page.collection.categoryPath}`
            }
          }
        ]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: page.collection.name, item: `${SITE_URL}${page.collection.categoryPath}` },
        { "@type": "ListItem", position: 3, name: page.h1, item: `${SITE_URL}${page.path}` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `Do you deliver ${page.collection.name.toLowerCase()} in ${page.city.city}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Yes, Sindureghari Furniture supports delivery and consultation for ${page.collection.name.toLowerCase()} in ${page.city.city} and other major cities in Nepal.`
          }
        },
        {
          "@type": "Question",
          name: `Can I customize ${page.collection.name.toLowerCase()} for my home?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: "Custom sizing, polish, material and layout options are available depending on the furniture design and production plan."
          }
        }
      ]
    }
  ];

  return (
    <>
      {schema.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
      <main className="local-seo-page">
        <section className="local-seo-hero">
          <span>Furniture Store {page.city.city}</span>
          <h1>{page.h1}</h1>
          <p>
            Looking for {page.collection.name.toLowerCase()} in {page.city.city}? Sindureghari Furniture
            crafts premium wooden furniture for Nepali homes with careful material selection,
            practical sizing and delivery support across Nepal.
          </p>
          <div>
            <Link href={page.collection.categoryPath}>Shop {page.collection.name}</Link>
            <Link href="/order-request">Request Custom Furniture</Link>
          </div>
        </section>

        <section className="local-seo-copy">
          <h2>Premium {page.collection.name} for {page.city.city} Homes</h2>
          <p>
            {page.city.city} homes need furniture that balances space, durability and visual warmth.
            Sindureghari Furniture focuses on handcrafted wooden designs that feel premium without
            becoming impractical. Whether you are furnishing a new apartment, upgrading a family home
            or planning a custom interior, our team can help select the right size, finish and design.
          </p>
          <p>
            Customers searching for furniture Nepal, wooden furniture Nepal, furniture Kathmandu and
            premium furniture Nepal can use this page to move directly into the correct product cluster.
            The collection page, related categories and request form are linked here so both shoppers
            and search engines can understand the full buying path.
          </p>
          <ul>
            <li>Handmade wooden furniture with premium finishing options.</li>
            <li>Custom planning for room size, storage needs and delivery timeline.</li>
            <li>Internal links to category pages, order request and local furniture store pages.</li>
          </ul>
        </section>
      </main>
      <CategoryAuthorityContent category={child || category} />
    </>
  );
}
