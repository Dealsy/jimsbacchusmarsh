"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useEffect, useRef } from "react";
import posthog from "posthog-js";
import { isPostHogEnabled } from "@/components/analytics/posthog";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

function PostHogIdentity() {
  const { isLoaded, user } = useUser();
  const previousUserId = useRef<string | null>(null);
  const userId = user?.id;

  useEffect(() => {
    if (!isLoaded || !isPostHogEnabled()) {
      return;
    }

    if (!userId) {
      if (previousUserId.current) {
        posthog.reset();
        previousUserId.current = null;
      }
      return;
    }

    if (previousUserId.current && previousUserId.current !== userId) {
      posthog.reset();
    }

    posthog.identify(userId, {
      email: user?.primaryEmailAddress?.emailAddress,
      name: user?.fullName ?? undefined,
    });
    previousUserId.current = userId;
  }, [isLoaded, user?.fullName, user?.primaryEmailAddress?.emailAddress, userId]);

  return null;
}

export function ConvexClientProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <>
      <PostHogIdentity />
      {children}
    </>
  );

  if (!convexUrl || !convex) {
    return content;
  }

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {content}
    </ConvexProviderWithClerk>
  );
}
