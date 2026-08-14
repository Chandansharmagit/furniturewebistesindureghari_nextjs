import dynamic from 'next/dynamic';
import ModernHero from "../component/component/Hero/ModernHero";

// Lazy load all below-the-fold components to massively improve initial page load performance
const RoyalSpecialOffers = dynamic(() => import("../component/special-offers/RoyalSpecialOffers"), { ssr: true });
const GalleryEntryPoint = dynamic(() => import("../component/home-extensions/GalleryEntryPoint"), { ssr: true });
const CategoryLandingGrid = dynamic(() => import("../component/home-extensions/CategoryLandingGrid"), { ssr: true });
const SmartCampaignTemplate = dynamic(() => import("../component/home-extensions/SmartCampaignTemplate"), { ssr: true });
const DesignConsultationTemplates = dynamic(() => import("../component/home-extensions/DesignConsultationTemplates"), { ssr: true });
const LoyaltySchemeShowcase = dynamic(() => import("../component/home-extensions/LoyaltySchemeShowcase"), { ssr: true });
const Homeappliances = dynamic(() => import("../component/Homeapplicances/Homeappliances"), { ssr: true });
const InspirationGallery = dynamic(() => import("../component/home-extensions/InspirationGallery"), { ssr: true });
const Newproduct = dynamic(() => import("../component/newproducts/Newproducts"), { ssr: true });
const ShoppableRoom = dynamic(() => import("../component/home-extensions/ShoppableRoom"), { ssr: true });
const EMIPromo = dynamic(() => import("../component/emi-promo/EMIPromo"), { ssr: true });
const LandingReviewRequest = dynamic(() => import("../component/home-extensions/LandingReviewRequest"), { ssr: true });

// Newly added components for expanded homepage content
const Featuresproducts = dynamic(() => import("../component/component/featuresproducts/Featuresproducts"), { ssr: true });
const Furniturebrand = dynamic(() => import("../component/component/furniturebrand/Furniturebrand"), { ssr: true });

export default function HomePage() {
  return (
    <>
      <ModernHero />
      <Featuresproducts />
      <GalleryEntryPoint />
      <CategoryLandingGrid />
      <DesignConsultationTemplates />
      <LoyaltySchemeShowcase />
      <SmartCampaignTemplate />
      <RoyalSpecialOffers />
      <Furniturebrand />
      <Homeappliances />
      <InspirationGallery />
      <Newproduct />
      <ShoppableRoom />
      <EMIPromo />
      <LandingReviewRequest />
    </>
  );
}
