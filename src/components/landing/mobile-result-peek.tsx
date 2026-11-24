"use client";

import { ArrowDownIcon } from "lucide-react";

import { BeforeAfterSlider } from "@/components/landing/before-after-slider";
import { Eyebrow } from "@/components/landing/shell/section-heading";
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
    <section
      className={cn("bg-background px-5 pt-10 pb-6 md:hidden", className)}
    >
      <div className="mx-auto max-w-lg space-y-4">
        <div className="space-y-2 text-center">
          <Eyebrow>Real results</Eyebrow>
          <p className="font-heading text-2xl font-bold tracking-tight">
            See the difference
          </p>
        </div>
        <figure className="space-y-2.5">
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
            <figcaption className="text-center text-sm font-medium text-muted-foreground">
              {item.label}
            </figcaption>
          ) : null}
        </figure>
        <p className="text-center">
          <a
            href="#gallery"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
          >
            More before and afters
            <ArrowDownIcon className="size-4" />
          </a>
        </p>
      </div>
    </section>
  );
}
