import Nav from '@/components/nav'
import Bottom from '@/components/bottom'
import HeroSection from '@/components/home/heroSection'
import WhySection from '@/components/home/whySection'
import TradersLendersSection from '@/components/home/tradersLendersSection'
import HowItWorksSection from '@/components/home/howItWorksSection'
import RisksSection from '@/components/home/risksSection'
import FaqSection from '@/components/home/faqSection'

export default function App() {
  return (
    <>
      <Nav />
      <div className="w-full max-w-7xl mx-auto px-4 flex-1 py-8">
        <div className="flex flex-col items-center justify-center gap-1 px-4 sm:px-6 lg:px-8 mx-auto">
          <HeroSection />
          <main className="space-y-10">
            <WhySection />
            <TradersLendersSection />
            <HowItWorksSection />
            <RisksSection />
            <FaqSection />
          </main>
        </div>
      </div>
      <Bottom />
    </>
  )
}
