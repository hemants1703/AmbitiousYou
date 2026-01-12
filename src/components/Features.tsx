import { BarChartIcon, Component1Icon } from "@radix-ui/react-icons";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { TimerIcon } from "@radix-ui/react-icons";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { StarIcon } from "@radix-ui/react-icons";
import { RocketIcon } from "@radix-ui/react-icons";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import {
  IconChartDonut4,
  IconGraph,
  IconLock,
  IconNotification,
  IconRocket,
  IconSparkles,
  IconStar,
  IconStarFilled,
  IconTimeDuration30,
  IconTopologyStar3,
} from "@tabler/icons-react";
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
          <h2 className={`${bricolage.className} tracking-tight text-3xl md:text-5xl font-bold mb-6`}>
            Transform How You Achieve Your Goals
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AmbitiousYou provides the tools you need to set, track, and accomplish your most ambitious goals.
          </p>
        </div>

        <div className="select-none perspective-normal transform-3d grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature cards with hover animations and consistent styling */}
          {[
            {
              icon: <IconTopologyStar3 className="size-6 text-blue-500" />,
              title: "Goal Hierarchy",
              description: "Organize your ambitions from big dreams to daily tasks in a structured, manageable system.",
            },
            {
              icon: <IconStarFilled className="size-6 text-yellow-500" />,
              title: "Priority Management",
              description:
                "Focus on what matters most with our intuitive priority system that adapts to your changing needs.",
            },
            {
              icon: <IconChartDonut4 className="size-6 text-primary" />,
              title: "Progress Tracking",
              description: "Visualize your journey with beautiful charts and analytics that keep you motivated.",
            },
            {
              icon: <IconLock className="size-6 text-green-500" />,
              title: "Private & Secure",
              description:
                "Your ambitions are personal. We keep them private and secure and never share them with anyone.",
            },
            {
              icon: <IconNotification className="size-6 text-blue-500" />,
              title: "Smart Notifications",
              description: "Get personalized reminders at the right time to keep you on track with your goals. Coming soon!",
            },
            {
              icon: <IconSparkles className="size-6 text-cyan-500" />,
              title: "AI Assistance",
              description:
                "Receive intelligent suggestions to overcome obstacles and optimize your approach. Coming soon!",
            },
          ].map((feature, i) => (
            <FeatureCard key={i} icon={feature.icon} title={feature.title} description={feature.description} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group bg-card/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-border hover:border-primary/50 hover:shadow-lg transition-all ease-in-out">
      <div className="h-fit w-fit rounded-full bg-primary/10 flex items-center justify-center mb-5 py-3 px-4 gap-2 group-hover:scale-[1.02] transition-transform duration-300">
        <span>{icon}</span>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
