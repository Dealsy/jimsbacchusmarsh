"use client";

import { useEffect, useId, useRef, useState } from "react";

import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { AddressSuggestion } from "@/lib/address-search/photon";
import { cn } from "@/lib/utils";

type AddressAutocompleteFieldProps = {
  readonly id: string;
  readonly value: string;
  readonly suburb: string;
  readonly error?: string;
  readonly onChange: (next: { address: string; suburb: string }) => void;
};

export function AddressAutocompleteField({
  id,
  value,
  suburb,
  error,
  onChange,
}: AddressAutocompleteFieldProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<readonly AddressSuggestion[]>(
    [],
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (inputValue.trim().length < 3) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      setIsLoading(true);
      void fetch(`/api/address-search?q=${encodeURIComponent(inputValue)}`, {
        signal: controller.signal,
      })
        .then(async (response) => {
          if (!response.ok) {
            return { suggestions: [] as AddressSuggestion[] };
          }
          return (await response.json()) as {
            suggestions: AddressSuggestion[];
          };
        })
        .then((data) => {
          setSuggestions(data.suggestions);
          setActiveIndex(-1);
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            setSuggestions([]);
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsLoading(false);
          }
        });
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [inputValue]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function selectSuggestion(suggestion: AddressSuggestion) {
    setInputValue(suggestion.address);
    onChange({ address: suggestion.address, suburb: suggestion.suburb });
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function handleInputChange(nextValue: string) {
    setInputValue(nextValue);
    onChange({ address: nextValue, suburb: "" });
    setIsOpen(true);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || suggestions.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) =>
        current >= suggestions.length - 1 ? 0 : current + 1,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        current <= 0 ? suggestions.length - 1 : current - 1,
      );
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      const suggestion = suggestions[activeIndex];
      if (suggestion) {
        selectSuggestion(suggestion);
      }
      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <Input
        id={id}
        name="address"
        value={inputValue}
        onChange={(event) => handleInputChange(event.target.value)}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        autoComplete="street-address"
        placeholder="Start typing your street address…"
        aria-invalid={Boolean(error)}
        aria-expanded={isOpen && suggestions.length > 0}
        aria-controls={listboxId}
        aria-autocomplete="list"
        role="combobox"
      />
      <input type="hidden" name="suburb" value={suburb} />

      {isOpen && (isLoading || suggestions.length > 0) ? (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border bg-popover p-1 shadow-lg"
        >
          {isLoading ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              Searching addresses…
            </p>
          ) : (
            suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={cn(
                  "flex w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground",
                  index === activeIndex && "bg-accent text-accent-foreground",
                )}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectSuggestion(suggestion)}
              >
                {suggestion.label}
              </button>
            ))
          )}
        </div>
      ) : null}

      <p className="mt-2 text-xs text-muted-foreground">
        Address search powered by{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          OpenStreetMap
        </a>
        . You can type your full address if it doesn&apos;t appear.
      </p>

      {error ? <FieldError className="mt-2">{error}</FieldError> : null}
    </div>
  );
}
