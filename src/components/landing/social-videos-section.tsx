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

  const single = videos.length === 1;

  return (
    <section className="bg-background pt-4 pb-14 md:pt-0 md:pb-24">
      <ul
        className={cn(
          "no-scrollbar mx-auto flex w-full max-w-6xl snap-x snap-mandatory items-start gap-4 overflow-x-auto px-5 pb-2 md:grid md:grid-cols-2 md:justify-items-center md:gap-8 md:overflow-visible md:px-6 2xl:max-w-[1600px] 2xl:grid-cols-4",
          single && "justify-center md:grid-cols-1",
        )}
      >
        {videos.map(({ video, index }) => (
          <SocialVideoCard
            key={`${video.embedUrl}-${index}`}
            video={video}
            single={single}
          />
        ))}
      </ul>
    </section>
  );
}

const PHONE_FRAME_CLASS =
  "overflow-hidden rounded-[2rem] bg-neutral-950 p-1.5 shadow-float ring-1 ring-black/10";

function slideWidthClass(single: boolean): string {
  return single
    ? "w-full max-w-[22rem] md:max-w-[26rem]"
    : "w-[82%] max-w-[22rem] shrink-0 snap-center md:w-full md:max-w-[26rem]";
}

function SocialVideoCard({
  video,
  single,
}: {
  readonly video: SocialVideoEmbed;
  readonly single: boolean;
}) {
  if (video.provider === "instagram") {
    return <InstagramVideoCard video={video} single={single} />;
  }

  if (video.orientation === "landscape") {
    return (
      <li className="w-[92%] shrink-0 snap-center md:col-span-2 md:w-full">
        <div className="overflow-hidden rounded-3xl bg-neutral-950 shadow-float ring-1 ring-black/10">
          <div className="relative aspect-video w-full">
            <YouTubeFrame embedUrl={video.embedUrl} />
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className={slideWidthClass(single)}>
      <div className={PHONE_FRAME_CLASS}>
        <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[1.6rem]">
          <YouTubeFrame embedUrl={video.embedUrl} />
        </div>
      </div>
    </li>
  );
}

function YouTubeFrame({ embedUrl }: { readonly embedUrl: string }) {
  return (
    <iframe
      src={embedUrl}
      title="YouTube video"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      className="absolute inset-0 size-full border-0"
    />
  );
}

function InstagramVideoCard({
  video,
  single,
}: {
  readonly video: SocialVideoEmbed;
  readonly single: boolean;
}) {
  return (
    <li className={slideWidthClass(single)}>
      <div className={PHONE_FRAME_CLASS}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-black">
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
      </div>
    </li>
  );
}
