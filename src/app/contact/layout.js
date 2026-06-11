export const metadata = {
  title: "Contact Us — Furniture Showroom Nepal",
  description:
    "Get in touch with Sindureghari Furniture. Call +977-9855040000, WhatsApp, or visit our Chandrapur showroom. Custom furniture inquiries, bulk orders & delivery across Kathmandu, Lalitpur, Pokhara.",
  alternates: {
    canonical: "https://sinduregharifurniture.shop/contact",
  },
  openGraph: {
    title: "Contact Sindureghari Furniture — Nepal's Premium Showroom",
    description: "Call, WhatsApp or visit. Custom design inquiries welcome. Free delivery across Nepal.",
    url: "https://sinduregharifurniture.shop/contact",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function ContactLayout({ children }) {
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://sinduregharifurniture.shop/#localbusiness-contact",
    name: "Sindureghari Furniture Showroom",
    url: "https://sinduregharifurniture.shop/contact",
    telephone: "+977-9855040000",
    email: "support@sinduregharifurniture.shop",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Showroom Highway Road, Chandrapur",
      addressLocality: "Chandrapur",
      addressRegion: "Rautahat",
      postalCode: "44500",
      addressCountry: "NP",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 27.1352,
      longitude: 85.2023,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "08:00",
      closes: "20:00",
    },
    priceRange: "Rs 5,000 – Rs 5,00,000",
    image: "https://sinduregharifurniture.shop/images/showroom-exterior.jpg",
    sameAs: [
      "https://www.facebook.com/bishwokarmafurniture",
      "https://www.instagram.com/sinduregharifurniture",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      {children}
    </>
  );
}
