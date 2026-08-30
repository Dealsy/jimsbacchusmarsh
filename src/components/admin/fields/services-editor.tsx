"use client";

import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/slug";

import { SERVICE_ICON_OPTIONS, type ServiceItem } from "./editor-types";
import { ListSection } from "./list-section";
import {
  reorderList,
  SortableDragHandle,
  SortableItemRow,
  SortableList,
} from "./sortable-list";
import { StringListEditor } from "./string-list-editor";

type ServicesEditorProps = {
  readonly values: readonly ServiceItem[];
  readonly onChange: (values: ServiceItem[]) => void;
};

const emptyService = (): ServiceItem => ({
  title: "",
  description: "",
  icon: "home",
  slug: "",
  pageHeadline: "",
  pageIntro: "",
  pageBody: "",
  whatsIncluded: [],
});

export function ServicesEditor({ values, onChange }: ServicesEditorProps) {
  function updateItem(index: number, patch: Partial<ServiceItem>) {
    onChange(
      values.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        const next = { ...item, ...patch };
        if (patch.title !== undefined) {
          const previousAutoSlug = slugify(item.title);
          const currentSlug = item.slug?.trim() ?? "";
          if (!currentSlug || currentSlug === previousAutoSlug) {
            next.slug = slugify(patch.title);
          }
        }
        return next;
      }),
    );
  }

  function removeItem(index: number) {
    onChange(values.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <ListSection
      title="Services"
      description="What you offer — shown as cards on the landing page, each with its own detail page. Drag to reorder."
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
            key={`${service.slug || service.title || "new-service"}-${service.description}`}
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
              <FieldLabel>URL slug</FieldLabel>
              <Input
                value={service.slug ?? ""}
                placeholder="e.g. driveways-paths"
                onChange={(event) =>
                  updateItem(index, { slug: event.target.value })
                }
              />
              <FieldDescription>
                Used in the service page URL. Auto-filled from the title; you
                can edit it. Do not use thank-you.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel>Card description</FieldLabel>
              <Textarea
                value={service.description}
                rows={3}
                placeholder="Short description for this service card…"
                onChange={(event) =>
                  updateItem(index, { description: event.target.value })
                }
              />
            </Field>

            <Field>
              <FieldLabel>Page headline</FieldLabel>
              <Input
                value={service.pageHeadline ?? ""}
                placeholder="Defaults to the title if left blank"
                onChange={(event) =>
                  updateItem(index, { pageHeadline: event.target.value })
                }
              />
            </Field>

            <Field>
              <FieldLabel>Page intro</FieldLabel>
              <Textarea
                value={service.pageIntro ?? ""}
                rows={2}
                placeholder="Short paragraph at the top of the service page…"
                onChange={(event) =>
                  updateItem(index, { pageIntro: event.target.value })
                }
              />
            </Field>

            <Field>
              <FieldLabel>Page body</FieldLabel>
              <Textarea
                value={service.pageBody ?? ""}
                rows={4}
                placeholder="Longer copy for the service page…"
                onChange={(event) =>
                  updateItem(index, { pageBody: event.target.value })
                }
              />
            </Field>

            <StringListEditor
              label="What's included"
              description="Shown as a list on the service page."
              values={service.whatsIncluded ?? []}
              onChange={(whatsIncluded) => updateItem(index, { whatsIncluded })}
              placeholder="e.g. Oil stain treatment"
              addLabel="Add item"
            />
          </SortableItemRow>
        ))}
      </SortableList>
    </ListSection>
  );
}
