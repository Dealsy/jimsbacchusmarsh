import { formatPhoneHref } from "@/lib/phone";
import type { LeadFormValues } from "@/lib/validations/lead-form";

export type LeadNotificationEmailInput = {
  readonly values: LeadFormValues;
  readonly hasPhoto: boolean;
  readonly submittedAt?: Date;
};

export type LeadNotificationEmail = {
  readonly subject: string;
  readonly text: string;
  readonly html: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatSubmittedAt(date: Date): string {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Australia/Melbourne",
  }).format(date);
}

function getPageLabel(values: LeadFormValues): string {
  const pageName = values.pageName?.trim();
  if (pageName) {
    return pageName;
  }
  return values.pageSlug.replace(/-/g, " ");
}

function buildDetailRows(values: LeadFormValues, hasPhoto: boolean): Array<{
  label: string;
  value: string;
  htmlValue?: string;
}> {
  const rows: Array<{ label: string; value: string; htmlValue?: string }> = [
    { label: "Name", value: values.name },
    {
      label: "Phone",
      value: values.phone,
      htmlValue: `<a href="${escapeHtml(formatPhoneHref(values.phone))}" style="color:#111827;text-decoration:none;">${escapeHtml(values.phone)}</a>`,
    },
    { label: "Address", value: values.address },
  ];

  if (values.suburb?.trim()) {
    rows.push({ label: "Suburb", value: values.suburb.trim() });
  }

  rows.push(
    { label: "Surfaces", value: values.surfaces.join(", ") },
    { label: "Photo attached", value: hasPhoto ? "Yes" : "No" },
  );

  if (values.description?.trim()) {
    rows.push({
      label: "Additional details",
      value: values.description.trim(),
    });
  }

  return rows;
}

export function buildLeadNotificationEmail(
  input: LeadNotificationEmailInput,
): LeadNotificationEmail {
  const { values, hasPhoto } = input;
  const submittedAt = input.submittedAt ?? new Date();
  const pageLabel = getPageLabel(values);
  const locationLabel = values.suburb?.trim() || values.address;
  const detailRows = buildDetailRows(values, hasPhoto);

  const subject = `[${pageLabel}] New lead — ${values.name} — ${locationLabel}`;

  const sourceLines = [
    "SOURCE",
    `Landing page: ${pageLabel}`,
    `Service type: ${values.leadServiceType}`,
    `Page slug: ${values.pageSlug}`,
    `Submitted: ${formatSubmittedAt(submittedAt)}`,
    "",
  ];

  const detailLines = detailRows.map((row) => `${row.label}: ${row.value}`);

  const text = [
    "New lead enquiry",
    "",
    ...sourceLines,
    "LEAD DETAILS",
    ...detailLines,
    "",
    "Automated notification from landing pages",
  ].join("\n");

  const detailRowsHtml = detailRows
    .map(
      (row) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:14px;width:140px;vertical-align:top;">${escapeHtml(row.label)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;vertical-align:top;">${row.htmlValue ?? escapeHtml(row.value)}</td>
        </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:24px;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111827;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:0 auto;">
      <tr>
        <td style="padding:24px;background-color:#ffffff;border:1px solid #e5e7eb;border-radius:8px;">
          <p style="margin:0 0 20px;font-size:20px;font-weight:600;line-height:1.3;color:#111827;">New lead enquiry</p>

          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;">
            <tr>
              <td style="padding:16px;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#6b7280;">Source</p>
                <p style="margin:0 0 6px;font-size:14px;line-height:1.5;color:#111827;"><strong>Landing page:</strong> ${escapeHtml(pageLabel)}</p>
                <p style="margin:0 0 6px;font-size:14px;line-height:1.5;color:#111827;"><strong>Service type:</strong> ${escapeHtml(values.leadServiceType)}</p>
                <p style="margin:0 0 6px;font-size:14px;line-height:1.5;color:#111827;"><strong>Page slug:</strong> ${escapeHtml(values.pageSlug)}</p>
                <p style="margin:0;font-size:14px;line-height:1.5;color:#111827;"><strong>Submitted:</strong> ${escapeHtml(formatSubmittedAt(submittedAt))}</p>
              </td>
            </tr>
          </table>

          <p style="margin:0 0 12px;font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#6b7280;">Lead details</p>
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border:1px solid #e5e7eb;border-radius:6px;border-collapse:collapse;overflow:hidden;">
            ${detailRowsHtml}
          </table>

          <p style="margin:24px 0 0;font-size:12px;line-height:1.5;color:#9ca3af;">Automated notification from landing pages</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, text, html };
}
