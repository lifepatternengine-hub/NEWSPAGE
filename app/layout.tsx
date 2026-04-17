import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Pattern — Midlife Professional Reinvention",
  description:
    "Honest, evidence-based journalism for professionals navigating the second half of their working lives. Mental health, career transition, identity, and purpose.",
  metadataBase: new URL("https://the-pattern.xyz"),
  openGraph: {
    siteName: "The Pattern",
    type: "website",
    url: "https://the-pattern.xyz",
    title: "The Pattern — Midlife Professional Reinvention",
    description:
      "Honest, evidence-based journalism for professionals navigating the second half of their working lives.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${inter.variable}`}>
<body className="min-h-screen flex flex-col antialiased">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
