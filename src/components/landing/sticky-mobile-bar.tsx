"use client";

import { LinkButton } from "@/components/ui/link-button";
import { formatPhoneHref, isPlaceholderPhone } from "@/lib/phone";

type StickyMobileBarProps = {
  readonly phone: string;
  readonly ctaLabel: string;
  readonly businessName: string;
};

export function StickyMobileBar({
  phone,
  ctaLabel,
  businessName,
}: StickyMobileBarProps) {
  const showPhone = !isPlaceholderPhone(phone);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <p className="mb-2 text-center text-xs text-muted-foreground">
        {businessName}
        {showPhone ? ` · ${phone}` : ""}
      </p>
      <div className="mx-auto flex max-w-lg gap-2">
        {showPhone ? (
          <LinkButton
            href={formatPhoneHref(phone)}
            variant="outline"
            className="flex-1"
          >
            Call
          </LinkButton>
        ) : null}
        <LinkButton
          href="#quote-form"
          landingCtaLocation="sticky_bar"
          className="flex-1"
        >
          {ctaLabel}
        </LinkButton>
      </div>
    </div>
  );
}
