import React from 'react';
import './SofaLanding.css';
import FurnitureSlider from '../slider/FurnitureSlider';
// Removed heavy video file (38MB) for better performance
// import videos from "./vidoes.mp4"
const SofaLanding = () => {
  return (
    <div className="landing-container">
      {/* Modern Furniture Slider - Replaces video background */}
      <FurnitureSlider />
    </div>
  );
};

export default SofaLanding;