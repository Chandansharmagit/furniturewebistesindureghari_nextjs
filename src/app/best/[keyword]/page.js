import CategoryPage from "@/pages/CategoryPage";

export async function generateMetadata({ params }) {
  const { keyword } = (await params) || {};
  if (!keyword) {
    return {
      title: "Best Furniture in Nepal | Buy Online at Sindureghari Furniture",
      description: "Shop the best quality solid wood furniture in Nepal. Premium handcrafted sofas, beds, dining tables with free delivery.",
      alternates: {
        canonical: "https://sinduregharifurniture.shop",
      },
    };
  }
  const cleanKeyword = keyword.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return {
    title: `Best ${cleanKeyword} in Nepal | Buy Online at Sindureghari Furniture`,
    description: `Shop the best ${cleanKeyword} in Nepal. Handcrafted solid wood, premium quality, and free delivery to Kathmandu, Lalitpur, and Bhaktapur.`,
    alternates: {
      canonical: `https://sinduregharifurniture.shop/best-${keyword}-nepal`,
    },
    openGraph: {
      title: `Best ${cleanKeyword} in Nepal | Sindureghari Furniture`,
      description: `Shop the best ${cleanKeyword} in Nepal. Handcrafted solid wood, premium quality.`,
      url: `https://sinduregharifurniture.shop/best-${keyword}-nepal`,
      type: "website",
    }
  };
}

export default async function ProgrammaticSeoPage({ params }) {
  const { keyword } = (await params) || {};
  
  if (!keyword) {
    return (
      <div className="programmatic-seo-landing">
        <div style={{ backgroundColor: '#F9F9F9', padding: '2rem 1rem', textAlign: 'center', borderBottom: '1px solid #E5E5E5' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: '#1A1A1A' }}>
            Best Furniture in Nepal
          </h1>
          <p style={{ color: '#707070', margin: '0 auto', maxWidth: '600px', fontFamily: 'var(--font-sans)' }}>
            Discover our premium collection of handcrafted furniture designed for elegance and durability.
          </p>
        </div>
        <CategoryPage />
      </div>
    );
  }

  const cleanKeyword = keyword.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="programmatic-seo-landing">
      <div style={{ backgroundColor: '#F9F9F9', padding: '2rem 1rem', textAlign: 'center', borderBottom: '1px solid #E5E5E5' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: '#1A1A1A' }}>
          Best {cleanKeyword} in Nepal
        </h1>
        <p style={{ color: '#707070', margin: '0 auto', maxWidth: '600px', fontFamily: 'var(--font-sans)' }}>
          Discover our premium collection of handcrafted {keyword.replace(/-/g, ' ')} designed for elegance and durability.
        </p>
      </div>
      
      {/* Reusing existing CategoryPage logic for displaying products */}
      <CategoryPage />
    </div>
  );
}
