import type { Id } from "convex/_generated/dataModel";

import { StringListEditor } from "@/components/admin/fields/string-list-editor";
import { ImageUpload } from "@/components/admin/image-upload";
import type {
  EditorState,
  LoadedPage,
  UpdateEditorField,
} from "@/components/admin/page-editor-types";
import { SectionCard, TabIntro } from "@/components/admin/section-card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type HeroTabProps = {
  readonly page: LoadedPage;
  readonly state: EditorState;
  readonly updateField: UpdateEditorField;
  readonly onUploadingChange: (uploading: boolean) => void;
};

export function HeroTab({
  page,
  state,
  updateField,
  onUploadingChange,
}: HeroTabProps) {
  return (
    <div className="space-y-6 pt-6">
      <TabIntro
        title="Top of page"
        description="The first thing visitors see — headline, trust badges, and a full-bleed background photo or muted looping video behind the quote form."
      />

      <SectionCard title="Headline & intro">
        <FieldGroup>
          <Field>
            <FieldLabel>Audience callout</FieldLabel>
            <Input
              value={state.heroAudienceCallout}
              onChange={(event) =>
                updateField("heroAudienceCallout", event.target.value)
              }
              placeholder="e.g. For Bacchus Marsh homeowners"
            />
            <p className="text-xs text-muted-foreground">
              Eyebrow text above the headline — who this page is for. Leave
              blank to show service areas instead.
            </p>
          </Field>
          <Field>
            <FieldLabel>Main headline</FieldLabel>
            <Input
              value={state.heroHeadline}
              onChange={(event) =>
                updateField("heroHeadline", event.target.value)
              }
            />
          </Field>
          <Field>
            <FieldLabel>Supporting text</FieldLabel>
            <Textarea
              value={state.heroSubheadline}
              onChange={(event) =>
                updateField("heroSubheadline", event.target.value)
              }
              rows={3}
            />
          </Field>
        </FieldGroup>
      </SectionCard>

      <StringListEditor
        label="Intrigue bullets"
        description="5–6 scannable hooks that mix pain, curiosity, and secrets — shown below the sub-headline."
        values={state.heroIntrigueBullets}
        onChange={(values) => updateField("heroIntrigueBullets", values)}
        placeholder="e.g. Why pressure washing brings mould back…"
        addLabel="Add bullet"
      />

      <StringListEditor
        label="Trust badges"
        description="Short proof points under the headline — e.g. Fully insured."
        values={state.trustStrip}
        onChange={(values) => updateField("trustStrip", values)}
        placeholder="e.g. Fully insured"
        addLabel="Add badge"
      />

      <SectionCard
        title="Logo"
        description="Shown above the services section as visitors scroll — reinforces that they're on the right site. Use a light/white logo on the brand gradient (PNG with transparent background)."
      >
        <ImageUpload
          label="Upload logo"
          currentUrl={page.hero.logoUrl}
          storageId={state.heroLogoStorageId}
          onUploadingChange={onUploadingChange}
          onUploaded={(storageId: Id<"_storage">) =>
            updateField("heroLogoStorageId", storageId)
          }
        />
      </SectionCard>

      <SectionCard
        title="Hero background"
        description="Full-bleed photo or muted looping video behind the headline and quote form. Desktop only — a dark overlay keeps the text readable."
      >
        <Tabs
          value={state.heroBackgroundKind}
          onValueChange={(kind) => {
            if (kind === "image" || kind === "video") {
              updateField("heroBackgroundKind", kind);
            }
          }}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="image">Image</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
          </TabsList>
          <TabsContent value="image">
            <ImageUpload
              label="Upload hero background"
              currentUrl={page.hero.imageUrl}
              storageId={state.heroImageStorageId}
              onUploadingChange={onUploadingChange}
              onUploaded={(storageId: Id<"_storage">) => {
                updateField("heroImageStorageId", storageId);
                updateField("heroBackgroundKind", "image");
              }}
            />
          </TabsContent>
          <TabsContent value="video">
            <ImageUpload
              kind="video"
              label="Upload hero background video"
              currentUrl={page.hero.videoUrl}
              storageId={state.heroVideoStorageId}
              onUploadingChange={onUploadingChange}
              onUploaded={(storageId: Id<"_storage">) => {
                updateField("heroVideoStorageId", storageId);
                updateField("heroBackgroundKind", "video");
              }}
            />
          </TabsContent>
        </Tabs>
      </SectionCard>
    </div>
  );
}
