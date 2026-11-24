"use client";

import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { ArrowLeftIcon } from "lucide-react";
import { useRef, useState } from "react";
import { EditorLivePreview } from "@/components/admin/editor-live-preview";
import { EditorToolbar } from "@/components/admin/editor-toolbar";
import { galleryCategoryOptions } from "@/components/admin/fields/gallery-category-field";
import { AnalyticsTab } from "@/components/admin/page-editor/analytics-tab";
import { ContentTab } from "@/components/admin/page-editor/content-tab";
import { GalleryTab } from "@/components/admin/page-editor/gallery-tab";
import { GeneralTab } from "@/components/admin/page-editor/general-tab";
import { HeroTab } from "@/components/admin/page-editor/hero-tab";
import { SeoTab } from "@/components/admin/page-editor/seo-tab";
import { ThankYouTab } from "@/components/admin/page-editor/thank-you-tab";
import { ThemeTab } from "@/components/admin/page-editor/theme-tab";
import type {
  EditorState,
  LoadedPage,
  PersistEditorFields,
  UpdateEditorField,
} from "@/components/admin/page-editor-types";
import { capturePostHogEvent } from "@/components/analytics/posthog";
import { LinkButton } from "@/components/ui/link-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  buildPageUpdates,
  pageUpdatesForPatch,
  saveFailureMessage,
} from "@/lib/editor-page-updates";

type PageEditorLoadedProps = {
  readonly slug: string;
  readonly page: LoadedPage;
  readonly initialState: EditorState;
};

export function PageEditorLoaded({
  slug,
  page,
  initialState,
}: PageEditorLoadedProps) {
  const gallery = useQuery(api.landingPageGallery.listByPageId, {
    pageId: page._id,
  });
  const updatePage = useMutation(api.landingPages.update);
  const publishPage = useMutation(api.landingPages.publish);
  const unpublishPage = useMutation(api.landingPages.unpublish);
  const upsertGallery = useMutation(api.landingPageGallery.upsert);
  const updateGalleryItem = useMutation(api.landingPageGallery.updateItem);
  const removeGallery = useMutation(api.landingPageGallery.remove);

  const [state, setState] = useState<EditorState>(initialState);
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<"neutral" | "error">(
    "neutral",
  );
  const [saving, setSaving] = useState(false);
  const [activeUploads, setActiveUploads] = useState(0);
  const [newBeforeId, setNewBeforeId] = useState<Id<"_storage"> | undefined>();
  const [newAfterId, setNewAfterId] = useState<Id<"_storage"> | undefined>();
  const [newGalleryLabel, setNewGalleryLabel] = useState("");
  const [newGalleryCategory, setNewGalleryCategory] = useState("");
  const [createdGalleryCategories, setCreatedGalleryCategories] = useState<
    string[]
  >([]);
  const stateRef = useRef(initialState);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());

  function handleUploadingChange(uploading: boolean): void {
    setActiveUploads((count) => {
      if (uploading) {
        return count + 1;
      }
      return Math.max(0, count - 1);
    });
  }

  const pageId = page._id;
  const galleryCategories = galleryCategoryOptions(
    state.services.map((service) => service.title),
    gallery?.map((item) => item.category) ?? [],
    createdGalleryCategories,
  );

  function applyPatch(patch: Partial<EditorState>): EditorState {
    const next = { ...stateRef.current, ...patch };
    stateRef.current = next;
    setState(next);
    return next;
  }

  function showStatus(text: string, tone: "neutral" | "error"): void {
    setMessage(text);
    setMessageTone(tone);
  }

  function enqueueSave(run: () => Promise<void>): Promise<void> {
    const next = saveQueue.current.then(run, run);
    saveQueue.current = next.then(
      () => undefined,
      () => undefined,
    );
    return next;
  }

  const updateField: UpdateEditorField = (key, value) => {
    applyPatch({ [key]: value } as Partial<EditorState>);
  };

  const persistFields: PersistEditorFields = (patch) => {
    const drafted = { ...stateRef.current, ...patch };
    const updates = pageUpdatesForPatch(patch, drafted);
    const next = updates.services
      ? { ...drafted, services: updates.services }
      : drafted;
    stateRef.current = next;
    setState(next);
    if (Object.keys(updates).length === 0) {
      return;
    }

    void enqueueSave(async () => {
      try {
        const result = await updatePage({ slug, updates });
        showStatus(
          result.success
            ? "Live page updated."
            : (result.error ?? "Could not update the live page."),
          result.success ? "neutral" : "error",
        );
      } catch (error) {
        showStatus(saveFailureMessage(error), "error");
      }
    });
  };

  async function handleSave(): Promise<void> {
    setSaving(true);
    setMessage(null);
    setMessageTone("neutral");

    try {
      await enqueueSave(async () => {
        const result = await updatePage({
          slug,
          updates: buildPageUpdates(stateRef.current),
        });
        showStatus(
          result.success ? "Saved." : (result.error ?? "Save failed."),
          result.success ? "neutral" : "error",
        );
        if (result.success) {
          capturePostHogEvent("landing_page_saved", { page_slug: slug });
        }
      });
    } catch (error) {
      showStatus(saveFailureMessage(error), "error");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish(): Promise<void> {
    const result = await publishPage({ slug });
    if (result.success) {
      capturePostHogEvent("landing_page_published", { page_slug: slug });
    }
    showStatus(
      result.success ? "Published." : (result.error ?? "Failed."),
      result.success ? "neutral" : "error",
    );
  }

  async function handleUnpublish(): Promise<void> {
    const result = await unpublishPage({ slug });
    if (result.success) {
      capturePostHogEvent("landing_page_unpublished", { page_slug: slug });
    }
    showStatus(
      result.success ? "Unpublished." : (result.error ?? "Failed."),
      result.success ? "neutral" : "error",
    );
  }

  async function handleAddGalleryItem(): Promise<void> {
    if (!newBeforeId || !newAfterId) {
      showStatus("Upload both before and after images.", "error");
      return;
    }

    const sortOrder = gallery?.length ?? 0;
    await upsertGallery({
      pageId,
      sortOrder,
      label: newGalleryLabel.trim() || undefined,
      category: newGalleryCategory.trim() || undefined,
      beforeStorageId: newBeforeId,
      afterStorageId: newAfterId,
    });

    capturePostHogEvent("landing_page_gallery_item_added", {
      page_slug: slug,
    });
    setNewBeforeId(undefined);
    setNewAfterId(undefined);
    setNewGalleryLabel("");
    setNewGalleryCategory("");
    showStatus("Gallery item added.", "neutral");
  }

  async function handleRemoveGalleryItem(
    itemId: Id<"landingPageGallery">,
  ): Promise<void> {
    await removeGallery({ itemId });
    capturePostHogEvent("landing_page_gallery_item_removed", {
      page_slug: slug,
    });
  }

  async function handleUpdateGalleryCategory(
    itemId: Id<"landingPageGallery">,
    category: string,
  ): Promise<void> {
    await updateGalleryItem({
      itemId,
      category,
    });
  }

  function handleCreateGalleryCategory(category: string): void {
    setCreatedGalleryCategories((current) =>
      current.includes(category) ? current : [...current, category],
    );
  }

  return (
    <div className="space-y-4">
      <LinkButton href="/admin" variant="ghost" size="sm" className="-ml-2">
        <ArrowLeftIcon className="size-4" />
        All pages
      </LinkButton>

      <EditorToolbar
        pageName={state.name}
        slug={slug}
        status={page.status}
        saving={saving}
        uploading={activeUploads > 0}
        message={message}
        messageTone={messageTone}
        onSave={handleSave}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
      />

      <Tabs defaultValue="general" className="pt-2">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-muted/40 p-1">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="thank-you">Thank you</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="gallery">Media</TabsTrigger>
          <TabsTrigger value="preview">Live preview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralTab
            state={state}
            updateField={updateField}
            persistFields={persistFields}
          />
        </TabsContent>

        <TabsContent value="seo">
          <SeoTab state={state} updateField={updateField} />
        </TabsContent>

        <TabsContent value="hero">
          <HeroTab
            page={page}
            state={state}
            updateField={updateField}
            persistFields={persistFields}
            onUploadingChange={handleUploadingChange}
          />
        </TabsContent>

        <TabsContent value="content">
          <ContentTab
            page={page}
            state={state}
            updateField={updateField}
            persistFields={persistFields}
            onUploadingChange={handleUploadingChange}
          />
        </TabsContent>

        <TabsContent value="thank-you">
          <ThankYouTab
            state={state}
            updateField={updateField}
            persistFields={persistFields}
          />
        </TabsContent>

        <TabsContent value="theme">
          <ThemeTab state={state} updateField={updateField} />
        </TabsContent>

        <TabsContent value="gallery">
          <GalleryTab
            state={state}
            updateField={updateField}
            gallery={gallery}
            galleryCategories={galleryCategories}
            newGalleryLabel={newGalleryLabel}
            newGalleryCategory={newGalleryCategory}
            newBeforeId={newBeforeId}
            newAfterId={newAfterId}
            onUploadingChange={handleUploadingChange}
            onNewGalleryLabelChange={setNewGalleryLabel}
            onNewGalleryCategoryChange={setNewGalleryCategory}
            onNewBeforeIdChange={setNewBeforeId}
            onNewAfterIdChange={setNewAfterId}
            onCreateGalleryCategory={handleCreateGalleryCategory}
            onAddGalleryItem={() => {
              void handleAddGalleryItem();
            }}
            onRemoveGalleryItem={(itemId) => {
              void handleRemoveGalleryItem(itemId);
            }}
            onUpdateGalleryCategory={(itemId, category) => {
              void handleUpdateGalleryCategory(itemId, category);
            }}
            persistFields={persistFields}
          />
        </TabsContent>

        <TabsContent value="preview" className="space-y-0 pt-6">
          <EditorLivePreview
            page={page}
            state={state}
            gallery={gallery ?? []}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsTab state={state} updateField={updateField} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
