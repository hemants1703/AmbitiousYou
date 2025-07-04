type Greeting = {
    prefix: string;
    suffix: string;
    energy: "high" | "medium" | "calm";
};

const greetings: Greeting[] = [
    {
        prefix: "Rise and shine",
        suffix: "Today's the day to make magic happen! ✨",
        energy: "high"
    },
    {
        prefix: "Champion",
        suffix: "Ready to conquer your goals? Let's do this! 🚀",
        energy: "high"
    },
    {
        prefix: "Superstar",
        suffix: "Your potential is absolutely limitless! 🌟",
        energy: "high"
    },
    {
        prefix: "Game Changer",
        suffix: "Time to turn your dreams into reality! 💫",
        energy: "high"
    },
    {
        prefix: "Trailblazer",
        suffix: "Let's set the world on fire with your brilliance! 🔥",
        energy: "high"
    },
    {
        prefix: "Welcome back",
        suffix: "Your journey to greatness continues! Ready to level up? ⭐",
        energy: "medium"
    },
    {
        prefix: "Hello there",
        suffix: "Today's opportunities are waiting for you to seize them! 🌈",
        energy: "medium"
    },
    {
        prefix: "Hey achiever",
        suffix: "Let's make today count towards your success story! 📈",
        energy: "medium"
    },
    {
        prefix: "Welcome",
        suffix: "Your future self is cheering for your efforts today! 🎯",
        energy: "medium"
    },
    {
        prefix: "Hello",
        suffix: "Every step forward is a victory worth celebrating! 🏆",
        energy: "medium"
    },
    {
        prefix: "Greetings",
        suffix: "Your dedication is creating something extraordinary! 🌱",
        energy: "calm"
    },
    {
        prefix: "Welcome back",
        suffix: "Each day is a new opportunity to shine brighter! ✨",
        energy: "calm"
    },
    {
        prefix: "Hello",
        suffix: "Your journey is unique and inspiring! 🌟",
        energy: "calm"
    },
    {
        prefix: "Welcome",
        suffix: "Today's small steps lead to tomorrow's giant leaps! 🎯",
        energy: "calm"
    },
    {
        prefix: "Hey there",
        suffix: "Your potential is like a diamond - ready to shine! 💎",
        energy: "calm"
    }
];

export function getRandomGreeting(): Greeting {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
}

// Get a greeting based on energy level
export function getGreetingByEnergy(energy: "high" | "medium" | "calm"): Greeting {
    const filteredGreetings = greetings.filter(greeting => greeting.energy === energy);
    const randomIndex = Math.floor(Math.random() * filteredGreetings.length);
    return filteredGreetings[randomIndex];
} 