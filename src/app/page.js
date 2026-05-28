"use client";

import ModernHero from "../component/component/Hero/ModernHero";
import RoyalSpecialOffers from "../component/special-offers/RoyalSpecialOffers";
import Homeappliances from "../component/Homeapplicances/Homeappliances";
import InspirationGallery from "../component/home-extensions/InspirationGallery";
import FurnitureBrand from "../component/component/furniturebrand/Furniturebrand";
import Newproduct from "../component/newproducts/Newproducts";
import ShoppableRoom from "../component/home-extensions/ShoppableRoom";
import TopratedBrand from "../component/component/toprated/Toprated";
import InteriorDesignService from "../component/home-extensions/InteriorDesignService";
import Craftsmanship from "../component/home-extensions/Craftsmanship";
import EMIPromo from "../component/emi-promo/EMIPromo";
import Policy from "../component/component/privacypolicy/privacy";

export default function HomePage() {
  return (
    <>
      <ModernHero />
      <RoyalSpecialOffers />
      <Homeappliances />
      <InspirationGallery />
      <FurnitureBrand />
      <Newproduct />
      <ShoppableRoom />
      <TopratedBrand />
      <InteriorDesignService />
      <Craftsmanship />
      <EMIPromo />
      <Policy />
    </>
  );
}
