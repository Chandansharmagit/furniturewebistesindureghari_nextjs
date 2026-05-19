import StoresPage from '@/pages/StoresPage';

export const metadata = {
  title: "Furniture Showrooms & Store Locations Nepal",
  description:
    "Visit Sindureghari Furniture showrooms in Chandrapur, Rautahat. 10,000+ sq ft of handcrafted sofas, beds & dining sets on display. Get directions, opening hours & phone.",
  alternates: {
    canonical: "https://sinduregharifurniture.shop/stores",
  },
  openGraph: {
    title: "Our Showrooms | Sindureghari Furniture Nepal",
    description: "Find the nearest Sindureghari Furniture showroom. Premium solid wood furniture on display.",
    url: "https://sinduregharifurniture.shop/stores",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <StoresPage />;
}
