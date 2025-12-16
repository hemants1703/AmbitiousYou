import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "../styles/globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteConfig = {
  name: "AmbitiousYou",
  title: "AmbitiousYou — Where ambitious goals become inevitable outcomes",
  description:
    "Priority management and progress tracking that motivates. Structure your dreams, track your progress, become unstoppable.",
  url: "https://ambitiousyou.pro", // Update with your actual domain
  ogImage: "https://res.cloudinary.com/dej4ks4wd/image/upload/v1765910319/OG_IMAGE_AY.png",
  creator: "@AmbitiousYouHQ", // Update with your Twitter handle
  keywords: [
    "goal tracking",
    "ambition management",
    "productivity app",
    "goal setting",
    "milestone tracking",
    "task management",
    "personal development",
    "life goals",
    "achievement tracking",
    "progress tracking",
    "AI goal planning",
    "habit tracking",
    "self improvement",
    "goal breakdown",
    "priority management",
  ],
};

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

  // Icons & Favicon
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon0.svg", type: "image/svg+xml" },
      { url: "/png_logos/favicon_16px.png", sizes: "16x16", type: "image/png" },
      { url: "/png_logos/favicon_32px.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Additional meta tags not covered by Next.js Metadata API */}
        <meta name="apple-mobile-web-app-title" content="AmbitiousYou" />
        <meta name="application-name" content="AmbitiousYou" />
        <meta name="theme-color" content="#64ccc5" />
        <meta name="msapplication-TileColor" content="#64ccc5" />

        {/* LinkedIn & legacy crawler compatibility */}
        <meta name="author" content="AmbitiousYou" />
        <meta
          name="image"
          property="og:image"
          content="https://res.cloudinary.com/dej4ks4wd/image/upload/v1765910319/OG_IMAGE_AY.png"
        />
        <meta
          property="og:image:secure_url"
          content="https://res.cloudinary.com/dej4ks4wd/image/upload/v1765910319/OG_IMAGE_AY.png"
        />
        <meta property="og:logo" content="https://ambitiousyou.pro/png_logos/logo_250px.png" />

        {/* WhatsApp specific - prefers these formats */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="675" />
        <meta property="og:updated_time" content="2025-01-01T00:00:00+00:00" />

        {/* Preconnect to external resources for performance */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
