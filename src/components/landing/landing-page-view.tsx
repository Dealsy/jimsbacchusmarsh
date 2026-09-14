"use client";

import { useState } from "react";

import { GoogleAds } from "@/components/analytics/google-ads";
import { LandingPageAnalytics } from "@/components/analytics/landing-page-analytics";
import { MetaPixel } from "@/components/analytics/meta-pixel";
import { AboutUsSection } from "@/components/landing/about-us-section";
import { BeforeAfterGallery } from "@/components/landing/before-after-gallery";
import { CloseSection } from "@/components/landing/close-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FinalCta } from "@/components/landing/final-cta";
import { GoogleReviewsBadge } from "@/components/landing/google-reviews-badge";
import { GuaranteeSection } from "@/components/landing/guarantee-section";
import { Hero, TrustStrip } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingPageTheme } from "@/components/landing/landing-page-theme";
import { OfferStackSection } from "@/components/landing/offer-stack-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { ReviewsWedgeBlock } from "@/components/landing/reviews-wedge-block";
import { ServicesGrid } from "@/components/landing/services-grid";
import { SiteFooter } from "@/components/landing/site-footer";
import { StickyMobileBar } from "@/components/landing/sticky-mobile-bar";
import type {
  GalleryItem,
  PublishedLandingPage,
} from "@/lib/types/landing-page";

type LandingPageViewProps = {
  readonly page: PublishedLandingPage;
  readonly gallery: readonly GalleryItem[];
};

export function LandingPageView({ page, gallery }: LandingPageViewProps) {
  const metaPixelId = page.metaPixelId ?? process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const googleAdsId = page.googleAdsId ?? process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const [galleryCategory, setGalleryCategory] = useState<string | null>(null);

  return (
    <>
      <LandingPageAnalytics pageSlug={page.slug} />
      <MetaPixel pixelId={metaPixelId} />
      <GoogleAds adsId={googleAdsId} />
      <LandingPageTheme theme={page.theme}>
        <main className="pb-28 md:pb-14">
          <Hero page={page} />
          <TrustStrip page={page} />
          <GoogleReviewsBadge page={page} />
          <ProblemSection page={page} />
          <ReviewsWedgeBlock page={page} />
          <HowItWorks page={page} />
          <BeforeAfterGallery
            page={page}
            items={gallery}
            selectedCategory={galleryCategory}
            onSelectCategory={setGalleryCategory}
          />
          <OfferStackSection page={page} />
          <ServicesGrid page={page} />
          <GuaranteeSection page={page} />
          <AboutUsSection page={page} />
          <FaqSection page={page} />
          <FinalCta page={page} />
          <CloseSection page={page} />
        </main>
        <SiteFooter
          businessName={page.businessName}
          phone={page.phone}
          hideOnMobile
        />
        <StickyMobileBar
          phone={page.phone}
          ctaLabel={page.ctaLabel}
          businessName={page.businessName}
        />
      </LandingPageTheme>
    </>
  );
}
