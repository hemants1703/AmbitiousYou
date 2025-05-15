"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Rocket } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import "./exampleAmbitionAnimation.css";
import "./gradientAnimation.css";

interface OnboardingClientProps {
    step: number;
    features: any[];
    exampleAmbitions: string[];
    bricolage: any;
}

// Header component for all steps
function OnboardingHeader({ step, bricolage }: { step: number; bricolage: any }) {
    const titles = {
        1: {
            title: "Welcome to AmbitiousYou!",
            description: "Your personal companion for achieving extraordinary goals. Let's get you started on your journey to greatness."
        },
        2: {
            title: "What's Your Ambition?",
            description: "Share your goal, and our AI will help you break it down into achievable steps."
        },
        3: {
            title: "Your Personalized Ambition",
            description: "Here's your AI-powered ambition. You can edit any details before saving!"
        }
    };

    const current = titles[step as keyof typeof titles];

    return (
        <div className="text-center space-y-4">
            <h1 className={`${bricolage.className} tracking-tight text-4xl md:text-6xl font-bold`}>
                {current.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {current.description}
            </p>
        </div>
    );
}

// Footer component for all steps
function OnboardingFooter({
    step,
    onSkip,
    onBack,
    onNext,
    onSubmit,
    isLoading,
    isSubmitDisabled
}: {
    step: number;
    onSkip: () => void;
    onBack: () => void;
    onNext: () => void;
    onSubmit: () => void;
    isLoading: boolean;
    isSubmitDisabled: boolean;
}) {
    return (
        <div className="flex justify-between items-center mt-8">
            <Button variant="link" size="sm" className="text-muted-foreground hover:text-foreground opacity-50" onClick={onSkip}>
                Skip for now
            </Button>
            <div className="flex gap-4 items-center">
                {step > 1 && (
                    <Button size="lg" variant="outline" onClick={onBack}>
                        <ArrowLeftIcon className="h-4 w-4" />
                    </Button>
                )}
                {step === 1 && (
                    <Button size="lg" onClick={onNext}>
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                )}
                {step === 2 && (
                    <Button
                        size="lg"
                        className="px-8"
                        onClick={onSubmit}
                        disabled={isSubmitDisabled}
                    >
                        {isLoading ? "Generating..." : "Plan out my ambition"}
                        {/* {!isLoading && <Rocket className="ml-2 h-4 w-4" />} */}
                        {!isLoading && <span className="text-xl">🚀</span>}
                    </Button>
                )}
                {step === 3 && (
                    <Button size="lg" className="px-8" asChild>
                        <Link href="/dashboard">
                            Save & Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    );
}

// Add this after the imports
const exampleAmbitions = [
    // Personal Development
    {
        category: "Personal Growth",
        examples: [
            "Learn to play the piano and perform at a local venue",
            "Master conversational Spanish in 6 months",
            "Complete a 30-day meditation challenge"
        ]
    },
    // Career & Business
    {
        category: "Career & Business",
        examples: [
            "Launch my first tech startup within 12 months",
            "Complete my MBA while working full-time",
            "Build a portfolio of 10 successful client projects"
        ]
    },
    // Health & Fitness
    {
        category: "Health & Fitness",
        examples: [
            "Run a marathon in under 4 hours",
            "Achieve a consistent 5am morning routine",
            "Complete a 100-day fitness transformation"
        ]
    }
];

function ExampleAmbitions({ onSelect }: { onSelect: (example: string) => void }) {
    return (
        <div className="space-y-2 bg-background/80 backdrop-blur-sm rounded-lg p-4">
            <div className="space-y-2">
                {exampleAmbitions.map((category, idx) => (
                    <div key={idx} className="space-y-1">
                        <h3 className="text-xs text-foreground/50 font-black uppercase tracking-wider px-1">
                            {category.category}
                        </h3>
                        <div className="ambition-row">
                            <div className={`ambition-row-content ${idx % 2 === 0 ? 'roll-left' : 'roll-right'}`}>
                                {[...category.examples, ...category.examples, ...category.examples].map((example, exampleIdx) => (
                                    <button
                                        key={exampleIdx}
                                        onClick={() => onSelect(example)}
                                        className="ambition-card px-3 rounded-md border border-[var(--custom-light-pale)]/30 
                                            hover:border-[var(--custom-light)] hover:bg-[var(--custom-light-pale)]/10 
                                            transition-all text-sm group"
                                    >
                                        <div className="flex items-center gap-2 w-full">
                                            <span className="flex-1 truncate">{example}</span>
                                            <ArrowRight className="h-3.5 w-3.5 text-[var(--custom-light)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function OnboardingClient({ step, features, exampleAmbitions, bricolage }: OnboardingClientProps) {
    const router = useRouter();
    const [ambition, setAmbition] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [generatedAmbition, setGeneratedAmbition] = useState<any>(null);
    const [editableAmbition, setEditableAmbition] = useState<any>(null);

    const handleNext = () => {
        if (step < 3) {
            router.push(`/onboarding?step=${step + 1}`);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            router.push(`/onboarding?step=${step - 1}`);
        }
    };

    const handleSkip = () => {
        if (step < 3) {
            router.push(`/onboarding?step=${step + 1}`);
        }
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
                router.push('/onboarding?step=3');
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

    // Main content for each step
    const renderMainContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="grid md:grid-cols-3 gap-6">
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
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-foreground">
                            <div className="h-10 w-10 rounded-full bg-[var(--custom-light)]/20 flex items-center justify-center">
                                <span className="text-xl">👋</span>
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold">Hi, I'm Cynthia!</p>
                                <p className="text-sm text-foreground/60">Your AI ambition companion. What would you like to achieve? I'll help you curate your ambition into achievable steps.</p>
                            </div>
                        </div>

                        {/* Priority 1: Input Area */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--custom-light)] via-[var(--custom-dark)] to-[var(--custom-light-pale)] rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
                            <div className="relative">
                                <Input
                                    placeholder="e.g., I want to learn to play the piano and perform at a local venue within 6 months"
                                    className="w-full text-lg bg-background/80 backdrop-blur-sm border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg shadow-lg py-5 pl-12"
                                    value={ambition}
                                    onChange={(e) => setAmbition(e.target.value)}
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--custom-light)]">
                                    <span className="text-xl">💭</span>
                                </div>
                            </div>
                        </div>

                        {/* Priority 2: Example Ambitions */}
                        <ExampleAmbitions onSelect={setAmbition} />

                        {/* Priority 3: Generate Button
                        <div className="flex justify-center pt-2">
                            <Button
                                size="lg"
                                className="px-8 bg-gradient-to-r from-[var(--custom-light)] to-[var(--custom-dark)] hover:from-[var(--custom-dark)] hover:to-[var(--custom-light)] transition-all duration-500"
                                onClick={handleSubmit}
                                disabled={isSubmitDisabled}
                            >
                                {isLoading ? "Thinking..." : "Plan out my ambition"}
                                {!isLoading && <span className="text-xl ml-2">🚀</span>}
                            </Button>
                        </div> */}
                    </div>
                );
            case 3:
                return editableAmbition ? (
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
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground">
                        No plan generated yet. Please try again.
                    </div>
                );
            default:
                return null;
        }
    };

    const isSubmitDisabled = !ambition.trim() || (ambition.trim().length < 10) || isLoading;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <OnboardingHeader step={step} bricolage={bricolage} />
            <div className="flex-1 justify-center items-center h-[350px]">
                {renderMainContent()}
            </div>
            <OnboardingFooter
                step={step}
                onSkip={handleSkip}
                onBack={handleBack}
                onNext={handleNext}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                isSubmitDisabled={isSubmitDisabled}
            />
        </div>
    );
} 