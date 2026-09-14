/**
 * Split a middot-separated guarantee body into badge labels.
 * Returns null when there are fewer than two segments.
 */
export function guaranteeBadgeLabels(body: string): string[] | null {
  const parts = body
    .split("·")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  return parts.length >= 2 ? parts : null;
}
