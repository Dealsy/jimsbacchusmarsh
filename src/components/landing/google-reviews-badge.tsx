import { StarIcon } from "lucide-react";

import { GOOGLE_STAR_KEYS, googleStarFill } from "@/lib/google-rating";
import type { PublishedLandingPage } from "@/lib/types/landing-page";
import { cn } from "@/lib/utils";

type GoogleReviewsBadgeProps = {
  readonly page: PublishedLandingPage;
};

function formatReviewCount(count: number): string {
  return new Intl.NumberFormat("en-AU").format(count);
}

function GoogleRatingStars({
  rating,
}: {
  readonly rating: number | undefined;
}) {
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

type GoogleRatingSummaryProps = GoogleReviewsBadgeProps & {
  readonly className?: string;
  readonly countClassName?: string;
};

export function GoogleRatingSummary({
  page,
  className,
  countClassName,
}: GoogleRatingSummaryProps) {
  if (!page.googleReviewUrl?.trim()) {
    return null;
  }

  const rating = page.googleRating;
  const count = page.googleReviewCount;
  const hasRating = typeof rating === "number" && Number.isFinite(rating);
  const hasCount = typeof count === "number" && Number.isFinite(count);

  return (
    <div className={cn("flex flex-wrap items-center gap-2 text-sm", className)}>
      <GoogleRatingStars rating={hasRating ? rating : undefined} />
      {hasRating ? (
        <span className="font-semibold tabular-nums">{rating.toFixed(1)}</span>
      ) : null}
      <span className={cn("font-medium text-primary", countClassName)}>
        {hasCount
          ? `${formatReviewCount(count)} Google reviews`
          : "Google reviews"}
      </span>
    </div>
  );
}
