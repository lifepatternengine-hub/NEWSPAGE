"use client";
import { useState } from "react";
import Link from "next/link";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#1a1510]/90 backdrop-blur-md border-b border-[#2e2a24] text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link
            href="/"
            className="font-serif text-xl text-[#f0ece4]"
          >
            The <em className="italic text-[#a885d4]">Pattern</em>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase text-[#9b9286]">
            <Link href="/topics" className="hover:text-[#f0ece4] transition-colors">Topics</Link>
            <Link href="/case-studies" className="hover:text-[#f0ece4] transition-colors">Case Studies</Link>
            <Link href="/research" className="hover:text-[#f0ece4] transition-colors">Research</Link>
            <Link href="/about" className="hover:text-[#f0ece4] transition-colors">About</Link>
          </nav>

          <a
            href="https://life-pattern-engine.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center bg-[#f0ece4] text-[#1a1510] rounded-full px-5 py-2 text-xs font-medium hover:bg-[#a885d4] hover:text-white transition-colors"
          >
            Take the Diagnostic →
          </a>

          <button
            className="md:hidden text-[#9b9286] hover:text-[#f0ece4]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[#2e2a24] bg-[#1a1510]">
          <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col gap-4 text-xs tracking-widest uppercase text-[#9b9286]">
            <Link href="/topics" onClick={() => setMenuOpen(false)} className="hover:text-[#f0ece4] transition-colors">Topics</Link>
            <Link href="/case-studies" onClick={() => setMenuOpen(false)} className="hover:text-[#f0ece4] transition-colors">Case Studies</Link>
            <Link href="/research" onClick={() => setMenuOpen(false)} className="hover:text-[#f0ece4] transition-colors">Research</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)} className="hover:text-[#f0ece4] transition-colors">About</Link>
            <a
              href="https://life-pattern-engine.xyz"
              className="text-[#a885d4] font-medium"
            >
              Take the Diagnostic →
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
