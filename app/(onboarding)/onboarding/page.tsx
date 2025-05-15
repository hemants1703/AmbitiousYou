import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bricolage_Grotesque, Playfair_Display } from "next/font/google";
import { ArrowRight, Check, ChevronRight, Rocket, Star, Target, Timer, Zap } from "lucide-react";
import Link from "next/link";
import { OnboardingClient } from "./client";

const bricolage = Bricolage_Grotesque({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
});

const features = [
    {
        icon: <Target className="h-6 w-6 text-primary" />,
        title: "Goal Hierarchy",
        description: "Organize your ambitions from big dreams to daily tasks in a structured, manageable system.",
    },
    {
        icon: <Timer className="h-6 w-6 text-primary" />,
        title: "Progress Tracking",
        description: "Visualize your journey with beautiful charts and analytics that keep you motivated.",
    },
    {
        icon: <Zap className="h-6 w-6 text-primary" />,
        title: "AI Assistance",
        description: "Receive intelligent suggestions to overcome obstacles and optimize your approach.",
    },
];

const exampleAmbitions = [
    "Complete my MBA while working full-time",
    "Launch my first tech startup within 12 months",
    "Run a marathon in under 4 hours",
    "Learn to play the piano and perform at a local venue",
];

export default function Onboarding({
    searchParams,
}: {
    searchParams: { step?: string };
}) {
    const currentStep = Number(searchParams.step) || 1;
    const isValidStep = currentStep >= 1 && currentStep <= 3;
    const step = isValidStep ? currentStep : 1;

    return (
        <div className="relative min-h-screen flex justify-between items-center">
            {/* Animated Gradient Background */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute w-[150vw] h-[150vh] -top-1/3 -left-1/3 bg-gradient-radial from-blue-500/50 via-purple-500/40 to-transparent rounded-full blur-3xl animate-[spin_30s_linear_infinite]" />
                <div className="absolute w-[120vw] h-[120vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-pink-400/40 via-indigo-400/30 to-transparent rounded-full blur-2xl animate-[pulse_8s_ease-in-out_infinite]" />
                <div className="absolute w-[100vw] h-[100vw] right-0 bottom-0 bg-gradient-radial from-cyan-400/30 via-transparent to-transparent rounded-full blur-2xl animate-[spin_40s_linear_infinite]" />
                <div className="absolute w-[80vw] h-[80vh] top-0 left-1/4 bg-gradient-to-tr from-emerald-400/20 via-transparent to-transparent rounded-full blur-2xl animate-[spin_20s_linear_infinite]" />
                <div className="absolute w-[60vw] h-[60vh] bottom-1/4 right-1/4 bg-gradient-to-bl from-amber-400/20 via-transparent to-transparent rounded-full blur-2xl animate-[pulse_12s_ease-in-out_infinite]" />
                <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/10 to-background/20" />
            </div>

            <div className="max-w-5xl mx-auto px-4 py-6 relative z-10">
                {/* Stepper */}
                <div className="flex justify-center mb-8">
                    {[1, 2, 3].map((s: number) => (
                        <div
                            key={s}
                            className={`mx-2 w-3 h-3 rounded-full transition-all duration-300 ${Number(step) === Number(s) ? 'bg-primary scale-125' : 'bg-background'}`}
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

                <OnboardingClient
                    step={step}
                    features={features}
                    exampleAmbitions={exampleAmbitions}
                    bricolage={bricolage}
                />
            </div>
        </div>
    );
} 