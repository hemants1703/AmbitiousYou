import { AmbitionData, AmbitionMilestone, AmbitionTask } from "@/src/types";

export interface ExampleAmbitionType {
    category: string;
    examples: {
        ambition: AmbitionData,
        tasks?: AmbitionTask[],
        milestones?: AmbitionMilestone[]
    }[];
}

// Helper to represent current time as ISO string for consistency
const nowAsISO = new Date();

// Helper to convert a specific date string to ISO string (midnight UTC)
const specificDateToISO = (dateString: string) => new Date(dateString);

const exampleAmbitions: ExampleAmbitionType[] = [
    // Personal Development
    {
        category: "Personal Growth",
        examples: [
            {
                ambition: {
                    id: "1",
                    userId: "1",
                    ambitionName: "Learn to play the piano and perform at a local venue",
                    ambitionDefinition: "Learn to play the piano and perform at a local venue",
                    ambitionTrackingMethod: "milestone",
                    ambitionSuccessMetric: "",
                    ambitionStartDate: null,
                    ambitionEndDate: null,
                    ambitionCompletionDate: null,
                    ambitionDeadline: "2024-12-31",
                    ambitionStatus: "active",
                    ambitionPriority: "high",
                    ambitionPercentageCompleted: 0,
                    ambitionColor: "#FF5733",
                    createdAt: nowAsISO, // Updated from new Date()
                    updatedAt: nowAsISO, // Updated from new Date()
                    isFavourited: false,
                },
                milestones: [{
                    id: "1",
                    userId: "1",
                    ambitionId: "1",
                    milestone: "Learn the basics of piano",
                    milestoneDescription: "Complete a beginner's piano course",
                    milestoneCompleted: false,
                    createdAt: nowAsISO, // Updated from new Date()
                    updatedAt: nowAsISO, // Updated from new Date()
                    milestoneTargetDate: specificDateToISO("2024-06-30"), // Updated from new Date("2024-06-30")
                }],
            },
            {
                ambition: {
                    id: "2",
                    userId: "1",
                    ambitionName: "Master conversational Spanish in 6 months",
                    ambitionDefinition: "Master conversational Spanish in 6 months",
                    ambitionTrackingMethod: "milestone",
                    ambitionSuccessMetric: "",
                    ambitionStartDate: null,
                    ambitionEndDate: null,
                    ambitionCompletionDate: null,
                    ambitionDeadline: "2026-05-15",
                    ambitionStatus: "active",
                    ambitionPriority: "medium",
                    ambitionPercentageCompleted: 0,
                    ambitionColor: "#3498DB",
                    createdAt: nowAsISO, // Updated from new Date()
                    updatedAt: nowAsISO, // Updated from new Date()
                    isFavourited: false,
                },
                milestones: [],
            },
            {
                ambition: {
                    id: "3",
                    userId: "1",
                    ambitionName: "Complete a 30-day meditation challenge",
                    ambitionDefinition: "Complete a 30-day meditation challenge",
                    ambitionTrackingMethod: "milestone",
                    ambitionSuccessMetric: "",
                    ambitionStartDate: null,
                    ambitionEndDate: null,
                    ambitionCompletionDate: null,
                    ambitionDeadline: "2026-05-15",
                    ambitionStatus: "active",
                    ambitionPriority: "medium",
                    ambitionPercentageCompleted: 0,
                    ambitionColor: "#2ECC71",
                    createdAt: nowAsISO, // Updated from new Date()
                    updatedAt: nowAsISO, // Updated from new Date()
                    isFavourited: false,
                },
                milestones: [],
            },
        ],
    },
    // Career & Business
    {
        category: "Career & Business",
        examples: [
            {
                ambition: {
                    id: "4",
                    userId: "1",
                    ambitionName: "Launch my first tech startup within 12 months",
                    ambitionDefinition: "Launch my first tech startup within 12 months",
                    ambitionTrackingMethod: "milestone",
                    ambitionSuccessMetric: "",
                    ambitionStartDate: null,
                    ambitionEndDate: null,
                    ambitionCompletionDate: null,
                    ambitionDeadline: "2026-05-15",
                    ambitionStatus: "active",
                    ambitionPriority: "high",
                    ambitionPercentageCompleted: 0,
                    ambitionColor: "#F1C40F",
                    createdAt: nowAsISO, // Updated from new Date()
                    updatedAt: nowAsISO, // Updated from new Date()
                    isFavourited: false,
                },
                milestones: [],
            },
            {
                ambition: {
                    id: "5",
                    userId: "1",
                    ambitionName: "Complete my MBA while working full-time",
                    ambitionDefinition: "Complete my MBA while working full-time",
                    ambitionTrackingMethod: "milestone",
                    ambitionSuccessMetric: "",
                    ambitionStartDate: null,
                    ambitionEndDate: null,
                    ambitionCompletionDate: null,
                    ambitionDeadline: "2026-05-15",
                    ambitionStatus: "active",
                    ambitionPriority: "medium",
                    ambitionPercentageCompleted: 0,
                    ambitionColor: "#9B59B6",
                    createdAt: nowAsISO, // Updated from new Date()
                    updatedAt: nowAsISO, // Updated from new Date()
                    isFavourited: false,
                },
                milestones: [],
            },
            {
                ambition: {
                    id: "6",
                    userId: "1",
                    ambitionName: "Build a portfolio of 10 successful client projects",
                    ambitionDefinition: "Build a portfolio of 10 successful client projects",
                    ambitionTrackingMethod: "milestone",
                    ambitionSuccessMetric: "",
                    ambitionStartDate: null,
                    ambitionEndDate: null,
                    ambitionCompletionDate: null,
                    ambitionDeadline: "2026-05-15",
                    ambitionStatus: "active",
                    ambitionPriority: "medium",
                    ambitionPercentageCompleted: 0,
                    ambitionColor: "#E74C3C",
                    createdAt: nowAsISO, // Updated from new Date()
                    updatedAt: nowAsISO, // Updated from new Date()
                    isFavourited: false,
                },
                milestones: [],
            },
        ],
    },
    // Health & Fitness
    {
        category: "Health & Fitness",
        examples: [
            {
                ambition: {
                    id: "7",
                    userId: "1",
                    ambitionName: "Run a marathon in under 4 hours",
                    ambitionDefinition: "Run a marathon in under 4 hours",
                    ambitionTrackingMethod: "milestone",
                    ambitionSuccessMetric: "",
                    ambitionStartDate: null,
                    ambitionEndDate: null,
                    ambitionCompletionDate: null,
                    ambitionDeadline: "2026-05-15",
                    ambitionStatus: "active",
                    ambitionPriority: "high",
                    ambitionPercentageCompleted: 0,
                    ambitionColor: "#1ABC9C",
                    createdAt: nowAsISO, // Updated from new Date()
                    updatedAt: nowAsISO, // Updated from new Date()
                    isFavourited: false,
                },
                milestones: [],
            },
            {
                ambition: {
                    id: "8",
                    userId: "1",
                    ambitionName: "Achieve a consistent 5am morning routine",
                    ambitionDefinition: "Achieve a consistent 5am morning routine",
                    ambitionTrackingMethod: "milestone",
                    ambitionSuccessMetric: "",
                    ambitionStartDate: null,
                    ambitionEndDate: null,
                    ambitionCompletionDate: null,
                    ambitionDeadline: "2026-05-15",
                    ambitionStatus: "active",
                    ambitionPriority: "medium",
                    ambitionPercentageCompleted: 0,
                    ambitionColor: "#E67E22",
                    createdAt: nowAsISO, // Updated from new Date()
                    updatedAt: nowAsISO, // Updated from new Date()
                    isFavourited: false,
                },
                milestones: [],
            },
            {
                ambition: {
                    id: "9",
                    userId: "1",
                    ambitionName: "Complete a 100-day fitness transformation",
                    ambitionDefinition: "Complete a 100-day fitness transformation",
                    ambitionTrackingMethod: "milestone",
                    ambitionSuccessMetric: "",
                    ambitionStartDate: null,
                    ambitionEndDate: null,
                    ambitionCompletionDate: null,
                    ambitionDeadline: "2026-05-15",
                    ambitionStatus: "active",
                    ambitionPriority: "medium",
                    ambitionPercentageCompleted: 0,
                    ambitionColor: "#FF5733", // Repeating color from palette
                    createdAt: nowAsISO, // Updated from new Date()
                    updatedAt: nowAsISO, // Updated from new Date()
                    isFavourited: false,
                },
                milestones: [],
            },
        ],
    },
];

export default exampleAmbitions;