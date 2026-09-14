export type LandingSectionSurface = "plain" | "band";

export function landingSectionSurfaceClass(
  surface: LandingSectionSurface,
): string {
  return surface === "band"
    ? "bg-(--landing-section-band)"
    : "bg-background";
}
