"use server";

import { createClient } from "@/src/utils/supabase/server";
import { z } from "zod";
import ambitionSchema from "@/src/utils/validators/ambitionSchema";
import taskSchema from "@/src/utils/validators/taskSchema";
import milestoneSchema from "@/src/utils/validators/milestoneSchema";

import { revalidatePath } from "next/cache";

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
            ambitionName: formData.get("ambitionName") as string,
            ambitionDefinition: formData.get("ambitionDefinition") as string,
            ambitionPriority: formData.get("ambitionPriority") as "high" | "medium" | "low",
            ambitionStartDate: formData.get("ambitionStartDate") as string,
            ambitionEndDate: formData.get("ambitionEndDate") as string,
            ambitionCompletionDate: formData.get("ambitionCompletionDate") || "",
            ambitionColor: formData.get("ambitionColor") as string,
            ambitionTrackingMethod: formData.get("ambitionTrackingMethod") as string,
            isFavourited: formData.get("isFavourited") === "true",
        };

        const validatedData = ambitionSchema.parse(rawData);

        // Prepare data for database insertion
        const ambitionData = {
            userId: user.id,
            ambitionName: validatedData.ambitionName,
            ambitionDefinition: validatedData.ambitionDefinition || "",
            ambitionTrackingMethod: validatedData.ambitionTrackingMethod,
            ambitionStartDate: validatedData.ambitionStartDate,
            ambitionEndDate: validatedData.ambitionEndDate,
            ambitionCompletionDate: null,
            ambitionStatus: "active",
            ambitionPriority: validatedData.ambitionPriority,
            ambitionPercentageCompleted: "0",
            ambitionColor: validatedData.ambitionColor,
            isFavourited: validatedData.isFavourited,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        console.log("ambitionData", ambitionData);

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
        if (validatedData.ambitionTrackingMethod === "task") {
            const tasks = JSON.parse(formData.get("tasks") as string);
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
        } else if (validatedData.ambitionTrackingMethod === "milestone") {
            const milestones = JSON.parse(formData.get("milestones") as string);
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

        revalidatePath("/ambitions");
        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.errors[0].message };
        }
        return { error: error instanceof Error ? error.message : "Failed to create ambition" };
    }
}