"use client";

import { useEffect, useRef } from "react";

import { trackGoogleConversion } from "@/components/analytics/google-ads";
import { trackGoogleLead } from "@/components/analytics/google-tag";
import { trackMetaLead } from "@/components/analytics/meta-pixel";
import { capturePostHogEvent } from "@/components/analytics/posthog";
import type { PublishedLandingPage } from "@/lib/types/landing-page";

type ThankYouAnalyticsProps = {
  readonly page: PublishedLandingPage;
};

/** Fire lead conversion events once when the thank-you page loads. */
export function ThankYouAnalytics({ page }: ThankYouAnalyticsProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) {
      return;
    }
    tracked.current = true;

    capturePostHogEvent("thank_you_viewed", {
      page_slug: page.slug,
      service_type: page.leadServiceType,
    });
    trackGoogleLead(page.slug);
    trackMetaLead();
    trackGoogleConversion(
      page.googleAdsId ?? process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
      page.googleConversionLabel ??
        process.env.NEXT_PUBLIC_GOOGLE_CONVERSION_LABEL,
    );
  }, [
    page.slug,
    page.leadServiceType,
    page.googleAdsId,
    page.googleConversionLabel,
  ]);

  return null;
}
