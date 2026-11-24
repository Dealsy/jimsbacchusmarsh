"use client";

import { ArrowRightIcon, PhoneIcon } from "lucide-react";

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
    <div className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 rounded-3xl bg-background/85 p-2 shadow-float ring-1 ring-black/10 backdrop-blur-xl md:hidden">
      <p className="mb-1.5 truncate px-2 text-center text-[0.6875rem] font-medium text-muted-foreground">
        {businessName}
        {showPhone ? ` · ${phone}` : ""}
      </p>
      <div className="flex gap-2">
        {showPhone ? (
          <LinkButton
            href={formatPhoneHref(phone)}
            variant="outline"
            className="h-11 shrink-0 rounded-2xl bg-background px-4"
          >
            <PhoneIcon data-icon="inline-start" />
            Call
          </LinkButton>
        ) : null}
        <LinkButton
          href="#quote-form"
          landingCtaLocation="sticky_bar"
          className="h-11 flex-1 rounded-2xl text-[0.9375rem] font-semibold shadow-lg shadow-primary/30"
        >
          {ctaLabel}
          <ArrowRightIcon data-icon="inline-end" />
        </LinkButton>
      </div>
    </div>
  );
}
