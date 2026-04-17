import ArticleCard from "./ArticleCard";
import { featuredArticles } from "@/lib/mock-data";

export default function FeaturedBand() {
  return (
    <section className="bg-[#160b1d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-[10px] tracking-widest uppercase text-white/30 mb-6">
          Editor&apos;s Pick
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
          {featuredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="featured" />
          ))}
        </div>
      </div>
    </section>
  );
}
