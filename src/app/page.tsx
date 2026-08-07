import { preloadQuery } from "convex/nextjs";

import { ServiceHub } from "@/components/landing/service-hub";
import { api } from "convex/_generated/api";

export default async function HomePage() {
  const preloadedPages = await preloadQuery(api.landingPages.listPublished);

  return <ServiceHub preloadedPages={preloadedPages} />;
}
