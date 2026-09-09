import { DEFAULT_REASON_QUESTION } from "convex/lib/reasonQuestionDefaults";

import { StringListEditor } from "@/components/admin/fields/string-list-editor";
import type {
  EditorState,
  UpdateEditorField,
} from "@/components/admin/page-editor-types";
import { SectionCard, TabIntro } from "@/components/admin/section-card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type GeneralTabProps = {
  readonly state: EditorState;
  readonly updateField: UpdateEditorField;
};

export function GeneralTab({ state, updateField }: GeneralTabProps) {
  return (
    <div className="space-y-6 pt-6">
      <TabIntro
        title="Business details"
        description="Contact info, service areas, and quote form settings."
      />

      <SectionCard title="Basics">
        <FieldGroup>
          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Page name</FieldLabel>
              <Input
                value={state.name}
                onChange={(event) => updateField("name", event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>Business name</FieldLabel>
              <Input
                value={state.businessName}
                onChange={(event) =>
                  updateField("businessName", event.target.value)
                }
              />
            </Field>
          </div>
          <Field>
            <FieldLabel>Phone number</FieldLabel>
            <Input
              value={state.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="e.g. 0400 000 000"
            />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Quote button text</FieldLabel>
              <Input
                value={state.ctaLabel}
                onChange={(event) =>
                  updateField("ctaLabel", event.target.value)
                }
                placeholder="e.g. Get a free quote"
              />
            </Field>
            <Field>
              <FieldLabel>Service type (for leads)</FieldLabel>
              <Input
                value={state.leadServiceType}
                onChange={(event) =>
                  updateField("leadServiceType", event.target.value)
                }
                placeholder="e.g. Softwashing"
              />
            </Field>
          </div>
        </FieldGroup>
      </SectionCard>

      <StringListEditor
        label="Service areas"
        description="Suburbs or regions you service."
        values={state.serviceAreas}
        onChange={(values) => updateField("serviceAreas", values)}
        placeholder="e.g. Bacchus Marsh"
        addLabel="Add area"
      />

      <StringListEditor
        label="Surface options"
        description="Choices on the quote form — roof, driveway, etc."
        values={state.surfaceOptions}
        onChange={(values) => updateField("surfaceOptions", values)}
        placeholder="e.g. Roof"
        addLabel="Add option"
      />

      <SectionCard
        title="Main reason question"
        description="Shown above the surface choices on the quote form."
      >
        <Field>
          <FieldLabel>Question</FieldLabel>
          <Input
            value={state.reasonQuestion}
            onChange={(event) =>
              updateField("reasonQuestion", event.target.value)
            }
            placeholder={DEFAULT_REASON_QUESTION}
          />
        </Field>
      </SectionCard>

      <StringListEditor
        label="Main reason options"
        description="Single-choice answers for why they're getting the job done."
        values={state.reasonOptions}
        onChange={(values) => updateField("reasonOptions", values)}
        placeholder="e.g. The place just looks tired"
        addLabel="Add option"
      />
    </div>
  );
}
