import type { FunctionReturnType } from "convex/server";

import type { api } from "convex/_generated/api";

type PublishedPage = NonNullable<
  FunctionReturnType<typeof api.landingPages.getPublishedBySlug>
>;

export type ResolvedThankYou = {
  readonly headline: string;
  readonly body: string;
  readonly phonePrompt: string;
  readonly nextStepsTitle: string;
  readonly nextSteps: readonly {
    readonly step: number;
    readonly title: string;
    readonly description: string;
  }[];
};

const DEFAULT_THANK_YOU = {
  headline: "Thanks — we'll call you back today",
  body:
    "Your request is in. We'll be in touch shortly to arrange your free assessment.",
  phonePrompt: "Need to speak with someone now?",
  nextStepsTitle: "What happens next",
} as const;

const DEFAULT_THANK_YOU_STEPS = [
  {
    step: 1,
    title: "We call you back",
    description:
      "A local team member will reach out today to confirm your details.",
  },
  {
    step: 2,
    title: "Free on-site assessment",
    description:
      "We inspect the property and confirm the right approach for your job.",
  },
  {
    step: 3,
    title: "Clear quote upfront",
    description:
      "You get scope and pricing confirmed before any work begins.",
  },
] as const;

export function resolveThankYou(page: PublishedPage): ResolvedThankYou {
  const thankYou = page.thankYou;
  const useHowItWorksSteps = thankYou?.useHowItWorksSteps ?? true;

  let nextSteps: ResolvedThankYou["nextSteps"];
  if (
    !useHowItWorksSteps &&
    thankYou?.nextSteps &&
    thankYou.nextSteps.length > 0
  ) {
    nextSteps = [...thankYou.nextSteps].sort((a, b) => a.step - b.step);
  } else if (page.howItWorks.length > 0) {
    nextSteps = [...page.howItWorks].sort((a, b) => a.step - b.step);
  } else {
    nextSteps = DEFAULT_THANK_YOU_STEPS.map((step) => ({ ...step }));
  }

  return {
    headline: thankYou?.headline?.trim() || DEFAULT_THANK_YOU.headline,
    body: thankYou?.body?.trim() || DEFAULT_THANK_YOU.body,
    phonePrompt:
      thankYou?.phonePrompt?.trim() || DEFAULT_THANK_YOU.phonePrompt,
    nextStepsTitle:
      thankYou?.nextStepsTitle?.trim() || DEFAULT_THANK_YOU.nextStepsTitle,
    nextSteps,
  };
}

export type ResolvedOffer = {
  readonly headline: string;
  readonly reasonWhy: string | null;
  readonly valueItems: readonly { readonly label: string; readonly value: string | null }[];
  readonly bonuses: readonly string[];
};

export type ResolvedGuarantee = {
  readonly headline: string;
  readonly body: string;
};

export type ResolvedUrgency = {
  readonly enabled: boolean;
  readonly message: string;
};

export type ResolvedClose = {
  readonly warning: string | null;
  readonly ps: string;
};

export function resolveOffer(page: PublishedPage): ResolvedOffer {
  if (page.offer) {
    return {
      headline: page.offer.headline,
      reasonWhy: page.offer.reasonWhy?.trim() || null,
      valueItems: page.offer.valueItems.map((item) => ({
        label: item.label,
        value: item.value?.trim() || null,
      })),
      bonuses: page.offer.bonuses,
    };
  }

  return {
    headline: page.offerText,
    reasonWhy: null,
    valueItems: [],
    bonuses: [],
  };
}

export function resolveGuarantee(
  page: PublishedPage,
): ResolvedGuarantee | null {
  if (!page.guarantee?.headline.trim() || !page.guarantee.body.trim()) {
    return null;
  }

  return {
    headline: page.guarantee.headline.trim(),
    body: page.guarantee.body.trim(),
  };
}

export function resolveUrgency(page: PublishedPage): ResolvedUrgency | null {
  if (!page.urgency?.enabled || !page.urgency.message.trim()) {
    return null;
  }

  return {
    enabled: true,
    message: page.urgency.message.trim(),
  };
}

export function resolveClose(page: PublishedPage): ResolvedClose | null {
  if (!page.close?.ps.trim()) {
    return null;
  }

  return {
    warning: page.close.warning?.trim() || null,
    ps: page.close.ps.trim(),
  };
}

export function parseOfferValueAmount(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const digits = value.replace(/[^0-9.]/g, "");
  if (!digits) {
    return null;
  }

  const parsed = Number.parseFloat(digits);
  return Number.isFinite(parsed) ? parsed : null;
}

export function sumOfferValue(
  items: readonly { readonly value: string | null }[],
): number | null {
  let total = 0;
  let hasValue = false;

  for (const item of items) {
    const amount = parseOfferValueAmount(item.value);
    if (amount !== null) {
      total += amount;
      hasValue = true;
    }
  }

  return hasValue ? total : null;
}

export function hasOfferStackContent(offer: ResolvedOffer): boolean {
  return (
    offer.valueItems.length > 0 ||
    offer.bonuses.length > 0 ||
    offer.reasonWhy !== null
  );
}

export type ResolvedWedgeSection = {
  readonly headline: string;
  readonly description: string;
  readonly negativeTitle: string;
  readonly positiveTitle: string;
};

export type ResolvedServicesSection = {
  readonly title: string;
  readonly description: string;
};

export type ResolvedGallerySection = {
  readonly title: string;
  readonly description: string;
};

const DEFAULT_WEDGE: ResolvedWedgeSection = {
  headline: "Why pressure washing alone doesn't fix it",
  description:
    "High pressure might look good for a few weeks — but if the roots are still alive, the mould comes straight back.",
  negativeTitle: "Pressure washing alone",
  positiveTitle: "Softwashing",
};

const DEFAULT_SERVICES: ResolvedServicesSection = {
  title: "What we cover",
  description:
    "Low-pressure treatment for the surfaces where mould and algae do the most damage.",
};

const DEFAULT_GALLERY: ResolvedGallerySection = {
  title: "Before & after",
  description:
    "Real results from professional treatments — surfaces restored and protected.",
};

export function resolveWedgeSection(page: PublishedPage): ResolvedWedgeSection {
  return {
    headline: page.wedge.headline?.trim() || DEFAULT_WEDGE.headline,
    description: page.wedge.description?.trim() || DEFAULT_WEDGE.description,
    negativeTitle:
      page.wedge.negativeTitle?.trim() || DEFAULT_WEDGE.negativeTitle,
    positiveTitle:
      page.wedge.positiveTitle?.trim() || DEFAULT_WEDGE.positiveTitle,
  };
}

export function resolveServicesSection(
  page: PublishedPage,
): ResolvedServicesSection {
  return {
    title: page.servicesSectionTitle?.trim() || DEFAULT_SERVICES.title,
    description:
      page.servicesSectionDescription?.trim() || DEFAULT_SERVICES.description,
  };
}

export function resolveGallerySection(
  page: PublishedPage,
): ResolvedGallerySection {
  return {
    title: page.gallerySectionTitle?.trim() || DEFAULT_GALLERY.title,
    description:
      page.gallerySectionDescription?.trim() || DEFAULT_GALLERY.description,
  };
}
