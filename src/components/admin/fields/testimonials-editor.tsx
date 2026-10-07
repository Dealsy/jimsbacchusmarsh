"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { TestimonialItem } from "./editor-types";
import { ItemEditorDialog } from "./item-editor-dialog";
import { ListSection } from "./list-section";
import {
  reorderList,
  SortableDragHandle,
  SortableItemRow,
  SortableList,
} from "./sortable-list";

type TestimonialsEditorProps = {
  readonly values: readonly TestimonialItem[];
  readonly onChange: (values: TestimonialItem[]) => void;
};

const emptyTestimonial = (): TestimonialItem => ({
  quote: "",
  author: "",
  location: "",
});

export function TestimonialsEditor({
  values,
  onChange,
}: TestimonialsEditorProps) {
  const [draft, setDraft] = useState<TestimonialItem | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  function openAdd() {
    setEditIndex(null);
    setDraft(emptyTestimonial());
  }

  function openEdit(index: number) {
    const item = values[index];
    if (!item) {
      return;
    }
    setEditIndex(index);
    setDraft({ ...item });
  }

  function closeDialog() {
    setDraft(null);
    setEditIndex(null);
  }

  function saveDraft() {
    if (!draft || !draft.quote.trim()) {
      return;
    }
    if (editIndex === null) {
      onChange([...values, draft]);
    } else {
      onChange(
        values.map((item, itemIndex) =>
          itemIndex === editIndex ? draft : item,
        ),
      );
    }
    closeDialog();
  }

  function removeItem(index: number) {
    onChange(values.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <ListSection
      title="Testimonials"
      description="Customer quotes shown on the page. Drag to reorder."
      addLabel="Add testimonial"
      onAdd={openAdd}
      isEmpty={values.length === 0}
      emptyMessage="No testimonials yet. Add a customer quote."
    >
      <SortableList
        onReorder={(fromIndex, toIndex) =>
          onChange(reorderList(values, fromIndex, toIndex))
        }
      >
        {values.map((item, index) => (
          <SortableItemRow
            key={`${item.author}-${item.quote}-${item.location ?? ""}-${index}`}
            index={index}
            className="flex items-center gap-2 rounded-xl border bg-background/80 p-3"
          >
            <SortableDragHandle index={index} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {item.author.trim() || "Untitled"}
              </p>
              {item.quote.trim() ? (
                <p className="truncate text-xs text-muted-foreground">
                  {item.quote}
                </p>
              ) : null}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => openEdit(index)}
            >
              <PencilIcon className="size-4" />
              Edit
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => removeItem(index)}
            >
              <Trash2Icon className="size-4" />
              Remove
            </Button>
          </SortableItemRow>
        ))}
      </SortableList>

      <ItemEditorDialog
        open={draft !== null}
        title={editIndex === null ? "Add testimonial" : "Edit testimonial"}
        canSave={Boolean(draft?.quote.trim())}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
        onSave={saveDraft}
      >
        {draft ? (
          <>
            <Field>
              <FieldLabel>Quote</FieldLabel>
              <Textarea
                value={draft.quote}
                rows={3}
                autoFocus
                placeholder="What the customer said…"
                onChange={(event) =>
                  setDraft({ ...draft, quote: event.target.value })
                }
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Author name</FieldLabel>
                <Input
                  value={draft.author}
                  placeholder="e.g. Sarah M."
                  onChange={(event) =>
                    setDraft({ ...draft, author: event.target.value })
                  }
                />
              </Field>
              <Field>
                <FieldLabel>Location (optional)</FieldLabel>
                <Input
                  value={draft.location ?? ""}
                  placeholder="e.g. Bacchus Marsh"
                  onChange={(event) =>
                    setDraft({ ...draft, location: event.target.value })
                  }
                />
              </Field>
            </div>
          </>
        ) : null}
      </ItemEditorDialog>
    </ListSection>
  );
}
