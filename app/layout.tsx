import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AmbitiousYou - Get ready to become a Superhuman!",
  description: "Reduce your mental overload and manage all your ambitions at a single place, AmbitiousYou helps you become a Superhuman!",
  keywords: ["ambitious", "you", "superhuman", "ambitions", "goals", "tasks", "productivity", "mental health", "mental overload", "ambitiousyou", "ambitious-you", "ambitious_you", "ambitiousyou.com", "ambitious-you.com", "ambitious_you.com"],
  openGraph: {
    title: "AmbitiousYou - Get ready to become a Superhuman!",
    description: "Reduce your mental overload and manage all your ambitions at a single place, AmbitiousYou helps you become a Superhuman!",
    images: [
      {
        url: "/logo.ico",
        width: 800,
        height: 600,
        alt: "AmbitiousYou Logo",
      },
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
