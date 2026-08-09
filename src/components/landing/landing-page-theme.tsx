import type { ReactNode } from "react";

import {
  type LandingTheme,
  landingThemeToStyle,
  resolveLandingTheme,
} from "@/lib/landing-theme";

type LandingPageThemeProps = {
  readonly theme?: Partial<LandingTheme> | null;
  readonly children: ReactNode;
};

export function LandingPageTheme({ theme, children }: LandingPageThemeProps) {
  const resolved = resolveLandingTheme(theme);

  return (
    <div className="landing-page-theme" style={landingThemeToStyle(resolved)}>
      {children}
    </div>
  );
}
