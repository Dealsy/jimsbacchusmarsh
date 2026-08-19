import posthog from "posthog-js";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (projectToken && apiHost) {
  posthog.init(projectToken, {
    api_host: apiHost,
    defaults: "2026-05-30",
    capture_pageview: false,
    loaded: (client) => {
      if (process.env.NODE_ENV === "development") {
        client.debug();
      }
    },
  });
}
