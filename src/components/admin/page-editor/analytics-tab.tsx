import type {
  EditorState,
  UpdateEditorField,
} from "@/components/admin/page-editor-types";
import { SectionCard, TabIntro } from "@/components/admin/section-card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type AnalyticsTabProps = {
  readonly state: EditorState;
  readonly updateField: UpdateEditorField;
};

export function AnalyticsTab({ state, updateField }: AnalyticsTabProps) {
  return (
    <div className="space-y-6 pt-6">
      <TabIntro
        title="Tracking & ads"
        description="Optional — leave blank to use site-wide defaults."
      />

      <SectionCard title="Ad & pixel IDs">
        <FieldGroup>
          <Field>
            <FieldLabel>Meta (Facebook) Pixel ID</FieldLabel>
            <Input
              value={state.metaPixelId}
              onChange={(event) =>
                updateField("metaPixelId", event.target.value)
              }
              placeholder="Optional"
            />
          </Field>
          <Field>
            <FieldLabel>Google Ads ID</FieldLabel>
            <Input
              value={state.googleAdsId}
              onChange={(event) =>
                updateField("googleAdsId", event.target.value)
              }
              placeholder="Optional"
            />
          </Field>
          <Field>
            <FieldLabel>Google conversion label</FieldLabel>
            <Input
              value={state.googleConversionLabel}
              onChange={(event) =>
                updateField("googleConversionLabel", event.target.value)
              }
              placeholder="Optional"
            />
          </Field>
        </FieldGroup>
      </SectionCard>
    </div>
  );
}
