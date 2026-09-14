export const GOOGLE_STAR_KEYS = ["one", "two", "three", "four", "five"] as const;

export function clampGoogleRating(rating: number): number {
  if (!Number.isFinite(rating)) {
    return 0;
  }

  return Math.min(5, Math.max(0, rating));
}

export function googleStarFill(rating: number, starIndex: number): number {
  return Math.min(1, Math.max(0, clampGoogleRating(rating) - starIndex));
}
