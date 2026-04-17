import HeroSection from "@/components/HeroSection";
import FeaturedBand from "@/components/FeaturedBand";
import CategoryRow from "@/components/CategoryRow";
import LPEBand from "@/components/LPEBand";
import { burnoutArticles, reinventionArticles, researchArticles } from "@/lib/mock-data";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedBand />
      <CategoryRow
        title="Burnout &amp; Disruption"
        slug="burnout"
        articles={burnoutArticles}
      />
      <CategoryRow
        title="Reinvention Stories"
        slug="reinvention"
        articles={reinventionArticles}
      />
      <LPEBand />
      <CategoryRow
        title="Research &amp; Data"
        slug="research"
        articles={researchArticles}
      />
    </>
  );
}
