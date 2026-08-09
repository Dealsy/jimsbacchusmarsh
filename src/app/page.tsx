import { api } from "convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { ServiceHub } from "@/components/landing/service-hub";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const preloadedPages = await preloadQuery(api.landingPages.listPublished);

  return <ServiceHub preloadedPages={preloadedPages} />;
}
