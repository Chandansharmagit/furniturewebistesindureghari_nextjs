import React from 'react';

export const metadata = {
  title: "Furniture Price Guide in Nepal 2026 | Sindureghari Furniture",
  description: "The ultimate 2026 guide to furniture prices in Nepal. Compare costs for teak wood sofas, beds, dining tables, and modular kitchens in Kathmandu.",
  alternates: {
    canonical: "https://sinduregharifurniture.shop/furniture-price-guide-nepal-2026",
  },
  openGraph: {
    title: "Furniture Price Guide Nepal (2026 Update) | Sindureghari Furniture",
    description: "The complete 2026 furniture price guide for Kathmandu and Nepal. Know the real cost of teak, sheesham, and engineered wood.",
    url: "https://sinduregharifurniture.shop/furniture-price-guide-nepal-2026",
    type: "article",
  }
};

export default function PriceGuidePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">
          The 2026 Furniture Price Guide for Nepal
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Are you furnishing your new home in Kathmandu or Pokhara? Our definitive guide breaks down the real costs of high-quality wooden furniture so you can budget effectively and avoid being overcharged.
        </p>
      </div>

      {/* Sofa Prices Table */}
      <section className="mb-16">
        <h2 className="text-3xl font-serif text-gray-900 mb-6 border-b-2 border-amber-600 pb-2 inline-block">
          Sofa Set Prices in Nepal (2026)
        </h2>
        <p className="mb-6 text-gray-700 text-lg">
          Sofa prices vary wildly based on the wood used (Teak vs. Sal), the fabric quality, and the foam density. Here are the expected market rates for premium handcrafted sofas.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Sofa Type</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Material</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Expected Price Range (NPR)</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Lifespan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-4 px-6 text-gray-800">5-Seater Traditional</td>
                <td className="py-4 px-6 text-gray-600">Premium Teak Wood + High-Density Foam</td>
                <td className="py-4 px-6 font-medium text-green-700">Rs. 85,000 – Rs. 1,50,000</td>
                <td className="py-4 px-6 text-gray-600">20+ Years</td>
              </tr>
              <tr>
                <td className="py-4 px-6 text-gray-800">L-Shape / Corner Sofa</td>
                <td className="py-4 px-6 text-gray-600">Sheesham Wood + Premium Velvet</td>
                <td className="py-4 px-6 font-medium text-green-700">Rs. 75,000 – Rs. 1,30,000</td>
                <td className="py-4 px-6 text-gray-600">15+ Years</td>
              </tr>
              <tr>
                <td className="py-4 px-6 text-gray-800">Royal Carved Sofa</td>
                <td className="py-4 px-6 text-gray-600">Solid Rosewood (Hand Carved)</td>
                <td className="py-4 px-6 font-medium text-green-700">Rs. 1,50,000 – Rs. 3,50,000</td>
                <td className="py-4 px-6 text-gray-600">Generation to Generation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Bed Prices Table */}
      <section className="mb-16">
        <h2 className="text-3xl font-serif text-gray-900 mb-6 border-b-2 border-amber-600 pb-2 inline-block">
          Wooden Bed Prices in Kathmandu (2026)
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Bed Size / Type</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Material</th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Expected Price Range (NPR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-4 px-6 text-gray-800">King Size (Without Storage)</td>
                <td className="py-4 px-6 text-gray-600">Solid Teak Wood</td>
                <td className="py-4 px-6 font-medium text-green-700">Rs. 65,000 – Rs. 95,000</td>
              </tr>
              <tr>
                <td className="py-4 px-6 text-gray-800">King Size (Hydraulic Storage)</td>
                <td className="py-4 px-6 text-gray-600">Teak Frame + Premium Plywood Base</td>
                <td className="py-4 px-6 font-medium text-green-700">Rs. 85,000 – Rs. 1,20,000</td>
              </tr>
              <tr>
                <td className="py-4 px-6 text-gray-800">Queen Size Minimalist</td>
                <td className="py-4 px-6 text-gray-600">Sal Wood</td>
                <td className="py-4 px-6 font-medium text-green-700">Rs. 45,000 – Rs. 70,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Link Bait CTA */}
      <div className="bg-amber-50 border-l-4 border-amber-600 p-8 rounded-r-lg mt-12">
        <h3 className="text-2xl font-serif text-gray-900 mb-4">Are you a journalist, blogger, or real estate agent in Nepal?</h3>
        <p className="text-gray-700 mb-0 text-lg">
          Feel free to use our data and tables in your own articles! We actively track the furniture market across Nepal. We simply ask that you provide a link back to this page as the original data source.
        </p>
      </div>
    </div>
  );
}
