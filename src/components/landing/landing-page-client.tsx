"use client";

import { ReactiveLandingPage } from "@/components/landing/reactive-landing-page";

type LandingPageClientProps = {
  readonly slug: string;
};

export function LandingPageClient({ slug }: LandingPageClientProps) {
  return <ReactiveLandingPage slug={slug} variant="published" />;
}
