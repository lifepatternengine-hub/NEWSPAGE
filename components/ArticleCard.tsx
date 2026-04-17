import Image from "next/image";
import Link from "next/link";
import { ArticleMeta } from "@/lib/articles";

const CATEGORY_LABELS: Record<string, string> = {
  burnout: "Burnout & Disruption",
  reinvention: "Reinvention Stories",
  research: "Research & Data",
  policy: "Policy & Legislation",
  "case-study": "Case Studies",
};

interface Props {
  article: ArticleMeta;
  variant?: "hero" | "featured" | "row";
}

export default function ArticleCard({ article, variant = "row" }: Props) {
  const categoryLabel = CATEGORY_LABELS[article.category] ?? article.category;
  const formattedDate = new Date(article.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (variant === "featured") {
    return (
      <Link href={`/article/${article.slug}`} className="group relative block overflow-hidden">
        <div className="relative aspect-[16/9]">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <span className="inline-block text-[10px] tracking-widest uppercase text-[#C8512A] mb-2">
            {categoryLabel}
          </span>
          <h2 className="font-serif text-2xl lg:text-3xl text-white leading-tight">
            {article.title}
          </h2>
          {article.subheadline && (
            <p className="mt-2 text-sm text-white/65 line-clamp-2 max-w-lg">{article.subheadline}</p>
          )}
          <div className="mt-3 text-[11px] text-white/40 tracking-wide">
            {formattedDate} · {article.readingTime} min read
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "hero") {
    return (
      <Link href={`/article/${article.slug}`} className="group block">
        <div className="relative aspect-[3/2] overflow-hidden bg-stone-200">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="pt-3">
          <span className="text-[10px] tracking-widest uppercase text-[#C8512A]">
            {categoryLabel}
          </span>
          <h3 className="mt-1 font-serif text-[0.95rem] leading-snug text-[#1A1A1A] group-hover:text-[#C8512A] transition-colors line-clamp-3">
            {article.title}
          </h3>
          <div className="mt-1.5 text-[11px] text-[#8A8280]">{formattedDate}</div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/article/${article.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="pt-3">
        <span className="text-[10px] tracking-widest uppercase text-[#C8512A]">
          {categoryLabel}
        </span>
        <h3 className="mt-1 font-serif text-[1rem] leading-snug text-[#1A1A1A] group-hover:text-[#C8512A] transition-colors line-clamp-3">
          {article.title}
        </h3>
        <div className="mt-1.5 text-[11px] text-[#8A8280]">
          {formattedDate} · {article.readingTime} min read
        </div>
      </div>
    </Link>
  );
}
