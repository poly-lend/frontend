"use client";

import FaqSection from "@/components/home/faqSection";
import HeroSection from "@/components/home/heroSection";
import HowItWorksSection from "@/components/home/howItWorksSection";
import RisksSection from "@/components/home/risksSection";
import TradersLendersSection from "@/components/home/tradersLendersSection";
import WhySection from "@/components/home/whySection";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-1 px-4 mb-8 sm:px-6 lg:px-8 mx-auto ">
      <HeroSection />
      <main className="space-y-10">
        <WhySection />
        <TradersLendersSection />
        <HowItWorksSection />
        <RisksSection />
        <FaqSection />
      </main>
    </div>
  );
}
