"use client";

import { ArrowLeftIcon, CheckIcon } from "lucide-react";
import Link from "next/link";

import { GoogleAds } from "@/components/analytics/google-ads";
import { LandingPageAnalytics } from "@/components/analytics/landing-page-analytics";
import { MetaPixel } from "@/components/analytics/meta-pixel";
import { BeforeAfterGallery } from "@/components/landing/before-after-gallery";
import { LandingPageTheme } from "@/components/landing/landing-page-theme";
import { LeadForm } from "@/components/landing/lead-form";
import { SiteFooter } from "@/components/landing/site-footer";
import { StickyMobileBar } from "@/components/landing/sticky-mobile-bar";
import type { LandingPageService } from "@/lib/landing-page-content";
import type {
  GalleryItem,
  PublishedLandingPage,
} from "@/lib/types/landing-page";

type ServicePageViewProps = {
  readonly page: PublishedLandingPage;
  readonly service: LandingPageService;
  readonly gallery: readonly GalleryItem[];
};

export function ServicePageView({
  page,
  service,
  gallery,
}: ServicePageViewProps) {
  const metaPixelId = page.metaPixelId ?? process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const googleAdsId = page.googleAdsId ?? process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const headline = service.pageHeadline?.trim() || service.title;
  const intro = service.pageIntro?.trim() || service.description;
  const body = service.pageBody?.trim();
  const whatsIncluded = (service.whatsIncluded ?? []).filter((item) =>
    item.trim(),
  );
  const serviceGallery = gallery.filter(
    (item) => item.category === service.title,
  );

  return (
    <>
      <LandingPageAnalytics pageSlug={`${page.slug}/${service.slug ?? ""}`} />
      <MetaPixel pixelId={metaPixelId} />
      <GoogleAds adsId={googleAdsId} />
      <LandingPageTheme theme={page.theme}>
        <main className="pb-32 md:pb-14">
          <section
            className="border-b py-10 md:py-14"
            style={{
              background: `linear-gradient(to bottom, var(--landing-hero-from), var(--landing-hero-to))`,
            }}
          >
            <div className="mx-auto max-w-3xl space-y-6 px-4 text-white">
              <Link
                href={`/${page.slug}`}
                className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
              >
                <ArrowLeftIcon className="size-4" />
                Back to {page.name}
              </Link>
              <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl">
                {headline}
              </h1>
              {intro ? (
                <p className="text-lg text-white/90 md:text-xl">{intro}</p>
              ) : null}
            </div>
          </section>

          {body || whatsIncluded.length > 0 ? (
            <section className="py-12 md:py-16">
              <div className="mx-auto max-w-3xl space-y-8 px-4">
                {body ? (
                  <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground md:text-lg">
                    {body}
                  </p>
                ) : null}
                {whatsIncluded.length > 0 ? (
                  <div className="space-y-4">
                    <h2 className="font-heading text-2xl font-semibold tracking-tight">
                      What&apos;s included
                    </h2>
                    <ul className="space-y-3">
                      {whatsIncluded.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm md:text-base"
                        >
                          <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          {serviceGallery.length > 0 ? (
            <BeforeAfterGallery
              page={page}
              items={serviceGallery}
              selectedCategory={service.title}
              onSelectCategory={() => undefined}
              hideCategoryFilters
            />
          ) : null}

          <section className="bg-muted/30 py-16 md:py-20">
            <div className="mx-auto max-w-xl space-y-6 px-4">
              <div className="space-y-2 text-center">
                <h2 className="font-heading text-3xl font-bold tracking-tight">
                  {page.ctaLabel}
                </h2>
                <p className="text-muted-foreground">
                  Tell us your suburb and we&apos;ll call you back with a quote
                  for {service.title}.
                </p>
              </div>
              <div className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
                <LeadForm
                  page={page}
                  idPrefix="service"
                  formLocation="service"
                  variant="compact"
                  serviceTitle={service.title}
                />
              </div>
            </div>
          </section>
        </main>
        <SiteFooter businessName={page.businessName} phone={page.phone} />
        <StickyMobileBar phone={page.phone} ctaLabel={page.ctaLabel} />
      </LandingPageTheme>
    </>
  );
}
