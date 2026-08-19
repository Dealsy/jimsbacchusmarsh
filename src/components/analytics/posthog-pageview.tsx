"use client";

import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { useEffect, useRef } from "react";

import {
  isPostHogEnabled,
  isPublicMarketingPath,
} from "@/components/analytics/posthog";

export function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!isPostHogEnabled() || !pathname || !isPublicMarketingPath(pathname)) {
      return;
    }

    const query = searchParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    if (lastUrl.current === url) {
      return;
    }
    lastUrl.current = url;

    posthog.capture("$pageview", {
      $current_url: window.location.href,
    });
  }, [pathname, searchParams]);

  return null;
}
