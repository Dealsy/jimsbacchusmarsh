"use server";

import { Resend } from "resend";

import {
  extractLeadFormValues,
  validateLeadForm,
  type LeadFormFieldErrors,
  type LeadFormValues,
} from "@/lib/validations/lead-form";

export type SubmitLeadResult =
  | { success: true }
  | {
      success: false;
      error: string;
      fieldErrors?: LeadFormFieldErrors;
    };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function submitToLeadOs(
  values: LeadFormValues,
  photoBase64: string | undefined,
  photoMimeType: string | undefined,
): Promise<boolean> {
  const webhookUrl = process.env.LEAD_OS_WEBHOOK_URL;
  const webhookSecret = process.env.LEAD_OS_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    return false;
  }

  const nameParts = values.name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? values.name;
  const lastName = nameParts.slice(1).join(" ") || undefined;

  const locationLabel = values.suburb?.trim() || values.address;

  const estimatedScope = [
    `Address: ${values.address}`,
    `Surfaces: ${values.surfaces.join(", ")}`,
    values.otherDescription
      ? `Other details: ${values.otherDescription}`
      : undefined,
    `Page: ${values.pageSlug}`,
    photoBase64 ? "Customer attached a photo with the form." : undefined,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-lead-os-secret": webhookSecret,
    },
    body: JSON.stringify({
      firstName,
      lastName,
      phone: values.phone,
      suburb: locationLabel,
      serviceType: values.leadServiceType,
      propertyType: "residential",
      estimatedScope,
      photoBase64,
      photoMimeType,
    }),
  });

  return response.ok;
}

async function submitToResend(
  values: LeadFormValues,
  photoBase64: string | undefined,
  photoMimeType: string | undefined,
  photoFileName: string | undefined,
): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL ??
    "Landing Pages <onboarding@resend.dev>";

  if (!resendApiKey || !toEmail) {
    return false;
  }

  const resend = new Resend(resendApiKey);

  const locationLabel = values.suburb?.trim() || values.address;

  const plainText = [
    "New softwash quote request",
    "",
    `Name: ${values.name}`,
    `Phone: ${values.phone}`,
    `Address: ${values.address}`,
    values.suburb ? `Suburb: ${values.suburb}` : "",
    `Surfaces: ${values.surfaces.join(", ")}`,
    values.otherDescription
      ? `Other details: ${values.otherDescription}`
      : "",
    `Service: ${values.leadServiceType}`,
    `Page: ${values.pageSlug}`,
    photoBase64 ? "Photo attached." : "",
  ]
    .filter(Boolean)
    .join("\n");

  const attachments =
    photoBase64 && photoMimeType
      ? [
          {
            filename: photoFileName ?? "affected-area.jpg",
            content: photoBase64,
          },
        ]
      : undefined;

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    subject: `Softwash quote — ${values.name} — ${locationLabel}`,
    text: plainText,
    html: `
      <h2>New softwash quote request</h2>
      <p><strong>Name:</strong> ${escapeHtml(values.name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(values.phone)}</p>
      <p><strong>Address:</strong> ${escapeHtml(values.address)}</p>
      ${
        values.suburb
          ? `<p><strong>Suburb:</strong> ${escapeHtml(values.suburb)}</p>`
          : ""
      }
      <p><strong>Surfaces:</strong> ${escapeHtml(values.surfaces.join(", "))}</p>
      ${
        values.otherDescription
          ? `<p><strong>Other details:</strong> ${escapeHtml(values.otherDescription)}</p>`
          : ""
      }
      <p><strong>Service:</strong> ${escapeHtml(values.leadServiceType)}</p>
      <p><strong>Page:</strong> ${escapeHtml(values.pageSlug)}</p>
    `,
    attachments,
  });

  if (error) {
    console.error("Resend lead form error:", error.message);
    return false;
  }

  return true;
}

export async function submitLead(
  formData: FormData,
  surfaceOptions: readonly string[],
): Promise<SubmitLeadResult> {
  const surfacesRaw = formData.getAll("surfaces").map(String);
  const rawValues = extractLeadFormValues(formData, surfacesRaw);
  const validation = validateLeadForm(rawValues, surfaceOptions);

  if (!validation.success) {
    return {
      success: false,
      error: "Please fix the errors below.",
      fieldErrors: validation.fieldErrors,
    };
  }

  const values = validation.data;

  if (values.website) {
    return { success: true };
  }

  const photoFile = formData.get("photo");
  let photoBase64: string | undefined;
  let photoMimeType: string | undefined;
  let photoFileName: string | undefined;

  if (photoFile instanceof File && photoFile.size > 0) {
    if (photoFile.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: "Photo must be 5 MB or smaller.",
        fieldErrors: { photo: "Photo must be 5 MB or smaller." },
      };
    }

    if (!photoFile.type.startsWith("image/")) {
      return {
        success: false,
        error: "Please upload an image file.",
        fieldErrors: { photo: "Please upload an image file." },
      };
    }

    const buffer = Buffer.from(await photoFile.arrayBuffer());
    photoBase64 = buffer.toString("base64");
    photoMimeType = photoFile.type;
    photoFileName = photoFile.name;
  }

  const [leadOsOk, resendOk] = await Promise.all([
    submitToLeadOs(values, photoBase64, photoMimeType),
    submitToResend(
      values,
      photoBase64,
      photoMimeType,
      photoFileName,
    ),
  ]);

  if (!leadOsOk && !resendOk) {
    return {
      success: false,
      error:
        "We couldn't send your request right now. Please call us directly — we'll get back to you today.",
    };
  }

  return { success: true };
}
