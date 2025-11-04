import { Bricolage_Grotesque } from "next/font/google";
import { StarFilledIcon } from "@radix-ui/react-icons";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-1 mb-6 rounded-full bg-primary/10 backdrop-blur-sm text-primary font-medium text-sm">
            <StarFilledIcon className="mr-2 h-4 w-4 text-amber-400" />
            Testimonials
          </div>
          <h2
            className={`${bricolage.className} tracking-tight text-3xl md:text-5xl font-bold mb-6`}
          >
            What Our Users Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of ambitious individuals who are achieving their dreams with
            AmbitiousYou.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonials with profile photos and ratings */}
          {[
            {
              quote:
                "AmbitiousYou has been a game-changer for me. I've been able to achieve more in the past month than I did in the entire last year.",
              name: "John Doe",
              title: "Entrepreneur",
              rating: 5,
            },
            {
              quote:
                "I've always been a dreamer, but AmbitiousYou has helped me turn my dreams into reality. The goal hierarchy system is brilliant!",
              name: "Jane Smith",
              title: "Product Designer",
              rating: 5,
            },
            {
              quote:
                "I've tried many goal-setting apps, but none of them come close to AmbitiousYou. It's simple, yet powerful.",
              name: "Alex Johnson",
              title: "Marketing Director",
              rating: 5,
            },
          ].map((testimonial, i) => (
            <div
              key={i}
              className="bg-background/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-border relative"
            >
              {/* Quote mark */}
              <div className="absolute -top-4 -left-4 bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-primary text-xl font-serif">&quot;</span>
              </div>

              <p className="text-lg text-foreground/90 mb-8 italic">
                &quot;{testimonial.quote}&quot;
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                </div>
              </div>

              <div className="absolute top-6 right-6 flex">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarFilledIcon key={i} className="h-4 w-4 text-amber-400" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Brands/Companies section */}
        <div className="mt-20 text-center">
          <p className="text-sm uppercase tracking-wider text-muted-foreground mb-8">
            Trusted by ambitious individuals at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
            {["Google", "Microsoft", "Amazon", "Apple", "Meta"].map((brand) => (
              <div
                key={brand}
                className="text-xl font-semibold opacity-50 hover:opacity-100 transition-opacity"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
