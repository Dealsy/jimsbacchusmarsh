import type { CSSProperties } from "react";

export type LandingTheme = {
  readonly primary: string;
  readonly heroFrom: string;
  readonly heroTo: string;
  readonly accent: string;
};

export const DEFAULT_LANDING_THEME: LandingTheme = {
  primary: "#059669",
  heroFrom: "#022c22",
  heroTo: "#064e3b",
  accent: "#047857",
};

export type ThemePreset = {
  readonly name: string;
  readonly description: string;
  readonly theme: LandingTheme;
};

export const LANDING_THEME_PRESETS: readonly ThemePreset[] = [
  {
    name: "Jim's Green",
    description: "Default brand look — clean and trustworthy.",
    theme: DEFAULT_LANDING_THEME,
  },
  {
    name: "Ocean Blue",
    description: "Cool, professional coastal feel.",
    theme: {
      primary: "#0284c7",
      heroFrom: "#0c1929",
      heroTo: "#0c4a6e",
      accent: "#0369a1",
    },
  },
  {
    name: "Professional Navy",
    description: "Corporate and confident.",
    theme: {
      primary: "#1d4ed8",
      heroFrom: "#0f172a",
      heroTo: "#1e3a8a",
      accent: "#2563eb",
    },
  },
  {
    name: "Warm Orange",
    description: "Energetic and action-oriented.",
    theme: {
      primary: "#ea580c",
      heroFrom: "#431407",
      heroTo: "#9a3412",
      accent: "#c2410c",
    },
  },
];

export function resolveLandingTheme(
  theme?: Partial<LandingTheme> | null,
): LandingTheme {
  return {
    primary: theme?.primary ?? DEFAULT_LANDING_THEME.primary,
    heroFrom: theme?.heroFrom ?? DEFAULT_LANDING_THEME.heroFrom,
    heroTo: theme?.heroTo ?? DEFAULT_LANDING_THEME.heroTo,
    accent: theme?.accent ?? DEFAULT_LANDING_THEME.accent,
  };
}

export function landingThemeToStyle(theme: LandingTheme): CSSProperties {
  return {
    "--landing-primary": theme.primary,
    "--landing-hero-from": theme.heroFrom,
    "--landing-hero-to": theme.heroTo,
    "--landing-accent": theme.accent,
    "--primary": theme.primary,
    "--ring": theme.primary,
  } as CSSProperties;
}

export function isValidHexColor(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}

export function normalizeHexColor(value: string): string | null {
  const trimmed = value.trim();
  if (isValidHexColor(trimmed)) {
    return trimmed.toLowerCase();
  }

  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  if (isValidHexColor(withHash)) {
    return withHash.toLowerCase();
  }

  return null;
}
