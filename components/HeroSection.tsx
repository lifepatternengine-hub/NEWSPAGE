import Link from "next/link";
import Image from "next/image";
import { ArticleMeta } from "@/lib/articles";

interface Props {
  articles: ArticleMeta[];
}

const CATEGORY_LABELS: Record<string, string> = {
  burnout: "Burnout & Disruption",
  reinvention: "Reinvention Stories",
  research: "Research & Data",
  policy: "Policy & Legislation",
  "case-study": "Case Studies",
};

export default function HeroSection({ articles }: Props) {
  const featured = articles[0];
  const mostRead = articles.slice(1, 5);

  if (!featured) return null;

  const featuredCategory = CATEGORY_LABELS[featured.category] ?? featured.category;
  const featuredDate = new Date(featured.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section className="bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
          {/* Left: featured hero article */}
          <Link
            href={`/article/${featured.slug}`}
            className="group bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden hover:-translate-y-1 transition-transform block"
          >
            <div className="relative aspect-[16/8] w-full">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-7">
              <span className="text-[11px] tracking-widest uppercase text-[var(--accent)] font-medium">
                {featuredCategory}
              </span>
              <h2 className="font-serif text-2xl lg:text-3xl text-[var(--ink)] mt-2 leading-tight">
                {featured.title}
              </h2>
              {featured.subheadline && (
                <p className="text-[var(--ink-mid)] text-sm leading-relaxed mt-3 line-clamp-2">
                  {featured.subheadline}
                </p>
              )}
              <div className="text-[var(--ink-soft)] text-xs mt-4 flex gap-3">
                <span>{featuredDate}</span>
                <span>{featured.readingTime} min read</span>
              </div>
            </div>
          </Link>

          {/* Right: Most Read sidebar */}
          <aside className="flex flex-col">
            <p className="text-[10px] tracking-[0.1em] uppercase text-[var(--ink-soft)] mb-3">
              Most Read
            </p>
            <ol className="flex flex-col gap-2.5">
              {mostRead.map((article, i) => {
                const catLabel = CATEGORY_LABELS[article.category] ?? article.category;
                return (
                  <li key={article.slug}>
                    <Link
                      href={`/article/${article.slug}`}
                      className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-3.5 flex gap-3 items-start hover:translate-x-1 transition-transform block"
                    >
                      <span className="font-serif text-xl italic text-[var(--border)] shrink-0 leading-none">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-xs font-medium text-[var(--ink)] leading-snug line-clamp-3">
                          {article.title}
                        </p>
                        <p className="text-[10px] text-[var(--ink-soft)] mt-1 capitalize">{catLabel}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </aside>
        </div>
      </div>
    </section>
  );
}
