import { z } from "zod";

const surfaceOptionValues = [
  "Roof",
  "Walls",
  "Fence",
  "Retaining wall",
  "Other",
] as const;

export const OTHER_SURFACE_OPTION = "Other";

export type LeadFormVariant = "full" | "compact";

export type LeadFormRawInput = {
  readonly name: string;
  readonly phone: string;
  readonly suburb: string;
  readonly mainReason?: string;
  readonly surfaces: readonly string[];
  readonly description: string;
  readonly website: string;
  readonly pageSlug: string;
  readonly pageName: string;
  readonly leadServiceType: string;
  readonly formVariant: LeadFormVariant;
  readonly serviceTitle?: string;
  readonly webBookingDiscountPercent?: number;
};

type LeadFormSchemaOptions = {
  readonly requireSurfaces?: boolean;
  readonly reasonOptions?: readonly string[];
};

export function createLeadFormSchema(
  surfaceOptions: readonly string[],
  options: LeadFormSchemaOptions = {},
) {
  const surfaceSet = new Set(surfaceOptions);
  const requireSurfaces = options.requireSurfaces ?? true;
  const reasonOptions = options.reasonOptions ?? [];
  const reasonSet = new Set(reasonOptions);
  const requireMainReason = reasonOptions.length > 0;

  const surfacesSchema = requireSurfaces
    ? z
        .array(z.string())
        .min(1, "Please select at least one affected surface")
        .refine(
          (values) => values.every((value) => surfaceSet.has(value)),
          "Invalid surface selection",
        )
    : z
        .array(z.string())
        .refine(
          (values) => values.every((value) => surfaceSet.has(value)),
          "Invalid surface selection",
        );

  const mainReasonSchema = requireMainReason
    ? z
        .string()
        .trim()
        .min(1, "Please select a reason")
        .refine((value) => reasonSet.has(value), "Invalid reason selection")
    : z.string().trim().optional();

  return z.object({
    name: z
      .string()
      .trim()
      .min(1, "Please enter your name")
      .max(100, "Name is too long"),
    phone: z
      .string()
      .trim()
      .min(1, "Please enter your phone number")
      .min(8, "Please enter a valid phone number")
      .max(20, "Phone number is too long"),
    suburb: z
      .string()
      .trim()
      .min(1, "Please enter your suburb")
      .max(80, "Suburb is too long"),
    mainReason: mainReasonSchema,
    surfaces: surfacesSchema,
    description: z
      .string()
      .trim()
      .max(500, "Description is too long")
      .optional(),
    website: z.string().optional(),
    pageSlug: z.string().min(1),
    pageName: z.string().trim().max(120).optional(),
    leadServiceType: z.string().min(1),
    formVariant: z.union([z.literal("full"), z.literal("compact")]),
    serviceTitle: z.string().trim().max(120).optional(),
    webBookingDiscountPercent: z.number().int().min(1).max(100).optional(),
  });
}

export type LeadFormValues = z.infer<ReturnType<typeof createLeadFormSchema>>;

export type LeadFormFieldErrors = Partial<Record<keyof LeadFormValues, string>>;

function parseFormVariant(value: FormDataEntryValue | null): LeadFormVariant {
  return value === "compact" ? "compact" : "full";
}

export function extractLeadFormValues(
  formData: FormData,
  surfaces: readonly string[],
): LeadFormRawInput {
  const discountRaw = String(formData.get("webBookingDiscountPercent") ?? "");
  const parsedDiscount = Number.parseInt(discountRaw, 10);
  const serviceTitle = String(formData.get("serviceTitle") ?? "").trim();
  const mainReason = String(formData.get("mainReason") ?? "").trim();

  return {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    suburb: String(formData.get("suburb") ?? ""),
    mainReason: mainReason || undefined,
    surfaces,
    description: String(formData.get("description") ?? ""),
    website: String(formData.get("website") ?? ""),
    pageSlug: String(formData.get("pageSlug") ?? ""),
    pageName: String(formData.get("pageName") ?? ""),
    leadServiceType: String(formData.get("leadServiceType") ?? ""),
    formVariant: parseFormVariant(formData.get("formVariant")),
    serviceTitle: serviceTitle || undefined,
    webBookingDiscountPercent:
      Number.isFinite(parsedDiscount) &&
      parsedDiscount >= 1 &&
      parsedDiscount <= 100
        ? parsedDiscount
        : undefined,
  };
}

export function getLeadFieldErrors(
  error: z.ZodError<LeadFormValues>,
): LeadFormFieldErrors {
  const fieldErrors: LeadFormFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in fieldErrors)) {
      fieldErrors[field as keyof LeadFormValues] = issue.message;
    }
  }

  return fieldErrors;
}

export function validateLeadForm(
  rawValues: LeadFormRawInput,
  surfaceOptions: readonly string[],
  reasonOptions: readonly string[] = [],
):
  | { success: true; data: LeadFormValues }
  | { success: false; fieldErrors: LeadFormFieldErrors } {
  const schema = createLeadFormSchema(surfaceOptions, {
    requireSurfaces: rawValues.formVariant !== "compact",
    reasonOptions,
  });
  const parsed = schema.safeParse(rawValues);

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: getLeadFieldErrors(parsed.error),
    };
  }

  return { success: true, data: parsed.data };
}

export const DEFAULT_SURFACE_OPTIONS = surfaceOptionValues;
