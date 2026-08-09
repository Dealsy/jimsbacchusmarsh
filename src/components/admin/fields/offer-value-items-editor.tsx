"use client";

import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import type { OfferValueItem } from "./editor-types";
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
  function updateItem(index: number, patch: Partial<OfferValueItem>) {
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
      title="What's included"
      description="Itemize what they get in the assessment — optional dollar value for stacking (e.g. $150)."
      addLabel="Add item"
      onAdd={() => onChange([...values, emptyValueItem()])}
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
            key={`offer-value-${index}`}
            index={index}
            className="space-y-3 rounded-xl border bg-background/80 p-4"
          >
            <div className="flex items-center gap-2">
              <SortableDragHandle index={index} />
              <p className="flex-1 text-sm font-medium text-muted-foreground">
                Item {index + 1}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => removeItem(index)}
              >
                <Trash2Icon className="size-4" />
              </Button>
            </div>
            <Field>
              <FieldLabel>Label</FieldLabel>
              <Input
                value={item.label}
                onChange={(event) =>
                  updateItem(index, { label: event.target.value })
                }
                placeholder="e.g. On-site roof inspection"
              />
            </Field>
            <Field>
              <FieldLabel>Value (optional)</FieldLabel>
              <Input
                value={item.value ?? ""}
                onChange={(event) =>
                  updateItem(index, { value: event.target.value })
                }
                placeholder="e.g. $150"
              />
            </Field>
          </SortableItemRow>
        ))}
      </SortableList>
    </ListSection>
  );
}
