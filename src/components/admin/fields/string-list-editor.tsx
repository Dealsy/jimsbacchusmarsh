"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ListSection } from "./list-section";
import {
  reorderList,
  SortableDragHandle,
  SortableItemRow,
  SortableList,
} from "./sortable-list";

type StringListEditorProps = {
  readonly label: string;
  readonly description?: string;
  readonly values: readonly string[];
  readonly onChange: (values: string[]) => void;
  readonly placeholder?: string;
  readonly addLabel?: string;
};

export function StringListEditor({
  label,
  description,
  values,
  onChange,
  placeholder = "Type and press Add…",
  addLabel = "Add",
}: StringListEditorProps) {
  const [draft, setDraft] = useState("");

  function addItem() {
    const trimmed = draft.trim();
    if (!trimmed) {
      return;
    }
    onChange([...values, trimmed]);
    setDraft("");
  }

  function updateItem(index: number, value: string) {
    onChange(
      values.map((item, itemIndex) => (itemIndex === index ? value : item)),
    );
  }

  function removeItem(index: number) {
    onChange(values.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <ListSection
      title={label}
      description={
        description
          ? `${description} Drag the handle to reorder.`
          : "Drag the handle to reorder."
      }
      isEmpty={values.length === 0}
      emptyMessage="Nothing here yet — add your first item below."
    >
      {values.length > 0 ? (
        <SortableList
          className="space-y-2"
          onReorder={(fromIndex, toIndex) =>
            onChange(reorderList(values, fromIndex, toIndex))
          }
        >
          {values.map((value, index) => (
            <SortableItemRow
              key={`${label}-${index}-${value}`}
              index={index}
              className="flex items-center gap-2 rounded-xl border bg-background/80 p-2"
            >
              <SortableDragHandle index={index} />
              <Input
                value={value}
                aria-label={`${label} ${index + 1}`}
                onChange={(event) => updateItem(index, event.target.value)}
                className="border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeItem(index)}
                aria-label="Remove"
              >
                <Trash2Icon className="size-4" />
              </Button>
            </SortableItemRow>
          ))}
        </SortableList>
      ) : null}

      <div className="flex gap-2 pt-1">
        <Input
          value={draft}
          placeholder={placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addItem();
            }
          }}
        />
        <Button type="button" variant="secondary" onClick={addItem}>
          <PlusIcon className="size-4" />
          {addLabel}
        </Button>
      </div>
    </ListSection>
  );
}
