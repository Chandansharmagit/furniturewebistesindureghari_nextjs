export const metadata = {
  title: "Help Center",
  description:
    "Get help with Sindureghari Furniture delivery, EMI plans, warranty, custom furniture, returns, order tracking and customer support in Nepal.",
  keywords: [
    "Sindureghari support",
    "furniture help Nepal",
    "track furniture order Nepal",
    "furniture warranty Nepal",
    "furniture EMI Nepal",
    "custom furniture help",
  ],
  alternates: {
    canonical: "https://sinduregharifurniture.shop/help-and-support",
  },
  openGraph: {
    title: "Help Center | Sindureghari Furniture Nepal",
    description:
      "Support for delivery, EMI, warranty, custom furniture and furniture orders in Nepal.",
    url: "https://sinduregharifurniture.shop/help-and-support",
    type: "website",
    siteName: "Sindureghari Furniture",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HelpSupportLayout({ children }) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I track my furniture order from Sindureghari?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use the order tracker on the Help Center or Track Order page. You can also contact support with your order number for delivery updates.",
        },
      },
      {
        "@type": "Question",
        name: "Where does Sindureghari Furniture deliver?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sindureghari Furniture delivers to Chandrapur, Kathmandu Valley, Lalitpur, Bhaktapur, Chitwan, Pokhara and other major cities in Nepal.",
        },
      },
      {
        "@type": "Question",
        name: "Is home assembly included?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Assembly support is available for eligible furniture orders. Contact customer support to confirm service availability for your delivery location.",
        },
      },
      {
        "@type": "Question",
        name: "What types of furniture can I customize?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can request custom dimensions, polish, fabric and storage options for sofas, beds, dining tables, wardrobes, study tables and other wooden furniture.",
        },
      },
      {
        "@type": "Question",
        name: "Do you offer EMI for furniture?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "EMI plans are available on selected products and supported banks. Choose an EMI option on the product details page or contact support for guidance.",
        },
      },
    ],
  };

  const customerServiceJsonLd = {
    "@context": "https://schema.org",
    "@type": "CustomerService",
    name: "Sindureghari Furniture Customer Support",
    url: "https://sinduregharifurniture.shop/help-and-support",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+977-9855040000",
        contactType: "customer service",
        availableLanguage: ["Nepali", "Hindi", "English"],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(customerServiceJsonLd) }}
      />
      {children}
    </>
  );
}
