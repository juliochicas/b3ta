import { MainHeader } from "@/components/MainHeader";
import { HeroB3ta } from "@/components/wow/HeroB3ta";
import { ProblemSolution } from "@/components/wow/ProblemSolution";
import { HowItWorks } from "@/components/wow/HowItWorks";
import { CoreServices } from "@/components/wow/CoreServices";
import { Methodology } from "@/components/wow/Methodology";
import { CaseStudiesCarousel } from "@/components/wow/CaseStudiesCarousel";
import { PricingSection } from "@/components/wow/PricingSection";
import { RecentBlog } from "@/components/wow/RecentBlog";
import { FinalCTA } from "@/components/wow/FinalCTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <MainHeader />
      <main>
        <HeroB3ta />
        <ProblemSolution />
        <HowItWorks />
        <CoreServices />
        <Methodology />
        <CaseStudiesCarousel />
        <PricingSection />
        <RecentBlog />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
