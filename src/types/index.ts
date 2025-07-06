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

export interface AmbitionTask {
    id: string;
    userId: string;
    ambitionId: string;
    task: string;
    taskDescription?: string;
    taskCompleted: boolean;
    taskDeadline: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface AmbitionMilestone {
    id: string;
    userId: string;
    ambitionId: string;
    milestone: string;
    milestoneDescription?: string;
    milestoneCompleted: boolean;
    milestoneTargetDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface Ambition {
    id: string;
    userId: string;
    ambitionName: string;
    ambitionDefinition?: string;
    ambitionTrackingMethod: "task" | "milestone";
    ambitionStartDate: string;
    ambitionEndDate: string;
    ambitionCompletionDate: string;
    ambitionStatus: "active" | "completed" | "archived";
    ambitionPriority: "low" | "medium" | "high";
    ambitionPercentageCompleted: number;
    ambitionColor: string;
    isFavourited: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Profile {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
};

export interface Plan {
    id: string;
    userId: string;
    planName: string;
    planMonthlyPrice: number;
    createdAt: string;
    updatedAt: string;
}