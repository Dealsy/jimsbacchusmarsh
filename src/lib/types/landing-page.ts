import type { api } from "convex/_generated/api";
import type { FunctionReturnType } from "convex/server";

export type PublishedLandingPage = NonNullable<
  FunctionReturnType<typeof api.landingPages.getPublishedBySlug>
>;

export type GalleryItem = FunctionReturnType<
  typeof api.landingPageGallery.listByPageSlug
>[number];
