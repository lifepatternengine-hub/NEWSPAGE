"use client";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("success");
      setEmail("");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <footer className="bg-[var(--bg)] border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-[var(--border)] pb-12">
          <div>
            <h2 className="font-serif text-xl text-[var(--ink)] mb-3">
              The <em className="italic text-[var(--accent)]">Pattern</em>
            </h2>
            <p className="text-sm text-[var(--ink-mid)] leading-relaxed max-w-xs">
              Honest, evidence-based journaling for professionals navigating the second half of their working lives. Neither doom nor cheerleading — just the full arc.
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

            {status === "success" ? (
              <div className="flex items-center gap-2 text-sm text-[var(--accent)] bg-[var(--bg-card)] border border-[var(--border)] rounded-full px-4 py-2.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Check your inbox!</span>
              </div>
            ) : (
              <form className="flex gap-2" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={status === "loading"}
                  className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-full px-4 py-2 text-sm text-[var(--ink)] placeholder-[var(--ink-soft)] focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-[var(--ink)] text-[var(--bg)] rounded-full px-4 py-2 text-xs font-medium hover:bg-[var(--accent)] hover:text-white transition-colors shrink-0 disabled:opacity-50"
                >
                  {status === "loading" ? "…" : "Join"}
                </button>
              </form>
            )}

            {status === "error" && (
              <p className="mt-2 text-xs text-red-400">{errorMsg}</p>
            )}
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
