import type { PublishedLandingPage } from "@/lib/types/landing-page";

type HowItWorksProps = {
  readonly page: PublishedLandingPage;
};

export function HowItWorks({ page }: HowItWorksProps) {
  const sorted = [...page.howItWorks].sort((a, b) => a.step - b.step);

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl space-y-10 px-4">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            How it works
          </h2>
          <p className="text-muted-foreground">
            No guesswork — here&apos;s exactly what happens after you get in
            touch.
          </p>
        </div>
        <ol className="grid gap-8 md:grid-cols-3">
          {sorted.map((step) => (
            <li key={step.step} className="relative space-y-4 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                {step.step}
              </div>
              <h3 className="font-heading text-xl font-semibold">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
