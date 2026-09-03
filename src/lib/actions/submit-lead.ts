"use server";

import { Resend } from "resend";

import { buildLeadNotificationEmail } from "@/lib/emails/lead-notification-email";
import {
  extractLeadFormValues,
  type LeadFormFieldErrors,
  type LeadFormValues,
  validateLeadForm,
} from "@/lib/validations/lead-form";

/** Vercel serverless request bodies cap around 4.5 MB — stay under with multipart overhead. */
const MAX_PHOTO_BYTES = 3 * 1024 * 1024;

export type SubmitLeadResult =
  | { success: true }
  | {
      success: false;
      error: string;
      fieldErrors?: LeadFormFieldErrors;
    };

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

  try {
    const nameParts = values.name.trim().split(/\s+/);
    const firstName = nameParts[0] ?? values.name;
    const lastName = nameParts.slice(1).join(" ") || undefined;

    const locationLabel = values.suburb.trim();

    const estimatedScope = [
      `Suburb: ${values.suburb}`,
      values.serviceTitle ? `Service: ${values.serviceTitle}` : undefined,
      values.surfaces.length > 0
        ? `Surfaces: ${values.surfaces.join(", ")}`
        : undefined,
      values.description
        ? `Additional details: ${values.description}`
        : undefined,
      `Page: ${values.pageSlug}`,
      values.webBookingDiscountPercent
        ? `Web booking discount: ${values.webBookingDiscountPercent}% off the job`
        : undefined,
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
  } catch (error) {
    console.error(
      "Lead OS webhook error:",
      error instanceof Error ? error.message : error,
    );
    return false;
  }
}

async function submitToResend(
  values: LeadFormValues,
  photoBuffer: Buffer | undefined,
  photoMimeType: string | undefined,
  photoFileName: string | undefined,
): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL ?? "Landing Pages <onboarding@resend.dev>";

  if (!resendApiKey || !toEmail) {
    console.error(
      "Resend lead form skipped: missing RESEND_API_KEY or CONTACT_TO_EMAIL",
    );
    return false;
  }

  try {
    const resend = new Resend(resendApiKey);
    const email = buildLeadNotificationEmail({
      values,
      hasPhoto: Boolean(photoBuffer),
    });

    const attachments =
      photoBuffer && photoMimeType
        ? [
            {
              filename: photoFileName ?? "affected-area.jpg",
              content: photoBuffer,
            },
          ]
        : undefined;

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: email.subject,
      text: email.text,
      html: email.html,
      attachments,
    });

    if (error) {
      console.error("Resend lead form error:", error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error(
      "Resend lead form exception:",
      error instanceof Error ? error.message : error,
    );
    return false;
  }
}

export async function submitLead(
  formData: FormData,
  surfaceOptions: readonly string[],
): Promise<SubmitLeadResult> {
  try {
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
    let photoBuffer: Buffer | undefined;
    let photoMimeType: string | undefined;
    let photoFileName: string | undefined;
    let photoBase64: string | undefined;

    if (photoFile instanceof File && photoFile.size > 0) {
      if (photoFile.size > MAX_PHOTO_BYTES) {
        return {
          success: false,
          error: "Photo must be 3 MB or smaller.",
        };
      }

      if (!photoFile.type.startsWith("image/")) {
        return {
          success: false,
          error: "Please upload an image file.",
        };
      }

      photoBuffer = Buffer.from(await photoFile.arrayBuffer());
      photoMimeType = photoFile.type;
      photoFileName = photoFile.name;
      photoBase64 = photoBuffer.toString("base64");
    }

    const [leadOsOk, resendOk] = await Promise.all([
      submitToLeadOs(values, photoBase64, photoMimeType),
      submitToResend(values, photoBuffer, photoMimeType, photoFileName),
    ]);

    if (!leadOsOk && !resendOk) {
      return {
        success: false,
        error:
          "We couldn't send your request right now. Please call us directly — we'll get back to you today.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error(
      "submitLead failed:",
      error instanceof Error ? error.message : error,
    );
    return {
      success: false,
      error:
        "Something went wrong sending your request. Please try again, or call us directly.",
    };
  }
}
