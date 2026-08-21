"use client";

import { useRef, useState, useTransition } from "react";
import { capturePostHogEvent } from "@/components/analytics/posthog";
import { AddressAutocompleteField } from "@/components/landing/address-autocomplete-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitLead } from "@/lib/actions/submit-lead";
import { formatPhoneHref, isPlaceholderPhone } from "@/lib/phone";
import type { PublishedLandingPage } from "@/lib/types/landing-page";
import {
  extractLeadFormValues,
  type LeadFormFieldErrors,
  OTHER_SURFACE_OPTION,
  validateLeadForm,
} from "@/lib/validations/lead-form";

type LeadFormProps = {
  readonly page: PublishedLandingPage;
};

export function LeadForm({ page }: LeadFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const hasTrackedFormStart = useRef(false);
  const [fieldErrors, setFieldErrors] = useState<LeadFormFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedSurfaces, setSelectedSurfaces] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [suburb, setSuburb] = useState("");
  const [isPending, startTransition] = useTransition();

  const showOtherDescription = selectedSurfaces.includes(OTHER_SURFACE_OPTION);

  function clearFieldError(field: keyof LeadFormFieldErrors) {
    setFieldErrors((current) => {
      if (!(field in current)) {
        return current;
      }
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function toggleSurface(surface: string, checked: boolean) {
    clearFieldError("surfaces");
    clearFieldError("description");

    setSelectedSurfaces((current) => {
      if (checked) {
        return [...current, surface];
      }

      return current.filter((item) => item !== surface);
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    for (const surface of selectedSurfaces) {
      formData.append("surfaces", surface);
    }

    const rawValues = extractLeadFormValues(formData, selectedSurfaces);
    const validation = validateLeadForm(rawValues, page.surfaceOptions);

    if (!validation.success) {
      setFieldErrors(validation.fieldErrors);
      return;
    }

    startTransition(async () => {
      try {
        const result = await submitLead(formData, page.surfaceOptions);

        if (result.success) {
          const photo = formData.get("photo");
          capturePostHogEvent("lead_form_submitted", {
            page_slug: page.slug,
            service_type: page.leadServiceType,
            selected_surface_count: selectedSurfaces.length,
            has_photo: photo instanceof File && photo.size > 0,
          });
          window.location.assign(`/${page.slug}/thank-you`);
          return;
        }

        setFormError(result.error);
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
      } catch {
        setFormError(
          "Something went wrong sending your request. If you attached a photo, try again with a smaller image or no photo.",
        );
      }
    });
  }

  function handleFormFocusCapture(event: React.FocusEvent<HTMLFormElement>) {
    if (hasTrackedFormStart.current) {
      return;
    }

    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.name === "website") {
      return;
    }

    hasTrackedFormStart.current = true;
    capturePostHogEvent("form_started", { page_slug: page.slug });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onFocusCapture={handleFormFocusCapture}
      noValidate
      className="space-y-6"
    >
      <input type="hidden" name="pageSlug" value={page.slug} />
      <input type="hidden" name="pageName" value={page.name} />
      <input
        type="hidden"
        name="leadServiceType"
        value={page.leadServiceType}
      />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <FieldGroup>
        <Field data-invalid={Boolean(fieldErrors.name)}>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            aria-invalid={Boolean(fieldErrors.name)}
            onChange={() => clearFieldError("name")}
          />
          {fieldErrors.name ? (
            <FieldError>{fieldErrors.name}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(fieldErrors.phone)}>
          <FieldLabel htmlFor="phone">Phone</FieldLabel>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={Boolean(fieldErrors.phone)}
            onChange={() => clearFieldError("phone")}
          />
          {fieldErrors.phone ? (
            <FieldError>{fieldErrors.phone}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(fieldErrors.address)}>
          <FieldLabel htmlFor="address">Property address</FieldLabel>
          <AddressAutocompleteField
            id="address"
            value={address}
            suburb={suburb}
            error={fieldErrors.address}
            onChange={({ address: nextAddress, suburb: nextSuburb }) => {
              setAddress(nextAddress);
              setSuburb(nextSuburb);
              clearFieldError("address");
            }}
          />
        </Field>

        <FieldSet
          data-invalid={Boolean(fieldErrors.surfaces)}
          className="gap-3 border-0 p-0"
        >
          <FieldLegend className="mb-0 px-0">Affected surface</FieldLegend>
          <div className="grid gap-3 sm:grid-cols-2">
            {page.surfaceOptions.map((surface) => {
              const surfaceId = `surface-${surface.replace(/\s+/g, "-").toLowerCase()}`;
              return (
                <label
                  key={surface}
                  htmlFor={surfaceId}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 has-checked:border-primary has-checked:bg-primary/5"
                >
                  <Checkbox
                    id={surfaceId}
                    checked={selectedSurfaces.includes(surface)}
                    onCheckedChange={(checked) =>
                      toggleSurface(surface, checked === true)
                    }
                  />
                  <span className="text-sm">{surface}</span>
                </label>
              );
            })}
          </div>
          {fieldErrors.surfaces ? (
            <FieldError>{fieldErrors.surfaces}</FieldError>
          ) : null}
        </FieldSet>

        <Field data-invalid={Boolean(fieldErrors.description)}>
          <FieldLabel htmlFor="description">
            {showOtherDescription
              ? "Describe the issue"
              : "Anything else we should know?"}
            {!showOtherDescription ? (
              <span className="font-normal text-muted-foreground">
                {" "}
                (optional)
              </span>
            ) : null}
          </FieldLabel>
          <Textarea
            id="description"
            name="description"
            rows={4}
            placeholder={
              showOtherDescription
                ? "Tell us what's affected and what you're seeing…"
                : "Access notes, severity, preferred callback time, etc."
            }
            aria-invalid={Boolean(fieldErrors.description)}
            aria-required={showOtherDescription}
            onChange={() => clearFieldError("description")}
          />
          {fieldErrors.description ? (
            <FieldError>{fieldErrors.description}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(fieldErrors.photo)}>
          <FieldLabel htmlFor="photo">
            Photo of affected area{" "}
            <span className="font-normal text-muted-foreground">
              (optional, max 3 MB)
            </span>
          </FieldLabel>
          <Input
            id="photo"
            name="photo"
            type="file"
            accept="image/*"
            className="cursor-pointer file:cursor-pointer"
            aria-invalid={Boolean(fieldErrors.photo)}
            onChange={() => clearFieldError("photo")}
          />
          {fieldErrors.photo ? (
            <FieldError>{fieldErrors.photo}</FieldError>
          ) : null}
        </Field>
      </FieldGroup>

      {formError ? (
        <p className="text-sm text-destructive" role="alert">
          {formError}
          {!isPlaceholderPhone(page.phone) ? (
            <>
              {" "}
              Or call{" "}
              <a
                href={formatPhoneHref(page.phone)}
                className="font-medium underline"
              >
                {page.phone}
              </a>
              .
            </>
          ) : null}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Sending…" : page.ctaLabel}
      </Button>
    </form>
  );
}
