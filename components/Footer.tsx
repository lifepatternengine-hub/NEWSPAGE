"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1a1510] border-t border-[#2e2a24]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-[#2e2a24] pb-12">
          <div>
            <h2 className="font-serif text-xl text-[#f0ece4] mb-3">
              The <em className="italic text-[#a885d4]">Pattern</em>
            </h2>
            <p className="text-sm text-[#9b9286] leading-relaxed max-w-xs">
              Honest, evidence-based journalism for professionals navigating the second half
              of their working lives. Neither doom nor cheerleading — just the full arc.
            </p>
          </div>

          <div>
            <h3 className="text-[#6b6460] text-[10px] tracking-widest uppercase mb-5">Topics</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-[#9b9286]">
              <li>
                <Link href="/category/burnout" className="hover:text-[#f0ece4] transition-colors">
                  Burnout &amp; Disruption
                </Link>
              </li>
              <li>
                <Link href="/category/reinvention" className="hover:text-[#f0ece4] transition-colors">
                  Reinvention Stories
                </Link>
              </li>
              <li>
                <Link href="/category/research" className="hover:text-[#f0ece4] transition-colors">
                  Research &amp; Data
                </Link>
              </li>
              <li>
                <Link href="/category/policy" className="hover:text-[#f0ece4] transition-colors">
                  Policy &amp; Legislation
                </Link>
              </li>
              <li>
                <Link href="/category/case-study" className="hover:text-[#f0ece4] transition-colors">
                  Case Studies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#6b6460] text-[10px] tracking-widest uppercase mb-5">
              Weekly Digest
            </h3>
            <p className="text-sm text-[#9b9286] mb-4">The signal, not the noise.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-[#221d17] border border-[#2e2a24] rounded-full px-4 py-2 text-sm text-[#f0ece4] placeholder-[#6b6460] focus:outline-none focus:border-[#a885d4] transition-colors"
              />
              <button
                type="submit"
                className="bg-[#f0ece4] text-[#1a1510] rounded-full px-4 py-2 text-xs font-medium hover:bg-[#a885d4] hover:text-white transition-colors shrink-0"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-[11px] text-[#6b6460]">© 2026 The Pattern. All rights reserved.</p>
          <div className="flex gap-6 text-[11px] text-[#6b6460]">
            <Link href="/privacy" className="hover:text-[#9b9286] transition-colors">Privacy</Link>
            <Link href="/editorial-policy" className="hover:text-[#9b9286] transition-colors">
              Editorial Policy
            </Link>
            <Link href="/contact" className="hover:text-[#9b9286] transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
