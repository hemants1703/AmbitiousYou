import { Button } from "@/components/ui/button";
import { Bricolage_Grotesque } from "next/font/google";
import Link from "next/link";
import { ArrowRightIcon, RocketIcon } from "lucide-react";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function CTA() {
  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="bg-card/80 border border-primary/20 rounded-2xl p-10 shadow-xl backdrop-blur-sm">
          <div className="text-center mb-10">
            <h2 className={`${bricolage.className} tracking-tight text-3xl md:text-5xl font-bold mb-6 text-foreground`}>Your next twelve months can look completely different</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Set one goal, break it into today’s actions, and let the momentum build. Getting started takes about a minute.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg h-12 px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
              <Link prefetch={true} href="/signup" className="flex items-center gap-2">
                Set your first goal <RocketIcon className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg h-12 px-8">
              <Link prefetch={true} href="/experience" className="flex items-center gap-2">
                Experience For Free <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-center mt-6">Always free to start · 60 seconds to set up · Private by default</p>
        </div>
      </div>
    </section>
  );
}
