import { SITE_URL, getSeoSitelinkUrl, seoSitelinks } from "@/data/seoSitelinks";

export function getSiteNavigationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/#primary-sitelinks`,
    name: "Sindureghari Furniture primary site links",
    itemListElement: seoSitelinks.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SiteNavigationElement",
        "@id": `${getSeoSitelinkUrl(item.path)}#sitelink`,
        name: item.name,
        url: getSeoSitelinkUrl(item.path),
        description: item.description,
      },
    })),
  };
}

export default seoSitelinks;
