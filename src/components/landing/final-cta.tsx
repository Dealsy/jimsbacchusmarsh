import { LinkButton } from "@/components/ui/link-button";
import { LeadForm } from "@/components/landing/lead-form";
import { UrgencyBanner } from "@/components/landing/urgency-banner";
import {
  resolveOffer,
  resolveUrgency,
} from "@/lib/landing-page-content";
import { formatPhoneHref, isPlaceholderPhone } from "@/lib/phone";
import type { PublishedLandingPage } from "@/lib/types/landing-page";

type FinalCtaProps = {
  readonly page: PublishedLandingPage;
};

export function FinalCta({ page }: FinalCtaProps) {
  const phoneHref = formatPhoneHref(page.phone);
  const showPhone = !isPlaceholderPhone(page.phone);
  const offer = resolveOffer(page);
  const urgency = resolveUrgency(page);

  return (
    <section id="quote-form" className="py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-2 lg:items-start">
        <div className="space-y-6">
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            {page.ctaLabel}
          </h2>
          <p className="text-lg text-muted-foreground">{offer.headline}</p>
          {showPhone ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Prefer to talk now?
              </p>
              <LinkButton href={phoneHref} variant="outline" size="lg">
                {page.phone}
              </LinkButton>
            </div>
          ) : null}
          <p className="text-sm text-muted-foreground">
            {page.businessName} · {page.serviceAreas.join(", ")}
          </p>
        </div>
        <div className="space-y-4">
          {urgency ? <UrgencyBanner message={urgency.message} /> : null}
          <div className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
            <LeadForm page={page} />
          </div>
        </div>
      </div>
    </section>
  );
}
