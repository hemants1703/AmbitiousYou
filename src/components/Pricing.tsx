import { Button } from "@/components/ui/button";
import { ArrowRightIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { IconCheck } from "@tabler/icons-react";
import { Bricolage_Grotesque } from "next/font/google";
import Link from "next/link";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function Pricing() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-1 mb-6 rounded-full bg-primary/10 backdrop-blur-sm text-primary font-medium text-sm">
            <IconCheck className="mr-2 h-4 w-4 text-green-500" />
            Simple Pricing
          </div>
          <h2 className={`${bricolage.className} tracking-tight text-3xl md:text-5xl font-bold mb-6`}>
            Choose Your Ambition Level
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start for free or unlock premium features to accelerate your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free tier */}
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-8 border border-border shadow-md h-full flex flex-col">
            <h3 className="text-xl font-bold mb-2">Explorer</h3>
            <p className="text-muted-foreground mb-6">Perfect for getting started</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <Button variant="outline" className="mb-8">
              <Link prefetch={true} href="/signup" className="flex justify-center items-center gap-2 w-full">
                Start Free <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </Button>

            <div className="space-y-3 mt-auto">
              {["3 Active Goals", "Basic Task Management", "Core Analytics", "7-Day History"].map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <CheckCircledIcon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro tier (highlighted) */}
          <div className="bg-card/90 backdrop-blur-sm rounded-xl p-8 border-2 border-primary shadow-lg relative flex flex-col">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-sm py-1 px-4 rounded-full font-medium">
              Most Popular
            </div>
            <h3 className="text-xl font-bold mb-2">Achiever</h3>
            <p className="text-muted-foreground mb-6">For serious goal-setters</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$9.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <Button className="mb-8 shadow-md shadow-primary/20">
              <Link prefetch={true} href="/pricing" className="flex justify-center items-center gap-2 w-full">
                Get Started <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </Button>

            <div className="space-y-3 mt-auto">
              {[
                "Unlimited Goals",
                "Advanced Task Management",
                "Detailed Analytics",
                "Unlimited History",
                "Priority Support",
                "Custom Categories",
              ].map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <CheckCircledIcon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Enterprise tier */}
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-8 border border-border shadow-md h-full flex flex-col">
            <h3 className="text-xl font-bold mb-2">Superhuman</h3>
            <p className="text-muted-foreground mb-6">For teams and businesses</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$29.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <Button variant="outline" className="mb-8">
              <Link prefetch={true} href="/pricing" className="flex justify-center items-center gap-2 w-full">
                Contact Sales <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </Button>

            <div className="space-y-3 mt-auto">
              {[
                "Everything in Achiever",
                "Team Collaboration",
                "AI Recommendations",
                "Custom Integrations",
                "Dedicated Support",
                "Advanced Security",
              ].map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <CheckCircledIcon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
