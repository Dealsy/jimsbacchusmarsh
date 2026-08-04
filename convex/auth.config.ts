import type { AuthConfig } from "convex/server";

// Replace with your Clerk JWT issuer URL from Dashboard → JWT Templates → Convex
export default {
  providers: [
    {
      domain: "https://evident-sunbeam-52.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
