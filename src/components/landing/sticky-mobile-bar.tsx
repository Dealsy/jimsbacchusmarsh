"use client";

import { LinkButton } from "@/components/ui/link-button";
import { formatPhoneHref, isPlaceholderPhone } from "@/lib/phone";

type StickyMobileBarProps = {
  readonly phone: string;
  readonly ctaLabel: string;
};

export function StickyMobileBar({ phone, ctaLabel }: StickyMobileBarProps) {
  const showPhone = !isPlaceholderPhone(phone);

  return (
    <div className="fixed inset-x-0 bottom-12 z-50 border-t bg-background/95 p-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-lg gap-2">
        {showPhone ? (
          <LinkButton href={formatPhoneHref(phone)} variant="outline" className="flex-1">
            Call
          </LinkButton>
        ) : null}
        <LinkButton href="#quote-form" className="flex-1">
          {ctaLabel}
        </LinkButton>
      </div>
    </div>
  );
}
