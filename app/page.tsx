import React from "react";
import { Navbar } from "../components/landing/Navbar";
import { HeroSection } from "../components/landing/HeroSection";
import { FeaturesSection } from "../components/landing/FeaturesSection";
import { PricingSection } from "../components/landing/PricingSection";
import { Footer } from "../components/landing/Footer";

export default async function LandingPage(): Promise<React.JSX.Element> {
  return (
    <div
      id="landing-page-root"
      className="flex flex-col min-h-screen bg-gray-50 text-gray-900 selection:bg-indigo-500 selection:text-white"
    >
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Sections */}
      <main id="landing-main-content" className="flex-grow pt-16">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
