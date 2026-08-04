import { z } from "zod";

const surfaceOptionValues = [
  "Roof",
  "Walls",
  "Fence",
  "Retaining wall",
  "Other",
] as const;

export function createLeadFormSchema(surfaceOptions: readonly string[]) {
  const surfaceSet = new Set(surfaceOptions);

  return z.object({
    name: z
      .string()
      .trim()
      .min(2, "Please enter your name")
      .max(100, "Name is too long"),
    phone: z
      .string()
      .trim()
      .min(8, "Please enter a valid phone number")
      .max(20, "Phone number is too long"),
    suburb: z
      .string()
      .trim()
      .min(2, "Please enter your suburb")
      .max(80, "Suburb is too long"),
    surfaces: z
      .array(z.string())
      .min(1, "Select at least one affected surface")
      .refine(
        (values) => values.every((value) => surfaceSet.has(value)),
        "Invalid surface selection",
      ),
    website: z.string().optional(),
    pageSlug: z.string().min(1),
    leadServiceType: z.string().min(1),
  });
}

export type LeadFormValues = z.infer<ReturnType<typeof createLeadFormSchema>>;

export type LeadFormFieldErrors = Partial<
  Record<keyof LeadFormValues | "photo", string>
>;

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

export const DEFAULT_SURFACE_OPTIONS = surfaceOptionValues;
