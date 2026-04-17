import Link from "next/link";
import ArticleCard from "./ArticleCard";
import { heroArticles, mostRead } from "@/lib/mock-data";

export default function HeroSection() {
  return (
    <section className="bg-[#F0EDE6] border-b border-[#E2DDD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-[10px] tracking-widest uppercase text-[#8A8280] mb-7">
          Latest Stories
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8">
            {heroArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="hero" />
            ))}
          </div>

          <aside className="lg:col-span-1 lg:border-l lg:border-[#E2DDD5] lg:pl-8">
            <h3 className="text-[10px] tracking-widest uppercase text-[#8A8280] mb-5">
              Most Read
            </h3>
            <ol className="flex flex-col gap-5">
              {mostRead.map((article, i) => (
                <li key={article.id} className="flex gap-3 items-start">
                  <span className="text-2xl font-serif text-[#DDD8CF] leading-none select-none shrink-0 w-7">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <Link
                      href={`/article/${article.slug}`}
                      className="text-[0.8rem] font-medium text-[#1A1A1A] hover:text-[#C8512A] transition-colors leading-snug line-clamp-3"
                    >
                      {article.title}
                    </Link>
                    <div className="mt-1 text-[10px] tracking-wide uppercase text-[#8A8280]">
                      {article.category}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/articles"
            className="inline-block text-xs tracking-widest uppercase border border-[#1A1A1A] text-[#1A1A1A] px-7 py-2.5 hover:bg-[#1A1A1A] hover:text-white transition-colors"
          >
            See More Stories
          </Link>
        </div>
      </div>
    </section>
  );
}
