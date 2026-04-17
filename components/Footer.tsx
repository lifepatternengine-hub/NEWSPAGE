"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0e0a17] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/10 pb-12">
          <div>
            <h2 className="font-serif text-2xl mb-3">The Pattern</h2>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Honest, evidence-based journalism for professionals navigating the second half
              of their working lives. Neither doom nor cheerleading — just the full arc.
            </p>
          </div>

          <div>
            <h3 className="text-[10px] tracking-widest uppercase text-white/30 mb-5">Topics</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-white/60">
              <li>
                <Link href="/category/burnout" className="hover:text-white transition-colors">
                  Burnout &amp; Disruption
                </Link>
              </li>
              <li>
                <Link href="/category/reinvention" className="hover:text-white transition-colors">
                  Reinvention Stories
                </Link>
              </li>
              <li>
                <Link href="/category/research" className="hover:text-white transition-colors">
                  Research &amp; Data
                </Link>
              </li>
              <li>
                <Link href="/category/policy" className="hover:text-white transition-colors">
                  Policy &amp; Legislation
                </Link>
              </li>
              <li>
                <Link href="/category/case-study" className="hover:text-white transition-colors">
                  Case Studies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] tracking-widest uppercase text-white/30 mb-5">
              Weekly Digest
            </h3>
            <p className="text-sm text-white/50 mb-4">The signal, not the noise.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-white/8 border border-white/15 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />
              <button
                type="submit"
                className="bg-white text-[#0e0a17] px-4 py-2 text-xs tracking-widest uppercase font-medium hover:bg-white/90 transition-colors shrink-0"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-[11px] text-white/25">© 2026 The Pattern. All rights reserved.</p>
          <div className="flex gap-6 text-[11px] text-white/35">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
            <Link href="/editorial-policy" className="hover:text-white/60 transition-colors">
              Editorial Policy
            </Link>
            <Link href="/contact" className="hover:text-white/60 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
