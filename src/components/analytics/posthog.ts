import posthog from "posthog-js";

export function isPostHogEnabled(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST,
  );
}

export function capturePostHogEvent(
  name: string,
  properties?: Record<string, string | number | boolean | undefined>,
): void {
  if (typeof window === "undefined" || !isPostHogEnabled()) {
    return;
  }

  posthog.capture(name, properties);
}

const PRIVATE_ROUTE_PREFIXES = ["/admin", "/sign-in", "/sign-up"] as const;

export function isPublicMarketingPath(pathname: string): boolean {
  return !PRIVATE_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
