import posthog from "posthog-js";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

function requirePostHogConfigurationInDevelopment(
  value: string | undefined,
  variableName: string,
): void {
  if (!value && process.env.NODE_ENV === "development") {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    );
  }
}

requirePostHogConfigurationInDevelopment(
  projectToken,
  "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN",
);
requirePostHogConfigurationInDevelopment(apiHost, "NEXT_PUBLIC_POSTHOG_HOST");

if (projectToken && apiHost) {
  posthog.init(projectToken, {
    api_host: apiHost,
    defaults: "2026-05-30",
    capture_pageview: false,
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
    loaded: (client) => {
      if (process.env.NODE_ENV === "development") {
        client.debug();
      }
    },
  });
}
