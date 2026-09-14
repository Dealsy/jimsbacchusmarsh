import { CheckIcon, XIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { resolveWedgeSection } from "@/lib/landing-page-content";
import { landingSectionSurfaceClass } from "@/lib/landing-section-surface";
import type { PublishedLandingPage } from "@/lib/types/landing-page";
import { cn } from "@/lib/utils";

type WedgeSectionProps = {
  readonly page: PublishedLandingPage;
};

export function WedgeSection({ page }: WedgeSectionProps) {
  const { wedge } = page;
  const section = resolveWedgeSection(page);

  return (
    <section
      className={cn(landingSectionSurfaceClass("plain"), "py-16 md:py-20")}
    >
      <div className="mx-auto max-w-6xl space-y-10 px-4">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            {section.headline}
          </h2>
          <p className="text-lg text-muted-foreground">{section.description}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-2xl border-muted bg-background shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <XIcon className="size-5" />
                {section.negativeTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {wedge.pressureWashPoints.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                  >
                    <XIcon className="mt-0.5 size-4 shrink-0 text-destructive/70" />
                    {point}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-[color-mix(in_srgb,var(--landing-accent)_50%,transparent)] bg-background shadow-lg ring-2 ring-[color-mix(in_srgb,var(--landing-accent)_35%,transparent)]">
            <CardHeader>
              <CardTitle
                className="flex items-center gap-2"
                style={{ color: "var(--landing-accent)" }}
              >
                <CheckIcon className="size-5" />
                {section.positiveTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {wedge.softwashPoints.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                  >
                    <CheckIcon
                      className="mt-0.5 size-4 shrink-0"
                      style={{ color: "var(--landing-accent)" }}
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-center">
          <LinkButton href="#quote-form" landingCtaLocation="wedge" size="lg">
            {page.ctaLabel}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
