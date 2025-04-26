"use server";

export async function createNewAmbition(formData: FormData) {
    const rawFormData = {
        title: formData.get("title"),
        description: formData.get("description"),
        category: formData.get("category"),
        priorityLevel: formData.get("priorityLevel"),
        deadline: formData.get("deadline"),
        color: formData.get("color"),
        focusedAmbitionOnDashboard: formData.get("focusedAmbitionOnDashboard"),
        trackingMethod: formData.get("trackingMethod"),
        isCompleted: formData.get("isCompleted"),
        tasks: formData.get("tasks"),
        milestones: formData.get("milestones"),
        notes: formData.get("notes"),
        tags: formData.get("tags"),
    }
}