"use client";

import { Trash2Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { HowItWorksStep } from "./editor-types";
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
  function updateItem(index: number, patch: Partial<HowItWorksStep>) {
    onChange(
      renumberSteps(
        values.map((item, itemIndex) =>
          itemIndex === index ? { ...item, ...patch } : item,
        ),
      ),
    );
  }

  function removeItem(index: number) {
    onChange(
      renumberSteps(values.filter((_, itemIndex) => itemIndex !== index)),
    );
  }

  function handleReorder(fromIndex: number, toIndex: number) {
    onChange(renumberSteps(reorderList(values, fromIndex, toIndex)));
  }

  return (
    <ListSection
      title="How it works"
      description="Step-by-step process shown on the page. Drag to reorder."
      addLabel="Add step"
      onAdd={() => onChange([...values, emptyStep(values.length + 1)])}
      isEmpty={values.length === 0}
      emptyMessage="No steps yet. Add how your service works."
    >
      <SortableList onReorder={handleReorder}>
        {values.map((step, index) => (
          <SortableItemRow
            key={`step-${index}`}
            index={index}
            className="space-y-4 rounded-xl border bg-background/80 p-4"
          >
            <div className="flex items-center gap-2">
              <SortableDragHandle index={index} />
              <Badge variant="secondary">Step {step.step}</Badge>
              <div className="flex-1" />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => removeItem(index)}
                aria-label="Remove step"
              >
                <Trash2Icon className="size-4" />
              </Button>
            </div>

            <Field>
              <FieldLabel>Step title</FieldLabel>
              <Input
                value={step.title}
                placeholder="e.g. Free on-site assessment"
                onChange={(event) =>
                  updateItem(index, { title: event.target.value })
                }
              />
            </Field>

            <Field>
              <FieldLabel>Step description</FieldLabel>
              <Textarea
                value={step.description}
                rows={3}
                placeholder="Explain what happens in this step…"
                onChange={(event) =>
                  updateItem(index, { description: event.target.value })
                }
              />
            </Field>
          </SortableItemRow>
        ))}
      </SortableList>
    </ListSection>
  );
}
