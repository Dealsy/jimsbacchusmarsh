"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

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
import { ItemEditorDialog } from "./item-editor-dialog";
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
  const [draft, setDraft] = useState<ServiceItem | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  function openAdd() {
    setEditIndex(null);
    setDraft(emptyService());
  }

  function openEdit(index: number) {
    const item = values[index];
    if (!item) {
      return;
    }
    setEditIndex(index);
    setDraft({
      ...item,
      whatsIncluded: [...(item.whatsIncluded ?? [])],
    });
  }

  function closeDialog() {
    setDraft(null);
    setEditIndex(null);
  }

  function updateDraft(patch: Partial<ServiceItem>) {
    setDraft((current) => {
      if (!current) {
        return current;
      }
      const next = { ...current, ...patch };
      if (patch.title !== undefined) {
        const previousAutoSlug = slugify(current.title);
        const currentSlug = current.slug?.trim() ?? "";
        if (!currentSlug || currentSlug === previousAutoSlug) {
          next.slug = slugify(patch.title);
        }
      }
      return next;
    });
  }

  function saveDraft() {
    if (!draft || !draft.title.trim()) {
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
      title="Services"
      description="What you offer — shown as cards on the landing page, each with its own detail page. Drag to reorder."
      addLabel="Add service"
      onAdd={openAdd}
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
            key={`${service.slug || service.title}-${service.description}-${index}`}
            index={index}
            className="flex items-center gap-2 rounded-xl border bg-background/80 p-3"
          >
            <SortableDragHandle index={index} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {service.title.trim() || "Untitled"}
              </p>
              {service.description.trim() ? (
                <p className="truncate text-xs text-muted-foreground">
                  {service.description}
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
        title={editIndex === null ? "Add service" : "Edit service"}
        description="Shown as a card on the landing page, with its own detail page."
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
            <div className="grid gap-4 md:grid-cols-[1fr_12rem]">
              <Field>
                <FieldLabel>Title</FieldLabel>
                <Input
                  value={draft.title}
                  placeholder="e.g. Roofs"
                  autoFocus
                  onChange={(event) =>
                    updateDraft({ title: event.target.value })
                  }
                />
              </Field>
              <Field>
                <FieldLabel>Icon</FieldLabel>
                <NativeSelect
                  className="w-full"
                  value={draft.icon ?? "home"}
                  onChange={(event) =>
                    updateDraft({ icon: event.target.value })
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
                value={draft.slug ?? ""}
                placeholder="e.g. driveways-paths"
                onChange={(event) => updateDraft({ slug: event.target.value })}
              />
              <FieldDescription>
                Used in the service page URL. Auto-filled from the title; you
                can edit it. Do not use thank-you.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel>Card description</FieldLabel>
              <Textarea
                value={draft.description}
                rows={3}
                placeholder="Short description for this service card…"
                onChange={(event) =>
                  updateDraft({ description: event.target.value })
                }
              />
            </Field>

            <Field>
              <FieldLabel>Page headline</FieldLabel>
              <Input
                value={draft.pageHeadline ?? ""}
                placeholder="Defaults to the title if left blank"
                onChange={(event) =>
                  updateDraft({ pageHeadline: event.target.value })
                }
              />
            </Field>

            <Field>
              <FieldLabel>Page intro</FieldLabel>
              <Textarea
                value={draft.pageIntro ?? ""}
                rows={2}
                placeholder="Short paragraph at the top of the service page…"
                onChange={(event) =>
                  updateDraft({ pageIntro: event.target.value })
                }
              />
            </Field>

            <Field>
              <FieldLabel>Page body</FieldLabel>
              <Textarea
                value={draft.pageBody ?? ""}
                rows={4}
                placeholder="Longer copy for the service page…"
                onChange={(event) =>
                  updateDraft({ pageBody: event.target.value })
                }
              />
            </Field>

            <StringListEditor
              label="What's included"
              description="Shown as a list on the service page."
              values={draft.whatsIncluded ?? []}
              onChange={(whatsIncluded) => updateDraft({ whatsIncluded })}
              placeholder="e.g. Oil stain treatment"
              addLabel="Add item"
            />
          </>
        ) : null}
      </ItemEditorDialog>
    </ListSection>
  );
}
