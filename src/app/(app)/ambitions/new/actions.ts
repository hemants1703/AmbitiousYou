"use server";

import { createClient } from "@/src/utils/supabase/server";
import { z } from "zod";

// Validation schema for ambition creation
const ambitionSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().default(""),
    priorityLevel: z.enum(["high", "medium", "low"]),
    deadline: z.string().min(1, "Deadline is required"),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a valid hex code"),
    trackingMethod: z.enum(["task", "milestone"]),
    successMetric: z.string().default(""),
    focusedAmbitionOnDashboard: z.boolean(),
    tasks: z.string().default("[]"),
    milestones: z.string().default("[]"),
});

// Schema for task validation
const taskSchema = z.object({
    task: z.string().min(1, "Task name is required"),
    taskDescription: z.string().optional(),
    taskDeadline: z.string().min(1, "Task deadline is required"),
});

// Schema for milestone validation
const milestoneSchema = z.object({
    milestone: z.string().min(1, "Milestone name is required"),
    milestoneDescription: z.string().optional(),
    milestoneCompleted: z.boolean().default(false),
    milestoneTargetDate: z.string().min(1, "Milestone target date is required"),
});

export async function createNewAmbition(formData: FormData) {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            throw new Error("Unauthorized");
        }

        // Parse and validate form data
        const rawData = {
            title: formData.get("title"),
            description: formData.get("description"),
            priorityLevel: formData.get("priorityLevel"),
            deadline: formData.get("deadline"),
            color: formData.get("color"),
            trackingMethod: formData.get("trackingMethod"),
            successMetric: formData.get("successMetric"),
            focusedAmbitionOnDashboard: formData.get("focusedAmbitionOnDashboard") === "true",
            tasks: formData.get("tasks"),
            milestones: formData.get("milestones"),
        };

        const validatedData = ambitionSchema.parse(rawData);

        // Prepare data for database insertion
        const ambitionData = {
            userId: user.id,
            ambitionName: validatedData.title,
            ambitionDefinition: validatedData.description || "",
            ambitionTrackingMethod: validatedData.trackingMethod,
            ambitionSuccessMetric: validatedData.successMetric,
            ambitionStartDate: new Date().toISOString(),
            ambitionEndDate: null,
            ambitionCompletionDate: null,
            ambitionDeadline: validatedData.deadline,
            ambitionStatus: "active",
            ambitionPriority: validatedData.priorityLevel,
            ambitionCategory: null,
            ambitionPercentageCompleted: "0",
            ambitionColor: validatedData.color,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Insert ambition and get its ID
        const { data: insertedAmbition, error: insertError } = await supabase
            .from("ambitions")
            .insert([ambitionData])
            .select()
            .single();

        if (insertError || !insertedAmbition) {
            throw new Error(insertError?.message || "Failed to create ambition");
        }

        // Handle tasks or milestones based on tracking method
        if (validatedData.trackingMethod === "task") {
            const tasks = JSON.parse(validatedData.tasks);
            if (!Array.isArray(tasks)) {
                throw new Error("Invalid tasks format");
            }

            // Validate each task
            const validatedTasks = tasks.map(task => taskSchema.parse(task));

            // Prepare tasks for insertion
            const tasksToInsert = validatedTasks.map(task => ({
                userId: user.id,
                ambitionId: insertedAmbition.id,
                task: task.task,
                taskDescription: task.taskDescription || null,
                taskCompleted: false,
                taskDeadline: task.taskDeadline,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }));

            // Insert tasks
            const { error: tasksError } = await supabase
                .from("tasks")
                .insert(tasksToInsert);

            if (tasksError) {
                // If tasks insertion fails, delete the ambition and throw error
                await supabase.from("ambitions").delete().eq("id", insertedAmbition.id);
                throw new Error(tasksError.message);
            }
        } else if (validatedData.trackingMethod === "milestone") {
            const milestones = JSON.parse(validatedData.milestones);
            if (!Array.isArray(milestones)) {
                throw new Error("Invalid milestones format");
            }

            // Validate each milestone
            const validatedMilestones = milestones.map(milestone => milestoneSchema.parse(milestone));

            // Prepare milestones for insertion
            const milestonesToInsert = validatedMilestones.map(milestone => ({
                userId: user.id,
                ambitionId: insertedAmbition.id,
                milestone: milestone.milestone || null,
                milestoneDescription: milestone.milestoneDescription || null,
                milestoneCompleted: milestone.milestoneCompleted || false,
                milestoneTargetDate: milestone.milestoneTargetDate || new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }));

            // Insert milestones
            const { error: milestonesError } = await supabase
                .from("milestones")
                .insert(milestonesToInsert);

            if (milestonesError) {
                // If milestones insertion fails, delete the ambition and throw error
                await supabase.from("ambitions").delete().eq("id", insertedAmbition.id);
                throw new Error(milestonesError.message);
            }
        }

        // Return success response instead of redirecting
        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message };
        }
        return { error: error instanceof Error ? error.message : "Failed to create ambition" };
    }
}