"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import type { OfferValueItem } from "./editor-types";
import { ItemEditorDialog } from "./item-editor-dialog";
import { ListSection } from "./list-section";
import {
  reorderList,
  SortableDragHandle,
  SortableItemRow,
  SortableList,
} from "./sortable-list";

type OfferValueItemsEditorProps = {
  readonly values: readonly OfferValueItem[];
  readonly onChange: (values: OfferValueItem[]) => void;
};

const emptyValueItem = (): OfferValueItem => ({
  label: "",
  value: "",
});

export function OfferValueItemsEditor({
  values,
  onChange,
}: OfferValueItemsEditorProps) {
  const [draft, setDraft] = useState<OfferValueItem | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  function openAdd() {
    setEditIndex(null);
    setDraft(emptyValueItem());
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
    if (!draft || !draft.label.trim()) {
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
      title="What's included"
      description="Itemize what they get in the assessment — optional dollar value for stacking (e.g. $150). Remove, add, and reorder update the live page immediately."
      addLabel="Add item"
      onAdd={openAdd}
      isEmpty={values.length === 0}
      emptyMessage="No value items yet. Add what's included in your offer."
    >
      <SortableList
        onReorder={(fromIndex, toIndex) =>
          onChange(reorderList(values, fromIndex, toIndex))
        }
      >
        {values.map((item, index) => (
          <SortableItemRow
            key={`${item.label}-${item.value ?? ""}-${index}`}
            index={index}
            className="flex items-center gap-2 rounded-xl border bg-background/80 p-3"
          >
            <SortableDragHandle index={index} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {item.label.trim() || "Untitled"}
              </p>
              {item.value?.trim() ? (
                <p className="truncate text-xs text-muted-foreground">
                  {item.value}
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
        title={editIndex === null ? "Add item" : "Edit item"}
        canSave={Boolean(draft?.label.trim())}
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
              <FieldLabel>Label</FieldLabel>
              <Input
                value={draft.label}
                autoFocus
                placeholder="e.g. On-site roof inspection"
                onChange={(event) =>
                  setDraft({ ...draft, label: event.target.value })
                }
              />
            </Field>
            <Field>
              <FieldLabel>Value (optional)</FieldLabel>
              <Input
                value={draft.value ?? ""}
                placeholder="e.g. $150"
                onChange={(event) =>
                  setDraft({ ...draft, value: event.target.value })
                }
              />
            </Field>
          </>
        ) : null}
      </ItemEditorDialog>
    </ListSection>
  );
}
