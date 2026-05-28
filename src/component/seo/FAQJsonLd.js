'use client';

/**
 * FAQJsonLd — Renders FAQPage structured data
 * This enables Google to show FAQ rich results with 
 * expandable question/answer dropdowns in search results
 * (like WoodenStreet and other e-commerce sites).
 * 
 * Usage:
 *   <FAQJsonLd faqs={[
 *     { question: 'What wood do you use?', answer: 'We use premium teak...' },
 *     { question: 'Do you deliver to Kathmandu?', answer: 'Yes, free delivery...' },
 *   ]} />
 */

export default function FAQJsonLd({ faqs }) {
  if (!faqs || faqs.length === 0) return null;

  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
    />
  );
}
