import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug, getAllArticleSlugs } from "@/lib/articles";

export async function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  const url = `https://the-pattern.xyz/article/${article.slug}`;
  return {
    title: `${article.title} — The Pattern`,
    description: article.subheadline,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.subheadline,
      url,
      type: "article",
      publishedTime: article.date,
      images: [{ url: article.image, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.subheadline,
      images: [article.image],
    },
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  burnout: "Burnout & Disruption",
  reinvention: "Reinvention Stories",
  research: "Research & Data",
  policy: "Policy & Legislation",
  "case-study": "Case Studies",
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const label = CATEGORY_LABELS[article.category] ?? article.category;
  const formattedDate = new Date(article.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="bg-[var(--bg)] min-h-screen">
      {/* Header */}
      <div className="border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-8">
          <Link
            href={`/category/${article.category}`}
            className="text-[10px] tracking-widest uppercase text-[var(--accent)] font-medium hover:opacity-75 transition-opacity"
          >
            {label}
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mt-4 mb-4 text-[var(--ink)]">
            {article.title}
          </h1>
          <p className="text-lg text-[var(--ink-mid)] leading-relaxed mb-6">
            {article.subheadline}
          </p>
          <p className="text-xs text-[var(--ink-soft)] tracking-wide">
            {formattedDate} · {article.readingTime} min read
          </p>
        </div>
      </div>

      {/* Hero image */}
      <div className="w-full h-[220px] md:h-[420px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div
          className="prose-article"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {/* LPE CTA */}
        <div className="mt-16 border-t border-[var(--border)] pt-12">
          <div className="bg-[var(--lpe-bg)] border border-[var(--lpe-border)] rounded-2xl px-8 py-10 text-center">
            <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--accent)] mb-3">
              Life Pattern Engine
            </p>
            <h2 className="font-serif text-2xl md:text-3xl mb-4 text-[var(--ink)]">
              Which of the 15 patterns are you carrying?
            </h2>
            <p className="text-[var(--ink-mid)] text-sm mb-6 max-w-sm mx-auto leading-relaxed">
              28 questions. Free. Built for high-achieving professionals
              navigating the second half of their working lives.
            </p>
            <a
              href="https://life-pattern-engine.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[var(--accent)] text-[var(--bg)] rounded-full px-8 py-3 text-xs tracking-widest uppercase font-medium hover:opacity-90 transition-opacity"
            >
              Take the Free Diagnostic →
            </a>
            <p className="mt-3 text-[11px] text-[var(--ink-soft)]">No email required. Takes 7 minutes.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
