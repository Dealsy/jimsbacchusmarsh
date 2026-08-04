import type { FunctionReturnType } from "convex/server";

import type { api } from "convex/_generated/api";

type PublishedPage = NonNullable<
  FunctionReturnType<typeof api.landingPages.getPublishedBySlug>
>;

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
