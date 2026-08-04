import type { PublishedLandingPage } from "@/lib/types/landing-page";

type ProblemSectionProps = {
  readonly page: PublishedLandingPage;
};

export function ProblemSection({ page }: ProblemSectionProps) {
  const paragraphs = page.problem.body.split("\n\n").filter(Boolean);

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-3xl space-y-6 px-4 text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
          Sound familiar?
        </h2>
        {paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className="text-lg leading-relaxed text-muted-foreground"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
