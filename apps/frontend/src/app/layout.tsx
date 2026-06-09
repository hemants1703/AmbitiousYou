import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeColorSync } from "@/components/theme-color-sync";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Base metadata
  metadataBase: new URL(siteConfig.url),
  title: {
    template: `%s | ${siteConfig.name}`,
    default: siteConfig.title,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,

  // Robots & indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Canonical
  alternates: {
    canonical: "/",
  },

  // OpenGraph - Facebook, LinkedIn, Discord, etc.
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 675,
        alt: "AmbitiousYou — Where ambitious goals become inevitable outcomes",
        type: "image/png",
      },
    ],
  },

  // Twitter Card - X/Twitter
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.creator,
    site: siteConfig.creator,
  },

  // Icons & Favicon — reference only assets that exist on disk
  // (src/app/favicon.ico is served at /favicon.ico).
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/svg_logos/favicon_32px.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
  },

  // Apple-specific
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "default",
  },

  // Format detection
  formatDetection: {
    telephone: false,
  },

  // Category
  category: "productivity",

  // Verification (add your verification codes when ready)
  // verification: {
  //   google: "your-google-verification-code",
  //   yandex: "your-yandex-verification-code",
  // },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {/* Extra tags not covered by the Metadata API. OG image tags are emitted
            from `openGraph.images`, so they are intentionally not duplicated here. */}
        <meta name="apple-mobile-web-app-title" content="AmbitiousYou" />
        <meta name="application-name" content="AmbitiousYou" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#64ccc5" />
        <meta name="author" content="AmbitiousYou" />

        {/* Preconnect to the image CDN for faster OG/illustration loads. */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ThemeColorSync />
          <Analytics />
          <SpeedInsights />
          <TooltipProvider>
            {children}
            <Toaster richColors theme="system" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
