"use client";

import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import type {
  EditorState,
  LoadedPage,
} from "@/components/admin/page-editor-types";
import { LandingPageView } from "@/components/landing/landing-page-view";
import { mergeEditorPreviewPage } from "@/lib/editor-preview-page";
import type { GalleryItem } from "@/lib/types/landing-page";

type EditorLivePreviewProps = {
  readonly page: LoadedPage;
  readonly state: EditorState;
  readonly gallery: readonly GalleryItem[];
};

export function EditorLivePreview({
  page,
  state,
  gallery,
}: EditorLivePreviewProps) {
  const heroImageUrl = useQuery(
    api.landingPages.getStorageUrl,
    state.heroImageStorageId ? { storageId: state.heroImageStorageId } : "skip",
  );
  const heroLogoUrl = useQuery(
    api.landingPages.getStorageUrl,
    state.heroLogoStorageId ? { storageId: state.heroLogoStorageId } : "skip",
  );

  const heroVideoUrl = useQuery(
    api.landingPages.getStorageUrl,
    state.heroVideoStorageId ? { storageId: state.heroVideoStorageId } : "skip",
  );
  const equipmentPhotoUrl = useQuery(
    api.landingPages.getStorageUrl,
    state.equipmentPhotoStorageId
      ? { storageId: state.equipmentPhotoStorageId }
      : "skip",
  );
  const aboutPhotoUrl = useQuery(
    api.landingPages.getStorageUrl,
    state.aboutPhotoStorageId
      ? { storageId: state.aboutPhotoStorageId }
      : "skip",
  );

  const previewPage = mergeEditorPreviewPage(page, state, {
    heroImageUrl,
    heroLogoUrl,
    heroVideoUrl,
    equipmentPhotoUrl,
    aboutPhotoUrl,
  });

  const previewKey = [
    page.updatedAt,
    state.heroHeadline,
    state.heroSubheadline,
    state.heroImageStorageId,
    state.heroLogoStorageId,
    state.heroVideoStorageId,
    state.heroBackgroundKind,
    state.equipmentPhotoStorageId,
    state.aboutHeadline,
    state.aboutBody,
    state.aboutFounderName,
    state.aboutYearsLocal,
    state.aboutJobsCompleted,
    state.aboutPhotoStorageId,
    state.theme.primary,
    state.theme.heroFrom,
    state.theme.heroTo,
    state.theme.accent,
    state.theme.sectionBand,
  ].join("|");

  return (
    <div className="-mx-4 border-y bg-background">
      <div className="bg-sky-100 px-4 py-2 text-center text-sm text-sky-950">
        Live preview — updates as you edit. Save to push changes to the live
        page.
      </div>
      <LandingPageView key={previewKey} page={previewPage} gallery={gallery} />
    </div>
  );
}
