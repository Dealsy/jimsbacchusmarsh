import type { EditorState, LoadedPage } from "@/components/admin/page-editor-types";
import type { PublishedLandingPage } from "@/lib/types/landing-page";

function trimStringList(values: readonly string[]): string[] {
  return values.map((value) => value.trim()).filter(Boolean);
}

function optionalTrim(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed || undefined;
}

export function mergeEditorPreviewPage(
  page: LoadedPage,
  state: EditorState,
  imageUrls: {
    readonly heroImageUrl: string | null | undefined;
    readonly heroLogoUrl: string | null | undefined;
  },
): PublishedLandingPage {
  const offerHeadline = state.offer.headline.trim();

  return {
    ...page,
    name: state.name.trim(),
    seoTitle: state.seoTitle.trim(),
    seoDescription: state.seoDescription.trim(),
    businessName: state.businessName.trim(),
    phone: state.phone.trim(),
    serviceAreas: trimStringList(state.serviceAreas),
    offerText: offerHeadline,
    ctaLabel: state.ctaLabel.trim(),
    hero: {
      ...page.hero,
      audienceCallout: state.heroAudienceCallout.trim() || undefined,
      headline: state.heroHeadline.trim(),
      subheadline: state.heroSubheadline.trim(),
      intrigueBullets: trimStringList(state.heroIntrigueBullets),
      trustStrip: trimStringList(state.trustStrip),
      imageStorageId: state.heroImageStorageId,
      logoStorageId: state.heroLogoStorageId,
      imageUrl: imageUrls.heroImageUrl ?? page.hero.imageUrl,
      logoUrl: imageUrls.heroLogoUrl ?? page.hero.logoUrl,
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
    offer: {
      headline: offerHeadline,
      reasonWhy: state.offer.reasonWhy.trim() || undefined,
      valueItems: state.offer.valueItems
        .map((item) => ({
          label: item.label.trim(),
          value: item.value?.trim() || undefined,
        }))
        .filter((item) => item.label),
      bonuses: trimStringList(state.offer.bonuses),
    },
    guarantee:
      state.guarantee.headline.trim() || state.guarantee.body.trim()
        ? {
            headline: state.guarantee.headline.trim(),
            body: state.guarantee.body.trim(),
          }
        : undefined,
    urgency:
      state.urgency.enabled && state.urgency.message.trim()
        ? { enabled: true, message: state.urgency.message.trim() }
        : undefined,
    close: state.close.ps.trim()
      ? {
          ps: state.close.ps.trim(),
          warning: state.close.warning?.trim() || undefined,
        }
      : undefined,
    services: state.services
      .map((item) => ({
        title: item.title.trim(),
        description: item.description.trim(),
        icon: item.icon?.trim() || undefined,
      }))
      .filter((item) => item.title || item.description),
    howItWorks: state.howItWorks
      .map((item, index) => ({
        step: index + 1,
        title: item.title.trim(),
        description: item.description.trim(),
      }))
      .filter((item) => item.title || item.description),
    faq: state.faq
      .map((item) => ({
        question: item.question.trim(),
        answer: item.answer.trim(),
      }))
      .filter((item) => item.question || item.answer),
    testimonials: state.testimonials
      .map((item) => ({
        quote: item.quote.trim(),
        author: item.author.trim(),
        location: item.location?.trim() || undefined,
      }))
      .filter((item) => item.quote || item.author),
    metaPixelId: state.metaPixelId.trim() || undefined,
    googleAdsId: state.googleAdsId.trim() || undefined,
    googleConversionLabel: state.googleConversionLabel.trim() || undefined,
    leadServiceType: state.leadServiceType.trim(),
    surfaceOptions: trimStringList(state.surfaceOptions),
    servicesSectionTitle: optionalTrim(state.servicesSectionTitle),
    servicesSectionDescription: optionalTrim(state.servicesSectionDescription),
    gallerySectionTitle: optionalTrim(state.gallerySectionTitle),
    gallerySectionDescription: optionalTrim(state.gallerySectionDescription),
    theme: state.theme,
    updatedAt: page.updatedAt,
  };
}
