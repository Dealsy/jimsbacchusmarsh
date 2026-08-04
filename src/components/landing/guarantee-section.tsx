import { ShieldCheckIcon } from "lucide-react";

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

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="rounded-2xl border bg-card p-8 text-center shadow-sm md:p-10">
          <ShieldCheckIcon className="mx-auto mb-4 size-10 text-primary" />
          <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
            {guarantee.headline}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {guarantee.body}
          </p>
        </div>
      </div>
    </section>
  );
}
