import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";
import { createClient } from "@/utils/supabase/server";

export default async function LandingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // If user is logged in, redirect to dashboard
  const supabase = await createClient();
  const userLoggedIn = await supabase.auth.getUser();
  // if (!userLoggedIn.error) {
  //   redirect("/dashboard");
  // }

  return (
    <>
      {/* GPU INTENSIVE BACKGROUND - Fixed background with gradient effects - these will stay in place during scroll */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/15 dark:from-primary/20 dark:to-primary/25"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 dark:bg-primary/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/10 dark:bg-secondary/20 rounded-full filter blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary/5 dark:bg-primary/15 rounded-full filter blur-3xl animate-pulse"
          style={{ animationDelay: "3s", animationDuration: "8s" }}
        ></div>
      </div>

      {/* Main content container */}
      <main className="relative max-w-screen-2xl min-h-svh flex flex-col justify-between items-center mx-auto z-10 overflow-x-hidden">
        <Navbar userLoggedIn={userLoggedIn.error === null ? true : false} />
        <div className="mt-16">{children}</div>
        <Footer />
      </main>
    </>
  );
}
