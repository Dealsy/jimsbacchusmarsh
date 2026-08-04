"use client";

import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

import {
  SERVICE_ICON_OPTIONS,
  type ServiceItem,
} from "./editor-types";
import { ListSection } from "./list-section";
import {
  reorderList,
  SortableDragHandle,
  SortableItemRow,
  SortableList,
} from "./sortable-list";

type ServicesEditorProps = {
  readonly values: readonly ServiceItem[];
  readonly onChange: (values: ServiceItem[]) => void;
};

const emptyService = (): ServiceItem => ({
  title: "",
  description: "",
  icon: "home",
});

export function ServicesEditor({ values, onChange }: ServicesEditorProps) {
  function updateItem(index: number, patch: Partial<ServiceItem>) {
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
      title="Services"
      description="What you offer — shown as cards on the landing page. Drag to reorder."
      addLabel="Add service"
      onAdd={() => onChange([...values, emptyService()])}
      isEmpty={values.length === 0}
      emptyMessage="No services yet. Add your first service card."
    >
      <SortableList
        onReorder={(fromIndex, toIndex) =>
          onChange(reorderList(values, fromIndex, toIndex))
        }
      >
        {values.map((service, index) => (
          <SortableItemRow
            key={`service-${index}`}
            index={index}
            className="space-y-4 rounded-xl border bg-background/80 p-4"
          >
            <div className="flex items-center gap-2">
              <SortableDragHandle index={index} />
              <p className="flex-1 text-sm font-medium text-muted-foreground">
                Service {index + 1}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => removeItem(index)}
                aria-label="Remove service"
              >
                <Trash2Icon className="size-4" />
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_12rem]">
              <Field>
                <FieldLabel>Title</FieldLabel>
                <Input
                  value={service.title}
                  placeholder="e.g. Roofs"
                  onChange={(event) =>
                    updateItem(index, { title: event.target.value })
                  }
                />
              </Field>
              <Field>
                <FieldLabel>Icon</FieldLabel>
                <NativeSelect
                  className="w-full"
                  value={service.icon ?? "home"}
                  onChange={(event) =>
                    updateItem(index, { icon: event.target.value })
                  }
                >
                  {SERVICE_ICON_OPTIONS.map((option) => (
                    <NativeSelectOption key={option.value} value={option.value}>
                      {option.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </Field>
            </div>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                value={service.description}
                rows={3}
                placeholder="Short description for this service…"
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
