import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { whatIsAnAmbition, ambitionGenerationPromptForFreeUser } from "@/src/lib/content/ambitionGenerationPrompt";
import { AmbitionData, AmbitionMilestone, AmbitionTask } from "@/types";
import { createClient } from "@/utils/supabase/server";

// Input validation schema
const ambitionSchema = z.object({
    ambition: z.string()
        .min(10, "Ambition must be at least 10 characters long")
        .max(500, "Ambition must not exceed 500 characters")
        .regex(/^[a-zA-Z0-9\s.,!?-]+$/, "Ambition contains invalid characters")
});

export interface GeneratedAmbitionResponse {
    ambition: AmbitionData;
    tasks?: AmbitionTask[];
    milestones?: AmbitionMilestone[];
}

export async function POST(request: NextRequest) {
    const supabase = await createClient();

    if (!supabase.auth.getUser()) {
        return NextResponse.json({
            success: false,
            error: "Unauthorized"
        }, {
            status: 401,
            headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate",
                "Content-Type": "application/json",
            }
        })
    }

    try {
        // Parse and validate request body
        const body = await request.json();
        const validationResult = ambitionSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid input",
                    details: validationResult.error.errors
                },
                { status: 400 }
            );
        }

        const { ambition } = validationResult.data;

        // Validate API key
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
            console.error("Missing Google AI API key");
            return NextResponse.json(
                {
                    success: false,
                    error: "Server configuration error"
                },
                { status: 500 }
            );
        }

        // Initialize Google AI
        const googleGenAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });

        // Set timeout for AI request
        // const timeoutPromise = new Promise((_, reject) => {
        //     setTimeout(() => reject(new Error("Request timeout")), 10000);
        // });

        // Generate content with timeout
        const googleGenAIResponse = await googleGenAI.models.generateContent({
            model: "gemini-2.0-flash",
            contents: ambition,
            config: {
                systemInstruction: whatIsAnAmbition + ambitionGenerationPromptForFreeUser
            }
        });

        if (!googleGenAIResponse || !googleGenAIResponse.text) {
            throw new Error("No response from AI");
        }

        if (!googleGenAIResponse.text) {
            throw new Error("Empty response from AI");
        }

        console.log("Google GenAI response:", googleGenAIResponse.text);


        const cleanedResponse = JSON.parse(googleGenAIResponse.text.replace(/```json\s*|\s*```/g, ''));

        let generatedAmbition: GeneratedAmbitionResponse = {
            ambition: {
                id: crypto.randomUUID(),
                userId: "",
                ambitionName: cleanedResponse.ambition,
                ambitionDefinition: "",
                ambitionTrackingMethod: cleanedResponse.trackingMethod,
                ambitionSuccessMetric: "",
                ambitionStartDate: null,
                ambitionEndDate: null,
                ambitionCompletionDate: null,
                ambitionDeadline: "",
                ambitionStatus: "active",
                ambitionPriority: "medium",
                ambitionCategory: "",
                ambitionPercentageCompleted: 0,
                ambitionColor: "",
                createdAt: new Date(),
                updatedAt: new Date(),
                isFavourited: false
            },
            tasks: [],
            milestones: []
        }

        // Check if the response is in the expected format
        if (cleanedResponse.trackingMethod === "task") {
            generatedAmbition.tasks = cleanedResponse.tasks?.map((task: {
                task: string;
                description: string;
            }, index: number) => {
                return {
                    id: index.toString(),
                    userId: "",
                    ambitionId: generatedAmbition.ambition.id,
                    task: task.task,
                    taskDescription: task.description,
                    taskCompleted: false,
                    taskDeadline: "",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            })
        }

        // If tracking method is milestones, map the milestones
        if (cleanedResponse.trackingMethod === "milestone") {
            generatedAmbition.milestones = cleanedResponse.milestones?.map((milestone: {
                milestone: string;
                description: string;
            }, index: number) => {
                return {
                    id: index.toString(),
                    userId: "",
                    ambitionId: generatedAmbition.ambition.id,
                    milestone: milestone.milestone,
                    milestoneDescription: milestone.description,
                    milestoneCompleted: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    milestoneTargetDate: new Date(),
                }
            })
        }

        // Return success response
        return NextResponse.json(
            {
                success: true,
                googleGenAIResponse: cleanedResponse,
                generatedAmbition,
            },
            {
                status: 200,
                headers: {
                    "Cache-Control": "no-store, no-cache, must-revalidate",
                    "Content-Type": "application/json"
                }
            }
        );

    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "An unexpected error occurred"
            },
            { status: 500 }
        );
    }
}