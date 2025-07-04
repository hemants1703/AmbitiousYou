import { Bricolage_Grotesque } from "next/font/google";
import { OnboardingClient } from "./OnboardingClient";
import { cn } from "@/src/lib/utils";
import { Metadata } from "next";
import { StarsBackground } from "@/src/components/animate-ui/backgrounds/stars";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Onboarding",
};

export default async function Onboarding({ searchParams }: { searchParams: { step?: string } }) {
  const currentStep = Number(await searchParams.step) || 1;
  const isValidStep = currentStep >= 1 && currentStep <= 3;
  const step = isValidStep ? currentStep : 1;

  return (
    <div className="relative min-h-screen flex justify-between items-center">
      {/* Animated Gradient Background */}
      {/* <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute w-[150vw] h-[150vh] -top-1/3 -left-1/3 bg-gradient-radial from-blue-500/50 via-purple-500/40 to-transparent rounded-full blur-3xl animate-[spin_30s_linear_infinite]" />
        <div className="absolute w-[120vw] h-[120vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-pink-400/40 via-indigo-400/30 to-transparent rounded-full blur-2xl animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute w-[100vw] h-[100vw] right-0 bottom-0 bg-gradient-radial from-cyan-400/30 via-transparent to-transparent rounded-full blur-2xl animate-[spin_40s_linear_infinite]" />
        <div className="absolute w-[80vw] h-[80vh] top-0 left-1/4 bg-gradient-to-tr from-emerald-400/20 via-transparent to-transparent rounded-full blur-2xl animate-[spin_20s_linear_infinite]" />
        <div className="absolute w-[60vw] h-[60vh] bottom-1/4 right-1/4 bg-gradient-to-bl from-amber-400/20 via-transparent to-transparent rounded-full blur-2xl animate-[pulse_12s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/10 to-background/20" />
      </div> */}
      <StarsBackground className="absolute inset-0 flex items-center justify-center rounded-xl" />

      <div className="max-w-5xl mx-auto px-4 py-6 relative z-10">
        {/* Stepper */}
        <div className="flex justify-center mb-8">
          {[1, 2, 3].map((s: number) => (
            <div
              key={s}
              className={`mx-2 size-2 rounded-full transition-all duration-300 ${Number(step) === Number(s) ? "bg-primary scale-125" : "bg-background"}`}
            />
          ))}
        </div>

        {/* Progress bar */}
        {/* <div className="w-full h-1 bg-muted rounded-full mb-12">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div> */}

        <OnboardingHeader step={step} bricolage={bricolage} />

        <OnboardingClient step={step} />
      </div>
    </div>
  );
}

// Header component for all steps
function OnboardingHeader({ step, bricolage }: { step: number; bricolage: any }) {
  const titles = {
    1: {
      title: "Welcome to AmbitiousYou!",
      description:
        "Your personal companion for achieving extraordinary goals. Let's get you started on your journey to greatness.",
    },
    2: {
      title: "What's Your Ambition?",
      // description: "Share your goal, and our AI will help you break it down into achievable steps.",
      description: "",
    },
    3: {
      title: "Your Personalized Ambition",
      description: "Here's your AI-powered ambition. You can edit any details before saving!",
    },
  };

  const current = titles[step as keyof typeof titles];

  return (
    <div
      className={cn(
        "text-center space-y-4 max-sm:mx-20",
        step === 1 ? "flex flex-col justify-center items-center h-[480px]" : ""
      )}
    >
      <h1 className={`${bricolage.className} tracking-tight text-4xl md:text-6xl font-bold`}>
        {current.title}
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{current.description}</p>
    </div>
  );
}
