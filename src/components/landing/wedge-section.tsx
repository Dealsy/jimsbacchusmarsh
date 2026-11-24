import { ArrowRightIcon, CheckIcon, XIcon } from "lucide-react";

import {
  DarkSectionDecor,
  LandingSection,
} from "@/components/landing/shell/landing-section";
import { Reveal } from "@/components/landing/shell/reveal";
import { SectionHeading } from "@/components/landing/shell/section-heading";
import { LinkButton } from "@/components/ui/link-button";
import { resolveWedgeSection } from "@/lib/landing-page-content";
import type { PublishedLandingPage } from "@/lib/types/landing-page";

type WedgeSectionProps = {
  readonly page: PublishedLandingPage;
};

export function WedgeSection({ page }: WedgeSectionProps) {
  const { wedge } = page;
  const section = resolveWedgeSection(page);

  return (
    <LandingSection tone="light" containerClassName="space-y-12">
      <Reveal>
        <SectionHeading
          eyebrow="Why us"
          title={section.headline}
          description={section.description}
        />
      </Reveal>
      <div className="relative grid items-center gap-5 md:grid-cols-2 md:gap-8">
        <Reveal>
          <div className="rounded-3xl border border-dashed bg-muted/40 p-6 md:p-8">
            <p className="mb-5 flex items-center gap-2.5 font-heading text-lg font-semibold text-muted-foreground">
              <span className="flex size-8 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <XIcon className="size-4" />
              </span>
              {section.negativeTitle}
            </p>
            <ul className="space-y-3.5">
              {wedge.pressureWashPoints.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-[0.9375rem] leading-relaxed text-muted-foreground"
                >
                  <XIcon className="mt-1 size-4 shrink-0 text-destructive/60" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div
          aria-hidden
          className="z-10 mx-auto -my-3 flex size-12 items-center justify-center rounded-full bg-background font-heading text-sm font-bold tracking-wide text-muted-foreground uppercase shadow-elevated ring-1 ring-border md:absolute md:top-1/2 md:left-1/2 md:my-0 md:-translate-x-1/2 md:-translate-y-1/2"
        >
          vs
        </div>

        <Reveal delay={120}>
          <div className="tone-dark landing-dark-surface relative isolate overflow-hidden rounded-3xl p-6 shadow-float ring-1 ring-white/10 md:scale-[1.03] md:p-9">
            <DarkSectionDecor />
            <p className="mb-5 flex items-center gap-2.5 font-heading text-lg font-semibold">
              <span
                className="flex size-8 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: "var(--landing-accent)" }}
              >
                <CheckIcon className="size-4" />
              </span>
              {section.positiveTitle}
            </p>
            <ul className="space-y-3.5">
              {wedge.softwashPoints.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-[0.9375rem] leading-relaxed text-white/90"
                >
                  <CheckIcon
                    className="mt-1 size-4 shrink-0"
                    style={{
                      color:
                        "color-mix(in srgb, var(--landing-accent) 55%, white)",
                    }}
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
      <div className="flex justify-center">
        <LinkButton
          href="#quote-form"
          landingCtaLocation="wedge"
          size="lg"
          className="h-12 px-7 text-base shadow-lg shadow-primary/25"
        >
          {page.ctaLabel}
          <ArrowRightIcon data-icon="inline-end" />
        </LinkButton>
      </div>
    </LandingSection>
  );
}
