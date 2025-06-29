import Hero from '@/components/Hero'
import CompanyStats from '@/components/CompanyStats'
import WorkProcess from '@/components/WorkProcess'
import WhyChooseUs from '@/components/WhyChooseUs'
import TechStack from '@/components/TechStack'
import BackToTop from '@/components/BackToTop'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Updated: 2025-06-24 - New optimized design with blue corporate palette */}
      <Hero />
      <CompanyStats />
      <WorkProcess />
      <WhyChooseUs />
      <TechStack />
      <BackToTop />
    </main>
  )
}
