"use client";

import Script from "next/script";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type GoogleTagProps = {
  readonly measurementId?: string;
};

/** Site-wide Google tag (GA4) — load once in the root layout. */
export function GoogleTag({ measurementId }: GoogleTagProps) {
  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}

/** Fired on thank-you page — use as GA4/Google Ads lead conversion. */
export function trackGoogleLead(pageSlug?: string): void {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }

  window.gtag("event", "generate_lead", {
    event_category: "lead_form",
    page_slug: pageSlug,
  });
}

export type { GoogleTagProps };
