import type {
  EditorState,
  UpdateEditorField,
} from "@/components/admin/page-editor-types";
import { SectionCard, TabIntro } from "@/components/admin/section-card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type SeoTabProps = {
  readonly state: EditorState;
  readonly updateField: UpdateEditorField;
};

export function SeoTab({ state, updateField }: SeoTabProps) {
  return (
    <div className="space-y-6 pt-6">
      <TabIntro
        title="Search & sharing"
        description="How your page appears in Google and when shared on social."
      />

      <SectionCard title="Meta tags">
        <FieldGroup>
          <Field>
            <FieldLabel>Page title</FieldLabel>
            <Input
              value={state.seoTitle}
              onChange={(event) => updateField("seoTitle", event.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {state.seoTitle.length} characters — aim for under 60
            </p>
          </Field>
          <Field>
            <FieldLabel>Description</FieldLabel>
            <Textarea
              value={state.seoDescription}
              onChange={(event) =>
                updateField("seoDescription", event.target.value)
              }
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              {state.seoDescription.length} characters — aim for 120–160
            </p>
          </Field>
        </FieldGroup>
      </SectionCard>
    </div>
  );
}
