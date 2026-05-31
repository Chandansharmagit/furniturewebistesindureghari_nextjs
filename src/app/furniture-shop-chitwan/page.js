import { CitySeoLanding } from "@/component/seo/NepalSeoLanding";
import { citySeoPages, SITE_URL } from "@/data/nepalSeo";

const page = citySeoPages.chitwan;

export const metadata = {
  title: page.title,
  description: page.metaDescription,
  alternates: { canonical: `${SITE_URL}${page.path}` },
  openGraph: { title: page.title, description: page.metaDescription, url: `${SITE_URL}${page.path}`, type: "website" },
};

export default function Page() {
  return <CitySeoLanding page={page} />;
}

