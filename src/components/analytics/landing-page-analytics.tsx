"use client";

import { useEffect, useRef } from "react";

import { capturePostHogEvent, isPostHogEnabled } from "@/components/analytics/posthog";

const SCROLL_DEPTH_THRESHOLDS = [25, 50, 75, 100] as const;

type LandingPageAnalyticsProps = {
  readonly pageSlug: string;
};

export function LandingPageAnalytics({ pageSlug }: LandingPageAnalyticsProps) {
  const firedScrollDepths = useRef<Set<number>>(new Set());
  const firedSections = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!isPostHogEnabled()) {
      return;
    }

    function captureScrollDepth(): void {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) {
        return;
      }

      const depth = Math.min(
        100,
        Math.round((window.scrollY / scrollHeight) * 100),
      );

      for (const threshold of SCROLL_DEPTH_THRESHOLDS) {
        if (depth >= threshold && !firedScrollDepths.current.has(threshold)) {
          firedScrollDepths.current.add(threshold);
          capturePostHogEvent(`scroll_depth_${threshold}`, { page_slug: pageSlug });
        }
      }
    }

    function handleCtaClick(event: MouseEvent): void {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const cta = target.closest("[data-landing-cta]");
      if (!(cta instanceof HTMLElement)) {
        return;
      }

      const location = cta.dataset.landingCta;
      if (!location) {
        return;
      }

      capturePostHogEvent("cta_clicked", {
        page_slug: pageSlug,
        location,
      });
    }

    captureScrollDepth();
    window.addEventListener("scroll", captureScrollDepth, { passive: true });
    document.addEventListener("click", handleCtaClick);

    const sections = document.querySelectorAll("[data-landing-section]");
    const observer =
      sections.length > 0
        ? new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (!entry.isIntersecting) {
                  continue;
                }

                const section = entry.target.getAttribute("data-landing-section");
                if (!section || firedSections.current.has(section)) {
                  continue;
                }

                firedSections.current.add(section);
                capturePostHogEvent("section_viewed", {
                  page_slug: pageSlug,
                  section,
                });
              }
            },
            { threshold: 0.25 },
          )
        : null;

    for (const section of sections) {
      observer?.observe(section);
    }

    return () => {
      window.removeEventListener("scroll", captureScrollDepth);
      document.removeEventListener("click", handleCtaClick);
      observer?.disconnect();
    };
  }, [pageSlug]);

  return null;
}
