import { Button } from "@/components/ui/button";
import { Bricolage_Grotesque } from "next/font/google";
import Link from "next/link";
import { Rocket } from "lucide-react";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function CTA() {
  return (
    <section className="py-24 overflow-hidden">
      <div className="mx-auto px-6 relative z-10">
        <div className="bg-background/30 border border-primary/20 rounded-2xl p-10 shadow-xl backdrop-blur-sm">
          <div className="text-center mb-10">
            <h2 className={`${bricolage.className} tracking-tight text-3xl md:text-5xl font-bold mb-6 text-foreground`}>Ready to Achieve Your Dreams?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Join AmbitiousYou today and start your journey towards becoming a Superhuman.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg h-12 px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
              <Link prefetch={true} href="/signup" className="flex items-center gap-2">
                Get Started <Rocket className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
