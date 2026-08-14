import { freePlan } from "@/lib/pricing/free-plan";
import { siteConfig } from "@/lib/site";


/** Machine-readable pricing for AI agents and buyers — mirrors the free plan. */
export async function GET() {
  const lines = [
    `# Pricing — ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    `## ${freePlan.name}`,
    `- Price: ${freePlan.price}/month`,
    `- Tagline: ${freePlan.tagline}`,
    `- Limits: No artificial caps on ambitions, tasks, or milestones`,
    `- Billing: No credit card required`,
    `- Features:`,
    ...freePlan.features.map((f) => `  - ${f}`),
    "",
    "## Notes",
    `- ${freePlan.lede}`,
    "- There is no checkout today. New accounts sign up on the free plan.",
    `- Human-readable page: ${siteConfig.url}/pricing`,
    `- Contact: support@ambitiousyou.pro`,
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
