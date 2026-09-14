import { landingSectionSurfaceClass } from "@/lib/landing-section-surface";
import type { PublishedLandingPage } from "@/lib/types/landing-page";

type ProblemSectionProps = {
  readonly page: PublishedLandingPage;
};

export function ProblemSection({ page }: ProblemSectionProps) {
  const paragraphs = page.problem.body.split("\n\n").filter(Boolean);
  const [quote, ...supporting] = paragraphs;

  return (
    <section className={`${landingSectionSurfaceClass("plain")} py-16 md:py-20`}>
      <div className="mx-auto max-w-3xl space-y-6 px-4 text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
          Sound familiar?
        </h2>
        {quote ? (
          <blockquote className="border-primary/40 text-xl leading-relaxed font-medium text-foreground italic md:border-l-4 md:pl-6 md:text-2xl">
            {quote}
          </blockquote>
        ) : null}
        {supporting.map((paragraph) => (
          <p
            key={paragraph}
            className="text-lg leading-relaxed text-muted-foreground"
          >
            {paragraph}
          </p>
        ))}
        <p>
          <a
            href="#before-after"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            See the difference
          </a>
        </p>
      </div>
    </section>
  );
}
