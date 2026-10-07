"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ItemEditorDialogProps = {
  readonly open: boolean;
  readonly title: string;
  readonly description?: string;
  readonly saveLabel?: string;
  readonly canSave: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSave: () => void;
  readonly children: ReactNode;
};

export function ItemEditorDialog({
  open,
  title,
  description,
  saveLabel = "Save",
  canSave,
  onOpenChange,
  onSave,
  children,
}: ItemEditorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col gap-4 overflow-hidden sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <form
          className="flex min-h-0 flex-1 flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (canSave) {
              onSave();
            }
          }}
        >
          <div className="-m-1.5 min-h-0 flex-1 space-y-4 overflow-y-auto p-1.5">
            {children}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!canSave}>
              {saveLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
