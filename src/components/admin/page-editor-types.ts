import type { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import type { FunctionReturnType } from "convex/server";
import type {
  CloseFields,
  FaqItem,
  GuaranteeFields,
  HowItWorksStep,
  OfferFields,
  ServiceItem,
  TestimonialItem,
  ThankYouFields,
  UrgencyFields,
} from "@/components/admin/fields/editor-types";
import type { LandingTheme } from "@/lib/landing-theme";

export type EditorState = {
  name: string;
  seoTitle: string;
  seoDescription: string;
  businessName: string;
  phone: string;
  serviceAreas: string[];
  ctaLabel: string;
  heroAudienceCallout: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroIntrigueBullets: string[];
  trustStrip: string[];
  problemBody: string;
  wedgeHeadline: string;
  wedgeDescription: string;
  wedgeNegativeTitle: string;
  wedgePositiveTitle: string;
  pressurePoints: string[];
  softwashPoints: string[];
  servicesSectionTitle: string;
  servicesSectionDescription: string;
  gallerySectionTitle: string;
  gallerySectionDescription: string;
  offer: OfferFields;
  guarantee: GuaranteeFields;
  urgency: UrgencyFields;
  close: CloseFields;
  thankYou: ThankYouFields;
  services: ServiceItem[];
  howItWorks: HowItWorksStep[];
  faq: FaqItem[];
  testimonials: TestimonialItem[];
  metaPixelId: string;
  googleAdsId: string;
  googleConversionLabel: string;
  googleReviewUrl: string;
  googleRating: string;
  googleReviewCount: string;
  leadServiceType: string;
  surfaceOptions: string[];
  heroImageStorageId?: Id<"_storage">;
  heroLogoStorageId?: Id<"_storage">;
  theme: LandingTheme;
};

export type LoadedPage = NonNullable<
  FunctionReturnType<typeof api.landingPages.getBySlug>
>;
