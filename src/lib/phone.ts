export function formatPhoneHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("61")) {
    return `tel:+${digits}`;
  }
  if (digits.startsWith("0")) {
    return `tel:+61${digits.slice(1)}`;
  }
  if (digits.length > 0) {
    return `tel:+${digits}`;
  }
  return "tel:";
}

export function isPlaceholderPhone(phone: string): boolean {
  return phone.includes("PLACEHOLDER");
}
