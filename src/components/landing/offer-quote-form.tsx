"use client";

import { useSearchParams } from "next/navigation";

import { LeadForm } from "@/components/landing/lead-form";
import type { PublishedLandingPage } from "@/lib/types/landing-page";

type OfferQuoteFormProps = {
  readonly page: PublishedLandingPage;
};

export function OfferQuoteForm({ page }: OfferQuoteFormProps) {
  const searchParams = useSearchParams();
  const surface = searchParams.get("surface")?.trim();
  const initialSurfaces =
    surface && page.surfaceOptions.includes(surface) ? [surface] : undefined;

  return (
    <LeadForm
      page={page}
      idPrefix="offer"
      formLocation="offer"
      initialSurfaces={initialSurfaces}
    />
  );
}
