"use client";

import { useEffect } from "react";

import { landingSectionSurfaceClass } from "@/lib/landing-section-surface";
import { parseSocialVideoUrl, type SocialVideoEmbed } from "@/lib/social-video";
import type { PublishedLandingPage } from "@/lib/types/landing-page";
import { cn } from "@/lib/utils";

const INSTAGRAM_EMBED_SCRIPT = "https://www.instagram.com/embed.js";

type InstagramEmbedApi = {
  Embeds: {
    process: () => void;
  };
};

type SocialVideosSectionProps = {
  readonly page: PublishedLandingPage;
};

export function SocialVideosSection({ page }: SocialVideosSectionProps) {
  const videos = (page.socialVideos ?? []).flatMap((url, index) => {
    const video = parseSocialVideoUrl(url);
    return video ? [{ video, index }] : [];
  });
  const instagramKey = videos
    .flatMap(({ video }) =>
      video.provider === "instagram" ? [video.pageUrl] : [],
    )
    .join("|");

  useEffect(() => {
    if (!instagramKey) {
      return;
    }

    let cancelled = false;
    const processEmbeds = () => {
      if (cancelled) {
        return;
      }
      readInstagramApi()?.Embeds.process();
    };

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${INSTAGRAM_EMBED_SCRIPT}"]`,
    );
    const frame = requestAnimationFrame(processEmbeds);

    if (!existing) {
      const script = document.createElement("script");
      script.async = true;
      script.src = INSTAGRAM_EMBED_SCRIPT;
      script.onload = processEmbeds;
      document.body.appendChild(script);
    } else if (!readInstagramApi()) {
      existing.addEventListener("load", processEmbeds);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      existing?.removeEventListener("load", processEmbeds);
    };
  }, [instagramKey]);

  if (videos.length === 0) {
    return null;
  }

  return (
    <section
      className={cn(landingSectionSurfaceClass("plain"), "pb-16 md:pb-20")}
    >
      <ul className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start justify-items-center gap-6 px-4 md:grid-cols-2 2xl:max-w-[1600px] 2xl:grid-cols-4">
        {videos.map(({ video, index }) => (
          <SocialVideoCard key={`${video.embedUrl}-${index}`} video={video} />
        ))}
      </ul>
    </section>
  );
}

function SocialVideoCard({ video }: { readonly video: SocialVideoEmbed }) {
  if (video.provider === "instagram") {
    return (
      <li className="w-full max-w-[540px]">
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={video.pageUrl}
          data-instgrm-version="14"
          style={{
            margin: 0,
            maxWidth: 540,
            minWidth: 0,
            padding: 0,
            width: "100%",
          }}
        >
          <a href={video.pageUrl} target="_blank" rel="noreferrer">
            View this post on Instagram
          </a>
        </blockquote>
      </li>
    );
  }

  return (
    <li
      className={cn(
        "overflow-hidden rounded-2xl border bg-background shadow-sm",
        video.orientation === "portrait" &&
          "mx-auto w-full max-w-[280px] md:max-w-none",
        video.orientation === "landscape" && "md:col-span-2",
      )}
    >
      <div
        className={cn(
          "relative w-full",
          video.orientation === "portrait" ? "aspect-[9/16]" : "aspect-video",
        )}
      >
        <iframe
          src={video.embedUrl}
          title="YouTube video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 size-full border-0"
        />
      </div>
    </li>
  );
}

function readInstagramApi(): InstagramEmbedApi | undefined {
  return (window as Window & { instgrm?: InstagramEmbedApi }).instgrm;
}
