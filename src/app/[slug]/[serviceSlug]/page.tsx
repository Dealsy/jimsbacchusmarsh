import { api } from "convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePageClient } from "@/components/landing/service-page-client";
import { fetchPublishedPage } from "@/lib/convex-server";
import {
  findServiceBySlug,
  isReservedChildSlug,
} from "@/lib/landing-page-content";
import { RESERVED_SLUGS } from "@/lib/slug";

type ServiceSlugPageProps = {
  readonly params: Promise<{ slug: string; serviceSlug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ServiceSlugPageProps): Promise<Metadata> {
  const { slug, serviceSlug } = await params;

  if (RESERVED_SLUGS.has(slug) || isReservedChildSlug(serviceSlug)) {
    return { title: "Not found" };
  }

  const page = await fetchPublishedPage(slug);
  const service = page ? findServiceBySlug(page.services, serviceSlug) : null;

  if (!page || !service) {
    return { title: "Not found" };
  }

  const title = service.pageHeadline?.trim() || service.title;
  const description =
    service.pageIntro?.trim() ||
    service.description ||
    `${service.title} — ${page.name}`;

  return {
    title: `${title} | ${page.name}`,
    description,
    openGraph: {
      title: `${title} | ${page.name}`,
      description,
    },
  };
}

export default async function ServiceSlugPage({
  params,
}: ServiceSlugPageProps) {
  const { slug, serviceSlug } = await params;

  if (RESERVED_SLUGS.has(slug) || isReservedChildSlug(serviceSlug)) {
    notFound();
  }

  const page = await fetchPublishedPage(slug);
  if (page && !findServiceBySlug(page.services, serviceSlug)) {
    notFound();
  }

  const [preloadedPage, preloadedGallery] = await Promise.all([
    preloadQuery(api.landingPages.getPublishedBySlug, { slug }),
    preloadQuery(api.landingPageGallery.listByPageSlug, { slug }),
  ]);

  return (
    <ServicePageClient
      serviceSlug={serviceSlug}
      preloadedPage={preloadedPage}
      preloadedGallery={preloadedGallery}
    />
  );
}
