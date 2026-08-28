import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware(
  async () => {
    // Session handshake only. Protect resources in layouts/pages, not by path.
  },
  {
    // Production-only: Clerk Dashboard registers the live origin as a Frontend API
    // proxy. Localhost is not registered, so enabling this here returns
    // `host_invalid` JSON for /__clerk/* (and can break the handshake on load).
    frontendApiProxy: {
      enabled: (url) => {
        const hostname = url.hostname;
        return hostname !== "localhost" && hostname !== "127.0.0.1";
      },
    },
  },
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    // Required so /__clerk/*.js is proxied to Clerk (not skipped as a static file).
    "/__clerk/(.*)",
  ],
};
