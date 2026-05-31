import { CategorySeoLanding } from "@/component/seo/NepalSeoLanding";
import { categorySeoPages, SITE_URL } from "@/data/nepalSeo";

const page = categorySeoPages["wooden-bed-nepal"];

export const metadata = {
  title: page.title,
  description: page.metaDescription,
  alternates: { canonical: `${SITE_URL}${page.canonical}` },
  openGraph: {
    title: page.title,
    description: page.metaDescription,
    url: `${SITE_URL}${page.path}`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: page.title,
    description: page.metaDescription,
  },
};

export default function Page() {
  return <CategorySeoLanding page={page} />;
}

