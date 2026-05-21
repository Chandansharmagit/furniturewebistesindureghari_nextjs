import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: "Wooden Bed Design Nepal | King & Queen Size Beds | Sindureghari",
  description: "Explore premium wooden bed designs in Nepal. Solid teak and sheesham wood king/queen size beds with hydraulic storage. Free delivery in Kathmandu.",
  alternates: {
    canonical: "https://sinduregharifurniture.shop/wooden-bed-design-nepal",
  },
  openGraph: {
    title: "Wooden Bed Design in Nepal | Sindureghari Furniture",
    description: "Shop handcrafted solid wood beds in Nepal. Lifetime warranty on wood.",
    url: "https://sinduregharifurniture.shop/wooden-bed-design-nepal",
    type: "website",
  }
};

export default function BedPillarPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 bg-blue-50 p-12 rounded-2xl border border-blue-100">
        <h1 className="text-4xl md:text-6xl font-serif text-gray-900 mb-6">
          Premium Wooden Bed Designs in Nepal
        </h1>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
          A good night's sleep starts with a solid foundation. Discover Nepal's finest collection of handcrafted wooden beds, built for absolute durability and timeless style.
        </p>
        <Link 
          href="/category/bedroom" 
          className="inline-block bg-gray-900 text-white font-medium py-3 px-8 rounded-md hover:bg-blue-800 transition duration-300"
        >
          Shop Bedroom Furniture
        </Link>
      </div>

      {/* Content Clusters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        <div className="col-span-2 prose prose-lg max-w-none text-gray-700">
          <h2 className="text-3xl font-serif text-gray-900 mb-4 border-b-2 border-blue-600 pb-2 inline-block">
            Choosing the Right Bed Size in Nepal
          </h2>
          <p>
            Space is often a premium in modern Kathmandu homes. Choosing the right dimensions is critical.
          </p>
          <ul className="space-y-4">
            <li><strong>King Size Beds (72" x 78"):</strong> Ideal for large master bedrooms. Offers maximum space for couples.</li>
            <li><strong>Queen Size Beds (60" x 78"):</strong> The most popular choice for apartments. Provides comfortable sleeping space while leaving room for wardrobes and dressing tables.</li>
          </ul>
          
          <h2 className="text-3xl font-serif text-gray-900 mt-12 mb-4 border-b-2 border-blue-600 pb-2 inline-block">
            Hydraulic Storage vs. Box Storage
          </h2>
          <p>
            With the rise of apartment living, storage beds have become essential. 
            <strong> Hydraulic lift beds</strong> allow you to effortlessly lift the heavy mattress to access the storage underneath, which is perfect for heavy winter blankets.
            <strong> Standard box storage</strong> requires you to remove the mattress to access the panels, but is generally more cost-effective.
          </p>

          <h2 className="text-3xl font-serif text-gray-900 mt-12 mb-4 border-b-2 border-blue-600 pb-2 inline-block">
            Why Solid Wood Over Engineered Plywood?
          </h2>
          <p>
            While engineered wood (MDF/Particle board) is cheaper, it quickly degrades in Nepal's humid monsoon season. A solid Teak or Sheesham wood bed from Sindureghari Furniture will easily last generations without creaking or warping.
          </p>
        </div>
        
        {/* Sidebar / Internal Linking Hub */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit">
          <h3 className="text-xl font-serif text-gray-900 mb-6 border-b border-gray-300 pb-2">
            Bedroom Categories
          </h3>
          <ul className="space-y-3">
            <li><Link href="/category/bedroom?type=beds" className="text-blue-700 hover:underline font-medium">Wooden Beds</Link></li>
            <li><Link href="/category/bedroom?type=wardrobes" className="text-blue-700 hover:underline font-medium">Wardrobes / Daraz</Link></li>
            <li><Link href="/category/bedroom?type=dressing-tables" className="text-blue-700 hover:underline font-medium">Dressing Tables</Link></li>
            <li><Link href="/category/bedroom?type=mattresses" className="text-blue-700 hover:underline font-medium">Orthopedic Mattresses</Link></li>
          </ul>

          <h3 className="text-xl font-serif text-gray-900 mt-10 mb-6 border-b border-gray-300 pb-2">
            Helpful Resources
          </h3>
          <ul className="space-y-3">
            <li><Link href="/furniture-price-guide-nepal-2026" className="text-gray-600 hover:text-blue-700">2026 Furniture Price Guide</Link></li>
            <li><Link href="/blog" className="text-gray-600 hover:text-blue-700">Bed Maintenance Tips</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
