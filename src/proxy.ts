import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  // Published landing pages live at /:slug (e.g. /softwashing, /pressure-washing)
  "/((?!admin|sign-in|sign-up|api|_next)[^/.]+)",
  "/((?!admin|sign-in|sign-up|api|_next)[^/.]+)/thank-you",
]);

export default clerkMiddleware(
  async (auth, req) => {
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
  },
  {
    // Clerk loads JS via /__clerk/* when Frontend API proxy is enabled in the dashboard.
    frontendApiProxy: {
      enabled: true,
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
