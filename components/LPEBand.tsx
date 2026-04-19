export default function LPEBand() {
  return (
    <section className="bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-[var(--lpe-bg)] border border-[var(--lpe-border)] rounded-2xl p-12 md:p-14 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center relative overflow-hidden">
          {/* Decorative large number */}
          <div className="absolute right-40 top-[-20px] font-serif text-[200px] italic text-white/[0.04] pointer-events-none leading-none select-none">
            15
          </div>

          {/* Left content */}
          <div className="relative">
            <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--accent)] mb-5">
              Life Pattern Engine
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--ink)] leading-tight">
              Which of the 15 patterns are you carrying?
            </h2>
            <p className="text-[var(--ink-mid)] text-sm leading-relaxed mt-3 max-w-lg">
              28 questions. 15 professional archetypes. Understand your dominant pattern — free.
              Built for high-achieving professionals navigating the second half of their working lives.
            </p>
            <p className="text-[var(--ink-soft)] text-xs mt-2">
              No email required. Takes 7 minutes.
            </p>
          </div>

          {/* Right CTA */}
          <div className="relative shrink-0">
            <a
              href="https://life-pattern-engine.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[var(--accent)] text-[var(--bg)] rounded-full px-7 py-3.5 font-medium text-sm whitespace-nowrap hover:opacity-90 transition-colors inline-block"
            >
              Take the Free Diagnostic →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
