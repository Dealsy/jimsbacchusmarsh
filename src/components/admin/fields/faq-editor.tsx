"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { FaqItem } from "./editor-types";
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
  function updateItem(index: number, patch: Partial<FaqItem>) {
    onChange(
      values.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  }

  function removeItem(index: number) {
    onChange(values.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <ListSection
      title="FAQ"
      description="Questions customers ask — shown as an accordion on the page. Drag to reorder."
      addLabel="Add FAQ"
      onAdd={() => onChange([...values, emptyFaq()])}
      isEmpty={values.length === 0}
      emptyMessage="No FAQs yet. Click “Add FAQ” to create one."
    >
      {values.length > 0 ? (
        <SortableList
          onReorder={(fromIndex, toIndex) =>
            onChange(reorderList(values, fromIndex, toIndex))
          }
        >
          {values.map((item, index) => (
            <SortableItemRow
              key={`faq-${index}`}
              index={index}
              className="space-y-4 rounded-xl border bg-background/80 p-4"
            >
              <div className="flex items-center gap-2">
                <SortableDragHandle index={index} />
                <p className="flex-1 text-sm font-medium text-muted-foreground">
                  FAQ {index + 1}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => removeItem(index)}
                  aria-label="Remove FAQ"
                >
                  <Trash2Icon className="size-4" />
                </Button>
              </div>

              <Field>
                <FieldLabel>Question</FieldLabel>
                <Input
                  value={item.question}
                  placeholder="e.g. Will softwashing damage my roof?"
                  onChange={(event) =>
                    updateItem(index, { question: event.target.value })
                  }
                />
              </Field>

              <Field>
                <FieldLabel>Answer</FieldLabel>
                <Textarea
                  value={item.answer}
                  rows={4}
                  placeholder="Write a clear, helpful answer…"
                  onChange={(event) =>
                    updateItem(index, { answer: event.target.value })
                  }
                />
              </Field>
            </SortableItemRow>
          ))}
        </SortableList>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => onChange([emptyFaq()])}
        >
          <PlusIcon className="size-4" />
          Add your first FAQ
        </Button>
      )}
    </ListSection>
  );
}
