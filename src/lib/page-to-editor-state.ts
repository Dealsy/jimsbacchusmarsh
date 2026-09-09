import {
  DEFAULT_REASON_OPTIONS,
  DEFAULT_REASON_QUESTION,
} from "convex/lib/reasonQuestionDefaults";

import type {
  EditorState,
  LoadedPage,
} from "@/components/admin/page-editor-types";
import { sanitizeTheme } from "@/lib/editor-sanitize";
import { DEFAULT_LANDING_THEME } from "@/lib/landing-theme";

export function pageToEditorState(page: LoadedPage): EditorState {
  const urgencyMessage = page.urgency?.message ?? "";

  return {
    name: page.name,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    businessName: page.businessName,
    phone: page.phone,
    serviceAreas: [...page.serviceAreas],
    ctaLabel: page.ctaLabel,
    heroAudienceCallout: page.hero.audienceCallout ?? "",
    heroHeadline: page.hero.headline,
    heroSubheadline: page.hero.subheadline,
    heroIntrigueBullets: [...(page.hero.intrigueBullets ?? [])],
    trustStrip: [...page.hero.trustStrip],
    problemBody: page.problem.body,
    wedgeHeadline: page.wedge.headline ?? "",
    wedgeDescription: page.wedge.description ?? "",
    wedgeNegativeTitle: page.wedge.negativeTitle ?? "",
    wedgePositiveTitle: page.wedge.positiveTitle ?? "",
    pressurePoints: [...page.wedge.pressureWashPoints],
    softwashPoints: [...page.wedge.softwashPoints],
    servicesSectionTitle: page.servicesSectionTitle ?? "",
    servicesSectionDescription: page.servicesSectionDescription ?? "",
    gallerySectionTitle: page.gallerySectionTitle ?? "",
    gallerySectionDescription: page.gallerySectionDescription ?? "",
    offer: {
      headline: page.offer?.headline ?? page.offerText,
      reasonWhy: page.offer?.reasonWhy ?? "",
      valueItems: (page.offer?.valueItems ?? []).map((item) => ({ ...item })),
      bonuses: [...(page.offer?.bonuses ?? [])],
      webBookingDiscountPercent: page.offer?.webBookingDiscountPercent,
    },
    guarantee: {
      headline: page.guarantee?.headline ?? "",
      body: page.guarantee?.body ?? "",
    },
    urgency: page.urgency?.enabled
      ? { enabled: true, message: urgencyMessage }
      : { enabled: false, message: urgencyMessage },
    close: {
      warning: page.close?.warning ?? "",
      ps: page.close?.ps ?? "",
    },
    thankYou: {
      headline: page.thankYou?.headline ?? "Thanks — we'll call you back today",
      body:
        page.thankYou?.body ??
        "Your request is in. We'll be in touch shortly to arrange your free assessment.",
      phonePrompt:
        page.thankYou?.phonePrompt ?? "Need to speak with someone now?",
      nextStepsTitle: page.thankYou?.nextStepsTitle ?? "What happens next",
      useHowItWorksSteps: page.thankYou?.useHowItWorksSteps ?? true,
      nextSteps: (page.thankYou?.nextSteps ?? []).map((item) => ({ ...item })),
    },
    services: page.services.map((item) => ({
      ...item,
      slug: item.slug ?? "",
      pageHeadline: item.pageHeadline ?? "",
      pageIntro: item.pageIntro ?? "",
      pageBody: item.pageBody ?? "",
      whatsIncluded: item.whatsIncluded ?? [],
    })),
    howItWorks: page.howItWorks.map((item) => ({ ...item })),
    faq: page.faq.map((item) => ({ ...item })),
    testimonials: page.testimonials.map((item) => ({
      ...item,
      location: item.location ?? "",
    })),
    metaPixelId: page.metaPixelId ?? "",
    googleAdsId: page.googleAdsId ?? "",
    googleConversionLabel: page.googleConversionLabel ?? "",
    googleReviewUrl: page.googleReviewUrl ?? "",
    googleRating:
      typeof page.googleRating === "number" ? String(page.googleRating) : "",
    googleReviewCount:
      typeof page.googleReviewCount === "number"
        ? String(page.googleReviewCount)
        : "",
    leadServiceType: page.leadServiceType,
    surfaceOptions: [...page.surfaceOptions],
    reasonQuestion: page.reasonQuestion?.trim() || DEFAULT_REASON_QUESTION,
    reasonOptions:
      page.reasonOptions && page.reasonOptions.length > 0
        ? [...page.reasonOptions]
        : [...DEFAULT_REASON_OPTIONS],
    heroImageStorageId: page.hero.imageStorageId,
    heroLogoStorageId: page.hero.logoStorageId,
    theme: sanitizeTheme({
      primary: page.theme?.primary ?? DEFAULT_LANDING_THEME.primary,
      heroFrom: page.theme?.heroFrom ?? DEFAULT_LANDING_THEME.heroFrom,
      heroTo: page.theme?.heroTo ?? DEFAULT_LANDING_THEME.heroTo,
      accent: page.theme?.accent ?? DEFAULT_LANDING_THEME.accent,
    }),
  };
}
