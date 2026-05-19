export const metadata = {
  title: "Help & Support — FAQ, Warranty, Disputes",
  description:
    "Get answers to frequently asked questions about Sindureghari Furniture. Delivery, EMI payments, wood quality, warranty claims & dispute resolution for furniture orders in Nepal.",
  alternates: {
    canonical: "https://sinduregharifurniture.shop/help-and-support",
  },
  openGraph: {
    title: "Help & Support | Sindureghari Furniture Nepal",
    description: "FAQs, warranty claims, delivery tracking and customer support for your furniture orders.",
    url: "https://sinduregharifurniture.shop/help-and-support",
    type: "website",
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
        name: "How do I customize my sofa or bed dimensions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can specify customized dimensional changes during checkout or by filling out the form on our Contact Us page. Alternatively, use our direct WhatsApp channel. Our master carpenters will manufacture your furniture to your exact room size specifications.",
        },
      },
      {
        "@type": "Question",
        name: "Where does Sindureghari deliver furniture?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We provide secure door-to-door transit across Rautahat (Chandrapur), Bara, Parsa, Hetauda, Kathmandu, Lalitpur, and surrounding regional districts. Every shipment is blanket-wrapped and secured against scratches.",
        },
      },
      {
        "@type": "Question",
        name: "Is solid-wood assembly free of charge?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely! Our specialized installation team accompanies the transit truck. They will unpack, inspect, align, and balance your solid-wood furniture in your designated rooms at zero extra cost.",
        },
      },
      {
        "@type": "Question",
        name: "What types of wood do you exclusively use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We source only premium grade, seasoned Teak (Sagwan) and high-density Sisau timber. We do not use MDF, composite particle board, or low-cost plywood in any primary load-bearing furniture structures.",
        },
      },
      {
        "@type": "Question",
        name: "How does the 0% EMI financing work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We support interest-free 0% EMI options for major Nepalese credit cards. Simply select the EMI checkout option during payment, select your bank partner, and choose a tenure of 3, 6, or 12 months.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
