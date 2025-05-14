"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Playfair_Display } from "next/font/google";
import { ArrowRight, Check, ChevronRight, Rocket, Star, Target, Timer, Zap } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface GeneratedAmbition {
    milestones: {
        milestone: string;
        description: string;
    }[];
    actions: {
        action: string;
        description: string;
    }[];
}

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
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

export default function Onboarding() {
    const [step, setStep] = useState<number>(1);
    const [ambition, setAmbition] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [generatedAmbition, setGeneratedAmbition] = useState<any>(null);
    const [editableAmbition, setEditableAmbition] = useState<any>(null);

    // Handle step navigation
    const goToStep = (s: number) => setStep(Math.max(1, Math.min(3, s)));

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
    };
    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };
    const handleSkip = () => {
        if (step < 3) setStep(step + 1);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/onboarding/user/free`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ambition }),
            });
            const data = await response.json();
            if (data.success) {
                setGeneratedAmbition(data.googleGenAIResponse);
                setEditableAmbition({ ...data.googleGenAIResponse });
                setStep(3);
            }
        } catch (error) {
            toast.error("Error generating ambition:", {
                description: "Please try again later.",
                duration: 5000,
            });
            console.error("Error generating ambition:", error);
        }
        setIsLoading(false);
    };

    return (
        <div className="relative min-h-screen flex justify-between items-center">
            {/* Animated Gradient Background */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute w-[120vw] h-[120vh] -top-1/4 -left-1/4 bg-gradient-radial from-blue-500/40 via-purple-500/30 to-transparent rounded-full blur-3xl animate-[spin_30s_linear_infinite]" />
                <div className="absolute w-[100vw] h-[100vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-pink-400/30 via-indigo-400/20 to-transparent rounded-full blur-2xl animate-[pulse_8s_ease-in-out_infinite]" />
                <div className="absolute w-[80vw] h-[80vw] right-0 bottom-0 bg-gradient-radial from-cyan-400/20 via-transparent to-transparent rounded-full blur-2xl animate-[spin_40s_linear_infinite]" />
            </div>

            <div className="container max-w-5xl mx-auto px-4 py-12 relative z-10">
                {/* Stepper */}
                <div className="flex justify-center mb-8">
                    {[1, 2, 3].map((s: number) => (
                        <div
                            key={s}
                            className={`mx-2 w-3 h-3 rounded-full transition-all duration-300 ${Number(step) === Number(s) ? 'bg-primary scale-125' : 'bg-muted'}`}
                        />
                    ))}
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-muted rounded-full mb-12">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                {/* Step 1: Welcome */}
                {step === 1 && (
                    <div className="text-center space-y-8">
                        <div className="space-y-4">
                            <h1 className={`${playfair.className} text-4xl md:text-6xl font-bold`}>
                                Welcome to AmbitiousYou
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                Your personal companion for achieving extraordinary goals. Let's get you started on your journey to greatness.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6 mt-12">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border hover:border-primary/50 transition-all"
                                >
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center gap-4 mt-8">
                            <Button size="lg" className="px-8" onClick={handleNext}>
                                Next <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="lg" onClick={handleSkip}>
                                Skip
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Input Ambition */}
                {step === 2 && (
                    <div className="max-w-2xl mx-auto space-y-8">
                        <div className="text-center space-y-4">
                            <h2 className={`${playfair.className} text-3xl md:text-4xl font-bold`}>
                                What's Your Ambition?
                            </h2>
                            <p className="text-muted-foreground">
                                Share your goal, and our AI will help you break it down into achievable steps.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <Textarea
                                placeholder="e.g., I want to learn to play the piano and perform at a local venue within 6 months"
                                className="min-h-[120px] text-lg"
                                value={ambition}
                                onChange={(e) => setAmbition(e.target.value)}
                            />
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Example ambitions:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {exampleAmbitions.map((example, index) => (
                                        <button
                                            key={index}
                                            className="text-left p-3 rounded-lg border hover:border-primary/50 transition-all text-sm"
                                            onClick={() => setAmbition(example)}
                                        >
                                            {example}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center gap-4 mt-8">
                            <Button size="lg" variant="outline" onClick={handleBack} disabled={step === 1}>
                                Back
                            </Button>
                            <Button
                                size="lg"
                                className="px-8"
                                onClick={handleSubmit}
                                disabled={!ambition.trim() || isLoading}
                            >
                                {isLoading ? "Generating..." : "Generate Plan"}
                                {!isLoading && <Rocket className="ml-2 h-4 w-4" />}
                            </Button>
                            <Button variant="ghost" size="lg" onClick={handleSkip}>
                                Skip
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Curated Ambition UI */}
                {step === 3 && (
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div className="text-center space-y-4">
                            <h2 className={`${playfair.className} text-3xl md:text-4xl font-bold`}>
                                Your Personalized Plan
                            </h2>
                            <p className="text-muted-foreground">
                                Here's your AI-generated roadmap to success. You can edit any details before saving!
                            </p>
                        </div>
                        {editableAmbition ? (
                            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border space-y-6">
                                {/* Ambition Details */}
                                <div className="space-y-4">
                                    <label className="block font-semibold">Title</label>
                                    <input
                                        className="w-full p-2 rounded bg-background border border-border"
                                        value={editableAmbition.ambitionName || ''}
                                        onChange={e => setEditableAmbition({ ...editableAmbition, ambitionName: e.target.value })}
                                    />
                                    <label className="block font-semibold mt-4">Definition</label>
                                    <Textarea
                                        className="w-full min-h-[80px]"
                                        value={editableAmbition.ambitionDefinition || ''}
                                        onChange={e => setEditableAmbition({ ...editableAmbition, ambitionDefinition: e.target.value })}
                                    />
                                </div>
                                {/* Tracking Method */}
                                <div className="mt-6">
                                    <label className="block font-semibold mb-2">Tracking Method</label>
                                    <div className="flex gap-6">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                checked={editableAmbition.trackingMethod === 'task'}
                                                onChange={() => setEditableAmbition({ ...editableAmbition, trackingMethod: 'task' })}
                                            />
                                            Task Based
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                checked={editableAmbition.trackingMethod === 'milestone'}
                                                onChange={() => setEditableAmbition({ ...editableAmbition, trackingMethod: 'milestone' })}
                                            />
                                            Milestone Based
                                        </label>
                                    </div>
                                </div>
                                {/* Tasks or Milestones */}
                                {editableAmbition.trackingMethod === 'task' ? (
                                    <div className="mt-6">
                                        <label className="block font-semibold mb-2">Tasks</label>
                                        <ul className="space-y-2">
                                            {(editableAmbition.tasks || []).map((task: any, idx: number) => (
                                                <li key={idx} className="flex items-center gap-2">
                                                    <input
                                                        className="flex-1 p-2 rounded bg-background border border-border"
                                                        value={task.taskName || ''}
                                                        onChange={e => {
                                                            const newTasks = [...editableAmbition.tasks];
                                                            newTasks[idx].taskName = e.target.value;
                                                            setEditableAmbition({ ...editableAmbition, tasks: newTasks });
                                                        }}
                                                    />
                                                    <Button variant="ghost" size="icon" onClick={() => {
                                                        setEditableAmbition({ ...editableAmbition, tasks: editableAmbition.tasks.filter((_: any, i: number) => i !== idx) });
                                                    }}>✕</Button>
                                                </li>
                                            ))}
                                        </ul>
                                        <Button
                                            className="mt-2"
                                            size="sm"
                                            onClick={() => setEditableAmbition({ ...editableAmbition, tasks: [...(editableAmbition.tasks || []), { taskName: '' }] })}
                                        >
                                            + Add Task
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="mt-6">
                                        <label className="block font-semibold mb-2">Milestones</label>
                                        <ul className="space-y-2">
                                            {(editableAmbition.milestones || []).map((milestone: any, idx: number) => (
                                                <li key={idx} className="flex items-center gap-2">
                                                    <input
                                                        className="flex-1 p-2 rounded bg-background border border-border"
                                                        value={milestone.milestoneName || milestone.milestone || ''}
                                                        onChange={e => {
                                                            const newMilestones = [...editableAmbition.milestones];
                                                            newMilestones[idx].milestoneName = e.target.value;
                                                            setEditableAmbition({ ...editableAmbition, milestones: newMilestones });
                                                        }}
                                                    />
                                                    <Button variant="ghost" size="icon" onClick={() => {
                                                        setEditableAmbition({ ...editableAmbition, milestones: editableAmbition.milestones.filter((_: any, i: number) => i !== idx) });
                                                    }}>✕</Button>
                                                </li>
                                            ))}
                                        </ul>
                                        <Button
                                            className="mt-2"
                                            size="sm"
                                            onClick={() => setEditableAmbition({ ...editableAmbition, milestones: [...(editableAmbition.milestones || []), { milestoneName: '' }] })}
                                        >
                                            + Add Milestone
                                        </Button>
                                    </div>
                                )}
                                <div className="flex justify-center gap-4 mt-8">
                                    <Button size="lg" variant="outline" onClick={handleBack}>
                                        Back
                                    </Button>
                                    <Button size="lg" className="px-8" asChild>
                                        <Link href="/dashboard">
                                            Save & Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground">
                                No plan generated yet. Please try again.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
} 