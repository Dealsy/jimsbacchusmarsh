"use client";

import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { ImageIcon, UploadIcon, VideoIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  isAcceptedMediaFile,
  isWithinConvexUploadLimit,
  type MediaUploadKind,
  mediaAcceptAttribute,
} from "@/lib/media-file";
import { uploadToConvex } from "@/lib/upload-to-convex";
import { cn } from "@/lib/utils";

type ImageUploadProps = {
  readonly label: string;
  readonly kind?: MediaUploadKind;
  readonly currentUrl?: string | null;
  readonly storageId?: Id<"_storage">;
  readonly onUploaded: (storageId: Id<"_storage">) => void;
  readonly onUploadingChange?: (uploading: boolean) => void;
};

export function ImageUpload({
  label,
  kind = "image",
  currentUrl,
  storageId,
  onUploaded,
  onUploadingChange,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const generateUploadUrl = useMutation(api.landingPages.generateUploadUrl);
  const storageUrl = useQuery(
    api.landingPages.getStorageUrl,
    storageId ? { storageId } : "skip",
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [awaitingStorageId, setAwaitingStorageId] =
    useState<Id<"_storage"> | null>(null);

  const displayUrl = localPreviewUrl ?? storageUrl ?? currentUrl ?? null;
  const isVideo = kind === "video";
  const EmptyIcon = isVideo ? VideoIcon : ImageIcon;

  useEffect(() => {
    onUploadingChange?.(uploading);
  }, [onUploadingChange, uploading]);

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  useEffect(() => {
    if (
      !localPreviewUrl ||
      !storageUrl ||
      !storageId ||
      awaitingStorageId !== storageId
    ) {
      return;
    }

    URL.revokeObjectURL(localPreviewUrl);
    setLocalPreviewUrl(null);
    setAwaitingStorageId(null);
  }, [awaitingStorageId, localPreviewUrl, storageId, storageUrl]);

  function clearLocalPreview() {
    setLocalPreviewUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      return null;
    });
  }

  function setInstantPreview(file: File) {
    const blobUrl = URL.createObjectURL(file);
    setLocalPreviewUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      return blobUrl;
    });
  }

  async function uploadFile(file: File) {
    if (!isAcceptedMediaFile(file, kind)) {
      setError(
        isVideo
          ? "Please upload an MP4 or WebM video."
          : "Please upload an image file.",
      );
      return;
    }

    if (!isWithinConvexUploadLimit(file)) {
      setError("File must be 20 MB or smaller.");
      return;
    }

    setInstantPreview(file);
    setUploading(true);
    setError(null);

    try {
      const result = await generateUploadUrl({});
      if (!result.success) {
        setError(result.error ?? "Could not upload");
        setAwaitingStorageId(null);
        return;
      }

      const uploadedStorageId = await uploadToConvex(file, result.uploadUrl);
      if (!uploadedStorageId) {
        setError("Upload failed. Try again.");
        setAwaitingStorageId(null);
        clearLocalPreview();
        return;
      }

      setAwaitingStorageId(uploadedStorageId);
      onUploaded(uploadedStorageId);
    } catch {
      setError("Upload failed. Try again.");
      setAwaitingStorageId(null);
      clearLocalPreview();
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    await uploadFile(file);
  }

  async function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files.item(0);
    if (file && isAcceptedMediaFile(file, kind)) {
      await uploadFile(file);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">{label}</p>

      {displayUrl ? (
        isVideo ? (
          <video
            key={displayUrl}
            src={displayUrl}
            className="aspect-video w-full max-w-md rounded-xl border object-cover"
            muted
            loop
            autoPlay
            playsInline
          />
        ) : (
          // biome-ignore lint/performance/noImgElement: blob and Convex storage URLs
          <img
            key={displayUrl}
            src={displayUrl}
            alt=""
            className="aspect-video w-full max-w-md rounded-xl border object-cover"
          />
        )
      ) : (
        <div className="flex aspect-video w-full max-w-md items-center justify-center rounded-xl border border-dashed bg-muted/20">
          <EmptyIcon className="size-10 text-muted-foreground/50" />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={mediaAcceptAttribute(kind)}
        onChange={handleChange}
        disabled={uploading}
        className="sr-only"
        id={`upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
      />

      {/* biome-ignore lint/a11y/noStaticElementInteractions: drag-and-drop target */}
      <div
        role="presentation"
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center gap-2 rounded-xl border border-dashed p-6 transition-colors",
          dragOver ? "border-primary bg-primary/5" : "bg-muted/10",
        )}
      >
        <UploadIcon className="size-5 text-muted-foreground" />
        <p className="text-center text-sm text-muted-foreground">
          {isVideo
            ? "Drag an MP4 or WebM here, or choose a file (max 20 MB)"
            : "Drag an image here, or choose a file"}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Uploading…" : isVideo ? "Choose video" : "Choose image"}
        </Button>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
