"use client";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  DEFAULT_LANDING_THEME,
  LANDING_THEME_PRESETS,
  normalizeHexColor,
  type LandingTheme,
} from "@/lib/landing-theme";

type ThemeEditorProps = {
  readonly value: LandingTheme;
  readonly onChange: (theme: LandingTheme) => void;
};

type ThemeFieldKey = keyof LandingTheme;

const THEME_FIELDS: readonly {
  key: ThemeFieldKey;
  label: string;
  description: string;
}[] = [
  {
    key: "primary",
    label: "Brand colour",
    description: "Buttons, icons, step numbers, and highlights.",
  },
  {
    key: "heroFrom",
    label: "Hero top",
    description: "Top of the hero banner and logo band gradient.",
  },
  {
    key: "heroTo",
    label: "Hero bottom",
    description: "Bottom of the hero banner and logo band gradient.",
  },
  {
    key: "accent",
    label: "Accent colour",
    description: "Positive callouts, success states, and badges.",
  },
];

function ColorField({
  label,
  description,
  value,
  onChange,
}: {
  readonly label: string;
  readonly description: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
}) {
  const normalized = normalizeHexColor(value) ?? value;

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <FieldDescription>{description}</FieldDescription>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={normalized.startsWith("#") ? normalized : "#059669"}
          onChange={(event) => onChange(event.target.value)}
          className="size-11 shrink-0 cursor-pointer rounded-lg border bg-transparent p-1"
          aria-label={`${label} colour picker`}
        />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="#059669"
          className="font-mono uppercase"
          spellCheck={false}
        />
      </div>
    </Field>
  );
}

export function ThemeEditor({ value, onChange }: ThemeEditorProps) {
  function updateField(key: ThemeFieldKey, raw: string) {
    const normalized = normalizeHexColor(raw);
    onChange({
      ...value,
      [key]: normalized ?? raw,
    });
  }

  function applyPreset(theme: LandingTheme) {
    onChange({ ...theme });
  }

  function resetToDefault() {
    onChange({ ...DEFAULT_LANDING_THEME });
  }

  return (
    <div className="space-y-8">
      <div
        className="overflow-hidden rounded-2xl border shadow-sm"
        style={{
          background: `linear-gradient(to bottom, ${value.heroFrom}, ${value.heroTo})`,
        }}
      >
        <div className="space-y-4 p-6 text-white">
          <p className="text-sm font-medium text-white/80">Live preview</p>
          <h3 className="font-heading text-2xl font-bold">
            Your headline appears here
          </h3>
          <div
            className="inline-flex rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: value.primary }}
          >
            Get a free quote
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-white/10 bg-white/5 px-6 py-3">
          <span
            className="size-4 rounded-full ring-2 ring-white/30"
            style={{ backgroundColor: value.accent }}
          />
          <span className="text-sm text-white/80">Accent highlights</span>
        </div>
      </div>

      <FieldGroup>
        <FieldLabel>Preset palettes</FieldLabel>
        <FieldDescription>
          Start from a ready-made palette, then fine-tune individual colours
          below.
        </FieldDescription>
        <div className="grid gap-3 sm:grid-cols-2">
          {LANDING_THEME_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset.theme)}
              className="flex items-start gap-3 rounded-xl border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-muted/30"
            >
              <div className="flex shrink-0 flex-col overflow-hidden rounded-md border">
                <span
                  className="block h-4 w-10"
                  style={{ backgroundColor: preset.theme.heroFrom }}
                />
                <span
                  className="block h-4 w-10"
                  style={{ backgroundColor: preset.theme.primary }}
                />
              </div>
              <span>
                <span className="block font-medium">{preset.name}</span>
                <span className="block text-sm text-muted-foreground">
                  {preset.description}
                </span>
              </span>
            </button>
          ))}
        </div>
      </FieldGroup>

      <FieldGroup>
        {THEME_FIELDS.map((field) => (
          <ColorField
            key={field.key}
            label={field.label}
            description={field.description}
            value={value[field.key]}
            onChange={(next) => updateField(field.key, next)}
          />
        ))}
      </FieldGroup>

      <Button type="button" variant="outline" onClick={resetToDefault}>
        <RotateCcwIcon className="size-4" />
        Reset to default green
      </Button>
    </div>
  );
}
