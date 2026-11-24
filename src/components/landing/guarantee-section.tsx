import { CheckIcon, ShieldCheckIcon } from "lucide-react";

import { LandingSection } from "@/components/landing/shell/landing-section";
import { Reveal } from "@/components/landing/shell/reveal";
import { guaranteeBadgeLabels } from "@/lib/guarantee-badges";
import { resolveGuarantee } from "@/lib/landing-page-content";
import type { PublishedLandingPage } from "@/lib/types/landing-page";

type GuaranteeSectionProps = {
  readonly page: PublishedLandingPage;
};

export function GuaranteeSection({ page }: GuaranteeSectionProps) {
  const guarantee = resolveGuarantee(page);

  if (!guarantee) {
    return null;
  }

  const badges = guaranteeBadgeLabels(guarantee.body);

  return (
    <LandingSection tone="band" width="narrow" className="pt-24 md:pt-32">
      <Reveal>
        <div className="relative rounded-3xl bg-card px-6 pt-16 pb-8 text-center shadow-elevated ring-1 ring-border md:px-12 md:pb-12">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              className="flex size-20 items-center justify-center rounded-full text-primary-foreground shadow-float ring-8 ring-(--landing-section-band)"
              style={{
                background:
                  "linear-gradient(135deg, var(--landing-primary), var(--landing-accent))",
              }}
            >
              <ShieldCheckIcon className="size-9" />
            </div>
          </div>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-balance md:text-4xl">
            {guarantee.headline}
          </h2>
          {badges ? (
            <ul className="mx-auto mt-8 grid max-w-xl gap-3 text-left sm:grid-cols-2">
              {badges.map((badge) => (
                <li
                  key={badge}
                  className="flex items-start gap-3 rounded-2xl bg-(--landing-section-band) px-4 py-3 text-[0.9375rem] font-medium"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CheckIcon className="size-3" />
                  </span>
                  {badge}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {guarantee.body}
            </p>
          )}
        </div>
      </Reveal>
    </LandingSection>
  );
}
