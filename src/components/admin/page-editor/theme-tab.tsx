import { ThemeEditor } from "@/components/admin/fields/theme-editor";
import type {
  EditorState,
  UpdateEditorField,
} from "@/components/admin/page-editor-types";
import { SectionCard, TabIntro } from "@/components/admin/section-card";

type ThemeTabProps = {
  readonly state: EditorState;
  readonly updateField: UpdateEditorField;
};

export function ThemeTab({ state, updateField }: ThemeTabProps) {
  return (
    <div className="space-y-6 pt-6">
      <TabIntro
        title="Colours & branding"
        description="Customise the look of this landing page — hero banner, buttons, and accent highlights."
      />
      <SectionCard title="Page theme">
        <ThemeEditor
          value={state.theme}
          onChange={(theme) => updateField("theme", theme)}
        />
      </SectionCard>
    </div>
  );
}
