"use client";

import { useMutation, useQuery } from "convex/react";
import { ImageIcon, UploadIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";

type ImageUploadProps = {
  readonly label: string;
  readonly currentUrl?: string | null;
  readonly storageId?: Id<"_storage">;
  readonly onUploaded: (storageId: Id<"_storage">) => void;
  readonly onUploadingChange?: (uploading: boolean) => void;
};

export async function uploadToConvex(
  file: File,
  uploadUrl: string,
): Promise<Id<"_storage">> {
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  const json = (await response.json()) as { storageId: Id<"_storage"> };
  return json.storageId;
}

export function ImageUpload({
  label,
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
      setAwaitingStorageId(uploadedStorageId);
      onUploaded(uploadedStorageId);
    } catch {
      setError("Upload failed. Try again.");
      setAwaitingStorageId(null);
      setLocalPreviewUrl((previous) => {
        if (previous) {
          URL.revokeObjectURL(previous);
        }
        return null;
      });
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
    const file = event.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) {
      await uploadFile(file);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">{label}</p>

      {displayUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={displayUrl}
          src={displayUrl}
          alt=""
          className="aspect-video w-full max-w-md rounded-xl border object-cover"
        />
      ) : (
        <div className="flex aspect-video w-full max-w-md items-center justify-center rounded-xl border border-dashed bg-muted/20">
          <ImageIcon className="size-10 text-muted-foreground/50" />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={uploading}
        className="sr-only"
        id={`upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
      />

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
          Drag an image here, or choose a file
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Uploading…" : "Choose image"}
        </Button>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
