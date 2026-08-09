"use client";

import { usePreloadedQuery, type Preloaded } from "convex/react";

import { ComingSoon } from "@/components/landing/coming-soon";
import { LeadSuccessView } from "@/components/landing/lead-success-view";
import { api } from "convex/_generated/api";

type ThankYouPageClientProps = {
  readonly preloadedPage: Preloaded<
    typeof api.landingPages.getPublishedBySlug
  >;
};

export function ThankYouPageClient({ preloadedPage }: ThankYouPageClientProps) {
  const page = usePreloadedQuery(preloadedPage);

  if (page === null) {
    return <ComingSoon />;
  }

  return <LeadSuccessView page={page} />;
}
