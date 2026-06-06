import ModernHero from "../component/component/Hero/ModernHero";
import RoyalSpecialOffers from "../component/special-offers/RoyalSpecialOffers";
import GalleryEntryPoint from "../component/home-extensions/GalleryEntryPoint";
import CategoryLandingGrid from "../component/home-extensions/CategoryLandingGrid";
import SmartCampaignTemplate from "../component/home-extensions/SmartCampaignTemplate";
import DesignConsultationTemplates from "../component/home-extensions/DesignConsultationTemplates";
import LoyaltySchemeShowcase from "../component/home-extensions/LoyaltySchemeShowcase";
import Homeappliances from "../component/Homeapplicances/Homeappliances";
import InspirationGallery from "../component/home-extensions/InspirationGallery";
import Newproduct from "../component/newproducts/Newproducts";
import ShoppableRoom from "../component/home-extensions/ShoppableRoom";
import GoogleReviews from "../component/home-extensions/GoogleReviews";
import EMIPromo from "../component/emi-promo/EMIPromo";
import Policy from "../component/component/privacypolicy/privacy";
import EnterpriseSitelinkSection from "../component/seo/EnterpriseSitelinkSection";

export default function HomePage() {
  return (
    <>
      <ModernHero />
      <GalleryEntryPoint />
      <CategoryLandingGrid />
      <DesignConsultationTemplates />
      <LoyaltySchemeShowcase />
      <SmartCampaignTemplate />
      <RoyalSpecialOffers />
      <Homeappliances />
      <InspirationGallery />
      <Newproduct />
      <ShoppableRoom />
      <GoogleReviews />
      <EMIPromo />
      <Policy />
      <EnterpriseSitelinkSection />
    </>
  );
}
