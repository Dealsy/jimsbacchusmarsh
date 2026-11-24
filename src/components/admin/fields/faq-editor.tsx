"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { FaqItem } from "./editor-types";
import { ItemEditorDialog } from "./item-editor-dialog";
import { ListSection } from "./list-section";
import {
  reorderList,
  SortableDragHandle,
  SortableItemRow,
  SortableList,
} from "./sortable-list";

type FaqEditorProps = {
  readonly values: readonly FaqItem[];
  readonly onChange: (values: FaqItem[]) => void;
};

const emptyFaq = (): FaqItem => ({
  question: "",
  answer: "",
});

export function FaqEditor({ values, onChange }: FaqEditorProps) {
  const [draft, setDraft] = useState<FaqItem | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  function openAdd() {
    setEditIndex(null);
    setDraft(emptyFaq());
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
    if (!draft || !draft.question.trim()) {
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
      title="FAQ"
      description="Questions customers ask — shown as an accordion on the page. Drag to reorder. Remove, add, and reorder update the live page immediately."
      addLabel="Add FAQ"
      onAdd={openAdd}
      isEmpty={values.length === 0}
      emptyMessage="No FAQs yet. Click “Add FAQ” to create one."
    >
      <SortableList
        onReorder={(fromIndex, toIndex) =>
          onChange(reorderList(values, fromIndex, toIndex))
        }
      >
        {values.map((item, index) => (
          <SortableItemRow
            key={`${item.question}-${item.answer}-${index}`}
            index={index}
            className="flex items-center gap-2 rounded-xl border bg-background/80 p-3"
          >
            <SortableDragHandle index={index} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {item.question.trim() || "Untitled"}
              </p>
              {item.answer.trim() ? (
                <p className="truncate text-xs text-muted-foreground">
                  {item.answer}
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
        title={editIndex === null ? "Add FAQ" : "Edit FAQ"}
        canSave={Boolean(draft?.question.trim())}
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
              <FieldLabel>Question</FieldLabel>
              <Input
                value={draft.question}
                autoFocus
                placeholder="e.g. Will softwashing damage my roof?"
                onChange={(event) =>
                  setDraft({ ...draft, question: event.target.value })
                }
              />
            </Field>
            <Field>
              <FieldLabel>Answer</FieldLabel>
              <Textarea
                value={draft.answer}
                rows={4}
                placeholder="Write a clear, helpful answer…"
                onChange={(event) =>
                  setDraft({ ...draft, answer: event.target.value })
                }
              />
            </Field>
          </>
        ) : null}
      </ItemEditorDialog>
    </ListSection>
  );
}
