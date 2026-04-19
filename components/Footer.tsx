"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--bg)] border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-[var(--border)] pb-12">
          <div>
            <h2 className="font-serif text-xl text-[var(--ink)] mb-3">
              The <em className="italic text-[var(--accent)]">Pattern</em>
            </h2>
            <p className="text-sm text-[var(--ink-mid)] leading-relaxed max-w-xs">
              Honest, evidence-based journalism for professionals navigating the second half
              of their working lives. Neither doom nor cheerleading — just the full arc.
            </p>
          </div>

          <div>
            <h3 className="text-[var(--ink-soft)] text-[10px] tracking-widest uppercase mb-5">Topics</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-[var(--ink-mid)]">
              <li>
                <Link href="/category/burnout" className="hover:text-[var(--ink)] transition-colors">
                  Burnout &amp; Disruption
                </Link>
              </li>
              <li>
                <Link href="/category/reinvention" className="hover:text-[var(--ink)] transition-colors">
                  Reinvention Stories
                </Link>
              </li>
              <li>
                <Link href="/category/research" className="hover:text-[var(--ink)] transition-colors">
                  Research &amp; Data
                </Link>
              </li>
              <li>
                <Link href="/category/policy" className="hover:text-[var(--ink)] transition-colors">
                  Policy &amp; Legislation
                </Link>
              </li>
              <li>
                <Link href="/category/case-study" className="hover:text-[var(--ink)] transition-colors">
                  Case Studies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[var(--ink-soft)] text-[10px] tracking-widest uppercase mb-5">
              Weekly Digest
            </h3>
            <p className="text-sm text-[var(--ink-mid)] mb-4">The signal, not the noise.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-full px-4 py-2 text-sm text-[var(--ink)] placeholder-[var(--ink-soft)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
              <button
                type="submit"
                className="bg-[var(--ink)] text-[var(--bg)] rounded-full px-4 py-2 text-xs font-medium hover:bg-[var(--accent)] hover:text-white transition-colors shrink-0"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-[11px] text-[var(--ink-soft)]">© 2026 The Pattern. All rights reserved.</p>
          <div className="flex gap-6 text-[11px] text-[var(--ink-soft)]">
            <Link href="/privacy" className="hover:text-[var(--ink-mid)] transition-colors">Privacy</Link>
            <Link href="/editorial-policy" className="hover:text-[var(--ink-mid)] transition-colors">
              Editorial Policy
            </Link>
            <Link href="/contact" className="hover:text-[var(--ink-mid)] transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
