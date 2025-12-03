import CTA from "@/components/CTA";
import Features from "@/components/Features";
import AnimatedHero from "@/features/(landing)/homepage/AnimatedHero";
import confirmSession from "@/lib/auth/confirmSession";

export default async function Home() {
  let session;
  try {
    session = await confirmSession();
  } catch (error) {
    console.log(error);

    session = null;
  }

  return (
    <div className="flex flex-col w-full">
      {/* Animated Hero Section */}
      <AnimatedHero isLoggedIn={!!session} />

      {/* Features Section */}
      <Features />

      {/* Testimonials Section */}
      {/* <Testimonials /> */}

      {/* Pricing comparison section */}
      {/* <Pricing /> */}

      {/* CTA Section */}
      <CTA />
    </div>
  );
}
