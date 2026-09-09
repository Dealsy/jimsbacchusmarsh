import type { Id } from "convex/_generated/dataModel";

import { GalleryCategoryField } from "@/components/admin/fields/gallery-category-field";
import { ImageUpload } from "@/components/admin/image-upload";
import type {
  EditorState,
  UpdateEditorField,
} from "@/components/admin/page-editor-types";
import { SectionCard, TabIntro } from "@/components/admin/section-card";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { GalleryItem } from "@/lib/types/landing-page";

type GalleryTabProps = {
  readonly state: EditorState;
  readonly updateField: UpdateEditorField;
  readonly gallery: readonly GalleryItem[] | undefined;
  readonly galleryCategories: readonly string[];
  readonly newGalleryLabel: string;
  readonly newGalleryCategory: string;
  readonly newBeforeId: Id<"_storage"> | undefined;
  readonly newAfterId: Id<"_storage"> | undefined;
  readonly onUploadingChange: (uploading: boolean) => void;
  readonly onNewGalleryLabelChange: (value: string) => void;
  readonly onNewGalleryCategoryChange: (value: string) => void;
  readonly onNewBeforeIdChange: (storageId: Id<"_storage">) => void;
  readonly onNewAfterIdChange: (storageId: Id<"_storage">) => void;
  readonly onCreateGalleryCategory: (category: string) => void;
  readonly onAddGalleryItem: () => void;
  readonly onRemoveGalleryItem: (itemId: Id<"landingPageGallery">) => void;
  readonly onUpdateGalleryCategory: (
    itemId: Id<"landingPageGallery">,
    category: string,
  ) => void;
};

export function GalleryTab({
  state,
  updateField,
  gallery,
  galleryCategories,
  newGalleryLabel,
  newGalleryCategory,
  newBeforeId,
  newAfterId,
  onUploadingChange,
  onNewGalleryLabelChange,
  onNewGalleryCategoryChange,
  onNewBeforeIdChange,
  onNewAfterIdChange,
  onCreateGalleryCategory,
  onAddGalleryItem,
  onRemoveGalleryItem,
  onUpdateGalleryCategory,
}: GalleryTabProps) {
  return (
    <div className="space-y-6 pt-6">
      <TabIntro
        title="Before & after photos"
        description="Show real results. Each pair appears on the landing page."
      />

      <SectionCard title="Gallery section headings">
        <FieldGroup>
          <Field>
            <FieldLabel>Section title</FieldLabel>
            <Input
              value={state.gallerySectionTitle}
              onChange={(event) =>
                updateField("gallerySectionTitle", event.target.value)
              }
              placeholder="e.g. Before & after"
            />
          </Field>
          <Field>
            <FieldLabel>Section description</FieldLabel>
            <Textarea
              value={state.gallerySectionDescription}
              onChange={(event) =>
                updateField("gallerySectionDescription", event.target.value)
              }
              rows={2}
            />
          </Field>
        </FieldGroup>
      </SectionCard>

      {gallery && gallery.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {gallery.map((item) => (
            <SectionCard
              key={item._id}
              title={item.label ?? "Before / after"}
              action={
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemoveGalleryItem(item._id)}
                >
                  Remove
                </Button>
              }
            >
              <div className="grid grid-cols-2 gap-3">
                {item.beforeUrl ? (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Before
                    </p>
                    {/* biome-ignore lint/performance/noImgElement: Convex storage URLs */}
                    <img
                      src={item.beforeUrl}
                      alt="Before"
                      className="aspect-video w-full rounded-lg object-cover"
                    />
                  </div>
                ) : null}
                {item.afterUrl ? (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      After
                    </p>
                    {/* biome-ignore lint/performance/noImgElement: Convex storage URLs */}
                    <img
                      src={item.afterUrl}
                      alt="After"
                      className="aspect-video w-full rounded-lg object-cover"
                    />
                  </div>
                ) : null}
              </div>
              <div className="mt-4">
                <GalleryCategoryField
                  value={item.category ?? ""}
                  categories={galleryCategories}
                  onChange={(category) =>
                    onUpdateGalleryCategory(item._id, category)
                  }
                  onCreateCategory={onCreateGalleryCategory}
                  showHelp={false}
                />
              </div>
            </SectionCard>
          ))}
        </div>
      ) : (
        <SectionCard title="No photos yet">
          <p className="text-sm text-muted-foreground">
            Add your first before/after pair below.
          </p>
        </SectionCard>
      )}

      <SectionCard
        title="Add new before/after"
        description="Upload two photos, then click add."
      >
        <Field>
          <FieldLabel>Label (optional)</FieldLabel>
          <Input
            value={newGalleryLabel}
            onChange={(event) => onNewGalleryLabelChange(event.target.value)}
            placeholder="e.g. Roof clean — Bacchus Marsh"
          />
        </Field>
        <GalleryCategoryField
          value={newGalleryCategory}
          categories={galleryCategories}
          onChange={onNewGalleryCategoryChange}
          onCreateCategory={onCreateGalleryCategory}
        />
        <div className="grid gap-6 md:grid-cols-2">
          <ImageUpload
            label="Before"
            storageId={newBeforeId}
            onUploadingChange={onUploadingChange}
            onUploaded={onNewBeforeIdChange}
          />
          <ImageUpload
            label="After"
            storageId={newAfterId}
            onUploadingChange={onUploadingChange}
            onUploaded={onNewAfterIdChange}
          />
        </div>
        <Button type="button" onClick={onAddGalleryItem}>
          Add to gallery
        </Button>
      </SectionCard>
    </div>
  );
}
