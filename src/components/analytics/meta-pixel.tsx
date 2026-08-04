"use client";

import Script from "next/script";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type MetaPixelProps = {
  readonly pixelId?: string;
};

export function MetaPixel({ pixelId }: MetaPixelProps) {
  if (!pixelId) {
    return null;
  }

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_AU/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
    </>
  );
}

export function trackMetaLead(): void {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Lead");
  }
}
