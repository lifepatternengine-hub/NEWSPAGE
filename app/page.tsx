import HeroSection from "@/components/HeroSection";
import FeaturedBand from "@/components/FeaturedBand";
import CategoryRow from "@/components/CategoryRow";
import LPEBand from "@/components/LPEBand";
import { getAllArticles, getArticlesByCategory } from "@/lib/articles";

export default function Home() {
  const all = getAllArticles();
  const burnout = getArticlesByCategory("burnout");
  const reinvention = getArticlesByCategory("reinvention");
  const research = getArticlesByCategory("research");

  return (
    <>
      <HeroSection articles={all} />
      <FeaturedBand articles={all} />
      {burnout.length > 0 && (
        <CategoryRow title="Burnout &amp; Disruption" slug="burnout" articles={burnout} />
      )}
      {reinvention.length > 0 && (
        <CategoryRow title="Reinvention Stories" slug="reinvention" articles={reinvention} />
      )}
      <LPEBand />
      {research.length > 0 && (
        <CategoryRow title="Research &amp; Data" slug="research" articles={research} />
      )}
    </>
  );
}
