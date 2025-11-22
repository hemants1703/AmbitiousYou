import { MotionWrapper } from "@/components/MotionWrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconCirclePlus } from "@tabler/icons-react";
import clsx from "clsx";
import { Bricolage_Grotesque } from "next/font/google";
import { User } from "@/db/schema";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

interface WelcomeBannerProps {
  greeting: string;
  name: string;
}

export default function WelcomeBanner(props: WelcomeBannerProps) {
  return (
    <MotionWrapper
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border bg-card/90 p-8 shadow-sm relative overflow-hidden mb-2"
    >
      <div className="z-10 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1
            className={clsx(
              "text-4xl md:text-5xl font-extrabold tracking-tight mb-2",
              bricolage.className
            )}
          >
            {props.greeting} <span className="text-primary">{props.name.split(" ")[0]}</span>,
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            Here&apos;s your progress at a glance.
          </p>
        </div>
        <Button
          asChild
          variant="ay"
          size="lg"
          className="text-lg h-12 px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
        >
          <Link prefetch={true} href="/ambitions/new?ref=dashboard">
            <IconCirclePlus className="h-5 w-5" />
            New Ambition
          </Link>
        </Button>
      </div>
    </MotionWrapper>
  );
}
