import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeColorSync } from "@/components/theme-color-sync";
import { ThemeProvider } from "@/components/theme-provider";
import { createRootMetadata } from "@/lib/seo/metadata";
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

export const metadata: Metadata = createRootMetadata();

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const showTelemetry = process.env.NODE_ENV === "production";

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
          {showTelemetry ? <Analytics /> : null}
          {showTelemetry ? <SpeedInsights /> : null}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
