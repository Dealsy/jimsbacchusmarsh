import { ShieldCheckIcon } from "lucide-react";

import { guaranteeBadgeLabels } from "@/lib/guarantee-badges";
import { resolveGuarantee } from "@/lib/landing-page-content";
import { landingSectionSurfaceClass } from "@/lib/landing-section-surface";
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
    <section className={`${landingSectionSurfaceClass("plain")} py-16 md:py-20`}>
      <div className="mx-auto max-w-3xl px-4">
        <div className="rounded-2xl border bg-card p-8 text-center shadow-sm md:p-10">
          <ShieldCheckIcon className="mx-auto mb-4 size-10 text-primary" />
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            {guarantee.headline}
          </h2>
          {badges ? (
            <ul className="mt-6 flex flex-wrap justify-center gap-2">
              {badges.map((badge) => (
                <li
                  key={badge}
                  className="rounded-full border bg-muted/60 px-3 py-1 text-sm font-medium text-foreground"
                >
                  {badge}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {guarantee.body}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
