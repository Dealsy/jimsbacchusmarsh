"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type ListSectionProps = {
  readonly title: string;
  readonly description?: string;
  readonly addLabel?: string;
  readonly onAdd?: () => void;
  readonly children: React.ReactNode;
  readonly emptyMessage?: string;
  readonly isEmpty?: boolean;
};

export function ListSection({
  title,
  description,
  addLabel = "Add item",
  onAdd,
  children,
  emptyMessage,
  isEmpty = false,
}: ListSectionProps) {
  return (
    <section className="space-y-4 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="font-heading text-base font-semibold">{title}</h3>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {onAdd ? (
          <Button type="button" variant="outline" size="sm" onClick={onAdd}>
            <PlusIcon className="size-4" />
            {addLabel}
          </Button>
        ) : null}
      </div>

      {isEmpty && emptyMessage ? (
        <p className="rounded-xl border border-dashed bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      ) : null}

      <div className="space-y-3">{children}</div>
    </section>
  );
}
