"use client";

import { BeforeAfterSlider } from "@/components/landing/before-after-slider";
import type {
  GalleryItem,
  PublishedLandingPage,
} from "@/lib/types/landing-page";
import { cn } from "@/lib/utils";

type MobileResultPeekProps = {
  readonly page: PublishedLandingPage;
  readonly items: readonly GalleryItem[];
  readonly className?: string;
};

export function MobileResultPeek({
  page,
  items,
  className,
}: MobileResultPeekProps) {
  const item =
    items.find((candidate) => candidate.beforeUrl && candidate.afterUrl) ??
    items[0];

  if (!item) {
    return null;
  }

  return (
    <section className={cn("bg-background px-4 pt-8 pb-6 md:hidden", className)}>
      <div className="mx-auto max-w-lg space-y-3">
        <p className="text-center font-heading text-xl font-semibold">
          See the difference
        </p>
        <figure className="space-y-2">
          <BeforeAfterSlider
            beforeUrl={item.beforeUrl}
            afterUrl={item.afterUrl}
            beforeAlt={`Before — ${item.label ?? page.name}`}
            afterAlt={`After — ${item.label ?? page.name}`}
            onOpenLightbox={() =>
              document
                .getElementById("gallery")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          />
          {item.label ? (
            <figcaption className="text-center text-sm font-medium">
              {item.label}
            </figcaption>
          ) : null}
        </figure>
        <p className="text-center">
          <a
            href="#gallery"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            More before and afters
          </a>
        </p>
      </div>
    </section>
  );
}
