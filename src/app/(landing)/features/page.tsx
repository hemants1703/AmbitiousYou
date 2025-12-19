import { MotionWrapper } from "@/components/MotionWrapper";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  IconArrowRight,
  IconChartBar,
  IconCheck,
  IconCirclePlus,
  IconFilter,
  IconTarget,
  IconX,
} from "@tabler/icons-react";
import { Bricolage_Grotesque } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function Features() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Animated Hero Section */}
      <section className="w-full pt-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <MotionWrapper
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary font-medium mb-2">
                Trusted by 50,000+ ambitious professionals
              </div>
            </MotionWrapper>
            <div className="space-y-2">
              <MotionWrapper
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h1 className={cn(bricolage.className, "text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl")}>
                  Features Built for the Ambitious
                </h1>
              </MotionWrapper>
              <MotionWrapper
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Tools designed to elevate your performance, streamline your workflow, and help you achieve your most
                  ambitious goals.
                </p>
              </MotionWrapper>
            </div>
            <MotionWrapper
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild variant="ay" size="lg">
                  <Link prefetch={true} href="/signup" className="h-10 px-8">
                    Get Started Free
                  </Link>
                </Button>
                <Button asChild variant="ay-secondary" size="lg">
                  <Link href="/experience" className="h-10 px-8">
                    Try It Now
                  </Link>
                </Button>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </section>

      {/* Animated Core Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <MotionWrapper
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center space-y-4 text-center"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Core Features</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Everything you need to take your productivity to the next level.
              </p>
            </div>
          </MotionWrapper>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2">
            <AnimatedFeatureCard
              icon={<IconChartBar className="size-10 text-blue-500" />}
              title="Ambition Dashboard"
              description="Visualize all your goals in one place with our intuitive dashboard that provides at-a-glance progress tracking and priority management."
              delay={0}
            />
            <div className="relative">
              <MotionWrapper
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute -top-2 -right-2 z-10"
              >
                <div className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                  MOST POPULAR
                </div>
              </MotionWrapper>
              <AnimatedFeatureCard
                icon={<IconTarget className="size-10 text-red-500" />}
                title="Dual Tracking Methods"
                description="Choose between task-based or milestone-based progress tracking for each ambition, tailored to your unique goals and working style."
                delay={0.1}
              />
            </div>
            <AnimatedFeatureCard
              icon={<IconFilter className="size-10 text-green-500" />}
              title="Custom Organization"
              description="Categorize and prioritize your ambitions with flexible color-coding, and filtering options for perfect organization."
              delay={0.2}
            />
            <AnimatedFeatureCard
              icon={<IconCirclePlus className="size-10 text-cyan-500" />}
              title="Quick Ambition Creation"
              description="Our streamlined ambition creation process gets you from idea to execution in minutes, not hours."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Animated How It Works Section */}
      <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <MotionWrapper
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How AmbitiousYou Works</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Our simple process helps you transform goals into achievements
              </p>
            </div>
          </MotionWrapper>

          <div className="grid gap-12 lg:grid-cols-3">
            {[
              {
                step: "1",
                title: "Create Your Ambition",
                description:
                  "Define your goal with our guided setup process, setting deadlines, priorities and tracking methods.",
              },
              {
                step: "2",
                title: "Track Your Progress",
                description: "Break down your ambition into manageable milestones and track your progress visually.",
              },
              {
                step: "3",
                title: "Achieve & Celebrate",
                description:
                  "Reach your goals faster with data-backed insights and celebrate your accomplishments along the way.",
              },
            ].map((item, index) => (
              <MotionWrapper
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <MotionWrapper whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">{item.step}</span>
                    </div>
                  </MotionWrapper>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Benefits Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 items-center">
            <MotionWrapper
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Why ambitious people choose us</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Transform your potential into exceptional results
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                  Our platform is designed specifically for those who refuse to settle for mediocrity. See how
                  we&apos;ve helped thousands of ambitious professionals exceed their goals.
                </p>

                <div className="space-y-4 mt-6">
                  {[
                    "Increase productivity by up to 37% within the first month",
                    "Reduce time spent on administrative tasks by 64%",
                    "Achieve goals 2.5x faster with our structured approach",
                    "Join a community of 50,000+ high-achievers",
                  ].map((benefit, index) => (
                    <MotionWrapper
                      key={benefit}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    >
                      <div className="flex items-start gap-2">
                        <IconCheck className="h-5 w-5 mt-0.5 text-green-500 shrink-0" />
                        <p className="text-base font-medium leading-tight">{benefit}</p>
                      </div>
                    </MotionWrapper>
                  ))}
                </div>

                <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
                  <Button asChild variant="default">
                    <Link prefetch={true} href="/signup" className="h-10 px-8">
                      Start Your Journey
                    </Link>
                  </Button>
                </div>
              </div>
            </MotionWrapper>

            <MotionWrapper
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="rounded-lg border bg-background p-2 shadow-lg">
                <div className="overflow-hidden rounded-md">
                  <div className="bg-muted aspect-video w-full">
                    <Image
                      src="https://res.cloudinary.com/dej4ks4wd/image/upload/v1765910319/OG_IMAGE_AY.png"
                      alt="AmbitiousYou"
                      width={1000}
                      height={1000}
                      className="w-full h-full object-cover"
                      quality={100}
                      loading="lazy"
                      unoptimized={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </div>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </section>

      {/* Animated Before/After Comparison Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <MotionWrapper
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center space-y-4 text-center mb-12"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">The Ambitious Difference</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                See how your life transforms when you start using AmbitiousYou
              </p>
            </div>
          </MotionWrapper>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <MotionWrapper
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-background p-8 rounded-lg border shadow-sm h-full">
                <h3 className="text-xl font-bold mb-4 text-muted-foreground">Before AmbitiousYou</h3>
                <ul className="space-y-4">
                  {[
                    "Goals scattered across multiple apps and notes",
                    "Unclear progress tracking leads to abandoned ambitions",
                    "Overwhelming feeling when managing multiple goals",
                    "No visibility into time investment across goals",
                  ].map((item, index) => (
                    <MotionWrapper
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                    >
                      <li className="flex items-start gap-2">
                        <div className="mt-1 text-destructive shrink-0">
                          <IconX className="h-5 w-5" />
                        </div>
                        <p>{item}</p>
                      </li>
                    </MotionWrapper>
                  ))}
                </ul>
              </div>
            </MotionWrapper>

            <MotionWrapper
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-background p-8 rounded-lg border shadow h-full">
                <h3 className="text-xl font-bold mb-4 text-primary">With AmbitiousYou</h3>
                <ul className="space-y-4">
                  {[
                    "All ambitions organized in one unified system",
                    "Visual progress tracking keeps you motivated daily",
                    "Prioritization tools ensure focus on what matters most",
                    "Time analytics show where your efforts are yielding results",
                  ].map((item, index) => (
                    <MotionWrapper
                      key={item}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    >
                      <li className="flex items-start gap-2">
                        <div className="mt-1 text-green-500 shrink-0">
                          <IconCheck className="h-5 w-5" />
                        </div>
                        <p>{item}</p>
                      </li>
                    </MotionWrapper>
                  ))}
                </ul>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </section>

      {/* Animated FAQ Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <MotionWrapper
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center space-y-4 text-center mb-12"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Frequently Asked Questions
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Everything you need to know about getting started with AmbitiousYou
              </p>
            </div>
          </MotionWrapper>

          <MotionWrapper
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question: "How is AmbitiousYou different from regular task managers?",
                  answer:
                    "Unlike simple task managers, AmbitiousYou is specifically designed for long-term ambition tracking with dual progress methods (tasks or milestones), built-in time tracking, and powerful analytics that keep you motivated and focused on your biggest goals.",
                },
                {
                  question: "Is there a free plan available?",
                  answer:
                    "Yes! AmbitiousYou offers a comprehensive free plan that includes up to 3 active ambitions, basic progress tracking, and access to our core dashboard features. No credit card required to get started.",
                },
                {
                  question: "How secure is my data?",
                  answer:
                    "We take data privacy seriously. All your information is encrypted both in transit and at rest. We never sell your data to third parties, and you can export or delete your information at any time.",
                },
                {
                  question: "Can I use AmbitiousYou on all my devices?",
                  answer:
                    "Absolutely! AmbitiousYou works seamlessly on desktop, tablet, and mobile devices with a responsive web design. Native mobile apps for iOS and Android are coming soon!",
                },
              ].map((faq, index) => (
                <AccordionItem key={index} value={`item-${index + 1}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </MotionWrapper>
        </div>
      </section>

      {/* Animated CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <MotionWrapper
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center space-y-4 text-center"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to achieve your most ambitious goals?
              </h2>
              <p className="mx-auto max-w-[700px] md:text-xl/relaxed">
                Start for free today and see the difference in your productivity within the first week. No credit card
                required.
              </p>
            </div>
            <MotionWrapper
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="mx-auto w-full max-w-sm space-y-2">
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                  <Button asChild variant="default" size="lg" className="px-8">
                    <Link prefetch={true} href="/signup">
                      Get Started Free <IconArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </MotionWrapper>
          </MotionWrapper>
        </div>
      </section>
    </div>
  );
}

function AnimatedFeatureCard({
  icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}) {
  return (
    <MotionWrapper
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex flex-col items-center space-y-3 rounded-lg border p-6 bg-background shadow-sm transition-all hover:shadow-md h-full">
        <MotionWrapper whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
          <div className="p-3 rounded-full bg-muted">{icon}</div>
        </MotionWrapper>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground text-center">{description}</p>
      </div>
    </MotionWrapper>
  );
}
