import { parseSocialVideoUrl, type SocialVideoEmbed } from "@/lib/social-video";

export const DEFAULT_INTERVIEW_VIDEO_URL =
  "https://www.youtube.com/embed/cYvl8mAU0uA";

/**
 * Missing means the page has never chosen a video, so the Jim's interview plays.
 * A saved blank string hides the section. Any other value plays only if it is YouTube.
 */
export function resolveInterviewVideo(
  stored: string | undefined,
): SocialVideoEmbed | null {
  if (stored === undefined) {
    return youtubeOnly(DEFAULT_INTERVIEW_VIDEO_URL);
  }

  const trimmed = stored.trim();
  if (!trimmed) {
    return null;
  }

  return youtubeOnly(trimmed);
}

function youtubeOnly(value: string): SocialVideoEmbed | null {
  const video = parseSocialVideoUrl(value);
  if (!video || video.provider !== "youtube") {
    return null;
  }
  return video;
}
