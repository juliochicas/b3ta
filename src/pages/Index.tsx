import { MainHeader } from "@/components/MainHeader";
import { HeroB3ta } from "@/components/wow/HeroB3ta";
import { TechLogos } from "@/components/wow/TechLogos";
import { ProblemSolution } from "@/components/wow/ProblemSolution";
import { TechStack } from "@/components/wow/TechStack";
import { Methodology } from "@/components/wow/Methodology";
import { CaseStudiesCarousel } from "@/components/wow/CaseStudiesCarousel";
import { PricingSection } from "@/components/wow/PricingSection";
import { FinalCTA } from "@/components/wow/FinalCTA";
import { Footer } from "@/components/Footer";
import { StickyCTA } from "@/components/StickyCTA";

const Index = () => {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <MainHeader />
      
      <main>
        <HeroB3ta />
        <TechLogos />
        <ProblemSolution />
        <TechStack />
        <Methodology />
        <CaseStudiesCarousel />
        <PricingSection />
        <FinalCTA />
        
        <StickyCTA />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
