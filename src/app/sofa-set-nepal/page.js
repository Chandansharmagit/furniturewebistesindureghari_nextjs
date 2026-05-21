import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: "Best Sofa Set in Nepal | Teak & Sheesham Wood Sofas | Sindureghari",
  description: "Shop the best sofa sets in Nepal. Handcrafted solid wood (Teak, Sheesham, Rosewood). Free delivery across Kathmandu, Lalitpur, and Bhaktapur.",
  alternates: {
    canonical: "https://sinduregharifurniture.shop/sofa-set-nepal",
  },
  openGraph: {
    title: "Best Sofa Set in Nepal | Sindureghari Furniture",
    description: "Discover premium handcrafted wooden sofas in Nepal. Custom designs for your living room.",
    url: "https://sinduregharifurniture.shop/sofa-set-nepal",
    type: "website",
  }
};

export default function SofaSetPillarPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 bg-amber-50 p-12 rounded-2xl border border-amber-100">
        <h1 className="text-4xl md:text-6xl font-serif text-gray-900 mb-6">
          The Ultimate Guide to Sofa Sets in Nepal
        </h1>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
          Whether you are furnishing a new apartment in Kathmandu or a traditional home in Pokhara, choosing the right sofa set is the most important interior decision you will make.
        </p>
        <Link 
          href="/category/living-room" 
          className="inline-block bg-gray-900 text-white font-medium py-3 px-8 rounded-md hover:bg-amber-700 transition duration-300"
        >
          Shop All Sofa Sets
        </Link>
      </div>

      {/* Content Clusters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        <div className="col-span-2 prose prose-lg max-w-none text-gray-700">
          <h2 className="text-3xl font-serif text-gray-900 mb-4 border-b-2 border-amber-600 pb-2 inline-block">
            Why Wood Quality Matters in Nepal
          </h2>
          <p>
            Nepal's climate, especially the humidity variations between the monsoon and winter seasons, can wreak havoc on cheap engineered wood. That is why at Sindureghari Furniture, we exclusively use seasoned <strong>Teak Wood</strong>, <strong>Sheesham (Indian Rosewood)</strong>, and <strong>Sal Wood</strong>.
          </p>
          
          <h3 className="text-2xl font-serif text-gray-900 mt-8 mb-4">Teak Wood vs. Sheesham Wood Sofas</h3>
          <p>
            <strong>Teak Wood</strong> is naturally resistant to termites and moisture due to its high natural oil content. It is the premium choice for longevity. <strong>Sheesham Wood</strong> offers a beautiful, rich dark grain and immense load-bearing strength, making it perfect for heavy, intricately carved royal sofa sets.
          </p>

          <h2 className="text-3xl font-serif text-gray-900 mt-12 mb-4 border-b-2 border-amber-600 pb-2 inline-block">
            Popular Sofa Styles in Kathmandu
          </h2>
          <ul className="space-y-4">
            <li><strong>L-Shape / Corner Sofas:</strong> Perfect for maximizing seating in compact Kathmandu apartments.</li>
            <li><strong>Royal Carved Wooden Sofas:</strong> Traditional Nepalese and Indian inspired designs that act as the centerpiece of large living rooms.</li>
            <li><strong>Modern Minimalist Sofas:</strong> Sleek, straight lines with premium velvet or leatherette upholstery, popular in modern constructions.</li>
          </ul>
        </div>
        
        {/* Sidebar / Internal Linking Hub */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit">
          <h3 className="text-xl font-serif text-gray-900 mb-6 border-b border-gray-300 pb-2">
            Explore Living Room Categories
          </h3>
          <ul className="space-y-3">
            <li><Link href="/category/living-room?type=sofas" className="text-amber-700 hover:underline font-medium">L-Shape Sofas</Link></li>
            <li><Link href="/category/living-room?type=recliners" className="text-amber-700 hover:underline font-medium">Recliners</Link></li>
            <li><Link href="/category/living-room?type=coffee-tables" className="text-amber-700 hover:underline font-medium">Coffee Tables</Link></li>
            <li><Link href="/category/living-room?type=tv-units" className="text-amber-700 hover:underline font-medium">TV Units & Cabinets</Link></li>
          </ul>

          <h3 className="text-xl font-serif text-gray-900 mt-10 mb-6 border-b border-gray-300 pb-2">
            Helpful Resources
          </h3>
          <ul className="space-y-3">
            <li><Link href="/furniture-price-guide-nepal-2026" className="text-gray-600 hover:text-amber-700">2026 Furniture Price Guide</Link></li>
            <li><Link href="/blog" className="text-gray-600 hover:text-amber-700">How to Clean Fabric Sofas</Link></li>
          </ul>
        </div>
      </div>
      
      {/* FAQ Schema Output handled by Page layout or global layout ideally, but we can hardcode some FAQs for SEO */}
      <section className="bg-white border-t border-gray-200 pt-16">
        <h2 className="text-3xl font-serif text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">What is the average price of a wooden sofa set in Nepal?</h3>
            <p className="text-gray-600">A premium solid wood (Teak/Sheesham) 5-seater sofa set in Nepal typically ranges from Rs. 85,000 to Rs. 1,50,000, depending on the carving complexity and fabric quality.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Do you provide delivery outside Kathmandu?</h3>
            <p className="text-gray-600">Yes, Sindureghari Furniture provides safe delivery to major cities including Lalitpur, Bhaktapur, Pokhara, Chitwan, and across the Terai region.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
