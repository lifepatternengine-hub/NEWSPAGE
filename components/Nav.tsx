"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <header className="bg-[var(--bg-nav)] backdrop-blur-md border-b border-[var(--border)] text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link
            href="/"
            className="font-serif text-xl text-[var(--ink)]"
          >
            The <em className="italic text-[var(--accent)]">Pattern</em>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase text-[var(--nav-text)]">
            <Link href="/topics" className="hover:text-[var(--ink)] transition-colors">Topics</Link>
            <Link href="/case-studies" className="hover:text-[var(--ink)] transition-colors">Case Studies</Link>
            <Link href="/research" className="hover:text-[var(--ink)] transition-colors">Research</Link>
            <Link href="/about" className="hover:text-[var(--ink)] transition-colors">About</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 text-[var(--nav-text)] hover:text-[var(--ink)] transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            <a
              href="https://life-pattern-engine.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-[var(--ink)] text-[var(--bg)] rounded-full px-5 py-2 text-xs font-medium hover:bg-[var(--accent)] hover:text-white transition-colors"
            >
              Take the Diagnostic →
            </a>
          </div>

          <button
            className="md:hidden text-[var(--nav-text)] hover:text-[var(--ink)]"
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
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg)]">
          <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col gap-4 text-xs tracking-widest uppercase text-[var(--nav-text)]">
            <Link href="/topics" onClick={() => setMenuOpen(false)} className="hover:text-[var(--ink)] transition-colors">Topics</Link>
            <Link href="/case-studies" onClick={() => setMenuOpen(false)} className="hover:text-[var(--ink)] transition-colors">Case Studies</Link>
            <Link href="/research" onClick={() => setMenuOpen(false)} className="hover:text-[var(--ink)] transition-colors">Research</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)} className="hover:text-[var(--ink)] transition-colors">About</Link>
            <a
              href="https://life-pattern-engine.xyz"
              className="text-[var(--accent)] font-medium"
            >
              Take the Diagnostic →
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
