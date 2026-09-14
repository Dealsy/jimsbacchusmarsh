/**
 * Match a service card title to a lead-form surface option.
 * Prefers an exact match, then the longest includes match
 * (e.g. "Driveways & Paths" → "Driveway").
 */
export function matchSurfaceOption(
  serviceTitle: string,
  surfaceOptions: readonly string[],
): string | null {
  const normalizedTitle = serviceTitle.trim().toLowerCase();
  if (!normalizedTitle) {
    return null;
  }

  let best: string | null = null;
  let bestLength = 0;

  for (const option of surfaceOptions) {
    const normalizedOption = option.trim().toLowerCase();
    if (!normalizedOption) {
      continue;
    }

    if (normalizedOption === normalizedTitle) {
      return option;
    }

    if (
      normalizedTitle.includes(normalizedOption) ||
      normalizedOption.includes(normalizedTitle)
    ) {
      if (normalizedOption.length > bestLength) {
        best = option;
        bestLength = normalizedOption.length;
      }
    }
  }

  return best;
}

export function serviceQuoteHref(
  pageSlug: string,
  serviceTitle: string,
  surfaceOptions: readonly string[],
): string {
  const matched = matchSurfaceOption(serviceTitle, surfaceOptions);
  if (!matched) {
    return `/${pageSlug}#quote-form`;
  }

  return `/${pageSlug}?surface=${encodeURIComponent(matched)}#quote-form`;
}
