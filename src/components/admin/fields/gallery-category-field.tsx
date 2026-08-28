"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

type GalleryCategoryFieldProps = {
  readonly value: string;
  readonly categories: readonly string[];
  readonly onChange: (category: string) => void;
  readonly onCreateCategory: (category: string) => void;
  readonly showHelp?: boolean;
};

function matchingCategory(
  categories: readonly string[],
  candidate: string,
): string | undefined {
  const lower = candidate.trim().toLowerCase();
  if (!lower) {
    return undefined;
  }
  return categories.find((category) => category.toLowerCase() === lower);
}

export function galleryCategoryOptions(
  serviceTitles: readonly string[],
  storedCategories: readonly (string | undefined)[],
  createdCategories: readonly string[],
): string[] {
  const seen = new Set<string>();
  const options: string[] = [];

  function add(name: string | undefined) {
    const trimmed = name?.trim();
    if (!trimmed || seen.has(trimmed.toLowerCase())) {
      return;
    }
    seen.add(trimmed.toLowerCase());
    options.push(trimmed);
  }

  for (const title of serviceTitles) {
    add(title);
  }
  for (const category of createdCategories) {
    add(category);
  }
  const leftover = storedCategories
    .map((category) => category?.trim())
    .filter((category): category is string => Boolean(category))
    .sort((a, b) => a.localeCompare(b));
  for (const category of leftover) {
    add(category);
  }

  return options;
}

export function GalleryCategoryField({
  value,
  categories,
  onChange,
  onCreateCategory,
  showHelp = true,
}: GalleryCategoryFieldProps) {
  const [draft, setDraft] = useState("");

  function handleCreate() {
    const trimmed = draft.trim();
    if (!trimmed) {
      return;
    }

    const existing = matchingCategory(categories, trimmed);
    if (existing) {
      onChange(existing);
      setDraft("");
      return;
    }

    onCreateCategory(trimmed);
    onChange(trimmed);
    setDraft("");
  }

  return (
    <Field>
      <FieldLabel>Category</FieldLabel>
      <NativeSelect
        className="w-full"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <NativeSelectOption value="">Uncategorized</NativeSelectOption>
        {categories.map((category) => (
          <NativeSelectOption key={category} value={category}>
            {category}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <div className="flex gap-2">
        <Input
          value={draft}
          placeholder="New category name"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleCreate();
            }
          }}
        />
        <Button
          type="button"
          variant="secondary"
          disabled={!draft.trim()}
          onClick={handleCreate}
        >
          <PlusIcon className="size-4" />
          Add
        </Button>
      </div>
      {showHelp ? (
        <FieldDescription>
          Service names appear automatically. Add a category here to use it on
          photos that don't match a service card.
        </FieldDescription>
      ) : null}
    </Field>
  );
}
