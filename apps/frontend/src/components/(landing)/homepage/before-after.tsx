import { Bricolage_Grotesque } from "next/font/google";
import { ArrowRightLeftIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const withoutPoints = [
  "Goals live in your head and a dozen half-used apps.",
  "Nothing happens unless motivation decides to show up.",
  "Every Monday is another fresh restart from zero.",
  "Progress is invisible, so big goals stay abstract.",
  "“Someday” keeps swallowing the things you care about most.",
];

const withPoints = [
  "Every ambition structured in one private place.",
  "A system carries you on the days motivation doesn’t.",
  "The streak you’ve built makes you want to keep it.",
  "Progress you can see, so momentum compounds.",
  "Big goals broken into the one move you make today.",
];

export default function BeforeAfter() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-1 mb-6 rounded-full bg-foreground/10 backdrop-blur-sm text-foreground font-medium text-sm">
            <ArrowRightLeftIcon className="mr-2 h-4 w-4" />
            The shift
          </div>
          <h2 className={`${bricolage.className} tracking-tight text-3xl md:text-5xl font-bold mb-6`}>Same you. A completely different operating system.</h2>
          <p className="text-xl text-muted-foreground">This isn’t about working harder. It’s about becoming the person who actually finishes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Without */}
          <div className="rounded-2xl border border-border bg-muted/30 p-7 md:p-8">
            <h3 className="text-lg font-bold text-muted-foreground mb-6">Without AmbitiousYou</h3>
            <ul className="space-y-4">
              {withoutPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <XCircleIcon className="h-5 w-5 shrink-0 mt-0.5 text-muted-foreground/70" />
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* With */}
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-7 md:p-8 shadow-lg shadow-primary/5">
            <h3 className="text-lg font-bold mb-6">With AmbitiousYou</h3>
            <ul className="space-y-4">
              {withPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircleIcon className="h-5 w-5 shrink-0 mt-0.5 text-green-500" />
                  <span className="text-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
