"use client";

import { ExternalLinkIcon, SaveIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/utils";

type EditorToolbarProps = {
  readonly pageName: string;
  readonly slug: string;
  readonly status: "draft" | "published";
  readonly saving: boolean;
  readonly uploading?: boolean;
  readonly message: string | null;
  readonly messageTone?: "neutral" | "error";
  readonly onSave: () => void;
  readonly onPublish: () => void;
  readonly onUnpublish: () => void;
};

export function EditorToolbar({
  pageName,
  slug,
  status,
  saving,
  uploading = false,
  message,
  messageTone = "neutral",
  onSave,
  onPublish,
  onUnpublish,
}: EditorToolbarProps) {
  return (
    <div className="sticky top-0 z-20 -mx-4 border-b bg-background/95 px-4 py-3 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-heading text-lg font-semibold">
              {pageName}
            </p>
            <Badge variant={status === "published" ? "default" : "secondary"}>
              {status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">/{slug}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {message ? (
            <span
              className={cn(
                "hidden text-sm sm:inline",
                messageTone === "error"
                  ? "text-destructive"
                  : "text-muted-foreground",
              )}
            >
              {message}
            </span>
          ) : null}
          <LinkButton
            href={`/${slug}`}
            size="sm"
            variant="outline"
            target="_blank"
          >
            <ExternalLinkIcon className="size-4" />
            Live page
          </LinkButton>
          <span className="hidden text-xs text-muted-foreground lg:inline">
            Removals update the live page immediately
          </span>
          <LinkButton
            href={`/admin/${slug}/preview`}
            size="sm"
            variant="outline"
            target="_blank"
          >
            Draft preview
          </LinkButton>
          {status === "published" ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onUnpublish}
            >
              Unpublish
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onPublish}
            >
              Publish
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            onClick={onSave}
            disabled={saving || uploading}
          >
            <SaveIcon className="size-4" />
            {saving ? "Saving…" : uploading ? "Uploading…" : "Save"}
          </Button>
        </div>
      </div>
      {message ? (
        <p
          className={cn(
            "mx-auto mt-2 max-w-6xl text-sm sm:hidden",
            messageTone === "error"
              ? "text-destructive"
              : "text-muted-foreground",
          )}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
