import Link from "next/link";
import BlogList from "@/pages/Blog/BlogList";

export const metadata = {
  title: "Furniture Blog - Design Tips & Guides",
  description:
    "Read expert guides on choosing sofas, beds, dining tables, wardrobes, and custom furniture in Nepal from Sindureghari Furniture.",
  alternates: {
    canonical: "https://sinduregharifurniture.shop/blog",
  },
  openGraph: {
    title: "The Journal - Furniture Blog | Sindureghari Furniture",
    description:
      "Furniture buying guides, product-gallery stories, care advice, and showroom tips from Sindureghari Furniture.",
    url: "https://sinduregharifurniture.shop/blog",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return (
    <>
      <div className="journal-guide-strip">
        <div className="journal-guide-inner">
          <span className="journal-guide-label">Pillar guides</span>
          <div className="journal-guide-links">
            <Link href="/sofa-set-nepal">Sofa buying guide</Link>
            <Link href="/wooden-bed-design-nepal">Wooden bed designs</Link>
          </div>
        </div>
      </div>
      <BlogList />
    </>
  );
}
