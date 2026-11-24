import { ArrowRightIcon, QuoteIcon } from "lucide-react";

import { LandingSection } from "@/components/landing/shell/landing-section";
import { Reveal } from "@/components/landing/shell/reveal";
import { Eyebrow } from "@/components/landing/shell/section-heading";
import type { PublishedLandingPage } from "@/lib/types/landing-page";

type ProblemSectionProps = {
  readonly page: PublishedLandingPage;
};

export function ProblemSection({ page }: ProblemSectionProps) {
  const paragraphs = page.problem.body.split("\n\n").filter(Boolean);
  const [quote, ...supporting] = paragraphs;

  return (
    <LandingSection tone="light" width="narrow">
      <Reveal className="space-y-8 text-center">
        <div className="space-y-4">
          <Eyebrow>The problem</Eyebrow>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-balance md:text-5xl">
            Sound familiar?
          </h2>
        </div>
        {quote ? (
          <figure className="relative mx-auto max-w-2xl">
            <QuoteIcon
              aria-hidden
              className="mx-auto mb-4 size-10 fill-primary/15 text-primary/40"
            />
            <blockquote className="font-heading text-2xl leading-snug font-semibold tracking-tight text-balance text-foreground md:text-[2.125rem] md:leading-tight">
              {quote}
            </blockquote>
            <div
              aria-hidden
              className="mx-auto mt-8 h-1 w-16 rounded-full bg-linear-to-r from-(--landing-primary) to-(--landing-accent)"
            />
          </figure>
        ) : null}
        {supporting.map((paragraph) => (
          <p
            key={paragraph}
            className="mx-auto max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground"
          >
            {paragraph}
          </p>
        ))}
        <p>
          <a
            href="#before-after"
            className="group inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
          >
            See the difference
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </p>
      </Reveal>
    </LandingSection>
  );
}
