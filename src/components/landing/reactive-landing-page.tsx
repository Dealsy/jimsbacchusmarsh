"use client";

import { useQuery } from "convex/react";
import { useEffect } from "react";

import { ComingSoon } from "@/components/landing/coming-soon";
import { LandingPageSkeleton } from "@/components/landing/landing-page-skeleton";
import { LandingPageView } from "@/components/landing/landing-page-view";
import {
  readLandingCache,
  writeLandingCache,
} from "@/lib/landing-query-cache";
import { api } from "convex/_generated/api";

type ReactiveLandingPageProps = {
  readonly slug: string;
  readonly variant: "published" | "preview";
};

export function ReactiveLandingPage({
  slug,
  variant,
}: ReactiveLandingPageProps) {
  const publishedPage = useQuery(
    api.landingPages.getPublishedBySlug,
    variant === "published" ? { slug } : "skip",
  );
  const previewPage = useQuery(
    api.landingPages.getBySlugForPreview,
    variant === "preview" ? { slug } : "skip",
  );
  const publishedGallery = useQuery(
    api.landingPageGallery.listByPageSlug,
    variant === "published" ? { slug } : "skip",
  );
  const previewGallery = useQuery(
    api.landingPageGallery.listByPageSlug,
    variant === "preview" ? { slug, includeDraft: true } : "skip",
  );

  const page = variant === "published" ? publishedPage : previewPage;
  const gallery = variant === "published" ? publishedGallery : previewGallery;
  const cached = readLandingCache(slug, variant);

  useEffect(() => {
    if (page && gallery) {
      writeLandingCache(slug, variant, { page, gallery });
    }
  }, [gallery, page, slug, variant]);

  if (page === undefined || gallery === undefined) {
    if (cached) {
      return (
        <LandingPageView
          key={cached.page.updatedAt}
          page={cached.page}
          gallery={cached.gallery}
        />
      );
    }

    return <LandingPageSkeleton />;
  }

  if (page === null) {
    if (variant === "published") {
      return <ComingSoon />;
    }

    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Page not found.</p>
      </main>
    );
  }

  return (
    <LandingPageView
      key={page.updatedAt}
      page={page}
      gallery={gallery}
    />
  );
}
