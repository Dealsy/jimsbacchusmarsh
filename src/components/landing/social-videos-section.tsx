import { landingSectionSurfaceClass } from "@/lib/landing-section-surface";
import { parseSocialVideoUrl, type SocialVideoEmbed } from "@/lib/social-video";
import type { PublishedLandingPage } from "@/lib/types/landing-page";
import { cn } from "@/lib/utils";

/**
 * Instagram's embed header (username and View profile). Measured on a live reel.
 * The media box under it is 4:5 of the embed width.
 */
const INSTAGRAM_EMBED_HEADER_PX = 54;

/**
 * Room below the video for the embed footer. The iframe is this much taller than
 * the clip so the footer never creates a scrollbar that would shift the video.
 */
const INSTAGRAM_EMBED_FOOTER_PX = 420;

type SocialVideosSectionProps = {
  readonly page: PublishedLandingPage;
};

export function SocialVideosSection({ page }: SocialVideosSectionProps) {
  const videos = (page.socialVideos ?? []).flatMap((url, index) => {
    const video = parseSocialVideoUrl(url);
    return video ? [{ video, index }] : [];
  });

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
    return <InstagramVideoCard video={video} />;
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

function InstagramVideoCard({ video }: { readonly video: SocialVideoEmbed }) {
  return (
    <li className="w-full max-w-[540px]">
      <div className="relative aspect-[4/5] overflow-hidden bg-black">
        <iframe
          src={video.embedUrl}
          title="Instagram video"
          loading="lazy"
          scrolling="no"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          className="absolute left-0 w-full border-0"
          style={{
            top: -INSTAGRAM_EMBED_HEADER_PX,
            height: `calc(100% + ${INSTAGRAM_EMBED_HEADER_PX + INSTAGRAM_EMBED_FOOTER_PX}px)`,
          }}
        />
      </div>
    </li>
  );
}
