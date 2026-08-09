import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { preloadQuery } from "convex/nextjs";

import { ThankYouPageClient } from "@/components/landing/thank-you-page-client";
import { fetchPublishedPage } from "@/lib/convex-server";
import { RESERVED_SLUGS } from "@/lib/slug";
import { api } from "convex/_generated/api";

type ThankYouPageProps = {
  readonly params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ThankYouPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (RESERVED_SLUGS.has(slug)) {
    return { title: "Not found" };
  }

  const page = await fetchPublishedPage(slug);

  if (!page) {
    return { title: "Coming Soon" };
  }

  return {
    title: `Thanks — ${page.name}`,
    description: "Your request has been received. We'll be in touch shortly.",
    robots: { index: false, follow: false },
  };
}

export default async function ThankYouPage({ params }: ThankYouPageProps) {
  const { slug } = await params;

  if (RESERVED_SLUGS.has(slug)) {
    notFound();
  }

  const preloadedPage = await preloadQuery(
    api.landingPages.getPublishedBySlug,
    { slug },
  );

  return <ThankYouPageClient preloadedPage={preloadedPage} />;
}
