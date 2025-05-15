/**
 * Represents the structure of an ambition entry in the AmbitiousYou application.
 * 
 * @interface AmbitionData
 * @property {string} title - The name or title of the ambition
 * @property {string} description - Detailed description of the ambition
 * @property {string} category - Classification or grouping of the ambition
 * @property {string} priorityLevel - Importance level of the ambition
 * @property {string} deadline - Target completion deadline for the ambition
 * @property {string} color - Color code for visual representation of the ambition
 * @property {boolean} focusedAmbitionOnDashboard - Whether this ambition is featured on dashboard or not
 * @property {string} trackingMethod - Method used to track progress of the ambition
 * @property {string} successMetric - Measurement criteria for success of the ambition
 * @property {boolean} isCompleted - Completion status of the ambition (true if completed)
 * @property {string} tasks - Associated tasks for achieving the ambition
 * @property {string} milestones - Key progress points or achievements for the ambition
 * @property {string} notes - Additional information or remarks about the ambition
 * @property {string} tags - Labels for categorizing or filtering the ambition
 */
export interface AmbitionData {
    id: string;
    userId: string;
    ambitionName: string;
    ambitionDefinition: string | null;
    ambitionTrackingMethod: "task" | "milestone";
    ambitionSuccessMetric: string;
    ambitionStartDate: string | null;
    ambitionEndDate: string | null;
    ambitionCompletionDate: string | null;
    ambitionDeadline: string;
    ambitionStatus: "active" | "completed" | "archived";
    ambitionPriority: "low" | "medium" | "high";
    ambitionCategory: string;
    ambitionPercentageCompleted: number;
    ambitionColor: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface SupabaseProfileData {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    created_at: string;
    updated_at: string;
};

export interface SupabasePlansData {
    id: string;
    userId: string;
    planName: string;
    planMonthlyPrice: number;
    createdAt: string;
    updatedAt: string;
}

export interface AmbitionsData {
    id: string;
    userId: string;
    ambitionName: string;
    ambitionDefinition: string | null | "";
    ambitionType: string;
    ambitionStartDate: string | null | "";
    ambitionEndDate: string | null | "";
    ambitionCompletionDate: string | null | "";
    ambitionStatus: string;
    ambitionPriority: string;
    ambitionCategory: string;
    ambitionPercentageCompleted: number;
    ambitionTasks: string[] | null | "";
    ambitionNotes: string[] | null | "";
    ambitionTags: string[] | null | "";
    createdAt: string;
    updatedAt: string;
    isFavourited: boolean;
};

export interface AmbitionTask {
    id: string;
    userId: string;
    ambitionId: string;
    task: string;
    taskDescription: string | null;
    taskCompleted: boolean;
    taskDeadline: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AmbitionMilestone {
    id: string;
    userId: string;
    ambitionId: string;
    milestone: string;
    milestoneDescription: string | null;
    milestoneCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    milestoneTargetDate: Date;
}

export interface TimeEntry {
    id: string;
    date: string;
    duration: string;
    activity: string;
}

// export interface Ambition {
//     id: string;
//     ambitionName: string;
//     ambitionDefinition: string;
//     ambitionCategory: string;
//     ambitionPercentageCompleted: number;
//     ambitionPriority: string;
//     ambitionStartDate: string;
//     ambitionDeadline: string;
//     ambitionStatus: string;
//     ambitionColor: string;
//     ambitionTrackingMethod: string;
//     tasks: AmbitionTask[];
//     milestones: AmbitionMilestone[];
//     timeEntries: TimeEntry[];
// }