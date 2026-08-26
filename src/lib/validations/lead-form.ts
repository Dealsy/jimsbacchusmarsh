import { z } from "zod";

const surfaceOptionValues = [
  "Roof",
  "Walls",
  "Fence",
  "Retaining wall",
  "Other",
] as const;

export const OTHER_SURFACE_OPTION = "Other";

export type LeadFormRawInput = {
  readonly name: string;
  readonly phone: string;
  readonly suburb: string;
  readonly address: string;
  readonly surfaces: readonly string[];
  readonly description: string;
  readonly website: string;
  readonly pageSlug: string;
  readonly pageName: string;
  readonly leadServiceType: string;
  readonly webBookingDiscountPercent?: number;
};

export function createLeadFormSchema(surfaceOptions: readonly string[]) {
  const surfaceSet = new Set(surfaceOptions);

  return z
    .object({
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
      suburb: z.string().trim().max(80, "Suburb is too long").optional(),
      address: z
        .string()
        .trim()
        .min(1, "Please enter your property address")
        .max(200, "Address is too long"),
      surfaces: z
        .array(z.string())
        .min(1, "Please select at least one affected surface")
        .refine(
          (values) => values.every((value) => surfaceSet.has(value)),
          "Invalid surface selection",
        ),
      description: z
        .string()
        .trim()
        .max(500, "Description is too long")
        .optional(),
      website: z.string().optional(),
      pageSlug: z.string().min(1),
      pageName: z.string().trim().max(120).optional(),
      leadServiceType: z.string().min(1),
      webBookingDiscountPercent: z.number().int().min(1).max(100).optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.surfaces.includes(OTHER_SURFACE_OPTION)) {
        return;
      }

      const description = data.description?.trim() ?? "";
      if (description.length < 3) {
        ctx.addIssue({
          code: "custom",
          message: "Please describe the affected area",
          path: ["description"],
        });
      }
    });
}

export type LeadFormValues = z.infer<ReturnType<typeof createLeadFormSchema>>;

export type LeadFormFieldErrors = Partial<
  Record<keyof LeadFormValues | "photo", string>
>;

export function extractLeadFormValues(
  formData: FormData,
  surfaces: readonly string[],
): LeadFormRawInput {
  const discountRaw = String(formData.get("webBookingDiscountPercent") ?? "");
  const parsedDiscount = Number.parseInt(discountRaw, 10);

  return {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    suburb: String(formData.get("suburb") ?? ""),
    address: String(formData.get("address") ?? ""),
    surfaces,
    description: String(formData.get("description") ?? ""),
    website: String(formData.get("website") ?? ""),
    pageSlug: String(formData.get("pageSlug") ?? ""),
    pageName: String(formData.get("pageName") ?? ""),
    leadServiceType: String(formData.get("leadServiceType") ?? ""),
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
):
  | { success: true; data: LeadFormValues }
  | { success: false; fieldErrors: LeadFormFieldErrors } {
  const schema = createLeadFormSchema(surfaceOptions);
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
