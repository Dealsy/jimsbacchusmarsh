import { HowItWorksEditor } from "@/components/admin/fields/how-it-works-editor";
import type {
  EditorState,
  UpdateEditorField,
} from "@/components/admin/page-editor-types";
import { SectionCard, TabIntro } from "@/components/admin/section-card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ThankYouTabProps = {
  readonly state: EditorState;
  readonly updateField: UpdateEditorField;
};

export function ThankYouTab({ state, updateField }: ThankYouTabProps) {
  return (
    <div className="space-y-6 pt-6">
      <TabIntro
        title="Thank-you page"
        description="Shown after someone submits the quote form at /{slug}/thank-you."
      />

      <SectionCard title="Confirmation message">
        <FieldGroup>
          <Field>
            <FieldLabel>Headline</FieldLabel>
            <Input
              value={state.thankYou.headline}
              onChange={(event) =>
                updateField("thankYou", {
                  ...state.thankYou,
                  headline: event.target.value,
                })
              }
              placeholder="Thanks — we'll call you back today"
            />
          </Field>
          <Field>
            <FieldLabel>Body text</FieldLabel>
            <Textarea
              value={state.thankYou.body}
              onChange={(event) =>
                updateField("thankYou", {
                  ...state.thankYou,
                  body: event.target.value,
                })
              }
              rows={3}
              placeholder="Your request is in. We'll be in touch shortly…"
            />
          </Field>
          <Field>
            <FieldLabel>Phone prompt</FieldLabel>
            <Input
              value={state.thankYou.phonePrompt}
              onChange={(event) =>
                updateField("thankYou", {
                  ...state.thankYou,
                  phonePrompt: event.target.value,
                })
              }
              placeholder="Need to speak with someone now?"
            />
          </Field>
        </FieldGroup>
      </SectionCard>

      <SectionCard title="What happens next">
        <FieldGroup>
          <Field>
            <FieldLabel>Section title</FieldLabel>
            <Input
              value={state.thankYou.nextStepsTitle}
              onChange={(event) =>
                updateField("thankYou", {
                  ...state.thankYou,
                  nextStepsTitle: event.target.value,
                })
              }
              placeholder="What happens next"
            />
          </Field>
          <Field>
            <div className="flex items-center gap-2">
              <Checkbox
                id="thank-you-use-how-it-works"
                checked={state.thankYou.useHowItWorksSteps}
                onCheckedChange={(checked) =>
                  updateField("thankYou", {
                    ...state.thankYou,
                    useHowItWorksSteps: checked === true,
                  })
                }
              />
              <FieldLabel htmlFor="thank-you-use-how-it-works">
                Use the same steps as the How it works section
              </FieldLabel>
            </div>
          </Field>
          {!state.thankYou.useHowItWorksSteps ? (
            <HowItWorksEditor
              values={state.thankYou.nextSteps}
              onChange={(values) =>
                updateField("thankYou", {
                  ...state.thankYou,
                  nextSteps: values,
                })
              }
            />
          ) : null}
        </FieldGroup>
      </SectionCard>
    </div>
  );
}
