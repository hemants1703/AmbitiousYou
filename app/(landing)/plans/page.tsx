import { Playfair_Display } from "next/font/google";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  RocketIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  LightningBoltIcon,
  StarIcon,
  CheckIcon,
  BarChartIcon,
  HeartIcon,
  LockClosedIcon,
  PersonIcon,
  ArrowRightIcon,
  QuestionMarkCircledIcon,
  ChevronDownIcon,
  StarFilledIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function Plans() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative flex flex-col justify-center items-center w-full pt-7 pb-24 px-4">
        {/* Special offer badge */}
        <div className="z-10 mb-10 bg-primary/5 backdrop-blur-sm border border-primary/10 rounded-full px-5 py-2 flex items-center gap-2 animate-fade-in">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-sm font-medium">Limited time offer: Get 20% off annual plans</span>
        </div>
        
        <div className="text-center max-w-4xl mx-auto relative z-10">
          <h1 className={`${playfair.className} text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/70 leading-tight`}>
            Choose the Perfect Plan for Your Ambitions
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
            Unlock your full potential with the right tools and features that match your goals
          </p>
        </div>
      </section>

      {/* Pricing Toggle Section */}
      <section className="py-8 flex justify-center">
        <div className="bg-card/80 backdrop-blur-sm rounded-full border border-border p-1.5 flex items-center gap-4">
          <button className="px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium">
            Monthly
          </button>
          <button className="px-6 py-2 rounded-full text-muted-foreground hover:text-foreground transition-colors">
            Annually <span className="text-green-500 text-xs">Save 20%</span>
          </button>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free tier */}
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-8 border border-border shadow-md h-full flex flex-col">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Explorer</h3>
                <p className="text-muted-foreground">For individuals getting started</p>
              </div>
              
              <div className="mb-8">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
                <p className="text-sm text-muted-foreground mt-2">Free forever</p>
              </div>
              
              <Button variant="outline" size="lg" className="mb-8">
                <Link href="/signup" className="flex justify-center items-center gap-2 w-full">
                  Get Started <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Button>
              
              <div className="space-y-4 mt-auto">
                <p className="font-medium">Includes:</p>
                {[
                  '3 Active Goals',
                  'Basic Task Management',
                  'Core Analytics',
                  '7-Day History',
                  'Community Support'
                ].map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <CheckCircledIcon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
                
                <div className="pt-4">
                  {[
                    'Advanced Goal Hierarchy',
                    'Unlimited History',
                    'Premium Templates'
                  ].map((feature) => (
                    <div key={feature} className="flex items-start gap-3 mb-4">
                      <CrossCircledIcon className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Pro tier (highlighted) */}
            <div className="bg-card/90 backdrop-blur-sm rounded-xl p-8 border-2 border-primary shadow-lg relative flex flex-col -translate-y-4">
              <div className="absolute -top-4 inset-x-0 flex justify-center">
                <div className="bg-primary text-primary-foreground text-sm py-1 px-4 rounded-full font-medium">
                  Most Popular
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Achiever</h3>
                <p className="text-muted-foreground">For serious goal-setters</p>
              </div>
              
              <div className="mb-8">
                <span className="text-5xl font-bold">$9.99</span>
                <span className="text-muted-foreground">/month</span>
                <p className="text-sm text-muted-foreground mt-2">Billed monthly or $95.90/year</p>
              </div>
              
              <Button size="lg" className="mb-8 shadow-md shadow-primary/20">
                <Link href="/signup?plan=achiever" className="flex justify-center items-center gap-2 w-full">
                  Choose Achiever <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Button>
              
              <div className="space-y-4 mt-auto">
                <p className="font-medium">Everything in Explorer, plus:</p>
                {[
                  'Unlimited Goals',
                  'Advanced Goal Hierarchy',
                  'Advanced Task Management',
                  'Detailed Analytics',
                  'Unlimited History',
                  'Priority Support',
                  'Custom Categories',
                  'Premium Templates',
                  'Daily Progress Reports',
                  'Calendar Integration'
                ].map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <CheckCircledIcon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-primary/5 rounded-lg p-4 border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <StarIcon className="h-4 w-4 text-primary" />
                  <span className="font-medium">Popular features</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Unlimited goals, advanced analytics, and premium templates
                </p>
              </div>
            </div>
            
            {/* Enterprise tier */}
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-8 border border-border shadow-md h-full flex flex-col">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Superhuman</h3>
                <p className="text-muted-foreground">For teams and businesses</p>
              </div>
              
              <div className="mb-8">
                <span className="text-5xl font-bold">$29.99</span>
                <span className="text-muted-foreground">/month</span>
                <p className="text-sm text-muted-foreground mt-2">Billed monthly or $287.90/year</p>
              </div>
              
              <Button variant="outline" size="lg" className="mb-8">
                <Link href="/signup?plan=superhuman" className="flex justify-center items-center gap-2 w-full">
                  Choose Superhuman <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Button>
              
              <div className="space-y-4 mt-auto">
                <p className="font-medium">Everything in Achiever, plus:</p>
                {[
                  'Team Collaboration',
                  'Team Analytics Dashboard',
                  'AI Recommendations',
                  'Custom Integrations',
                  'Dedicated Account Manager',
                  'Advanced Security',
                  'API Access',
                  'Early Access to Features'
                ].map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <CheckCircledIcon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-primary/5 rounded-lg p-4 border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <RocketIcon className="h-4 w-4 text-primary" />
                  <span className="font-medium">Team features</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Team collaboration, dedicated support, and AI recommendations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-1 mb-6 rounded-full bg-primary/10 backdrop-blur-sm text-primary font-medium text-sm">
              <BarChartIcon className="mr-2 h-4 w-4" />
              Features
            </div>
            <h2 className={`${playfair.className} text-3xl md:text-4xl font-bold mb-6`}>
              Compare Plan Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find the plan that best fits your ambitions and goals
            </p>
          </div>

          {/* Desktop Comparison Table */}
          <div className="hidden lg:block overflow-hidden rounded-xl border border-border shadow-md">
            <table className="w-full bg-card/80 backdrop-blur-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-6 text-left font-medium text-xl">Features</th>
                  <th className="p-6 text-center font-medium text-lg">Explorer</th>
                  <th className="p-6 text-center font-medium text-lg bg-primary/5 border-x border-border">Achiever</th>
                  <th className="p-6 text-center font-medium text-lg">Superhuman</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Number of Goals", explorer: "3 Active", achiever: "Unlimited", superhuman: "Unlimited" },
                  { name: "Goal Hierarchy", explorer: "Basic", achiever: "Advanced", superhuman: "Advanced" },
                  { name: "Task Management", explorer: "Basic", achiever: "Advanced", superhuman: "Advanced + Team" },
                  { name: "Analytics", explorer: "Basic", achiever: "Detailed", superhuman: "Advanced & Team" },
                  { name: "History", explorer: "7 Days", achiever: "Unlimited", superhuman: "Unlimited" },
                  { name: "AI Recommendations", explorer: "—", achiever: "Limited", superhuman: "Advanced" },
                  { name: "Templates", explorer: "2", achiever: "50+", superhuman: "Custom" },
                  { name: "Support", explorer: "Community", achiever: "Priority", superhuman: "Dedicated" },
                  { name: "Team Collaboration", explorer: "—", achiever: "—", superhuman: "Full Access" },
                  { name: "API Access", explorer: "—", achiever: "—", superhuman: "Full Access" },
                ].map((feature, i) => (
                  <tr key={i} className={`border-b border-border ${i % 2 === 0 ? 'bg-muted/20' : ''}`}>
                    <td className="p-4 pl-6">{feature.name}</td>
                    <td className="p-4 text-center">
                      {feature.explorer === "—" ? 
                        <CrossCircledIcon className="h-5 w-5 text-muted-foreground mx-auto" /> : 
                        feature.explorer
                      }
                    </td>
                    <td className="p-4 text-center bg-primary/5 border-x border-border font-medium">
                      {feature.achiever === "—" ? 
                        <CrossCircledIcon className="h-5 w-5 text-muted-foreground mx-auto" /> : 
                        feature.achiever
                      }
                    </td>
                    <td className="p-4 text-center">
                      {feature.superhuman === "—" ? 
                        <CrossCircledIcon className="h-5 w-5 text-muted-foreground mx-auto" /> : 
                        feature.superhuman
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border bg-card">
                  <td className="p-6"></td>
                  <td className="p-4 text-center">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/signup">Get Started</Link>
                    </Button>
                  </td>
                  <td className="p-4 text-center bg-primary/5 border-x border-border">
                    <Button size="sm" asChild>
                      <Link href="/signup?plan=achiever">Choose Achiever</Link>
                    </Button>
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/signup?plan=superhuman">Choose Superhuman</Link>
                    </Button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          {/* Mobile Comparison - Accordions */}
          <div className="lg:hidden space-y-4">
            {["Explorer", "Achiever", "Superhuman"].map((plan) => (
              <div key={plan} className="bg-card/80 backdrop-blur-sm rounded-lg border border-border overflow-hidden">
                <div className="p-4 flex items-center justify-between font-medium">
                  <span>{plan}</span>
                  <ChevronDownIcon className="h-5 w-5" />
                </div>
                <div className="px-4 pb-4 border-t border-border pt-4">
                  <div className="space-y-3">
                    {[
                      { name: "Number of Goals", value: plan === "Explorer" ? "3 Active" : "Unlimited" },
                      { name: "Goal Hierarchy", value: plan === "Explorer" ? "Basic" : "Advanced" },
                      { name: "Analytics", value: plan === "Explorer" ? "Basic" : (plan === "Achiever" ? "Detailed" : "Advanced & Team") },
                    ].map((feature) => (
                      <div key={feature.name} className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{feature.name}</span>
                        <span className="text-sm">{feature.value}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    variant={plan === "Achiever" ? "default" : "outline"}
                    asChild
                  >
                    <Link href={`/signup${plan !== "Explorer" ? `?plan=${plan.toLowerCase()}` : ''}`}>
                      {plan === "Explorer" ? "Get Started" : `Choose ${plan}`}
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-16">
        <div className="absolute inset-0 bg-primary/5 backdrop-blur-[1px]"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-1 mb-6 rounded-full bg-primary/10 backdrop-blur-sm text-primary font-medium text-sm">
              <StarFilledIcon className="mr-2 h-4 w-4 text-amber-400" />
              Success Stories
            </div>
            <h2 className={`${playfair.className} text-3xl md:text-4xl font-bold mb-6`}>
              What Users Say About Premium Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how our premium features have transformed the lives of our users
            </p>
          </div>
          
          <div className="bg-background/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-border relative mb-20">
            <div className="md:flex items-start gap-8">
              <div className="md:w-1/3 mb-6 md:mb-0">
                <div className="aspect-square w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto md:mx-0">
                  <span className="text-4xl font-serif">M</span>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarFilledIcon key={i} className="h-5 w-5 text-amber-400" />
                  ))}
                </div>
                
                <blockquote className="text-xl md:text-2xl mb-6 italic">
                  "Upgrading to Achiever was the best decision I made for my productivity. The unlimited goals and advanced analytics helped me accomplish twice as much in half the time."
                </blockquote>
                
                <div>
                  <p className="font-medium">Michael Jordan</p>
                  <p className="text-sm text-muted-foreground">CEO & Founder, Jumpman Inc.</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">Achiever Plan</span>
                    <span className="text-sm text-muted-foreground">User for 2 years</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* More testimonials in smaller cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The team collaboration features in the Superhuman plan revolutionized how our team works together on goals.",
                name: "Sarah Williams",
                role: "Product Manager",
                plan: "Superhuman"
              },
              {
                quote: "The detailed analytics in the Achiever plan helped me identify patterns in my productivity that changed everything.",
                name: "David Chen",
                role: "Freelance Designer",
                plan: "Achiever"
              },
              {
                quote: "Worth every penny! The AI recommendations alone have saved me countless hours of planning.",
                name: "Jessica Taylor",
                role: "Marketing Director",
                plan: "Superhuman"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-background/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-border relative">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarFilledIcon key={i} className="h-4 w-4 text-amber-400" />
                  ))}
                </div>
                
                <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
                
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{testimonial.plan} Plan</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-1 mb-6 rounded-full bg-primary/10 backdrop-blur-sm text-primary font-medium text-sm">
              <QuestionMarkCircledIcon className="mr-2 h-4 w-4" />
              FAQ
            </div>
            <h2 className={`${playfair.className} text-3xl md:text-4xl font-bold mb-6`}>
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our plans
            </p>
          </div>
          
          <div className="space-y-6">
            {[
              {
                question: "Can I upgrade or downgrade my plan later?",
                answer: "Yes, you can change your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, you'll receive credit toward your next billing cycle."
              },
              {
                question: "Is there a free trial for paid plans?",
                answer: "Yes, we offer a 14-day free trial for both our Achiever and Superhuman plans. You can experience all premium features before you decide to commit."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and Apple Pay. For annual Superhuman plans, we can also arrange for invoice payment."
              },
              {
                question: "Can I cancel my subscription anytime?",
                answer: "Absolutely. You can cancel your subscription at any time from your account settings. You'll continue to have access to your paid features until the end of your current billing period."
              },
              {
                question: "What happens to my data if I downgrade?",
                answer: "Your data will be preserved, but access to premium features will be limited according to your new plan. For example, if you have more than 3 active goals and downgrade to Explorer, you'll need to select which 3 goals to keep active."
              }
            ].map((item, i) => (
              <div key={i} className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border">
                <h3 className="text-lg font-medium mb-3 flex items-start gap-3">
                  <QuestionMarkCircledIcon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  {item.question}
                </h3>
                <p className="text-muted-foreground pl-8">{item.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Have more questions? We're here to help.
            </p>
            <Button variant="outline" className="mx-auto">
              <Link href="/contact" className="flex items-center gap-2">
                Contact Support <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-primary/20">
            <div className="text-center mb-10">
              <div className="inline-flex items-center px-4 py-1 mb-6 rounded-full bg-primary/10 text-primary font-medium text-sm">
                <HeartIcon className="mr-2 h-4 w-4" />
                30-Day Money-Back Guarantee
              </div>
              <h2 className={`${playfair.className} text-3xl md:text-5xl font-bold mb-6`}>
                Ready to Unlock Your Full Potential?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose the plan that's right for you and start achieving your ambitious goals today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg h-12 px-8 shadow-lg shadow-primary/20">
                <Link href="/signup?plan=achiever" className="flex items-center gap-2">
                  Get Started with Achiever <ArrowRightIcon className="h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            {/* Security badges */}
            <div className="mt-10 flex justify-center gap-6 items-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <LockClosedIcon className="h-4 w-4" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <InfoCircledIcon className="h-4 w-4" />
                <span>Cancel Anytime</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircledIcon className="h-4 w-4" />
                <span>30-Day Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}