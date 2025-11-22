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

export const metadata: Metadata = {
  title: {
    template: "%s | AmbitiousYou",
    default: "AmbitiousYou - Get ready to become a Superhuman!",
  },
  description:
    "Reduce your mental overload and manage all your ambitions at a single place, AmbitiousYou helps you become a Superhuman!",
  keywords: [
    "ambitious",
    "you",
    "superhuman",
    "ambitions",
    "goals",
    "tasks",
    "productivity",
    "mental health",
    "mental overload",
    "ambitiousyou",
    "ambitious-you",
    "ambitious_you",
    "ambitiousyou.com",
    "ambitious-you.com",
    "ambitious_you.com",
  ],
  openGraph: {
    title: "AmbitiousYou - Get ready to become a Superhuman!",
    description:
      "Reduce your mental overload and manage all your ambitions at a single place, AmbitiousYou helps you become a Superhuman!",
    images: [
      {
        url: "/logo.ico",
        width: 800,
        height: 600,
        alt: "AmbitiousYou Logo",
      },
    ],
  },
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
        <meta name="apple-mobile-web-app-title" content="AmbitiousYou" />
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
