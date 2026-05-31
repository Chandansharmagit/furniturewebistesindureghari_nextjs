import Link from "next/link";
import { relatedInternalLinks, SITE_URL } from "@/data/nepalSeo";

const sectionStyle = {
  maxWidth: "1120px",
  margin: "0 auto",
  padding: "48px 20px",
  color: "#1f2933",
  lineHeight: 1.75,
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "16px",
};

function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function makeCategoryArticle(page) {
  return [
    `${page.intro} Buyers searching for ${page.primaryKeyword} usually want more than a list of products. They want to understand timber quality, comfort, size, polish, warranty, delivery and how the furniture will perform in Nepal's weather. Sindureghari Furniture handles this by combining factory manufacturing with practical guidance before purchase.`,
    `The first decision is material. Popular options include ${page.materials.join(", ")}. Properly seasoned timber is important because Nepal has humid monsoon months, dry winter air and frequent movement between warm and cool rooms. Furniture made from unseasoned wood can bend, crack or loosen. Sindureghari Furniture focuses on stable construction, practical hardware and finishes that suit family use.`,
    `The second decision is size. For ${page.name.toLowerCase()}, the right measurement depends on walking space, room shape, number of users and storage needs. A buyer in Kathmandu may need a compact apartment-friendly design, while a buyer in Pokhara or Chitwan may want a larger centerpiece for a wider room. Before confirming an order, measure wall length, door width, stair access and the free space required around the furniture.`,
    `The third decision is finish and style. Nepali homes use a mix of modern interiors, carved traditional details and simple practical layouts. Sindureghari Furniture can support natural wood polish, warmer brown tones, darker premium finishes and fabric or hardware choices depending on the product. This helps one purchase match the rest of the room instead of looking separate from the home.`,
    `Price is affected by wood type, dimensions, thickness, carving, upholstery, polish, storage, hardware and delivery location. A small standard product costs less than a custom design with premium timber and detailed finishing. The best approach is to shortlist the type of ${page.products.join(", ")} you like, share your preferred size, and request a current quote from the team.`,
    `Delivery is planned for major Nepal locations including Kathmandu, Lalitpur, Bhaktapur, Pokhara, Butwal, Chitwan and Biratnagar. Large furniture should be checked for stair access, lift size, parking distance and installation space before dispatch. For custom orders, the team can discuss delivery timing, assembly needs and care instructions.`,
    `For long-term value, compare furniture by construction rather than headline price alone. Check frame strength, surface finishing, edge quality, drawer movement, fabric stitching, hardware alignment and warranty support. A slightly better-built piece often saves money because it keeps its shape, looks better after years of use and needs fewer repairs.`,
    `Sindureghari Furniture is especially useful for buyers who want one supplier for multiple rooms. A customer can coordinate a sofa set, bed, wardrobe, dining table and office furniture in matching finishes. This creates a cleaner interior plan and makes future service easier because the products come from the same workshop and support team.`,
    `For Nepali searchers using terms such as ${page.nepaliKeywords.join(", ")}, this page is designed as a buying guide as well as a product entry point. Browse the related collections, compare sizes and contact Sindureghari Furniture for updated availability, current prices and custom furniture recommendations for your city.`,
  ];
}

export function CategorySeoLanding({ page }) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: page.name, item: `${SITE_URL}${page.path}` },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.h1,
    description: page.metaDescription,
    url: `${SITE_URL}${page.path}`,
    about: page.products.map((name) => ({ "@type": "Thing", name })),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: page.products.map((name, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name,
      })),
    },
  };

  const article = makeCategoryArticle(page);

  return (
    <main style={sectionStyle}>
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={collectionJsonLd} />

      <nav aria-label="Breadcrumb" style={{ fontSize: "0.92rem", marginBottom: "22px" }}>
        <Link href="/">Home</Link>
        <span> / </span>
        <span>{page.name}</span>
      </nav>

      <header style={{ maxWidth: "860px" }}>
        <p style={{ color: "#8a6a2f", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Sindureghari Furniture Nepal
        </p>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.1, margin: "0 0 18px" }}>
          {page.h1}
        </h1>
        <p style={{ fontSize: "1.12rem", color: "#44515f" }}>{page.metaDescription}</p>
      </header>

      <section style={{ marginTop: "36px", ...gridStyle }} aria-label="Popular options">
        {page.products.map((product) => (
          <Link
            key={product}
            href={page.productPath}
            style={{
              border: "1px solid #e7dfd0",
              borderRadius: "8px",
              padding: "18px",
              textDecoration: "none",
              color: "#1f2933",
              background: "#fffdf7",
            }}
          >
            <strong>{product}</strong>
            <span style={{ display: "block", marginTop: "8px", color: "#637083" }}>
              View options, sizes and current availability.
            </span>
          </Link>
        ))}
      </section>

      <article style={{ marginTop: "42px" }}>
        {page.h2.map((heading, index) => (
          <section key={heading} style={{ marginBottom: "30px" }}>
            <h2>{heading}</h2>
            <p>{article[index * 3]}</p>
            <p>{article[index * 3 + 1]}</p>
            <p>{article[index * 3 + 2]}</p>
          </section>
        ))}
      </article>

      <section style={{ marginTop: "38px" }}>
        <h2>Frequently Asked Questions</h2>
        <div style={gridStyle}>
          {page.faqs.map(([question, answer]) => (
            <div key={question} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "18px" }}>
              <h3 style={{ marginTop: 0 }}>{question}</h3>
              <p>{answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "42px" }}>
        <h2>Internal Links for Furniture Buyers in Nepal</h2>
        <div style={gridStyle}>
          {relatedInternalLinks.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export function CitySeoLanding({ page }) {
  const city = page.city;
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Do you deliver furniture in ${city}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. Sindureghari Furniture can arrange delivery for sofa sets, beds, wardrobes, dining tables, office furniture and custom furniture in ${city}.`,
        },
      },
      {
        "@type": "Question",
        name: `Can I order custom furniture from ${city}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes. Share measurements, reference photos and budget to request custom furniture for homes, offices, hotels or shops in ${city}.`,
        },
      },
      {
        "@type": "Question",
        name: `What furniture products are available for ${city}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "Popular products include sofa sets, wooden beds, wardrobes, dining tables, office desks, chairs, TV units, cabinets and made-to-order furniture.",
        },
      },
    ],
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": ["FurnitureStore", "LocalBusiness"],
    name: `Sindureghari Furniture - ${city} Delivery`,
    url: `${SITE_URL}${page.path}`,
    areaServed: {
      "@type": "City",
      name: city,
      addressCountry: "NP",
    },
    parentOrganization: {
      "@type": "Organization",
      name: "Sindureghari Furniture",
      url: SITE_URL,
    },
    telephone: "+977-9845427041",
    priceRange: "NPR 5,000 - NPR 500,000",
  };

  return (
    <main style={sectionStyle}>
      <JsonLd data={faqJsonLd} />
      <JsonLd data={localBusinessJsonLd} />

      <nav aria-label="Breadcrumb" style={{ fontSize: "0.92rem", marginBottom: "22px" }}>
        <Link href="/">Home</Link>
        <span> / </span>
        <span>{city}</span>
      </nav>

      <header style={{ maxWidth: "870px" }}>
        <p style={{ color: "#8a6a2f", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Furniture delivery and custom orders
        </p>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.1, margin: "0 0 18px" }}>
          {page.h1}
        </h1>
        <p style={{ fontSize: "1.12rem", color: "#44515f" }}>{page.metaDescription}</p>
      </header>

      <section style={{ marginTop: "36px" }}>
        <h2>Furniture Delivery Areas in {city}</h2>
        <p>
          Sindureghari Furniture supports furniture buyers in {city} who need reliable products,
          clear pricing and delivery planning. Popular service areas include {page.areas.join(", ")}.
          Customers can ask for sofa set prices, bed designs, wardrobe layouts, dining table options,
          office furniture and custom furniture based on room size and budget.
        </p>
        <p>
          The buying process starts with product selection or a custom design request. Share room
          measurements, preferred material, polish color, fabric choice and delivery location. The
          team can recommend practical sizes, explain current pricing and help coordinate dispatch
          for homes, apartments, offices, hotels, restaurants and showrooms in {city}.
        </p>
      </section>

      <section style={{ marginTop: "34px", ...gridStyle }}>
        {relatedInternalLinks.slice(0, 7).map(([label, href]) => (
          <Link
            key={href}
            href={href}
            style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "18px" }}
          >
            {label} in {city}
          </Link>
        ))}
      </section>

      <section style={{ marginTop: "38px" }}>
        <h2>Content Outline for {page.h1}</h2>
        <ol>
          <li>Best furniture categories for homes and offices in {city}</li>
          <li>Sofa set, bed, wardrobe and dining table price factors</li>
          <li>How to measure rooms before ordering custom furniture</li>
          <li>Delivery, unloading and installation checklist for {city}</li>
          <li>Frequently asked questions from local buyers</li>
        </ol>
      </section>
    </main>
  );
}

