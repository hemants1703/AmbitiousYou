import LandingSection from "@/components/(landing)/landing-section";

export default function ExperienceSkeleton() {
  return (
    <LandingSection eyebrow="Experience" title="Loading interactive demo…" lede="Preparing your preview of AmbitiousYou." className="pt-16 md:pt-24" align="center">
      <div className="mx-auto flex h-96 max-w-3xl animate-pulse flex-col gap-4 rounded-2xl border border-border/60 bg-card/40 p-8">
        <div className="h-8 w-2/3 rounded-lg bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-5/6 rounded bg-muted" />
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="h-24 rounded-xl bg-muted" />
          <div className="h-24 rounded-xl bg-muted" />
          <div className="h-24 rounded-xl bg-muted" />
          <div className="h-24 rounded-xl bg-muted" />
        </div>
      </div>
    </LandingSection>
  );
}
