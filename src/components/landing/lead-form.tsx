"use client";

import { useRef, useState, useTransition } from "react";
import { capturePostHogEvent } from "@/components/analytics/posthog";
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
import { submitLead } from "@/lib/actions/submit-lead";
import { resolveOffer } from "@/lib/landing-page-content";
import { formatPhoneHref, isPlaceholderPhone } from "@/lib/phone";
import type { PublishedLandingPage } from "@/lib/types/landing-page";
import {
  extractLeadFormValues,
  type LeadFormFieldErrors,
  type LeadFormVariant,
  validateLeadForm,
} from "@/lib/validations/lead-form";

type LeadFormProps = {
  readonly page: PublishedLandingPage;
  readonly idPrefix: string;
  readonly formLocation: string;
  readonly variant?: LeadFormVariant;
  readonly layout?: "stack" | "row";
  readonly serviceTitle?: string;
};

/** Keep error copy from collapsing the row when messages appear or clear. */
function ReservedFieldError({ message }: { readonly message?: string }) {
  return (
    <div
      className="min-h-5 text-sm font-normal text-destructive"
      role={message ? "alert" : undefined}
    >
      {message}
    </div>
  );
}

export function LeadForm({
  page,
  idPrefix,
  formLocation,
  variant = "full",
  layout = "stack",
  serviceTitle,
}: LeadFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const hasTrackedFormStart = useRef(false);
  const [fieldErrors, setFieldErrors] = useState<LeadFormFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedSurfaces, setSelectedSurfaces] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const offer = resolveOffer(page);
  const discountPercent = offer.webBookingDiscountPercent;
  const isCompact = variant === "compact";
  const isRowLayout = isCompact && layout === "row";

  const nameId = `${idPrefix}-name`;
  const phoneId = `${idPrefix}-phone`;
  const suburbId = `${idPrefix}-suburb`;

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
          capturePostHogEvent("lead_form_submitted", {
            page_slug: page.slug,
            service_type: page.leadServiceType,
            selected_surface_count: selectedSurfaces.length,
            form_location: formLocation,
            form_variant: variant,
            service_title: serviceTitle,
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
          "Something went wrong sending your request. Please try again.",
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
    capturePostHogEvent("form_started", {
      page_slug: page.slug,
      service_type: page.leadServiceType,
      form_location: formLocation,
      form_variant: variant,
      service_title: serviceTitle,
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onFocusCapture={handleFormFocusCapture}
      noValidate
      className={
        isRowLayout ? "space-y-3" : isCompact ? "space-y-4" : "space-y-6"
      }
    >
      <input type="hidden" name="pageSlug" value={page.slug} />
      <input type="hidden" name="pageName" value={page.name} />
      <input
        type="hidden"
        name="leadServiceType"
        value={page.leadServiceType}
      />
      <input type="hidden" name="formVariant" value={variant} />
      {serviceTitle ? (
        <input type="hidden" name="serviceTitle" value={serviceTitle} />
      ) : null}
      {discountPercent !== null ? (
        <input
          type="hidden"
          name="webBookingDiscountPercent"
          value={String(discountPercent)}
        />
      ) : null}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <FieldGroup
        className={
          isRowLayout
            ? "gap-3 md:grid md:grid-cols-[1fr_1fr_1fr_auto] md:grid-rows-[auto_auto_minmax(1.25rem,auto)] md:items-stretch md:gap-x-3 md:gap-y-1.5"
            : undefined
        }
      >
        <Field
          data-invalid={Boolean(fieldErrors.name)}
          className={
            isRowLayout
              ? "md:row-span-3 md:grid md:grid-rows-subgrid md:gap-0"
              : undefined
          }
        >
          <FieldLabel htmlFor={nameId}>Name</FieldLabel>
          <div className="relative min-h-9">
            <Input
              id={nameId}
              name="name"
              autoComplete="name"
              data-lpignore="true"
              data-1p-ignore="true"
              data-bwignore="true"
              aria-invalid={Boolean(fieldErrors.name)}
              onChange={() => clearFieldError("name")}
            />
          </div>
          {isCompact ? (
            <ReservedFieldError message={fieldErrors.name} />
          ) : fieldErrors.name ? (
            <FieldError>{fieldErrors.name}</FieldError>
          ) : null}
        </Field>

        <Field
          data-invalid={Boolean(fieldErrors.phone)}
          className={
            isRowLayout
              ? "md:row-span-3 md:grid md:grid-rows-subgrid md:gap-0"
              : undefined
          }
        >
          <FieldLabel htmlFor={phoneId}>Phone</FieldLabel>
          <div className="relative min-h-9">
            <Input
              id={phoneId}
              name="phone"
              type="tel"
              autoComplete="tel"
              data-lpignore="true"
              data-1p-ignore="true"
              data-bwignore="true"
              aria-invalid={Boolean(fieldErrors.phone)}
              onChange={() => clearFieldError("phone")}
            />
          </div>
          {isCompact ? (
            <ReservedFieldError message={fieldErrors.phone} />
          ) : fieldErrors.phone ? (
            <FieldError>{fieldErrors.phone}</FieldError>
          ) : null}
        </Field>

        <Field
          data-invalid={Boolean(fieldErrors.suburb)}
          className={
            isRowLayout
              ? "md:row-span-3 md:grid md:grid-rows-subgrid md:gap-0"
              : undefined
          }
        >
          <FieldLabel htmlFor={suburbId}>Suburb</FieldLabel>
          <div className="relative min-h-9">
            <Input
              id={suburbId}
              name="suburb"
              autoComplete="address-level2"
              placeholder="Your suburb"
              data-lpignore="true"
              data-1p-ignore="true"
              data-bwignore="true"
              aria-invalid={Boolean(fieldErrors.suburb)}
              onChange={() => clearFieldError("suburb")}
            />
          </div>
          {isCompact ? (
            <ReservedFieldError message={fieldErrors.suburb} />
          ) : fieldErrors.suburb ? (
            <FieldError>{fieldErrors.suburb}</FieldError>
          ) : null}
        </Field>

        {isCompact ? null : (
          <FieldSet
            data-invalid={Boolean(fieldErrors.surfaces)}
            className="gap-3 border-0 p-0"
          >
            <FieldLegend className="mb-0 px-0">Affected surface</FieldLegend>
            <div className="grid gap-3 sm:grid-cols-2">
              {page.surfaceOptions.map((surface) => {
                const surfaceId = `${idPrefix}-surface-${surface.replace(/\s+/g, "-").toLowerCase()}`;
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
        )}
        {isRowLayout ? (
          <Button
            type="submit"
            size="lg"
            className="w-full md:col-start-4 md:row-start-2 md:h-9 md:w-auto md:min-w-48 md:self-start"
            disabled={isPending}
          >
            {isPending ? "Sending…" : page.ctaLabel}
          </Button>
        ) : null}
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

      {discountPercent !== null ? (
        <p className="text-center text-sm text-muted-foreground">
          Book from this page and save {discountPercent}% on the job.
        </p>
      ) : null}

      {isRowLayout ? null : (
        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? "Sending…" : page.ctaLabel}
        </Button>
      )}
    </form>
  );
}
