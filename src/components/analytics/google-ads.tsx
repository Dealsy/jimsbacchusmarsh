"use client";

import Script from "next/script";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type GoogleAdsProps = {
  readonly adsId?: string;
  readonly conversionLabel?: string;
};

export function GoogleAds({ adsId }: GoogleAdsProps) {
  if (!adsId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${adsId}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${adsId}');
        `}
      </Script>
    </>
  );
}

export function trackGoogleConversion(
  adsId?: string,
  conversionLabel?: string,
): void {
  if (
    typeof window === "undefined" ||
    !window.gtag ||
    !adsId ||
    !conversionLabel
  ) {
    return;
  }

  window.gtag("event", "conversion", {
    send_to: `${adsId}/${conversionLabel}`,
  });
}

export type { GoogleAdsProps };
