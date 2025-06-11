import React from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from '../components/HeroSection'
import FeatureSection from '../components/FeatureSection'
import Footer from '../components/Footer'

export default function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <HeroSection/>
      <FeatureSection/>
      <Footer/>
    </div>
  );
}
