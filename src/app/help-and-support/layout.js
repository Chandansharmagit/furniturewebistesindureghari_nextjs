export const metadata = {
  title: "Help & Support — FAQ, Order Tracking, Warranty | Sindureghari Furniture",
  description:
    "Get instant answers about furniture orders, delivery, EMI payments, warranty claims, and custom dimensions. Track your order in real-time or file a support ticket. Sindureghari Furniture — Chandrapur, Nepal.",
  keywords: [
    "furniture help Nepal",
    "Sindureghari support",
    "furniture warranty Nepal",
    "furniture EMI Nepal",
    "track furniture order Nepal",
    "custom furniture help"
  ],
  alternates: {
    canonical: "https://sinduregharifurniture.shop/help-and-support",
  },
  openGraph: {
    title: "Help & Support | Sindureghari Furniture Nepal",
    description: "FAQs, live order tracking, warranty claims, EMI guidance, and 24/7 WhatsApp support for your furniture orders.",
    url: "https://sinduregharifurniture.shop/help-and-support",
    type: "website",
    siteName: "Sindureghari Furniture",
  },
  robots: { index: true, follow: true },
};

export default function HelpLayout({ children }) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I track my furniture order from Sindureghari?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Enter your Order ID (e.g. SIND-908) in the Order Tracker on the Help & Support page, or visit My Orders after logging in. You also receive WhatsApp and SMS updates at every stage."
        }
      },
      {
        "@type": "Question",
        name: "Where does Sindureghari Furniture deliver?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We deliver across Rautahat (Chandrapur), Bara, Parsa, Hetauda, Kathmandu Valley, Lalitpur, Bhaktapur, Chitwan, Pokhara and all major Terai districts. Every shipment is blanket-wrapped."
        }
      },
      {
        "@type": "Question",
        name: "Is home assembly included and free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Our certified carpenter installation team travels with the delivery truck and assembles everything in your room completely free of charge."
        }
      },
      {
        "@type": "Question",
        name: "What types of wood does Sindureghari use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We exclusively use Grade-A seasoned Teak (Sagwan) and high-density Sisau timber. No MDF or particle board in load-bearing structures. Every log is kiln-dried to 8–12% moisture content."
        }
      },
      {
        "@type": "Question",
        name: "How does the 0% EMI option work for furniture?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Select EMI at checkout, choose your bank (NABIL, NIC Asia, Standard Chartered, Himalayan Bank), and select 3, 6, or 12 month tenure. You pay the exact product price with zero interest charges."
        }
      },
      {
        "@type": "Question",
        name: "What warranty do you offer on furniture?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "All solid-wood furniture carries a 5-year structural warranty. Hardware components carry a 2-year warranty. Fabric and polish are covered for 1 year against manufacturing defects."
        }
      },
      {
        "@type": "Question",
        name: "Can I get custom dimensions for any furniture?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Specify exact L×W×H measurements during checkout in the Special Instructions field, or contact us on WhatsApp. Standard adjustments (±6 inches) are free."
        }
      }
    ]
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "CustomerService",
    name: "Sindureghari Furniture Customer Support",
    url: "https://sinduregharifurniture.shop/help-and-support",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+977-055-521234",
        contactType: "customer service",
        availableLanguage: ["Nepali", "Hindi", "English"],
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00"
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      {children}
    </>
  );
}
