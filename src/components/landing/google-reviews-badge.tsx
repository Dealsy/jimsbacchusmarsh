import { StarIcon } from "lucide-react";

import type { PublishedLandingPage } from "@/lib/types/landing-page";

type GoogleReviewsBadgeProps = {
  readonly page: PublishedLandingPage;
};

const STAR_KEYS = ["one", "two", "three", "four", "five"] as const;

function formatReviewCount(count: number): string {
  return new Intl.NumberFormat("en-AU").format(count);
}

export function GoogleReviewsBadge({ page }: GoogleReviewsBadgeProps) {
  const url = page.googleReviewUrl?.trim();
  if (!url) {
    return null;
  }

  const rating = page.googleRating;
  const count = page.googleReviewCount;
  const hasRating = typeof rating === "number" && Number.isFinite(rating);
  const hasCount = typeof count === "number" && Number.isFinite(count);

  const label = [
    hasRating ? `${rating.toFixed(1)} out of 5` : null,
    hasCount ? `${formatReviewCount(count)} Google reviews` : "Google reviews",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section
      data-landing-section="google-reviews"
      className="border-b bg-background py-3"
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 text-sm text-foreground"
        aria-label={`${label} — opens Google in a new tab`}
      >
        <span className="flex gap-0.5 text-amber-400" aria-hidden>
          {STAR_KEYS.map((key) => (
            <StarIcon key={key} className="size-4 fill-current" />
          ))}
        </span>
        {hasRating ? (
          <span className="font-semibold tabular-nums">
            {rating.toFixed(1)}
          </span>
        ) : null}
        <span className="font-medium text-primary underline-offset-2 hover:underline">
          {hasCount
            ? `${formatReviewCount(count)} Google reviews`
            : "Google reviews"}
        </span>
      </a>
    </section>
  );
}
