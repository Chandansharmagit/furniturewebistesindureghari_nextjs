export const metadata = {
  title: "Track Order",
  description:
    "Track your Sindureghari Furniture order status, delivery progress and support updates online.",
  alternates: {
    canonical: "https://sinduregharifurniture.shop/orders",
  },
  openGraph: {
    title: "Track Order | Sindureghari Furniture Nepal",
    description:
      "Check your furniture order status and delivery progress from Sindureghari Furniture.",
    url: "https://sinduregharifurniture.shop/orders",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function OrdersLayout({ children }) {
  return children;
}
