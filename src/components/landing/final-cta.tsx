import { PhoneIcon } from "lucide-react";

import { LeadForm } from "@/components/landing/lead-form";
import { LeadFormHeading } from "@/components/landing/lead-form-heading";
import { DarkSectionDecor } from "@/components/landing/shell/landing-section";
import { Reveal } from "@/components/landing/shell/reveal";
import { Eyebrow } from "@/components/landing/shell/section-heading";
import { LinkButton } from "@/components/ui/link-button";
import { resolveOffer } from "@/lib/landing-page-content";
import { formatPhoneHref, isPlaceholderPhone } from "@/lib/phone";
import type { PublishedLandingPage } from "@/lib/types/landing-page";

type FinalCtaProps = {
  readonly page: PublishedLandingPage;
};

export function FinalCta({ page }: FinalCtaProps) {
  const phoneHref = formatPhoneHref(page.phone);
  const showPhone = !isPlaceholderPhone(page.phone);
  const offer = resolveOffer(page);

  return (
    <section
      id="quote-form-footer"
      data-landing-section="form"
      className="scroll-mt-4 bg-background px-3 py-12 md:px-6 md:py-20"
    >
      <Reveal className="mx-auto max-w-7xl">
        <div className="tone-dark landing-dark-surface relative isolate overflow-hidden rounded-[2rem] px-5 py-10 shadow-float md:rounded-[2.5rem] md:px-12 md:py-16 lg:px-16">
          <DarkSectionDecor />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-40 -left-24 -z-10 size-[30rem] rounded-full opacity-40 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, var(--landing-accent), transparent 65%)",
            }}
          />
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="space-y-6">
              <Eyebrow centered={false}>Get started</Eyebrow>
              <h2 className="font-heading text-4xl leading-[1.05] font-bold tracking-tight text-balance md:text-6xl">
                {page.ctaLabel}
              </h2>
              <p className="max-w-lg text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl">
                {offer.headline}
              </p>
              {showPhone ? (
                <div className="space-y-2.5 pt-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Prefer to talk now?
                  </p>
                  <LinkButton
                    href={phoneHref}
                    variant="outline"
                    size="lg"
                    className="h-12 border-white/20 bg-white/10 px-6 text-base text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
                  >
                    <PhoneIcon data-icon="inline-start" />
                    {page.phone}
                  </LinkButton>
                </div>
              ) : null}
              <p className="text-sm text-muted-foreground">
                {page.businessName} · {page.serviceAreas.join(", ")}
              </p>
            </div>
            <div className="tone-light relative overflow-hidden rounded-3xl bg-card p-5 text-card-foreground shadow-float md:p-8">
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-(--landing-primary) to-(--landing-accent)"
              />
              <LeadFormHeading page={page} />
              <LeadForm page={page} idPrefix="footer" formLocation="footer" />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
