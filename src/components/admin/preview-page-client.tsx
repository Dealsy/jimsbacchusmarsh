"use client";

import { useQuery } from "convex/react";

import { ReactiveLandingPage } from "@/components/landing/reactive-landing-page";
import { api } from "convex/_generated/api";

type PreviewPageClientProps = {
  readonly slug: string;
};

export function PreviewPageClient({ slug }: PreviewPageClientProps) {
  const page = useQuery(api.landingPages.getBySlugForPreview, { slug });

  return (
    <>
      <div className="bg-amber-100 px-4 py-2 text-center text-sm text-amber-950">
        Admin draft preview —{" "}
        {page === undefined
          ? "loading…"
          : page === null
            ? "not found"
            : page.status === "draft"
              ? "not published"
              : "published"}
        . Updates automatically when you save.
      </div>
      <ReactiveLandingPage slug={slug} variant="preview" />
    </>
  );
}
