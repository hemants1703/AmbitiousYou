import Navbar from "@/components/(landing)/navbar";
import Footer from "@/components/(landing)/footer";
import LandingBackground from "@/components/(landing)/landing-background";
import { bricolage } from "@/lib/fonts";
import "@/styles/landing.css";

export const dynamic = "force-static";

export default async function LandingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={bricolage.variable}>
      <LandingBackground />

      <div className="relative z-10 mx-auto flex min-h-svh max-w-screen-2xl flex-col items-center justify-between overflow-x-hidden">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-border focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-md">
          Skip to content
        </a>
        <Navbar />
        <main id="main-content" className="mt-16 w-full flex-1">
            {children}
        </main>
        <Footer />
      </div>

      {/* Decorative brand wordmark — not a heading (each page owns its single <h1>). */}
      <div aria-hidden="true" translate="no" className="relative bottom-0 left-0 right-0 m-0 w-full translate-y-1/2 bg-linear-to-b from-foreground via-foreground/50 to-transparent bg-clip-text p-0 text-center font-brand text-5xl text-transparent md:text-8xl lg:text-[10rem]">
        <span className="font-regular">Ambitious</span>
        <span className="font-bold">You</span>
      </div>
    </div>
  );
}
