"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { HowItWorksStep } from "./editor-types";
import { ItemEditorDialog } from "./item-editor-dialog";
import { ListSection } from "./list-section";
import {
  reorderList,
  SortableDragHandle,
  SortableItemRow,
  SortableList,
} from "./sortable-list";

type HowItWorksEditorProps = {
  readonly values: readonly HowItWorksStep[];
  readonly onChange: (values: HowItWorksStep[]) => void;
};

function renumberSteps(steps: readonly HowItWorksStep[]): HowItWorksStep[] {
  return steps.map((step, index) => ({ ...step, step: index + 1 }));
}

const emptyStep = (stepNumber: number): HowItWorksStep => ({
  step: stepNumber,
  title: "",
  description: "",
});

export function HowItWorksEditor({ values, onChange }: HowItWorksEditorProps) {
  const [draft, setDraft] = useState<HowItWorksStep | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  function openAdd() {
    setEditIndex(null);
    setDraft(emptyStep(values.length + 1));
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
    if (!draft || !draft.title.trim()) {
      return;
    }
    if (editIndex === null) {
      onChange(renumberSteps([...values, draft]));
    } else {
      onChange(
        renumberSteps(
          values.map((item, itemIndex) =>
            itemIndex === editIndex ? draft : item,
          ),
        ),
      );
    }
    closeDialog();
  }

  function removeItem(index: number) {
    onChange(
      renumberSteps(values.filter((_, itemIndex) => itemIndex !== index)),
    );
  }

  return (
    <ListSection
      title="How it works"
      description="Step-by-step process shown on the page. Drag to reorder. Remove, add, and reorder update the live page immediately."
      addLabel="Add step"
      onAdd={openAdd}
      isEmpty={values.length === 0}
      emptyMessage="No steps yet. Add how your service works."
    >
      <SortableList
        onReorder={(fromIndex, toIndex) =>
          onChange(renumberSteps(reorderList(values, fromIndex, toIndex)))
        }
      >
        {values.map((step, index) => (
          <SortableItemRow
            key={`${step.title}-${step.description}-${index}`}
            index={index}
            className="flex items-center gap-2 rounded-xl border bg-background/80 p-3"
          >
            <SortableDragHandle index={index} />
            <Badge variant="secondary">Step {step.step}</Badge>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {step.title.trim() || "Untitled"}
              </p>
              {step.description.trim() ? (
                <p className="truncate text-xs text-muted-foreground">
                  {step.description}
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
        title={editIndex === null ? "Add step" : "Edit step"}
        canSave={Boolean(draft?.title.trim())}
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
              <FieldLabel>Step title</FieldLabel>
              <Input
                value={draft.title}
                autoFocus
                placeholder="e.g. Free on-site assessment"
                onChange={(event) =>
                  setDraft({ ...draft, title: event.target.value })
                }
              />
            </Field>
            <Field>
              <FieldLabel>Step description</FieldLabel>
              <Textarea
                value={draft.description}
                rows={3}
                placeholder="Explain what happens in this step…"
                onChange={(event) =>
                  setDraft({ ...draft, description: event.target.value })
                }
              />
            </Field>
          </>
        ) : null}
      </ItemEditorDialog>
    </ListSection>
  );
}
