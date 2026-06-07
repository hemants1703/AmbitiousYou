import Navbar from "@/components/(landing)/navbar";
import Footer from "@/components/(landing)/footer";
import LandingBackground from "@/components/(landing)/landing-background";

export const dynamic = "force-static";

export default async function LandingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <LandingBackground />

      {/* Main content container */}
      <main className="relative max-w-screen-2xl min-h-svh flex flex-col justify-between items-center mx-auto z-10 overflow-x-hidden">
        <Navbar />
        <div className="mt-16">{children}</div>
        <Footer />
      </main>
      {/* Decorative brand wordmark — not a heading (each page owns its single <h1>). */}
      <div aria-hidden="true" className="relative bottom-0 left-0 right-0 translate-y-1/2 text-5xl md:text-8xl lg:text-[10rem] p-0 m-0 text-center w-full bg-clip-text text-transparent bg-linear-to-b from-foreground via-foreground/50 to-transparent">
        <span className="font-regular">Ambitious</span>
        <span className="font-bold">You</span>
      </div>
    </>
  );
}
