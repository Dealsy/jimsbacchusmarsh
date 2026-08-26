export type ServiceItem = {
  title: string;
  description: string;
  icon?: string;
};

export type HowItWorksStep = {
  step: number;
  title: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type TestimonialItem = {
  quote: string;
  author: string;
  location?: string;
};

export type OfferValueItem = {
  label: string;
  value?: string;
};

export type OfferFields = {
  headline: string;
  reasonWhy: string;
  valueItems: OfferValueItem[];
  bonuses: string[];
  webBookingDiscountPercent?: number;
};

export type GuaranteeFields = {
  headline: string;
  body: string;
};

export type UrgencyFields = {
  enabled: boolean;
  message: string;
};

export type CloseFields = {
  warning?: string;
  ps: string;
};

export type ThankYouFields = {
  headline: string;
  body: string;
  phonePrompt: string;
  nextStepsTitle: string;
  useHowItWorksSteps: boolean;
  nextSteps: HowItWorksStep[];
};

export const SERVICE_ICON_OPTIONS = [
  { value: "home", label: "Home / roof" },
  { value: "building", label: "Building" },
  { value: "fence", label: "Fence" },
  { value: "layers", label: "Layers / walls" },
] as const;
