"use client";

import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { type TestimonialItem } from "./editor-types";
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
  function updateItem(index: number, patch: Partial<TestimonialItem>) {
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
      title="Testimonials"
      description="Customer quotes shown on the page. Drag to reorder."
      addLabel="Add testimonial"
      onAdd={() => onChange([...values, emptyTestimonial()])}
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
            key={`testimonial-${index}`}
            index={index}
            className="space-y-4 rounded-xl border bg-background/80 p-4"
          >
            <div className="flex items-center gap-2">
              <SortableDragHandle index={index} />
              <p className="flex-1 text-sm font-medium text-muted-foreground">
                Testimonial {index + 1}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => removeItem(index)}
                aria-label="Remove testimonial"
              >
                <Trash2Icon className="size-4" />
              </Button>
            </div>

            <Field>
              <FieldLabel>Quote</FieldLabel>
              <Textarea
                value={item.quote}
                rows={3}
                placeholder="What the customer said…"
                onChange={(event) =>
                  updateItem(index, { quote: event.target.value })
                }
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Author name</FieldLabel>
                <Input
                  value={item.author}
                  placeholder="e.g. Sarah M."
                  onChange={(event) =>
                    updateItem(index, { author: event.target.value })
                  }
                />
              </Field>
              <Field>
                <FieldLabel>Location (optional)</FieldLabel>
                <Input
                  value={item.location ?? ""}
                  placeholder="e.g. Bacchus Marsh"
                  onChange={(event) =>
                    updateItem(index, { location: event.target.value })
                  }
                />
              </Field>
            </div>
          </SortableItemRow>
        ))}
      </SortableList>
    </ListSection>
  );
}
