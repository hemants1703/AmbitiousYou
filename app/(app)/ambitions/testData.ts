export const testAmbitions = [
    {
        id: "1",
        ambitionName: "Learn Spanish",
        ambitionDefinition: "Become conversational in Spanish within 6 months",
        ambitionCategory: "Learning",
        ambitionPercentageCompleted: 65,
        ambitionPriority: "high",
        ambitionStartDate: "2024-01-01",
        ambitionDeadline: "2024-12-15",
        ambitionStatus: "on_track",
        ambitionColor: "bg-blue-500",
        ambitionTrackingMethod: "task",
        tasks: [
            {
                id: "1",
                task: "Complete Duolingo Spanish course",
                taskDescription: "Finish all levels of the Spanish course",
                taskDeadline: "2024-06-15",
                taskCompleted: true
            },
            {
                id: "2",
                task: "Practice speaking with native speakers",
                taskDescription: "Find language exchange partners",
                taskDeadline: "2024-08-15",
                taskCompleted: false
            }
        ],
        milestones: [],
        timeEntries: [
            {
                id: "1",
                date: "2024-03-15",
                duration: "2",
                activity: "Duolingo practice"
            },
            {
                id: "2",
                date: "2024-03-14",
                duration: "1.5",
                activity: "Vocabulary study"
            }
        ]
    },
    {
        id: "2",
        ambitionName: "Marathon Training",
        ambitionDefinition: "Complete a full marathon in under 4 hours",
        ambitionCategory: "Fitness",
        ambitionPercentageCompleted: 40,
        ambitionPriority: "medium",
        ambitionStartDate: "2024-01-01",
        ambitionDeadline: "2024-10-10",
        ambitionStatus: "at_risk",
        ambitionColor: "bg-green-500",
        ambitionTrackingMethod: "milestone",
        tasks: [],
        milestones: [
            {
                id: "1",
                milestone: "Complete first 10K race",
                description: "Run a 10K race under 50 minutes",
                completed: true,
                targetDate: "2024-04-15"
            },
            {
                id: "2",
                milestone: "Complete half marathon",
                description: "Run a half marathon under 1:45",
                completed: false,
                targetDate: "2024-07-15"
            }
        ],
        timeEntries: [
            {
                id: "1",
                date: "2024-03-15",
                duration: "1.5",
                activity: "Long run"
            },
            {
                id: "2",
                date: "2024-03-14",
                duration: "1",
                activity: "Speed training"
            }
        ]
    },
    {
        id: "3",
        ambitionName: "Work Promotion",
        ambitionDefinition: "Get promoted to senior position by year end",
        ambitionCategory: "Career",
        ambitionPercentageCompleted: 25,
        ambitionPriority: "high",
        ambitionStartDate: "2024-01-01",
        ambitionDeadline: "2024-12-31",
        ambitionStatus: "on_track",
        ambitionColor: "bg-purple-500",
        ambitionTrackingMethod: "task",
        tasks: [
            {
                id: "1",
                task: "Complete leadership training",
                taskDescription: "Finish the company's leadership program",
                taskDeadline: "2024-06-30",
                taskCompleted: true
            },
            {
                id: "2",
                task: "Lead a major project",
                taskDescription: "Successfully deliver the Q2 initiative",
                taskDeadline: "2024-09-30",
                taskCompleted: false
            }
        ],
        milestones: [],
        timeEntries: [
            {
                id: "1",
                date: "2024-03-15",
                duration: "3",
                activity: "Project planning"
            },
            {
                id: "2",
                date: "2024-03-14",
                duration: "2",
                activity: "Team meetings"
            }
        ]
    }
]; 