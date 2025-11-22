import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import confirmSession from "@/lib/auth/confirmSession";

export default async function LandingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let session;
  try {
    session = await confirmSession();
  } catch (error) {
    console.log(error);

    session = null;
  }

  return (
    <>
      {/* GPU INTENSIVE BACKGROUND - Fixed background with gradient effects - these will stay in place during scroll */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-primary/15 dark:from-primary/20 dark:to-primary/25"></div>
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
        <Navbar userLoggedIn={session ? true : false} />
        <div className="mt-16">{children}</div>
        <Footer />
      </main>
      <h1 className="relative bottom-0 left-0 right-0 translate-y-1/2 text-5xl md:text-8xl lg:text-[10rem] p-0 m-0 text-center w-full bg-clip-text text-transparent bg-linear-to-b from-primary via-primary/50 to-transparent">
        <span className="font-regular">Ambitious</span>
        <span className="font-bold">You</span>
      </h1>
    </>
  );
}
