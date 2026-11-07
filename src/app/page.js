import dynamic from 'next/dynamic';
import ModernHero from "../component/component/Hero/ModernHero";
import { getHomeData } from "../component/home/homeData";
import { NewArrivals, BestDeals, CategoryShelf } from "../component/home/HomeSections";

// Code-split interactive & below-the-fold sections
const DiwaliOfferTemplates = dynamic(() => import("../component/offers/DiwaliOfferTemplates"), { ssr: true });
const RoyalSpecialOffers = dynamic(() => import("../component/special-offers/RoyalSpecialOffers"));
const CategoryLandingGrid = dynamic(() => import("../component/home-extensions/CategoryLandingGrid"));
const EMIPromo = dynamic(() => import("../component/emi-promo/EMIPromo"));
const LandingReviewRequest = dynamic(() => import("../component/home-extensions/LandingReviewRequest"));

// Re-fetch product data from the backend at most once a minute
export const revalidate = 60;

export default async function HomePage() {
  const { newArrivals, deals, maxDiscount, shelves } = await getHomeData();

  return (
    <>
      <ModernHero />
      <DiwaliOfferTemplates />
      <NewArrivals items={newArrivals} />
      <RoyalSpecialOffers compact />
      <BestDeals items={deals} maxDiscount={maxDiscount} />
      {shelves.map((shelf, index) => (
        <CategoryShelf key={shelf.name} shelf={shelf} index={index} />
      ))}
      <CategoryLandingGrid />
      <EMIPromo />
      <LandingReviewRequest />
    </>
  );
}
