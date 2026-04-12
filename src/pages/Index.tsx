import { MainHeader } from "@/components/MainHeader";
import { HeroB3ta } from "@/components/wow/HeroB3ta";
import { ProblemSolution } from "@/components/wow/ProblemSolution";
import { CoreServices } from "@/components/wow/CoreServices";
import { Methodology } from "@/components/wow/Methodology";
import { Portfolio } from "@/components/wow/Portfolio";
import { PricingSection } from "@/components/wow/PricingSection";
import { FinalCTA } from "@/components/wow/FinalCTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <MainHeader />

      <main>
        <HeroB3ta />
        <ProblemSolution />
        <CoreServices />
        <Methodology />
        <Portfolio />
        <PricingSection />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
