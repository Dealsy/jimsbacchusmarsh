export function formatE164Phone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("61")) {
    return `+${digits}`;
  }
  if (digits.startsWith("0")) {
    return `+61${digits.slice(1)}`;
  }
  if (digits.length > 0) {
    return `+${digits}`;
  }
  return "";
}

export function formatPhoneHref(phone: string): string {
  const e164 = formatE164Phone(phone);
  return e164 ? `tel:${e164}` : "tel:";
}

export function isPlaceholderPhone(phone: string): boolean {
  return phone.includes("PLACEHOLDER");
}
