import { ArrowUpIcon, TriangleAlertIcon } from "lucide-react";

import { LinkButton } from "@/components/ui/link-button";
import { resolveClose } from "@/lib/landing-page-content";
import type { PublishedLandingPage } from "@/lib/types/landing-page";

type CloseSectionProps = {
  readonly page: PublishedLandingPage;
};

export function CloseSection({ page }: CloseSectionProps) {
  const close = resolveClose(page);

  if (!close) {
    return null;
  }

  return (
    <section className="bg-background pt-2 pb-16 md:pb-24">
      <div className="mx-auto max-w-3xl space-y-6 px-5">
        {close.warning ? (
          <div className="flex gap-4 rounded-2xl border-l-4 border-amber-400 bg-amber-50/70 p-5 md:p-6 dark:bg-amber-950/20">
            <TriangleAlertIcon className="mt-0.5 size-5 shrink-0 text-amber-500" />
            <p className="leading-relaxed text-foreground/80">
              {close.warning}
            </p>
          </div>
        ) : null}
        <div className="space-y-5 rounded-2xl bg-(--landing-section-band) p-5 ring-1 ring-border md:p-7">
          <p className="font-heading text-lg leading-relaxed text-pretty md:text-xl">
            {close.ps}
          </p>
          <LinkButton
            href="#quote-form-footer"
            landingCtaLocation="final_cta"
            size="lg"
            className="h-11 px-6 shadow-lg shadow-primary/25"
          >
            {page.ctaLabel}
            <ArrowUpIcon data-icon="inline-end" />
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
