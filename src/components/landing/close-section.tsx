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
    <section className="border-t bg-muted/20 py-12 md:py-16">
      <div className="mx-auto max-w-3xl space-y-6 px-4">
        {close.warning ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
            <p className="text-sm font-medium text-destructive">Warning</p>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {close.warning}
            </p>
          </div>
        ) : null}
        <p className="text-lg leading-relaxed">{close.ps}</p>
        <LinkButton href="#quote-form" landingCtaLocation="final_cta" size="lg">
          {page.ctaLabel}
        </LinkButton>
      </div>
    </section>
  );
}
