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
  readonly normalize?: (value: string) => string;
  readonly onCommit?: (values: string[]) => void;
};

export function StringListEditor({
  label,
  description,
  values,
  onChange,
  placeholder = "Type and press Add…",
  addLabel = "Add",
  normalize,
  onCommit,
}: StringListEditorProps) {
  const [draft, setDraft] = useState("");

  function prepare(value: string): string {
    return (normalize?.(value) ?? value).trim();
  }

  function emit(next: string[]) {
    onChange(next);
    onCommit?.(next);
  }

  function addItem() {
    const trimmed = prepare(draft);
    if (!trimmed) {
      return;
    }
    emit([...values, trimmed]);
    setDraft("");
  }

  function updateItem(index: number, value: string) {
    const next = normalize ? normalize(value) : value;
    onChange(
      values.map((item, itemIndex) => (itemIndex === index ? next : item)),
    );
  }

  function commitItem(index: number, value: string) {
    emit(
      values.map((item, itemIndex) => (itemIndex === index ? value : item)),
    );
  }

  function removeItem(index: number) {
    emit(values.filter((_, itemIndex) => itemIndex !== index));
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
            emit(reorderList(values, fromIndex, toIndex))
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
                onBlur={(event) => {
                  if (!onCommit) {
                    return;
                  }
                  commitItem(
                    index,
                    normalize
                      ? normalize(event.currentTarget.value)
                      : event.currentTarget.value,
                  );
                }}
                onPaste={(event) => {
                  const text = event.clipboardData.getData("text");
                  const normalized = normalize?.(text);
                  if (normalized && normalized !== text) {
                    event.preventDefault();
                    updateItem(index, normalized);
                  }
                }}
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
          onChange={(event) => {
            const next = event.target.value;
            setDraft(normalize?.(next) ?? next);
          }}
          onPaste={(event) => {
            const text = event.clipboardData.getData("text");
            const normalized = normalize?.(text);
            if (normalized && normalized !== text) {
              event.preventDefault();
              setDraft(normalized);
            }
          }}
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
