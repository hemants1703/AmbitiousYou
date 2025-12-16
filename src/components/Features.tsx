import { BarChartIcon, Component1Icon } from "@radix-ui/react-icons";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { TimerIcon } from "@radix-ui/react-icons";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { StarIcon } from "@radix-ui/react-icons";
import { RocketIcon } from "@radix-ui/react-icons";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function Features() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-1 mb-6 rounded-full bg-primary/10 backdrop-blur-sm text-primary font-medium text-sm">
            <BarChartIcon className="mr-2 h-4 w-4" />
            Features
          </div>
          <h2
            className={`${bricolage.className} tracking-tight text-3xl md:text-5xl font-bold mb-6`}
          >
            Transform How You Achieve Your Goals
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AmbitiousYou provides the tools you need to set, track, and accomplish your most
            ambitious goals.
          </p>
        </div>

        <div className="perspective-normal transform-3d grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature cards with hover animations and consistent styling */}
          {[
            {
              icon: <Component1Icon className="h-6 w-6 text-primary" />,
              title: "Goal Hierarchy",
              description:
                "Organize your ambitions from big dreams to daily tasks in a structured, manageable system.",
            },
            {
              icon: <MixerHorizontalIcon className="h-6 w-6 text-primary" />,
              title: "Priority Management",
              description:
                "Focus on what matters most with our intuitive priority system that adapts to your changing needs.",
            },
            {
              icon: <TimerIcon className="h-6 w-6 text-primary" />,
              title: "Progress Tracking",
              description:
                "Visualize your journey with beautiful charts and analytics that keep you motivated.",
            },
            {
              icon: <LockClosedIcon className="h-6 w-6 text-primary" />,
              title: "Private & Secure",
              description:
                "Your ambitions are personal. We use enterprise-grade encryption to keep your data safe.",
            },
            {
              icon: <StarIcon className="h-6 w-6 text-primary" />,
              title: "Smart Notifications",
              description:
                "Get personalized reminders at the right time to keep you on track with your goals.",
            },
            {
              icon: <RocketIcon className="h-6 w-6 text-primary" />,
              title: "AI Assistance",
              description:
                "Receive intelligent suggestions to overcome obstacles and optimize your approach. Coming soon!",
            },
          ].map((feature, i) => (
            <FeatureCard
              key={i}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group bg-card/80 backdrop-blur-sm rounded-xl p-7 shadow-md border border-border hover:border-primary/50 hover:shadow-xl hover:scale-105 hover:rotate-1 transition-all ease-in-out">
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
