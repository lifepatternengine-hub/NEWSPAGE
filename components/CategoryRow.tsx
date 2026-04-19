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
    <section className="bg-[var(--bg)] border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-baseline justify-between mb-7">
          <h2 className="font-serif text-2xl text-[var(--ink)]">{title}</h2>
          <Link
            href={`/category/${slug}`}
            className="text-[var(--accent)] text-xs font-medium hover:text-[var(--accent)] transition-colors"
          >
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {articles.slice(0, 4).map((article) => (
            <ArticleCard key={article.slug} article={article} variant="row" />
          ))}
        </div>
      </div>
    </section>
  );
}
