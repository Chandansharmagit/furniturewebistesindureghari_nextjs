import Link from "next/link";
import { enterpriseCategories, getProgrammaticLocalPages, prioritySitelinks } from "@/data/enterpriseSeo";
import "./EnterpriseSitelinkSection.css";

export default function EnterpriseSitelinkSection() {
  const cityPages = getProgrammaticLocalPages();

  return (
    <section className="enterprise-sitelinks" aria-labelledby="enterprise-sitelinks-title">
      <div className="enterprise-sitelinks__inner">
        <div className="enterprise-sitelinks__intro">
          <span>Premium Wooden Furniture Nepal</span>
          <h1 id="enterprise-sitelinks-title">Sindureghari Furniture: handmade sofas, beds, wardrobes and dining furniture for Nepal.</h1>
          <p>
            Sindureghari Furniture is building Nepal&apos;s most complete premium wooden furniture catalogue:
            handcrafted sofa sets, solid wood beds, wardrobes, dining tables, study tables, outdoor furniture
            and lighting. Every category below is crawlable, internally linked and organized for shoppers
            searching from Kathmandu, Lalitpur, Bhaktapur and across Nepal.
          </p>
        </div>

        <nav className="enterprise-sitelinks__priority" aria-label="Primary furniture sitelinks">
          {prioritySitelinks.map((item) => (
            <Link href={item.path} key={item.path}>
              <strong>{item.name}</strong>
              <span>{item.metaDescription}</span>
            </Link>
          ))}
        </nav>

        <div className="enterprise-sitelinks__clusters">
          {enterpriseCategories.map((category) => (
            <div className="enterprise-sitelinks__cluster" key={category.slug}>
              <Link href={category.path} className="enterprise-sitelinks__cluster-title">
                {category.name}
              </Link>
              <ul>
                {category.children.map((child) => (
                  <li key={child.path}>
                    <Link href={child.path}>{child.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="enterprise-sitelinks__local">
          <h2>Furniture Store Kathmandu and Local Nepal Pages</h2>
          <div>
            {cityPages.map((page) => (
              <Link href={page.path} key={page.path}>{page.h1}</Link>
            ))}
            <Link href="/furniture-shop-kathmandu">Furniture Shop Kathmandu</Link>
            <Link href="/furniture-shop-lalitpur">Furniture Shop Lalitpur</Link>
            <Link href="/furniture-shop-bhaktapur">Furniture Shop Bhaktapur</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
