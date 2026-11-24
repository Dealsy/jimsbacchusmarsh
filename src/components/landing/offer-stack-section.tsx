import { CheckIcon, GiftIcon } from "lucide-react";

import { Suspense } from "react";

import { LeadForm } from "@/components/landing/lead-form";
import { LeadFormHeading } from "@/components/landing/lead-form-heading";
import { OfferQuoteForm } from "@/components/landing/offer-quote-form";
import { LandingSection } from "@/components/landing/shell/landing-section";
import { Reveal } from "@/components/landing/shell/reveal";
import { SectionHeading } from "@/components/landing/shell/section-heading";
import {
  hasOfferStackContent,
  resolveOffer,
  resolveUrgency,
  sumOfferValue,
} from "@/lib/landing-page-content";
import type { PublishedLandingPage } from "@/lib/types/landing-page";

import { UrgencyBanner } from "./urgency-banner";

type OfferStackSectionProps = {
  readonly page: PublishedLandingPage;
};

export function OfferStackSection({ page }: OfferStackSectionProps) {
  const offer = resolveOffer(page);
  const urgency = resolveUrgency(page);
  const totalValue = sumOfferValue(offer.valueItems);
  const hasStack = hasOfferStackContent(offer);
  const hasValueItems = offer.valueItems.length > 0;
  const hasDiscount = offer.webBookingDiscountPercent !== null;

  return (
    <LandingSection
      id="quote-form"
      data-landing-section="offer"
      tone="band"
      width="narrow"
      className="scroll-mt-4"
      containerClassName="space-y-10"
    >
      <Reveal className="space-y-6">
        {urgency ? <UrgencyBanner message={urgency.message} /> : null}
        <SectionHeading
          eyebrow="The offer"
          title={offer.headline}
          description={
            offer.reasonWhy ||
            `Roofs, house exteriors, Colorbond fencing, and retaining walls across ${page.serviceAreas.join(", ")} and surrounds.`
          }
        />
      </Reveal>

      {hasStack ? (
        <Reveal delay={80}>
          <div className="relative rounded-3xl bg-card shadow-elevated ring-1 ring-border">
            {hasValueItems ? (
              <div className="space-y-5 p-6 md:p-9">
                <h3 className="font-heading text-lg font-semibold">
                  Here&apos;s what you get:
                </h3>
                <ul className="space-y-3.5">
                  {offer.valueItems.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-start justify-between gap-4 text-[0.9375rem]"
                    >
                      <span className="flex items-start gap-3">
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <CheckIcon className="size-3" />
                        </span>
                        <span>{item.label}</span>
                      </span>
                      {item.value ? (
                        <span className="shrink-0 text-sm font-medium text-muted-foreground">
                          {item.value} value
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {hasValueItems && (totalValue !== null || hasDiscount) ? (
              <CouponPerforation />
            ) : null}

            {totalValue !== null || hasDiscount ? (
              <div className="grid gap-4 p-6 md:grid-cols-2 md:items-center md:p-9">
                {totalValue !== null ? (
                  <div className="space-y-1 text-center md:text-left">
                    <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                      Total value
                    </p>
                    <p className="flex items-baseline justify-center gap-3 md:justify-start">
                      <span className="text-xl font-medium text-muted-foreground line-through decoration-2">
                        ${totalValue.toFixed(0)}
                      </span>
                      <span className="font-heading text-3xl font-bold text-primary">
                        Free today
                      </span>
                    </p>
                  </div>
                ) : null}
                {hasDiscount ? (
                  <div
                    className={
                      totalValue !== null
                        ? "flex items-center justify-center gap-3 rounded-2xl bg-primary/8 px-5 py-4 ring-1 ring-primary/20 md:justify-end"
                        : "flex items-center justify-center gap-3 rounded-2xl bg-primary/8 px-5 py-4 ring-1 ring-primary/20 md:col-span-2"
                    }
                  >
                    <span className="font-heading text-5xl leading-none font-bold text-primary">
                      {offer.webBookingDiscountPercent}%
                    </span>
                    <span className="text-sm leading-snug font-medium">
                      off the job
                      <br />
                      when you book from this page
                    </span>
                  </div>
                ) : null}
              </div>
            ) : null}

            {offer.bonuses.length > 0 ? (
              <div className="space-y-3 border-t border-dashed p-6 md:p-9">
                <h3 className="flex items-center gap-2 font-heading text-lg font-semibold">
                  <GiftIcon className="size-5 text-primary" />
                  Plus these bonuses:
                </h3>
                <ul className="space-y-2.5">
                  {offer.bonuses.map((bonus) => (
                    <li
                      key={bonus}
                      className="flex items-start gap-3 text-[0.9375rem] text-muted-foreground"
                    >
                      <CheckIcon className="mt-1 size-4 shrink-0 text-primary" />
                      {bonus}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </Reveal>
      ) : null}

      <Reveal delay={120}>
        <div className="relative overflow-hidden rounded-3xl bg-card p-6 shadow-elevated ring-1 ring-border md:p-9">
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-(--landing-primary) to-(--landing-accent)"
          />
          <LeadFormHeading page={page} />
          <Suspense
            fallback={
              <LeadForm page={page} idPrefix="offer" formLocation="offer" />
            }
          >
            <OfferQuoteForm page={page} />
          </Suspense>
        </div>
      </Reveal>
    </LandingSection>
  );
}

function CouponPerforation() {
  return (
    <div aria-hidden className="relative h-0">
      <span className="absolute top-0 -left-3 size-6 -translate-y-1/2 rounded-full bg-(--landing-section-band) shadow-[inset_-1px_0_0_var(--border)]" />
      <span className="absolute inset-x-6 top-0 border-t-2 border-dashed" />
      <span className="absolute top-0 -right-3 size-6 -translate-y-1/2 rounded-full bg-(--landing-section-band) shadow-[inset_1px_0_0_var(--border)]" />
    </div>
  );
}
