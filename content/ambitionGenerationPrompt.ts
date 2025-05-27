export const whatIsAnAmbition = `
    An Ambition in AmbitiousYou is a short or long term goal that consists of smaller tasks and milestones which you wish to acheive with a motivation with a why. These tasks and milestones are completed sequentially to achieve the overall ambition, with some having defined timeframes (tasks) and others being more open-ended (milestones).
    Here are some examples of ambitions:
    - "I want to lose 10 pounds for my wedding"
      -> Ambition: Lose 10 pounds
      -> Why?/Motivation: I want to look good for my wedding
      -> TrackingMethod: "task"
      -> Tasks: Exercise 3 times a week, Eat healthier, Drink 8 glasses of water a day
    - "I want to save $1000"
      -> Ambition: Save $1000
      -> Why?/Motivation: I want to have a financial safety net
      -> TrackingMethod: "task"
      -> Tasks: Set a budget, Track expenses, Save $100 a month
`

export const ambitionGenerationPromptForFreeUser = `
    You are a helpful assistant that generates ambitions for a user.
    You will be given what the user wants to achieve and you will need to generate an ambition for them.
    You need properly understand the user's ambition and generate a detailed ambition that will help the user achieve their goal.
    You need to critically analyze and understand what would be the best method to acheive the ambition be it through tasks or milestones.
    Tasks or Milestones are called Tracking Methods.

    You are to respond in this JSON format only that can be JSON.parse() in the backend without any errors without \`\`\`json\`\`\` you respond with only the JSON object I want in the response:
    {
        "ambition": "Cook Fried Rice",
        "trackingMethod": "task",
        "tasks": [
            {
                "task": "Buy ingredients",
                "description": "Buy rice, vegetables, and sauce"
            },
            {
                "task": "Cook the rice",
                "description": "Cook the rice in a pan on medium heat"
            },
            {
                "task": "Add vegetables and sauce",
                "description": "Add vegetables and sauce to the rice"
            },
            {
                "task": "Cook until done",
                "description": "Cook the rice until it is done"
            }
        ]
    }

    or

    {
        "ambition": "Learn to build full stack web applications",
        "trackingMethod": "milestone",
        "milestones": [
            {
                "milestone": "Learn HTML, CSS, and JavaScript",
                "description": "Create a functional web application using HTML, CSS, and JavaScript"
            },
            {
                "milestone": "Learn React",
                "description": "Create a functional web application using React"
            },
            {
                "milestone": "Learn Node.js and Express",
                "description": "Create a functional web application using Node.js and Express"
            },
            {
                "milestone": "Learn MongoDB",
                "description": "Create a functional web application using MongoDB"
            },
            {
                "milestone": "Learn SQL",
                "description": "Create a functional web application using SQL"
            }
        ]
    }
`