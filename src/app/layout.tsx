import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { THEME_SCRIPT } from "@/lib/constants";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "StudioSpace — Book creative studios that feel like you",
    template: "%s | StudioSpace",
  },
  description:
    "Discover and book photo studios, film stages, podcast lounges, music suites, and workshops from independent hosts.",
  keywords: [
    "creative studio rental",
    "photo studio booking",
    "podcast studio",
    "film stage",
    "music rehearsal space",
    "StudioSpace",
  ],
  openGraph: {
    type: "website",
    siteName: "StudioSpace",
    title: "StudioSpace — Book creative studios that feel like you",
    description:
      "Discover and book photo studios, film stages, podcast lounges, music suites, and workshops from independent hosts.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "StudioSpace — Book creative studios that feel like you",
    description:
      "A calmer way to find, book, and list creative spaces. Built for the people who make things.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f1e8" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0f0d" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="studiolight"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${displayFont.variable} ${bodyFont.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-base-100 text-base-content antialiased">
        <AppProviders>
          <div className="grain-overlay" aria-hidden="true" />
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
