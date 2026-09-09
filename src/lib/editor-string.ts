export function trimStringList(values: readonly string[]): string[] {
  return values.map((value) => value.trim()).filter(Boolean);
}

export function optionalTrim(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed || undefined;
}

export function parseGoogleRating(value: string): number | undefined {
  const parsed = Number.parseFloat(value.trim());
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 5) {
    return undefined;
  }
  return parsed;
}

export function parseGoogleReviewCount(value: string): number | undefined {
  const parsed = Number.parseInt(value.trim(), 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return undefined;
  }
  return parsed;
}
