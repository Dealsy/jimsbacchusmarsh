"use client";

import type { api } from "convex/_generated/api";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { ComingSoon } from "@/components/landing/coming-soon";
import { ServicePageView } from "@/components/landing/service-page-view";
import { findServiceBySlug } from "@/lib/landing-page-content";

type ServicePageClientProps = {
  readonly serviceSlug: string;
  readonly preloadedPage: Preloaded<typeof api.landingPages.getPublishedBySlug>;
  readonly preloadedGallery: Preloaded<
    typeof api.landingPageGallery.listByPageSlug
  >;
};

export function ServicePageClient({
  serviceSlug,
  preloadedPage,
  preloadedGallery,
}: ServicePageClientProps) {
  const page = usePreloadedQuery(preloadedPage);
  const gallery = usePreloadedQuery(preloadedGallery);

  if (page === null) {
    return <ComingSoon />;
  }

  const service = findServiceBySlug(page.services, serviceSlug);
  if (!service) {
    return <ComingSoon />;
  }

  return (
    <ServicePageView
      key={`${page.updatedAt}-${serviceSlug}`}
      page={page}
      service={service}
      gallery={gallery}
    />
  );
}
