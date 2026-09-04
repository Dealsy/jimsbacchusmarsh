import Script from "next/script";

type GoogleTagManagerProps = {
  readonly containerId?: string;
};

const DEFAULT_CONTAINER_ID = "GTM-TSG7WMTD";

function resolveContainerId(containerId?: string): string | undefined {
  const id =
    containerId ?? process.env.NEXT_PUBLIC_GTM_ID ?? DEFAULT_CONTAINER_ID;
  const trimmed = id.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/** Google Tag Manager — script in the document, noscript immediately after `<body>`. */
export function GoogleTagManager({ containerId }: GoogleTagManagerProps) {
  const id = resolveContainerId(containerId);
  if (!id) {
    return null;
  }

  return (
    <>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${id}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}

export type { GoogleTagManagerProps };
