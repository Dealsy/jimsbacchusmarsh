"use client";

import { useQuery } from "convex/react";

import { ComingSoon } from "@/components/landing/coming-soon";
import { LandingPageView } from "@/components/landing/landing-page-view";
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

  if (page === undefined || gallery === undefined) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </main>
    );
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
