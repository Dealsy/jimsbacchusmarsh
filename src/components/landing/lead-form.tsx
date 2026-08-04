"use client";

import { useRef, useState, useTransition } from "react";

import { trackGoogleConversion } from "@/components/analytics/google-ads";
import { trackMetaLead } from "@/components/analytics/meta-pixel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { submitLead } from "@/lib/actions/submit-lead";
import { formatPhoneHref, isPlaceholderPhone } from "@/lib/phone";
import type { PublishedLandingPage } from "@/lib/types/landing-page";
import type { LeadFormFieldErrors } from "@/lib/validations/lead-form";

type LeadFormProps = {
  readonly page: PublishedLandingPage;
};

export function LeadForm({ page }: LeadFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [fieldErrors, setFieldErrors] = useState<LeadFormFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedSurfaces, setSelectedSurfaces] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  function toggleSurface(surface: string, checked: boolean) {
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

    startTransition(async () => {
      const result = await submitLead(formData, page.surfaceOptions);

      if (result.success) {
        setSuccess(true);
        formRef.current?.reset();
        setSelectedSurfaces([]);
        trackMetaLead();
        trackGoogleConversion(
          page.googleAdsId ?? process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
          page.googleConversionLabel ??
            process.env.NEXT_PUBLIC_GOOGLE_CONVERSION_LABEL,
        );
        return;
      }

      setFormError(result.error);
      if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
      }
    });
  }

  if (success) {
    return (
      <div className="rounded-2xl border bg-[color-mix(in_srgb,var(--landing-accent)_10%,white)] p-8 text-center dark:bg-[color-mix(in_srgb,var(--landing-accent)_15%,black)]">
        <h3
          className="font-heading text-xl font-semibold"
          style={{ color: "var(--landing-accent)" }}
        >
          Thanks — we&apos;ll call you back today
        </h3>
        <p className="mt-2 text-muted-foreground">
          Your request is in. We&apos;ll be in touch shortly to arrange your
          free assessment.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="pageSlug" value={page.slug} />
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
          <Input id="name" name="name" required autoComplete="name" />
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
            required
            autoComplete="tel"
          />
          {fieldErrors.phone ? (
            <FieldError>{fieldErrors.phone}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(fieldErrors.suburb)}>
          <FieldLabel htmlFor="suburb">Suburb</FieldLabel>
          <Input id="suburb" name="suburb" required autoComplete="address-level2" />
          {fieldErrors.suburb ? (
            <FieldError>{fieldErrors.suburb}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(fieldErrors.surfaces)}>
          <FieldLabel>Affected surface</FieldLabel>
          <div className="grid gap-3 sm:grid-cols-2">
            {page.surfaceOptions.map((surface) => (
              <label
                key={surface}
                className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 has-checked:border-primary has-checked:bg-primary/5"
              >
                <Checkbox
                  checked={selectedSurfaces.includes(surface)}
                  onCheckedChange={(checked) =>
                    toggleSurface(surface, checked === true)
                  }
                />
                <span className="text-sm">{surface}</span>
              </label>
            ))}
          </div>
          {fieldErrors.surfaces ? (
            <FieldError>{fieldErrors.surfaces}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(fieldErrors.photo)}>
          <FieldLabel htmlFor="photo">
            Photo of affected area{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </FieldLabel>
          <Input
            id="photo"
            name="photo"
            type="file"
            accept="image/*"
            className="cursor-pointer file:cursor-pointer"
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
