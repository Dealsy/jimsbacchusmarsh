import type { GalleryItem, PublishedLandingPage } from "@/lib/types/landing-page";

type CachedLanding = {
  readonly page: PublishedLandingPage;
  readonly gallery: readonly GalleryItem[];
};

const landingCache = new Map<string, CachedLanding>();

function cacheKey(slug: string, variant: "published" | "preview"): string {
  return `${variant}:${slug}`;
}

export function readLandingCache(
  slug: string,
  variant: "published" | "preview",
): CachedLanding | undefined {
  return landingCache.get(cacheKey(slug, variant));
}

export function writeLandingCache(
  slug: string,
  variant: "published" | "preview",
  data: CachedLanding,
): void {
  landingCache.set(cacheKey(slug, variant), data);
}
