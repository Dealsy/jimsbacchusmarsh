import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LandingPageClient } from "@/components/landing/landing-page-client";
import { fetchPublishedPage } from "@/lib/convex-server";

const RESERVED_SLUGS = new Set(["admin", "sign-in", "sign-up", "api"]);

type LandingSlugPageProps = {
  readonly params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: LandingSlugPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (RESERVED_SLUGS.has(slug)) {
    return { title: "Not found" };
  }

  const page = await fetchPublishedPage(slug);

  if (!page) {
    return {
      title: "Coming Soon",
    };
  }

  return {
    title: page.seoTitle,
    description: page.seoDescription,
    openGraph: {
      title: page.seoTitle,
      description: page.seoDescription,
    },
  };
}

export default async function LandingSlugPage({ params }: LandingSlugPageProps) {
  const { slug } = await params;

  if (RESERVED_SLUGS.has(slug)) {
    notFound();
  }

  return <LandingPageClient slug={slug} />;
}
