import { v } from "convex/values";

export const pageStatusValidator = v.union(
  v.literal("draft"),
  v.literal("published"),
);

export const pageTemplateValidator = v.literal("service-landing");

export const heroValidator = v.object({
  headline: v.string(),
  subheadline: v.string(),
  trustStrip: v.array(v.string()),
  imageStorageId: v.optional(v.id("_storage")),
  logoStorageId: v.optional(v.id("_storage")),
  audienceCallout: v.optional(v.string()),
  intrigueBullets: v.optional(v.array(v.string())),
});

export const offerValueItemValidator = v.object({
  label: v.string(),
  value: v.optional(v.string()),
});

export const offerValidator = v.object({
  headline: v.string(),
  reasonWhy: v.optional(v.string()),
  valueItems: v.array(offerValueItemValidator),
  bonuses: v.array(v.string()),
  webBookingDiscountPercent: v.optional(v.number()),
});

export const guaranteeValidator = v.object({
  headline: v.string(),
  body: v.string(),
});

export const urgencyValidator = v.object({
  enabled: v.boolean(),
  message: v.string(),
});

export const closeValidator = v.object({
  warning: v.optional(v.string()),
  ps: v.string(),
});

export const problemValidator = v.object({
  body: v.string(),
});

export const wedgeValidator = v.object({
  headline: v.optional(v.string()),
  description: v.optional(v.string()),
  negativeTitle: v.optional(v.string()),
  positiveTitle: v.optional(v.string()),
  pressureWashPoints: v.array(v.string()),
  softwashPoints: v.array(v.string()),
});

export const serviceItemValidator = v.object({
  title: v.string(),
  description: v.string(),
  icon: v.optional(v.string()),
  slug: v.optional(v.string()),
  pageHeadline: v.optional(v.string()),
  pageIntro: v.optional(v.string()),
  pageBody: v.optional(v.string()),
  whatsIncluded: v.optional(v.array(v.string())),
});

export const howItWorksStepValidator = v.object({
  step: v.number(),
  title: v.string(),
  description: v.string(),
});

export const thankYouValidator = v.object({
  headline: v.string(),
  body: v.string(),
  phonePrompt: v.optional(v.string()),
  nextStepsTitle: v.optional(v.string()),
  useHowItWorksSteps: v.optional(v.boolean()),
  nextSteps: v.optional(v.array(howItWorksStepValidator)),
});

export const faqItemValidator = v.object({
  question: v.string(),
  answer: v.string(),
});

export const testimonialValidator = v.object({
  quote: v.string(),
  author: v.string(),
  location: v.optional(v.string()),
});

export const themeValidator = v.object({
  primary: v.string(),
  heroFrom: v.string(),
  heroTo: v.string(),
  accent: v.string(),
  navBackground: v.optional(v.string()),
  navText: v.optional(v.string()),
});

export const landingPageFields = {
  slug: v.string(),
  name: v.string(),
  status: pageStatusValidator,
  template: pageTemplateValidator,
  seoTitle: v.string(),
  seoDescription: v.string(),
  businessName: v.string(),
  phone: v.string(),
  serviceAreas: v.array(v.string()),
  offerText: v.string(),
  ctaLabel: v.string(),
  hero: heroValidator,
  problem: problemValidator,
  wedge: wedgeValidator,
  services: v.array(serviceItemValidator),
  howItWorks: v.array(howItWorksStepValidator),
  faq: v.array(faqItemValidator),
  testimonials: v.array(testimonialValidator),
  metaPixelId: v.optional(v.string()),
  googleAdsId: v.optional(v.string()),
  googleConversionLabel: v.optional(v.string()),
  leadServiceType: v.string(),
  surfaceOptions: v.array(v.string()),
  reasonQuestion: v.optional(v.string()),
  reasonOptions: v.optional(v.array(v.string())),
  theme: v.optional(themeValidator),
  offer: v.optional(offerValidator),
  guarantee: v.optional(guaranteeValidator),
  urgency: v.optional(urgencyValidator),
  close: v.optional(closeValidator),
  thankYou: v.optional(thankYouValidator),
  servicesSectionTitle: v.optional(v.string()),
  servicesSectionDescription: v.optional(v.string()),
  gallerySectionTitle: v.optional(v.string()),
  gallerySectionDescription: v.optional(v.string()),
  googleReviewUrl: v.optional(v.string()),
  googleRating: v.optional(v.number()),
  googleReviewCount: v.optional(v.number()),
  updatedAt: v.number(),
};

export const landingPageUpdateValidator = v.object({
  name: v.optional(v.string()),
  status: v.optional(pageStatusValidator),
  seoTitle: v.optional(v.string()),
  seoDescription: v.optional(v.string()),
  businessName: v.optional(v.string()),
  phone: v.optional(v.string()),
  serviceAreas: v.optional(v.array(v.string())),
  offerText: v.optional(v.string()),
  ctaLabel: v.optional(v.string()),
  hero: v.optional(heroValidator),
  problem: v.optional(problemValidator),
  wedge: v.optional(wedgeValidator),
  services: v.optional(v.array(serviceItemValidator)),
  howItWorks: v.optional(v.array(howItWorksStepValidator)),
  faq: v.optional(v.array(faqItemValidator)),
  testimonials: v.optional(v.array(testimonialValidator)),
  metaPixelId: v.optional(v.string()),
  googleAdsId: v.optional(v.string()),
  googleConversionLabel: v.optional(v.string()),
  leadServiceType: v.optional(v.string()),
  surfaceOptions: v.optional(v.array(v.string())),
  reasonQuestion: v.optional(v.string()),
  reasonOptions: v.optional(v.array(v.string())),
  theme: v.optional(themeValidator),
  offer: v.optional(offerValidator),
  guarantee: v.optional(guaranteeValidator),
  urgency: v.optional(urgencyValidator),
  close: v.optional(closeValidator),
  thankYou: v.optional(thankYouValidator),
  servicesSectionTitle: v.optional(v.string()),
  servicesSectionDescription: v.optional(v.string()),
  gallerySectionTitle: v.optional(v.string()),
  gallerySectionDescription: v.optional(v.string()),
  googleReviewUrl: v.optional(v.string()),
  googleRating: v.optional(v.number()),
  googleReviewCount: v.optional(v.number()),
});
