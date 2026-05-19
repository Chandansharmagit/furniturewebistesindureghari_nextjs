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

export default function Page() {
  return <BlogList />;
}
