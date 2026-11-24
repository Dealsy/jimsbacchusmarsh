import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type LandingSectionTone = "light" | "band" | "dark";

type LandingSectionWidth = "narrow" | "default" | "wide" | "full";

type LandingSectionProps = Omit<ComponentProps<"section">, "children"> & {
  readonly tone?: LandingSectionTone;
  readonly width?: LandingSectionWidth;
  readonly containerClassName?: string;
  readonly children: ReactNode;
};

const TONE_CLASS: Record<LandingSectionTone, string> = {
  light: "bg-background",
  band: "bg-(--landing-section-band)",
  dark: "tone-dark landing-dark-surface",
};

const WIDTH_CLASS: Record<LandingSectionWidth, string> = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
  full: "max-w-[100rem]",
};

export function LandingSection({
  tone = "light",
  width = "default",
  className,
  containerClassName,
  children,
  ...props
}: LandingSectionProps) {
  return (
    <section
      {...props}
      className={cn(
        "relative isolate overflow-clip py-16 md:py-28",
        TONE_CLASS[tone],
        className,
      )}
    >
      {tone === "dark" ? <DarkSectionDecor /> : null}
      <div
        className={cn(
          "relative mx-auto w-full px-5 md:px-6",
          WIDTH_CLASS[width],
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}

export function DarkSectionDecor() {
  return (
    <div
      aria-hidden
      className="landing-grid-texture pointer-events-none absolute inset-0 -z-10"
    />
  );
}
