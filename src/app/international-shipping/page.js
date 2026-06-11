import "./international-shipping.css";

const SITE_URL = "https://sinduregharifurniture.shop";

export const metadata = {
  title: "International Shipping | Sindureghari Furniture",
  description:
    "International shipping details for Sindureghari Furniture customers, including export packing, payment protection, customs documents, cargo coordination, and order support.",
  alternates: {
    canonical: `${SITE_URL}/international-shipping`,
  },
  openGraph: {
    title: "International Shipping | Sindureghari Furniture",
    description:
      "Trust-focused international shipment process for handcrafted furniture orders from Sindureghari Furniture Nepal.",
    url: `${SITE_URL}/international-shipping`,
    siteName: "Sindureghari Furniture",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/assets/aurelian-hero.png`,
        width: 1200,
        height: 630,
        alt: "Sindureghari Furniture international shipping support",
      },
    ],
  },
};

const processSteps = [
  ["1", "Consultation", "Share product links, room sizes, destination country, preferred wood finish, and any building access constraints."],
  ["2", "Export Quotation", "We prepare product pricing, packing estimate, shipping route options, estimated cargo weight, and production timeline."],
  ["3", "Secure Confirmation", "Orders move ahead only after written confirmation, invoice review, and agreed payment milestone schedule."],
  ["4", "Production Updates", "Customers receive progress photos or videos before polishing, before packing, and before cargo handover."],
  ["5", "Export Packing", "Furniture is wrapped, corner-protected, moisture-protected, and crated based on route and cargo partner requirements."],
  ["6", "Cargo Handover", "We coordinate with the selected freight or courier partner and share dispatch proof, document copies, and tracking details."],
];

const documents = [
  "Commercial invoice with Sindureghari Furniture details",
  "Packing list with item names, quantities, and package count",
  "Product photos before final packing",
  "Buyer contact and delivery handover details",
  "Cargo partner tracking or airway/shipping reference when available",
];

const trustPoints = [
  ["Photo-first approval", "You review finishing and packing photos before shipment handover."],
  ["Clear payment milestones", "Large custom orders can be split into booking, production, and dispatch milestones."],
  ["Customs guidance", "We provide export-side documents and help you understand what your local customs broker may request."],
  ["Dedicated support", "International customers get one WhatsApp contact thread from inquiry to dispatch."],
];

export default function InternationalShippingPage() {
  const shippingJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "International Furniture Shipping",
    provider: {
      "@type": "Organization",
      name: "Sindureghari Furniture",
      url: SITE_URL,
    },
    areaServed: "International",
    serviceType: "Furniture export packing and international shipment coordination",
    url: `${SITE_URL}/international-shipping`,
  };

  return (
    <main className="intl-shipping-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(shippingJsonLd) }}
      />

      <section className="intl-hero">
        <div className="intl-hero-media" aria-hidden="true">
          <img src="/assets/aurelian-hero.png" alt="" />
        </div>
        <div className="intl-hero-shade" />
        <div className="intl-hero-content">
          <span className="intl-eyebrow">International Customers</span>
          <h1>International shipment support for handcrafted furniture from Nepal.</h1>
          <p>
            Sindureghari Furniture helps overseas customers order custom wooden furniture with clear
            pricing, export-safe packing, document support, shipment coordination, and direct
            communication from inquiry to dispatch.
          </p>
          <div className="intl-hero-actions">
            <a href="https://wa.me/9779845427041?text=Hi%20Sindureghari%20Furniture%2C%20I%20need%20international%20shipping%20details." target="_blank" rel="noopener noreferrer">
              Request Shipping Quote
            </a>
            <a href="/contact">Contact Showroom</a>
          </div>
        </div>
      </section>

      <section className="intl-trust-band" aria-label="International shipping highlights">
        <div>
          <strong>Export-safe packing</strong>
          <span>Crating, corner protection, moisture protection</span>
        </div>
        <div>
          <strong>Photo updates</strong>
          <span>Production, finishing, packing, dispatch</span>
        </div>
        <div>
          <strong>Document support</strong>
          <span>Invoice, packing list, cargo references</span>
        </div>
        <div>
          <strong>Dedicated WhatsApp</strong>
          <span>One support thread for overseas buyers</span>
        </div>
      </section>

      <section className="intl-section intl-process">
        <div className="intl-section-heading">
          <span>How It Works</span>
          <h2>A clear shipment process before you commit.</h2>
          <p>
            International furniture orders need more certainty than a normal checkout. This flow
            gives you visibility into pricing, production, packing, and dispatch.
          </p>
        </div>

        <div className="intl-process-grid">
          {processSteps.map(([number, title, detail]) => (
            <article className="intl-process-card" key={title}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="intl-section intl-two-column">
        <div className="intl-panel intl-dark-panel">
          <span>What We Can Ship</span>
          <h2>Made-to-order wooden furniture for international homes and projects.</h2>
          <p>
            Sofas, beds, wardrobes, dining tables, office furniture, carved pieces, and coordinated
            room sets can be quoted for international shipment after reviewing size, finish, and route.
          </p>
          <ul>
            <li>Custom dimensions for apartments, villas, hotels, and offices</li>
            <li>Knock-down planning where practical for easier transport</li>
            <li>Wood, polish, fabric, and hardware confirmation before production</li>
            <li>Final packing photos before cargo partner handover</li>
          </ul>
        </div>

        <div className="intl-panel">
          <span>Documents Included</span>
          <h2>Export paperwork and proof points.</h2>
          <div className="intl-document-list">
            {documents.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>
          <p className="intl-note">
            Import duty, customs clearance, port charges, and local delivery in the destination
            country are normally handled by the buyer or their local customs broker.
          </p>
        </div>
      </section>

      <section className="intl-section intl-trust-grid-section">
        <div className="intl-section-heading">
          <span>Trust Details</span>
          <h2>Built for buyers who cannot visit the showroom in person.</h2>
        </div>
        <div className="intl-trust-grid">
          {trustPoints.map(([title, detail]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="intl-section intl-faq">
        <div className="intl-section-heading">
          <span>Common Questions</span>
          <h2>Before placing an international order.</h2>
        </div>

        <div className="intl-faq-list">
          <details>
            <summary>Do you ship directly to every country?</summary>
            <p>We can review most international inquiries, but final availability depends on cargo route, item size, destination rules, and freight partner confirmation.</p>
          </details>
          <details>
            <summary>Who pays customs duty and import tax?</summary>
            <p>The buyer is responsible for destination-country duties, taxes, port charges, storage charges, and final local delivery unless a separate written agreement says otherwise.</p>
          </details>
          <details>
            <summary>Can you provide photos before shipment?</summary>
            <p>Yes. International orders receive production and packing photos so the customer can review the furniture before cargo handover.</p>
          </details>
          <details>
            <summary>Can I use my own freight forwarder?</summary>
            <p>Yes. If you already have a freight forwarder or cargo agent, we can coordinate handover from our side after order completion and packing.</p>
          </details>
        </div>
      </section>

      <section className="intl-cta">
        <span>Ready to plan your shipment?</span>
        <h2>Send your destination country, product list, and room requirements.</h2>
        <div>
          <a href="https://wa.me/9779845427041?text=Hi%20Sindureghari%20Furniture%2C%20I%20want%20an%20international%20shipping%20quote." target="_blank" rel="noopener noreferrer">
            Start on WhatsApp
          </a>
          <a href="mailto:support@sinduregharifurniture.shop">Email Shipping Desk</a>
        </div>
      </section>
    </main>
  );
}
