import { CheckIcon, GiftIcon } from "lucide-react";

import { LinkButton } from "@/components/ui/link-button";
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

  return (
    <section data-landing-section="offer" className="bg-muted/30 py-16 md:py-20">
      <div className="mx-auto max-w-3xl space-y-8 px-4">
        {urgency ? <UrgencyBanner message={urgency.message} /> : null}

        <div className="space-y-4 text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            {offer.headline}
          </h2>
          {offer.reasonWhy ? (
            <p className="text-lg leading-relaxed text-muted-foreground">
              {offer.reasonWhy}
            </p>
          ) : (
            <p className="text-lg text-muted-foreground">
              Roofs, house exteriors, Colorbond fencing, and retaining walls
              across {page.serviceAreas.join(", ")} and surrounds.
            </p>
          )}
        </div>

        {hasStack ? (
          <div className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
            {offer.valueItems.length > 0 ? (
              <div className="space-y-4">
                <h3 className="font-heading text-lg font-semibold">
                  Here&apos;s what you get:
                </h3>
                <ul className="space-y-3">
                  {offer.valueItems.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-start justify-between gap-4 text-sm"
                    >
                      <span className="flex items-start gap-2">
                        <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{item.label}</span>
                      </span>
                      {item.value ? (
                        <span className="shrink-0 font-medium text-muted-foreground">
                          {item.value} value
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
                {totalValue !== null ? (
                  <p className="border-t pt-4 text-center text-sm font-medium">
                    Total value: ${totalValue.toFixed(0)} — yours free today
                  </p>
                ) : null}
              </div>
            ) : null}

            {offer.bonuses.length > 0 ? (
              <div
                className={
                  offer.valueItems.length > 0
                    ? "mt-6 space-y-3 border-t pt-6"
                    : "space-y-3"
                }
              >
                <h3 className="flex items-center gap-2 font-heading text-lg font-semibold">
                  <GiftIcon className="size-5 text-primary" />
                  Plus these bonuses:
                </h3>
                <ul className="space-y-2">
                  {offer.bonuses.map((bonus) => (
                    <li
                      key={bonus}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                      {bonus}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="text-center">
          <LinkButton
            href="#quote-form"
            landingCtaLocation="offer"
            size="lg"
            className="h-auto px-8 py-3.5 text-lg font-semibold md:text-xl"
          >
            {page.ctaLabel}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
