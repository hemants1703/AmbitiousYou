import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { RocketIcon } from "@radix-ui/react-icons";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function CTA() {
  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="bg-background/30 border border-primary/20 rounded-2xl p-10 shadow-xl backdrop-blur-sm">
          <div className="text-center mb-10">
            <h2
              className={`${bricolage.className} tracking-tight text-3xl md:text-5xl font-bold mb-6 text-foreground`}
            >
              Ready to Achieve Your Dreams?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join AmbitiousYou today and start your journey towards becoming a Superhuman.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg h-12 px-8 shadow-lg shadow-primary/20">
              <Link prefetch={true} href="/signup" className="flex items-center gap-2">
                Get Started <RocketIcon className="h-5 w-5" />
              </Link>
            </Button>
            {/* <Button variant="outline" size="lg" className="text-lg h-12 px-8 hover:bg-primary/5">
              <Link prefetch={true} href="/pricing" className="flex items-center gap-2">
                View Pricing <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </Button> */}
          </div>

          {/* Final social proof */}
          {/* <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Join thousands of users already achieving their dreams
            </p>
            <div className="flex justify-center">
              <div className="flex -space-x-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-medium"
                  >
                    {["JS", "KL", "AR", "TM", "BN"][i]}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-medium">
                  +3K
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
