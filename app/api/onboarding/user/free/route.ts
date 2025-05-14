import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { whatIsAnAmbition, ambitionGenerationPromptForFreeUser } from "@/content/ambitionGenerationPrompt";
// Input validation schema
const ambitionSchema = z.object({
    ambition: z.string()
        .min(10, "Ambition must be at least 10 characters long")
        .max(500, "Ambition must not exceed 500 characters")
        .regex(/^[a-zA-Z0-9\s.,!?-]+$/, "Ambition contains invalid characters")
});

export async function POST(request: NextRequest) {
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
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Request timeout")), 10000);
        });

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

        const cleanedResponse = JSON.parse(googleGenAIResponse.text.replace(/```json\s*|\s*```/g, ''));

        // Return success response
        return NextResponse.json(
            {
                success: true,
                googleGenAIResponse: cleanedResponse
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