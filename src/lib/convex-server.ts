import { ConvexHttpClient } from "convex/browser";
import { cache } from "react";

import { api } from "../../convex/_generated/api";

function getConvexClient(): ConvexHttpClient | null {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    return null;
  }
  return new ConvexHttpClient(url);
}

export const fetchPublishedPage = cache(async (slug: string) => {
  const client = getConvexClient();
  if (!client) {
    return null;
  }
  return await client.query(api.landingPages.getPublishedBySlug, { slug });
});

export const fetchGalleryBySlug = cache(async (slug: string) => {
  const client = getConvexClient();
  if (!client) {
    return [];
  }
  return await client.query(api.landingPageGallery.listByPageSlug, { slug });
});
