export type SocialVideoProvider = "youtube" | "instagram";

export type SocialVideoOrientation = "portrait" | "landscape";

export type SocialVideoEmbed = {
  readonly provider: SocialVideoProvider;
  readonly embedUrl: string;
  readonly pageUrl: string;
  readonly orientation: SocialVideoOrientation;
};

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
  "youtu.be",
]);

const INSTAGRAM_HOSTS = new Set(["instagram.com", "instagr.am"]);

/**
 * Leave a typed link unchanged. An Instagram embed snippet becomes the reel URL.
 * Unrecognised text is returned unchanged so the editor can warn about it.
 */
export function normalizeSocialVideoInput(input: string): string {
  if (!looksLikeEmbedSnippet(input)) {
    return input;
  }
  return parseSocialVideoUrl(input)?.pageUrl ?? input;
}

function looksLikeEmbedSnippet(input: string): boolean {
  return /data-instgrm-permalink|<blockquote|<iframe|<script/i.test(input);
}

/** Turn a public Instagram or YouTube link, or an Instagram embed snippet, into an embed. */
export function parseSocialVideoUrl(input: string): SocialVideoEmbed | null {
  const candidate = extractSocialVideoCandidate(input);
  if (!candidate) {
    return null;
  }

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  if (YOUTUBE_HOSTS.has(host)) {
    return parseYouTube(url, host);
  }
  if (INSTAGRAM_HOSTS.has(host)) {
    return parseInstagram(url);
  }
  return null;
}

function parseYouTube(url: URL, host: string): SocialVideoEmbed | null {
  const parts = url.pathname.split("/").filter(Boolean);
  const shortsId = idAfter(parts, "shorts");
  if (shortsId) {
    return youtubeEmbed(shortsId, "portrait");
  }

  if (host === "youtu.be") {
    const id = parts[0];
    return id && isYouTubeId(id) ? youtubeEmbed(id, "landscape") : null;
  }

  const watchId = url.searchParams.get("v");
  if (watchId && isYouTubeId(watchId)) {
    return youtubeEmbed(watchId, "landscape");
  }

  const pathId =
    idAfter(parts, "embed") ?? idAfter(parts, "live") ?? idAfter(parts, "v");
  return pathId ? youtubeEmbed(pathId, "landscape") : null;
}

function parseInstagram(url: URL): SocialVideoEmbed | null {
  const parts = url.pathname.split("/").filter(Boolean);
  const kindIndex = parts.findIndex(
    (part) =>
      part === "reel" || part === "reels" || part === "p" || part === "tv",
  );
  if (kindIndex < 0) {
    return null;
  }

  const kind = parts[kindIndex];
  const code = parts[kindIndex + 1];
  if (!kind || !code || !isInstagramCode(code)) {
    return null;
  }

  const embedKind = kind === "reels" ? "reel" : kind;
  return {
    provider: "instagram",
    embedUrl: `https://www.instagram.com/${embedKind}/${code}/embed`,
    pageUrl: `https://www.instagram.com/${embedKind}/${code}/`,
    orientation: "portrait",
  };
}

function extractSocialVideoCandidate(input: string): string | null {
  const decoded = decodeHtmlEntities(input);
  const permalink = /data-instgrm-permalink\s*=\s*["']([^"']+)["']/i.exec(
    decoded,
  );
  const permalinkUrl = permalink?.[1]?.trim();
  if (permalinkUrl) {
    return permalinkUrl;
  }

  for (const match of decoded.matchAll(/https?:\/\/[^\s"'<>]+/gi)) {
    const raw = match[0]?.replace(/[),.;]+$/, "");
    if (raw && isSocialUrl(raw)) {
      return raw;
    }
  }

  const trimmed = decoded.trim();
  return trimmed.startsWith("http://") || trimmed.startsWith("https://")
    ? trimmed
    : null;
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&#0*39;/g, "'")
    .replace(/&quot;/gi, '"');
}

function isSocialUrl(value: string): boolean {
  try {
    const host = new URL(value).hostname.replace(/^www\./, "").toLowerCase();
    return YOUTUBE_HOSTS.has(host) || INSTAGRAM_HOSTS.has(host);
  } catch {
    return false;
  }
}

function youtubeEmbed(
  id: string,
  orientation: SocialVideoOrientation,
): SocialVideoEmbed {
  return {
    provider: "youtube",
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
    pageUrl:
      orientation === "portrait"
        ? `https://www.youtube.com/shorts/${id}`
        : `https://www.youtube.com/watch?v=${id}`,
    orientation,
  };
}

function idAfter(parts: readonly string[], marker: string): string | null {
  const index = parts.indexOf(marker);
  const id = index >= 0 ? parts[index + 1] : undefined;
  return id && isYouTubeId(id) ? id : null;
}

function isYouTubeId(value: string): boolean {
  return /^[\w-]{11}$/.test(value);
}

function isInstagramCode(value: string): boolean {
  return /^[\w-]{5,}$/.test(value);
}
