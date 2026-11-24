import type { EditorState } from "@/components/admin/page-editor-types";
import {
  sanitizeAbout,
  sanitizeClose,
  sanitizeFaq,
  sanitizeGuarantee,
  sanitizeHowItWorks,
  sanitizeOffer,
  sanitizeServices,
  sanitizeTestimonials,
  sanitizeThankYou,
  sanitizeTheme,
  sanitizeUrgency,
} from "@/lib/editor-sanitize";
import {
  optionalTrim,
  parseGoogleRating,
  parseGoogleReviewCount,
  trimStringList,
} from "@/lib/editor-string";

export function buildPageUpdates(state: EditorState) {
  const thankYou = sanitizeThankYou(state.thankYou);

  return {
    name: state.name.trim(),
    seoTitle: state.seoTitle.trim(),
    seoDescription: state.seoDescription.trim(),
    businessName: state.businessName.trim(),
    phone: state.phone.trim(),
    serviceAreas: trimStringList(state.serviceAreas),
    offerText: sanitizeOffer(state.offer).headline,
    ctaLabel: state.ctaLabel.trim(),
    hero: {
      headline: state.heroHeadline.trim(),
      subheadline: state.heroSubheadline.trim(),
      trustStrip: trimStringList(state.trustStrip),
      imageStorageId: state.heroImageStorageId,
      logoStorageId: state.heroLogoStorageId,
      videoStorageId: state.heroVideoStorageId,
      backgroundKind: state.heroBackgroundKind,
      audienceCallout: state.heroAudienceCallout.trim() || undefined,
      intrigueBullets: trimStringList(state.heroIntrigueBullets),
    },
    problem: { body: state.problemBody.trim() },
    wedge: {
      headline: optionalTrim(state.wedgeHeadline),
      description: optionalTrim(state.wedgeDescription),
      negativeTitle: optionalTrim(state.wedgeNegativeTitle),
      positiveTitle: optionalTrim(state.wedgePositiveTitle),
      pressureWashPoints: trimStringList(state.pressurePoints),
      softwashPoints: trimStringList(state.softwashPoints),
    },
    offer: sanitizeOffer(state.offer),
    guarantee: sanitizeGuarantee(state.guarantee),
    urgency: sanitizeUrgency(state.urgency),
    close: sanitizeClose(state.close),
    thankYou: {
      headline: thankYou.headline,
      body: thankYou.body,
      phonePrompt: thankYou.phonePrompt,
      nextStepsTitle: thankYou.nextStepsTitle,
      useHowItWorksSteps: thankYou.useHowItWorksSteps,
      nextSteps: thankYou.useHowItWorksSteps ? undefined : thankYou.nextSteps,
    },
    services: sanitizeServices(state.services),
    howItWorks: sanitizeHowItWorks(state.howItWorks),
    faq: sanitizeFaq(state.faq),
    testimonials: sanitizeTestimonials(state.testimonials),
    metaPixelId: state.metaPixelId.trim() || undefined,
    googleAdsId: state.googleAdsId.trim() || undefined,
    googleConversionLabel: state.googleConversionLabel.trim() || undefined,
    googleReviewUrl: state.googleReviewUrl.trim() || undefined,
    googleRating: parseGoogleRating(state.googleRating),
    googleReviewCount: parseGoogleReviewCount(state.googleReviewCount),
    leadServiceType: state.leadServiceType.trim(),
    surfaceOptions: trimStringList(state.surfaceOptions),
    reasonQuestion: state.reasonQuestion.trim() || undefined,
    reasonOptions: trimStringList(state.reasonOptions),
    servicesSectionTitle: optionalTrim(state.servicesSectionTitle),
    servicesSectionDescription: optionalTrim(state.servicesSectionDescription),
    gallerySectionTitle: optionalTrim(state.gallerySectionTitle),
    gallerySectionDescription: optionalTrim(state.gallerySectionDescription),
    socialVideos: trimStringList(state.socialVideoUrls),
    interviewVideoUrl: state.interviewVideoUrl.trim(),
    howItWorksSectionTitle: optionalTrim(state.howItWorksSectionTitle),
    howItWorksSectionDescription: optionalTrim(
      state.howItWorksSectionDescription,
    ),
    faqSectionTitle: optionalTrim(state.faqSectionTitle),
    equipmentPhotoStorageId: state.equipmentPhotoStorageId ?? null,
    about: sanitizeAbout({
      headline: state.aboutHeadline,
      body: state.aboutBody,
      photoStorageId: state.aboutPhotoStorageId,
      founderName: state.aboutFounderName,
      yearsLocal: state.aboutYearsLocal,
      jobsCompleted: state.aboutJobsCompleted,
    }),
    theme: sanitizeTheme(state.theme),
  };
}

export type PageUpdates = ReturnType<typeof buildPageUpdates>;

export function pageUpdatesForPatch(
  patch: Partial<EditorState>,
  next: EditorState,
): Partial<PageUpdates> {
  const full = buildPageUpdates(next);
  const updates: Partial<PageUpdates> = {};

  if ("services" in patch) {
    updates.services = full.services;
  }
  if ("howItWorks" in patch) {
    updates.howItWorks = full.howItWorks;
  }
  if ("faq" in patch) {
    updates.faq = full.faq;
  }
  if ("testimonials" in patch) {
    updates.testimonials = full.testimonials;
  }
  if ("serviceAreas" in patch) {
    updates.serviceAreas = full.serviceAreas;
  }
  if ("surfaceOptions" in patch) {
    updates.surfaceOptions = full.surfaceOptions;
  }
  if ("reasonOptions" in patch) {
    updates.reasonOptions = full.reasonOptions;
  }
  if ("socialVideoUrls" in patch) {
    updates.socialVideos = full.socialVideos;
  }
  if ("offer" in patch) {
    updates.offer = full.offer;
    updates.offerText = full.offerText;
  }
  if ("thankYou" in patch) {
    updates.thankYou = full.thankYou;
  }
  if (
    "pressurePoints" in patch ||
    "softwashPoints" in patch ||
    "wedgeHeadline" in patch ||
    "wedgeDescription" in patch ||
    "wedgeNegativeTitle" in patch ||
    "wedgePositiveTitle" in patch
  ) {
    updates.wedge = full.wedge;
  }
  if ("trustStrip" in patch || "heroIntrigueBullets" in patch) {
    updates.hero = full.hero;
  }
  if ("interviewVideoUrl" in patch) {
    updates.interviewVideoUrl = full.interviewVideoUrl;
  }
  if ("equipmentPhotoStorageId" in patch) {
    updates.equipmentPhotoStorageId = full.equipmentPhotoStorageId;
  }
  if ("aboutPhotoStorageId" in patch || "aboutHeadline" in patch) {
    updates.about = full.about;
  }

  return updates;
}

export function saveFailureMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message.trim() : "";
  if (!raw) {
    return "Save failed.";
  }
  const firstLine = raw.split("\n")[0] ?? raw;
  return firstLine.length > 180 ? `${firstLine.slice(0, 177)}...` : firstLine;
}
