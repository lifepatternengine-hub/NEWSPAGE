import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "The Pattern — Midlife Professional Reinvention",
  description:
    "Honest, evidence-based journalism for professionals navigating the second half of their working lives. Mental health, career transition, identity, and purpose.",
  metadataBase: new URL("https://the-pattern.xyz"),
  verification: { google: "ljvh2zOheaJ2nLCOlCXZCXSLeitBSnvFT6MeJyPAEu8" },
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
    <html lang="en" className={`${instrumentSerif.variable} ${dmSans.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()` }} />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-66YK7DMK53" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-66YK7DMK53');
        `}</Script>
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
