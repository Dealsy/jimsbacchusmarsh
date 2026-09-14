const AVATAR_COLORS = [
  "bg-rose-400",
  "bg-sky-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-orange-500",
] as const;

const REVIEW_QUOTE_TOGGLE_CHARS = 110;

export function authorInitials(author: string): string {
  const parts = author.trim().split(/\s+/).filter(Boolean);
  const first = parts[0];
  if (!first) {
    return "?";
  }
  const last = parts.length > 1 ? parts[parts.length - 1] : undefined;
  const initials = last
    ? `${first[0] ?? ""}${last[0] ?? ""}`
    : first.slice(0, 2);
  return initials.toUpperCase() || "?";
}

export function avatarColorClass(author: string): string {
  let hash = 0;
  for (const character of author) {
    hash = (hash + character.charCodeAt(0)) % AVATAR_COLORS.length;
  }
  return AVATAR_COLORS[hash] ?? "bg-rose-400";
}

export function reviewQuoteNeedsToggle(quote: string): boolean {
  return quote.trim().length > REVIEW_QUOTE_TOGGLE_CHARS;
}

export function testimonialsSubtitle(serviceAreas: readonly string[]): string {
  const namedAreas = serviceAreas
    .map((area) => area.trim())
    .filter((area) => area.length > 0);
  const preview = namedAreas.slice(0, 3);

  if (preview.length === 0) {
    return "Real feedback from local homeowners.";
  }

  const listed = preview.join(", ");
  if (namedAreas.length > 3) {
    return `Real feedback from homeowners across ${listed} and surrounds.`;
  }

  return `Real feedback from homeowners across ${listed}.`;
}
