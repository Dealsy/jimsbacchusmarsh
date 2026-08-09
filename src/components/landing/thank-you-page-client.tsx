"use client";

import type { api } from "convex/_generated/api";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { ComingSoon } from "@/components/landing/coming-soon";
import { LeadSuccessView } from "@/components/landing/lead-success-view";

type ThankYouPageClientProps = {
  readonly preloadedPage: Preloaded<typeof api.landingPages.getPublishedBySlug>;
};

export function ThankYouPageClient({ preloadedPage }: ThankYouPageClientProps) {
  const page = usePreloadedQuery(preloadedPage);

  if (page === null) {
    return <ComingSoon />;
  }

  return <LeadSuccessView page={page} />;
}
