import { StarIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { PublishedLandingPage } from "@/lib/types/landing-page";
import { cn } from "@/lib/utils";

type TestimonialsSectionProps = {
  readonly page: PublishedLandingPage;
};

const STAR_KEYS = ["one", "two", "three", "four", "five"] as const;

function FiveStarRating() {
  return (
    <div
      className="flex gap-0.5 text-amber-400"
      aria-label="5 out of 5 stars"
      role="img"
    >
      {STAR_KEYS.map((key) => (
        <StarIcon key={key} className="size-4 fill-current" aria-hidden />
      ))}
    </div>
  );
}

export function TestimonialsSection({ page }: TestimonialsSectionProps) {
  const hasRealQuotes = page.testimonials.some(
    (item) => !item.quote.includes("PLACEHOLDER"),
  );

  return (
    <section className="bg-muted/30 py-16 md:py-20">
      <div className="mx-auto max-w-6xl space-y-10 px-4">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            What locals say
          </h2>
          {hasRealQuotes ? (
            <p className="text-lg text-muted-foreground">
              Real feedback from homeowners across{" "}
              {page.serviceAreas.slice(0, 3).join(", ")}
              {page.serviceAreas.length > 3 ? " and surrounds" : ""}.
            </p>
          ) : null}
        </div>
        {!hasRealQuotes ? (
          <div className="rounded-2xl border border-dashed bg-background p-12 text-center text-muted-foreground">
            [PLACEHOLDER — Matt to supply 2–3 real customer quotes via admin]
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {page.testimonials.map((testimonial, index) => (
              <Card
                key={`${testimonial.author}-${testimonial.quote.slice(0, 20)}`}
                className={cn(
                  "h-full border-border/80 bg-background shadow-sm transition-shadow duration-300 hover:shadow-md",
                  "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-3 motion-safe:duration-500",
                )}
                style={{
                  animationDelay: `${index * 80}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <CardContent className="flex flex-1 flex-col gap-4 pt-6">
                  <FiveStarRating />
                  <blockquote className="flex-1 text-base leading-relaxed text-foreground/90">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <footer className="mt-auto border-t pt-4 text-sm">
                    <p className="font-semibold">{testimonial.author}</p>
                    {testimonial.location ? (
                      <p className="text-muted-foreground">
                        {testimonial.location}
                      </p>
                    ) : null}
                  </footer>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
