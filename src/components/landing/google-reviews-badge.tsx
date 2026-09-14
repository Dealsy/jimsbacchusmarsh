import { StarIcon } from "lucide-react";

import {
  GOOGLE_STAR_KEYS,
  googleStarFill,
} from "@/lib/google-rating";
import type { PublishedLandingPage } from "@/lib/types/landing-page";

type GoogleReviewsBadgeProps = {
  readonly page: PublishedLandingPage;
};

function formatReviewCount(count: number): string {
  return new Intl.NumberFormat("en-AU").format(count);
}

function GoogleRatingStars({ rating }: { readonly rating: number | undefined }) {
  const hasRating = typeof rating === "number" && Number.isFinite(rating);

  return (
    <span className="flex gap-0.5 text-amber-400" aria-hidden>
      {GOOGLE_STAR_KEYS.map((key, index) => {
        const fill = hasRating ? googleStarFill(rating, index) : 1;

        return (
          <span key={key} className="relative size-4 shrink-0">
            <StarIcon className="size-4 text-amber-400/30" />
            <span
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <StarIcon className="size-4 fill-current text-amber-400" />
            </span>
          </span>
        );
      })}
    </span>
  );
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
        <GoogleRatingStars rating={hasRating ? rating : undefined} />
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
