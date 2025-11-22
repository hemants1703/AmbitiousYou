import { Button } from "@/components/ui/button";
import { motivationalQuotes } from "@/lib/motivationalQuotes";
import { IconCheck, IconCirclePlus, IconSettings2, IconTarget } from "@tabler/icons-react";
import Link from "next/link";

export default function NoAmbitionsFound() {
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div className="text-center py-10 px-4 md:px-8 lg:px-12 min-h-[70vh] flex flex-col justify-center">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left side - Main content */}
        <div className="space-y-6">
          <div>
            <IconTarget className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 opacity-20" />
            <h3 className="text-2xl md:text-3xl font-semibold mb-3">Start Your Journey</h3>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              You haven&apos;t created any ambitions yet. Ambitions help you track and achieve your
              most important goals.
            </p>
          </div>

          <Button asChild size="lg" className="mt-6">
            <Link prefetch={true} href="/ambitions/new" className="flex items-center gap-2">
              <IconCirclePlus className="h-5 w-5" />
              Create Your First Ambition
            </Link>
          </Button>

          <div className="inline-flex flex-col gap-1 items-center bg-primary/10 text-primary px-8 py-4 rounded-xl text-base">
            <p className="font-serif italic text-lg">{randomQuote.quote}</p>
            <div className="flex items-center gap-1 text-sm text-primary/80">
              <span className="font-medium">- {randomQuote.author}</span>
            </div>
          </div>
        </div>

        {/* Right side - Tips card */}
        <div className="bg-muted/50 rounded-xl p-6 md:p-8 shadow-sm">
          <div className="text-left space-y-6">
            <h4 className="text-xl font-medium flex items-center gap-2">
              <IconSettings2 className="h-5 w-5" />
              Quick Tips for Success
            </h4>

            <ul className="space-y-4 text-muted-foreground">
              <li className="flex gap-3 items-start">
                <IconCheck className="h-5 w-5 mt-1 text-green-500 shrink-0" />
                <span className="text-base">
                  Break down big goals into smaller, manageable milestones to maintain clarity and
                  focus
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <IconCheck className="h-5 w-5 mt-1 text-green-500 shrink-0" />
                <span className="text-base">
                  Set realistic deadlines with buffer time to maintain steady momentum
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <IconCheck className="h-5 w-5 mt-1 text-green-500 shrink-0" />
                <span className="text-base">
                  Track your progress regularly and celebrate small wins along the way
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <IconCheck className="h-5 w-5 mt-1 text-green-500 shrink-0" />
                <span className="text-base">
                  Review and adjust your strategies based on what works best for you
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
