import Link from "next/link";
import ArticleCard from "./ArticleCard";
import { ArticleMeta } from "@/lib/articles";

interface Props {
  title: string;
  slug: string;
  articles: ArticleMeta[];
}

export default function CategoryRow({ title, slug, articles }: Props) {
  return (
    <section className="border-b border-[#E2DDD5] bg-[#F0EDE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-baseline justify-between mb-7">
          <h2 className="font-serif text-2xl text-[#1A1A1A]">{title}</h2>
          <Link
            href={`/category/${slug}`}
            className="text-xs tracking-widest uppercase text-[#8A8280] hover:text-[#C8512A] transition-colors"
          >
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {articles.slice(0, 4).map((article) => (
            <ArticleCard key={article.slug} article={article} variant="row" />
          ))}
        </div>
      </div>
    </section>
  );
}
