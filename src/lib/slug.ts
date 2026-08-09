export const RESERVED_SLUGS = new Set(["admin", "sign-in", "sign-up", "api"]);

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function isValidSlug(slug: string): boolean {
  if (slug.length < 2 || slug.length > 64) {
    return false;
  }
  return SLUG_PATTERN.test(slug);
}

export function describeSlugError(slug: string): string | null {
  if (!slug) {
    return "URL slug is required.";
  }
  if (!isValidSlug(slug)) {
    return "Use lowercase letters, numbers, and hyphens only (e.g. gutter-cleaning).";
  }
  if (RESERVED_SLUGS.has(slug)) {
    return `"${slug}" is reserved and cannot be used.`;
  }
  return null;
}
