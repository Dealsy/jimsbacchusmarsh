"use client";

import type { api } from "convex/_generated/api";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { ComingSoon } from "@/components/landing/coming-soon";
import { LandingPageView } from "@/components/landing/landing-page-view";

type LandingPageClientProps = {
  readonly preloadedPage: Preloaded<typeof api.landingPages.getPublishedBySlug>;
  readonly preloadedGallery: Preloaded<
    typeof api.landingPageGallery.listByPageSlug
  >;
};

export function LandingPageClient({
  preloadedPage,
  preloadedGallery,
}: LandingPageClientProps) {
  const page = usePreloadedQuery(preloadedPage);
  const gallery = usePreloadedQuery(preloadedGallery);

  if (page === null) {
    return <ComingSoon />;
  }

  return <LandingPageView key={page.updatedAt} page={page} gallery={gallery} />;
}
