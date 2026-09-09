"use client";

import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
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
  UpdateEditorField,
} from "@/components/admin/page-editor-types";
import { capturePostHogEvent } from "@/components/analytics/posthog";
import { LinkButton } from "@/components/ui/link-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  sanitizeClose,
  sanitizeFaq,
  sanitizeGuarantee,
  sanitizeHowItWorks,
  sanitizeOffer,
  sanitizeServices,
  sanitizeTestimonials,
  sanitizeThankYou,
  sanitizeTheme,
  sanitizeUrgency,
} from "@/lib/editor-sanitize";
import {
  optionalTrim,
  parseGoogleRating,
  parseGoogleReviewCount,
  trimStringList,
} from "@/lib/editor-string";

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
  const [saving, setSaving] = useState(false);
  const [activeUploads, setActiveUploads] = useState(0);
  const [newBeforeId, setNewBeforeId] = useState<Id<"_storage"> | undefined>();
  const [newAfterId, setNewAfterId] = useState<Id<"_storage"> | undefined>();
  const [newGalleryLabel, setNewGalleryLabel] = useState("");
  const [newGalleryCategory, setNewGalleryCategory] = useState("");
  const [createdGalleryCategories, setCreatedGalleryCategories] = useState<
    string[]
  >([]);

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

  const updateField: UpdateEditorField = (key, value) => {
    setState((current) => ({ ...current, [key]: value }));
  };

  async function handleSave(): Promise<void> {
    const currentState = state;
    setSaving(true);
    setMessage(null);

    try {
      const result = await updatePage({
        slug,
        updates: {
          name: currentState.name.trim(),
          seoTitle: currentState.seoTitle.trim(),
          seoDescription: currentState.seoDescription.trim(),
          businessName: currentState.businessName.trim(),
          phone: currentState.phone.trim(),
          serviceAreas: trimStringList(currentState.serviceAreas),
          offerText: sanitizeOffer(currentState.offer).headline,
          ctaLabel: currentState.ctaLabel.trim(),
          hero: {
            headline: currentState.heroHeadline.trim(),
            subheadline: currentState.heroSubheadline.trim(),
            trustStrip: trimStringList(currentState.trustStrip),
            imageStorageId: currentState.heroImageStorageId,
            logoStorageId: currentState.heroLogoStorageId,
            audienceCallout:
              currentState.heroAudienceCallout.trim() || undefined,
            intrigueBullets: trimStringList(currentState.heroIntrigueBullets),
          },
          problem: { body: currentState.problemBody.trim() },
          wedge: {
            headline: optionalTrim(currentState.wedgeHeadline),
            description: optionalTrim(currentState.wedgeDescription),
            negativeTitle: optionalTrim(currentState.wedgeNegativeTitle),
            positiveTitle: optionalTrim(currentState.wedgePositiveTitle),
            pressureWashPoints: trimStringList(currentState.pressurePoints),
            softwashPoints: trimStringList(currentState.softwashPoints),
          },
          offer: sanitizeOffer(currentState.offer),
          guarantee: sanitizeGuarantee(currentState.guarantee),
          urgency: sanitizeUrgency(currentState.urgency),
          close: sanitizeClose(currentState.close),
          thankYou: (() => {
            const sanitized = sanitizeThankYou(currentState.thankYou);
            return {
              headline: sanitized.headline,
              body: sanitized.body,
              phonePrompt: sanitized.phonePrompt,
              nextStepsTitle: sanitized.nextStepsTitle,
              useHowItWorksSteps: sanitized.useHowItWorksSteps,
              nextSteps: sanitized.useHowItWorksSteps
                ? undefined
                : sanitized.nextSteps,
            };
          })(),
          services: sanitizeServices(currentState.services),
          howItWorks: sanitizeHowItWorks(currentState.howItWorks),
          faq: sanitizeFaq(currentState.faq),
          testimonials: sanitizeTestimonials(currentState.testimonials),
          metaPixelId: currentState.metaPixelId.trim() || undefined,
          googleAdsId: currentState.googleAdsId.trim() || undefined,
          googleConversionLabel:
            currentState.googleConversionLabel.trim() || undefined,
          googleReviewUrl: currentState.googleReviewUrl.trim() || undefined,
          googleRating: parseGoogleRating(currentState.googleRating),
          googleReviewCount: parseGoogleReviewCount(
            currentState.googleReviewCount,
          ),
          leadServiceType: currentState.leadServiceType.trim(),
          surfaceOptions: trimStringList(currentState.surfaceOptions),
          reasonQuestion: currentState.reasonQuestion.trim() || undefined,
          reasonOptions: trimStringList(currentState.reasonOptions),
          servicesSectionTitle: optionalTrim(currentState.servicesSectionTitle),
          servicesSectionDescription: optionalTrim(
            currentState.servicesSectionDescription,
          ),
          gallerySectionTitle: optionalTrim(currentState.gallerySectionTitle),
          gallerySectionDescription: optionalTrim(
            currentState.gallerySectionDescription,
          ),
          theme: sanitizeTheme(currentState.theme),
        },
      });

      setMessage(result.success ? "Saved." : (result.error ?? "Save failed."));
      if (result.success) {
        capturePostHogEvent("landing_page_saved", { page_slug: slug });
      }
    } catch {
      setMessage("Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish(): Promise<void> {
    const result = await publishPage({ slug });
    if (result.success) {
      capturePostHogEvent("landing_page_published", { page_slug: slug });
    }
    setMessage(result.success ? "Published." : (result.error ?? "Failed."));
  }

  async function handleUnpublish(): Promise<void> {
    const result = await unpublishPage({ slug });
    if (result.success) {
      capturePostHogEvent("landing_page_unpublished", { page_slug: slug });
    }
    setMessage(result.success ? "Unpublished." : (result.error ?? "Failed."));
  }

  async function handleAddGalleryItem(): Promise<void> {
    if (!newBeforeId || !newAfterId) {
      setMessage("Upload both before and after images.");
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
    setMessage("Gallery item added.");
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
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="preview">Live preview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralTab state={state} updateField={updateField} />
        </TabsContent>

        <TabsContent value="seo">
          <SeoTab state={state} updateField={updateField} />
        </TabsContent>

        <TabsContent value="hero">
          <HeroTab
            page={page}
            state={state}
            updateField={updateField}
            onUploadingChange={handleUploadingChange}
          />
        </TabsContent>

        <TabsContent value="content">
          <ContentTab state={state} updateField={updateField} />
        </TabsContent>

        <TabsContent value="thank-you">
          <ThankYouTab state={state} updateField={updateField} />
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
