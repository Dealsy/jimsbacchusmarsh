"use client";

import { LandingPageTheme } from "@/components/landing/landing-page-theme";
import { BeforeAfterGallery } from "@/components/landing/before-after-gallery";
import { FaqSection } from "@/components/landing/faq-section";
import { FinalCta } from "@/components/landing/final-cta";
import { Hero, TrustStrip } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CloseSection } from "@/components/landing/close-section";
import { GuaranteeSection } from "@/components/landing/guarantee-section";
import { OfferStackSection } from "@/components/landing/offer-stack-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { ServicesGrid } from "@/components/landing/services-grid";
import { SiteFooter } from "@/components/landing/site-footer";
import { StickyMobileBar } from "@/components/landing/sticky-mobile-bar";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { WedgeSection } from "@/components/landing/wedge-section";
import { GoogleAds } from "@/components/analytics/google-ads";
import { MetaPixel } from "@/components/analytics/meta-pixel";
import type { GalleryItem, PublishedLandingPage } from "@/lib/types/landing-page";

type LandingPageViewProps = {
  readonly page: PublishedLandingPage;
  readonly gallery: readonly GalleryItem[];
};

export function LandingPageView({ page, gallery }: LandingPageViewProps) {
  const metaPixelId =
    page.metaPixelId ?? process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const googleAdsId = page.googleAdsId ?? process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

  return (
    <>
      <MetaPixel pixelId={metaPixelId} />
      <GoogleAds adsId={googleAdsId} />
      <LandingPageTheme theme={page.theme}>
        <main className="pb-32 md:pb-14">
          <Hero page={page} />
          <TrustStrip page={page} />
          <ProblemSection page={page} />
          <WedgeSection page={page} />
          <OfferStackSection page={page} />
          <ServicesGrid page={page} />
          <BeforeAfterGallery page={page} items={gallery} />
          <TestimonialsSection page={page} />
          <GuaranteeSection page={page} />
          <HowItWorks page={page} />
          <FaqSection page={page} />
          <FinalCta page={page} />
          <CloseSection page={page} />
        </main>
        <SiteFooter businessName={page.businessName} phone={page.phone} />
        <StickyMobileBar phone={page.phone} ctaLabel={page.ctaLabel} />
      </LandingPageTheme>
    </>
  );
}
