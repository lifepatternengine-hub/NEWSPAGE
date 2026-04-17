import ArticleCard from "./ArticleCard";
import { ArticleMeta } from "@/lib/articles";

interface Props {
  articles: ArticleMeta[];
}

export default function FeaturedBand({ articles }: Props) {
  const featured = articles.slice(0, 2);
  if (featured.length === 0) return null;

  return (
    <section className="bg-[#160b1d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-[10px] tracking-widest uppercase text-white/30 mb-6">
          Editor&apos;s Pick
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
          {featured.map((article) => (
            <ArticleCard key={article.slug} article={article} variant="featured" />
          ))}
        </div>
      </div>
    </section>
  );
}
