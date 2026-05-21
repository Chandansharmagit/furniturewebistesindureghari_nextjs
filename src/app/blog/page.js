import BlogList from '@/pages/Blog/BlogList';

export const metadata = {
  title: "Furniture Blog — Design Tips & Guides",
  description:
    "Read expert guides on choosing the best sofas, beds & dining tables for your home in Nepal. Interior design tips, furniture care advice & trend reports from Sindureghari Furniture.",
  alternates: {
    canonical: "https://sinduregharifurniture.shop/blog",
  },
  openGraph: {
    title: "The Journal — Interior Design Blog | Sindureghari Furniture",
    description:
      "Design tips, furniture care guides, room makeover ideas and the latest trends in Nepal.",
    url: "https://sinduregharifurniture.shop/blog",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import Link from 'next/link';

export default function Page() {
  return (
    <>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 md:mb-0">
              Pillar Guides
            </span>
            <div className="flex gap-4">
              <Link 
                href="/sofa-set-nepal" 
                className="text-amber-700 hover:text-amber-900 font-medium text-sm bg-amber-50 px-3 py-1 rounded-full transition-colors"
              >
                🛋️ The Ultimate Sofa Guide
              </Link>
              <Link 
                href="/wooden-bed-design-nepal" 
                className="text-blue-700 hover:text-blue-900 font-medium text-sm bg-blue-50 px-3 py-1 rounded-full transition-colors"
              >
                🛏️ Wooden Bed Designs
              </Link>
            </div>
          </div>
        </div>
      </div>
      <BlogList />
    </>
  );
}
