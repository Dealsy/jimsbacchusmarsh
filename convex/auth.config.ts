import type { AuthConfig } from "convex/server";

// Clerk Frontend API URL (JWT issuer). Set per deployment in the Convex dashboard:
//   npx convex env set CLERK_JWT_ISSUER_DOMAIN https://....clerk.accounts.dev
//   npx convex env --prod set CLERK_JWT_ISSUER_DOMAIN https://clerk.<your-domain>.com
// See https://docs.convex.dev/auth/clerk#configuring-dev-and-prod-instances
const clerkJwtIssuerDomain = process.env.CLERK_JWT_ISSUER_DOMAIN;

export default {
  providers: clerkJwtIssuerDomain
    ? [
        {
          domain: clerkJwtIssuerDomain,
          applicationID: "convex",
        },
      ]
    : [],
} satisfies AuthConfig;
