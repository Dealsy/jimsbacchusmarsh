import type {
  CloseFields,
  FaqItem,
  GuaranteeFields,
  HowItWorksStep,
  OfferFields,
  OfferValueItem,
  ServiceItem,
  TestimonialItem,
  ThankYouFields,
  UrgencyFields,
} from "@/components/admin/fields/editor-types";
import { trimStringList } from "@/lib/editor-string";
import { parseWebBookingDiscountPercent } from "@/lib/landing-page-content";
import type { LandingTheme } from "@/lib/landing-theme";
import { DEFAULT_LANDING_THEME, normalizeHexColor } from "@/lib/landing-theme";
import { RESERVED_CHILD_SLUGS, slugify } from "@/lib/slug";

export function persistServiceSlug(
  title: string,
  rawSlug: string | undefined,
): string {
  const fromInput = rawSlug?.trim();
  if (
    fromInput &&
    !RESERVED_CHILD_SLUGS.has(fromInput) &&
    !fromInput.includes("/")
  ) {
    return slugify(fromInput) || slugify(title);
  }
  const fromTitle = slugify(title);
  return RESERVED_CHILD_SLUGS.has(fromTitle)
    ? `${fromTitle}-service`
    : fromTitle;
}

export function sanitizeServices(
  values: readonly ServiceItem[],
): ServiceItem[] {
  return values
    .map((item) => {
      const title = item.title.trim();
      const whatsIncluded = trimStringList(item.whatsIncluded ?? []);
      return {
        title,
        description: item.description.trim(),
        icon: item.icon?.trim() || undefined,
        slug: persistServiceSlug(title, item.slug),
        pageHeadline: item.pageHeadline?.trim() || undefined,
        pageIntro: item.pageIntro?.trim() || undefined,
        pageBody: item.pageBody?.trim() || undefined,
        whatsIncluded: whatsIncluded.length > 0 ? whatsIncluded : undefined,
      };
    })
    .filter((item) => item.title || item.description);
}

export function sanitizeHowItWorks(
  values: readonly HowItWorksStep[],
): HowItWorksStep[] {
  return values
    .map((item, index) => ({
      step: index + 1,
      title: item.title.trim(),
      description: item.description.trim(),
    }))
    .filter((item) => item.title || item.description);
}

export function sanitizeFaq(values: readonly FaqItem[]): FaqItem[] {
  return values
    .map((item) => ({
      question: item.question.trim(),
      answer: item.answer.trim(),
    }))
    .filter((item) => item.question || item.answer);
}

export function sanitizeTestimonials(
  values: readonly TestimonialItem[],
): TestimonialItem[] {
  return values
    .map((item) => ({
      quote: item.quote.trim(),
      author: item.author.trim(),
      location: item.location?.trim() || undefined,
    }))
    .filter((item) => item.quote || item.author);
}

export function sanitizeOfferValueItems(
  values: readonly OfferValueItem[],
): OfferValueItem[] {
  return values
    .map((item) => ({
      label: item.label.trim(),
      value: item.value?.trim() || undefined,
    }))
    .filter((item) => item.label);
}

export function sanitizeOffer(offer: OfferFields): OfferFields {
  const percent = parseWebBookingDiscountPercent(
    offer.webBookingDiscountPercent,
  );
  return {
    headline: offer.headline.trim(),
    reasonWhy: offer.reasonWhy.trim(),
    valueItems: sanitizeOfferValueItems(offer.valueItems),
    bonuses: trimStringList(offer.bonuses),
    ...(percent !== null ? { webBookingDiscountPercent: percent } : {}),
  };
}

export function sanitizeGuarantee(
  guarantee: GuaranteeFields,
): GuaranteeFields | undefined {
  const headline = guarantee.headline.trim();
  const body = guarantee.body.trim();
  if (!headline && !body) {
    return undefined;
  }
  return { headline, body };
}

export function sanitizeUrgency(
  urgency: UrgencyFields,
): UrgencyFields | undefined {
  if (!urgency.enabled) {
    return undefined;
  }
  const message = urgency.message.trim();
  if (!message) {
    return undefined;
  }
  return { enabled: true, message };
}

export function sanitizeClose(close: CloseFields): CloseFields | undefined {
  const ps = close.ps.trim();
  if (!ps) {
    return undefined;
  }
  return {
    ps,
    warning: close.warning?.trim() || undefined,
  };
}

export function sanitizeThankYou(thankYou: ThankYouFields): ThankYouFields {
  const nextSteps = sanitizeHowItWorks(thankYou.nextSteps);
  return {
    headline: thankYou.headline.trim() || "Thanks — we'll call you back today",
    body:
      thankYou.body.trim() ||
      "Your request is in. We'll be in touch shortly to arrange your free assessment.",
    phonePrompt:
      thankYou.phonePrompt.trim() || "Need to speak with someone now?",
    nextStepsTitle: thankYou.nextStepsTitle.trim() || "What happens next",
    useHowItWorksSteps: thankYou.useHowItWorksSteps,
    nextSteps,
  };
}

export function sanitizeTheme(theme: LandingTheme): LandingTheme {
  return {
    primary: normalizeHexColor(theme.primary) ?? DEFAULT_LANDING_THEME.primary,
    heroFrom:
      normalizeHexColor(theme.heroFrom) ?? DEFAULT_LANDING_THEME.heroFrom,
    heroTo: normalizeHexColor(theme.heroTo) ?? DEFAULT_LANDING_THEME.heroTo,
    accent: normalizeHexColor(theme.accent) ?? DEFAULT_LANDING_THEME.accent,
  };
}
