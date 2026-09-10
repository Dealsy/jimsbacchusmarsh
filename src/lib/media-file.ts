export const MAX_CONVEX_UPLOAD_BYTES = 20 * 1024 * 1024;

export type MediaUploadKind = "image" | "video";

export function isWithinConvexUploadLimit(file: File): boolean {
  return file.size <= MAX_CONVEX_UPLOAD_BYTES;
}

export function isAcceptedMediaFile(
  file: File,
  kind: MediaUploadKind,
): boolean {
  if (kind === "video") {
    return file.type === "video/mp4" || file.type === "video/webm";
  }
  return file.type.startsWith("image/");
}

export function mediaAcceptAttribute(kind: MediaUploadKind): string {
  return kind === "video" ? "video/mp4,video/webm" : "image/*";
}
