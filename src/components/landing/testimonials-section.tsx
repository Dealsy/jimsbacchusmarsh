import { Card, CardContent } from "@/components/ui/card";
import type { PublishedLandingPage } from "@/lib/types/landing-page";

type TestimonialsSectionProps = {
  readonly page: PublishedLandingPage;
};

export function TestimonialsSection({ page }: TestimonialsSectionProps) {
  const hasRealQuotes = page.testimonials.some(
    (item) => !item.quote.includes("PLACEHOLDER"),
  );

  return (
    <section className="bg-muted/30 py-16 md:py-20">
      <div className="mx-auto max-w-6xl space-y-10 px-4">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            What locals say
          </h2>
        </div>
        {!hasRealQuotes ? (
          <div className="rounded-2xl border border-dashed bg-background p-12 text-center text-muted-foreground">
            [PLACEHOLDER — Matt to supply 2–3 real customer quotes via admin]
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {page.testimonials.map((testimonial) => (
              <Card key={`${testimonial.author}-${testimonial.quote.slice(0, 20)}`} className="bg-background">
                <CardContent className="space-y-4 pt-6">
                  <p className="text-sm leading-relaxed italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="text-sm">
                    <p className="font-medium">{testimonial.author}</p>
                    {testimonial.location ? (
                      <p className="text-muted-foreground">
                        {testimonial.location}
                      </p>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
