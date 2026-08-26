import type { Infer } from "convex/values";

import type {
  closeValidator,
  faqItemValidator,
  guaranteeValidator,
  heroValidator,
  howItWorksStepValidator,
  offerValidator,
  problemValidator,
  serviceItemValidator,
  testimonialValidator,
  themeValidator,
  urgencyValidator,
  wedgeValidator,
} from "./validators";

type Hero = Infer<typeof heroValidator>;
type Problem = Infer<typeof problemValidator>;
type Wedge = Infer<typeof wedgeValidator>;
type ServiceItem = Infer<typeof serviceItemValidator>;
type HowItWorksStep = Infer<typeof howItWorksStepValidator>;
type FaqItem = Infer<typeof faqItemValidator>;
type Testimonial = Infer<typeof testimonialValidator>;
type Theme = Infer<typeof themeValidator>;
type Offer = Infer<typeof offerValidator>;
type Guarantee = Infer<typeof guaranteeValidator>;
type Urgency = Infer<typeof urgencyValidator>;
type Close = Infer<typeof closeValidator>;

export const WINDOW_CLEANING_THEME: Theme = {
  primary: "#0284c7",
  heroFrom: "#0c4a6e",
  heroTo: "#0369a1",
  accent: "#0ea5e9",
};

import { createDefaultThankYou } from "./defaultThankYou";

export const WINDOW_CLEANING_SLUG = "window-cleaning";

export function createWindowCleaningSeed(now: number) {
  const hero: Hero = {
    audienceCallout:
      "For Bacchus Marsh, Melton & Ballan homeowners & businesses",
    headline: "Streak-Free Windows — Without the Ladder or the Smears",
    subheadline:
      "Professional window cleaning for Bacchus Marsh, Melton & Ballan. Inside and out, single and double storey — crystal-clear glass that actually lasts.",
    intrigueBullets: [
      "Why supermarket squeegees leave streaks every single time",
      "The hidden cost of ladder work on your own windows",
      "How pros get second-storey glass clean without leaving marks",
      "What most homeowners forget to clean (and why it shows)",
    ],
    trustStrip: [
      "Fully Insured",
      "Streak-Free Finish",
      "Local Bacchus Marsh Operator",
    ],
  };

  const problem: Problem = {
    body: "Fingerprints on the glass. Water marks catching the light. Upstairs windows you haven't touched in months — and every sunny afternoon, the smears are all you notice.\n\nClean windows change how a home feels inside and out. The problem isn't wanting them done — it's finding someone reliable who does a proper job without streaks, missed panes, or ladder marks on the sills.",
  };

  const wedge: Wedge = {
    headline: "Why DIY window cleaning frustrates everyone",
    description:
      "You've tried the bucket, the squeegee, the vinegar mix. It looks fine until the sun hits — then every streak and missed edge shows up.",
    negativeTitle: "DIY window cleaning",
    positiveTitle: "Professional Jim's window cleaning",
    pressureWashPoints: [
      "Streaks and water spots show up as soon as the glass dries in the sun",
      "Ladder work on double-storey homes is slow, risky, and easy to put off",
      "Frames, sills, and screens get skipped — so the job never looks truly finished",
    ],
    softwashPoints: [
      "Professional tools and technique for a streak-free finish that lasts",
      "Safe access for single and double storey — no ladder hassle for you",
      "Frames, sills, and tracks included so the whole opening looks clean",
    ],
  };

  const services: ServiceItem[] = [
    {
      title: "Single Storey",
      description:
        "All accessible windows, frames, and sills — inside and out where agreed.",
      icon: "home",
    },
    {
      title: "Double Storey",
      description:
        "Upper-level glass cleaned safely with proper access equipment — no DIY ladder risk.",
      icon: "building",
    },
    {
      title: "Shopfronts & Offices",
      description:
        "Commercial windows that represent your business — scheduled or one-off cleans.",
      icon: "building",
    },
    {
      title: "Screens & Tracks",
      description:
        "Flyscreens, sliding tracks, and sills — the details that make glass look truly clean.",
      icon: "layers",
    },
  ];

  const howItWorks: HowItWorksStep[] = [
    {
      step: 1,
      title: "Free Quote",
      description:
        "Tell us your property type and window count — we'll confirm scope and price, no obligation.",
    },
    {
      step: 2,
      title: "Book a Time",
      description:
        "Pick a slot that suits you. We arrive on time with everything needed on the day.",
    },
    {
      step: 3,
      title: "Streak-Free Finish",
      description:
        "Professional clean inside and/or out — glass, frames, and sills done properly.",
    },
  ];

  const faq: FaqItem[] = [
    {
      question: "Do you clean inside and outside?",
      answer:
        "Yes — we can do exterior only, interior only, or both. Confirm what you need when you request a quote and we'll scope it clearly.",
    },
    {
      question: "Can you reach second-storey windows safely?",
      answer:
        "Yes. We use appropriate access equipment for double-storey work — you don't need to climb a ladder or worry about safety.",
    },
    {
      question: "How often should windows be cleaned?",
      answer:
        "Most homes benefit from an exterior clean every 3–6 months depending on exposure and weather. We'll recommend a schedule that suits your property.",
    },
    {
      question: "Do you clean flyscreens and tracks?",
      answer:
        "Yes — frames, sills, and tracks can be included. Mention it when you book so we allow time in the quote.",
    },
    {
      question: "Do you service my suburb?",
      answer:
        "We cover Bacchus Marsh, Melton, Ballan and surrounding areas. Submit the form with your suburb and we'll confirm.",
    },
    {
      question: "Are you insured?",
      answer:
        "Yes — fully insured for residential and commercial work on your property.",
    },
  ];

  const testimonials: Testimonial[] = [
    {
      quote: "[PLACEHOLDER — Matt to supply real customer quote]",
      author: "Customer name",
      location: "Bacchus Marsh",
    },
    {
      quote: "[PLACEHOLDER — Matt to supply real customer quote]",
      author: "Customer name",
      location: "Melton",
    },
  ];

  const offer: Offer = {
    headline: "Free Window Cleaning Quote",
    reasonWhy:
      "We're welcoming new regular clients across Bacchus Marsh, Melton & Ballan — so we're offering free quotes with clear pricing before you commit.",
    valueItems: [
      { label: "Window count & access assessment", value: "$85" },
      { label: "Written quote — inside/out scope confirmed", value: "$75" },
      { label: "Regular service schedule recommendation", value: "$50" },
    ],
    bonuses: [
      "Priority booking for new clients this month",
      "Frame and sill wipe included on first full clean",
    ],
    webBookingDiscountPercent: 10,
  };

  const guarantee: Guarantee = {
    headline: "Streak-free guarantee",
    body: "Fully insured · Clear quote before we start · Not happy with the finish? Tell us on the day and we'll make it right.",
  };

  const urgency: Urgency = {
    enabled: true,
    message:
      "Limited weekly slots for new clients — submit the form to lock in your quote.",
  };

  const close: Close = {
    warning:
      "Dust, pollen, and weather marks build up faster than you think. The longer you wait, the harder the first clean — and the worse it looks every sunny afternoon until then.",
    ps: "P.S. Clean windows are the cheapest way to make your whole home feel brighter. Get your free quote — no obligation, no streaks.",
  };

  return {
    slug: WINDOW_CLEANING_SLUG,
    name: "Window Cleaning — Bacchus Marsh",
    status: "draft" as const,
    template: "service-landing" as const,
    seoTitle:
      "Window Cleaning Bacchus Marsh | Streak-Free — Jim's Window & Pressure Cleaning",
    seoDescription:
      "Professional window cleaning in Bacchus Marsh, Melton & Ballan. Single & double storey, inside and out. Fully insured. Free quote.",
    businessName: "Jim's Window & Pressure Cleaning",
    phone: "[PLACEHOLDER — Matt to supply]",
    serviceAreas: ["Bacchus Marsh", "Melton", "Ballan"],
    offerText:
      "Free window cleaning quote — streak-free finish, single or double storey. Clear pricing, no obligation.",
    ctaLabel: "Get My Free Quote",
    offer,
    guarantee,
    urgency,
    close,
    thankYou: createDefaultThankYou(),
    hero,
    problem,
    wedge,
    services,
    howItWorks,
    faq,
    testimonials,
    metaPixelId: undefined,
    googleAdsId: undefined,
    googleConversionLabel: undefined,
    leadServiceType: "window-cleaning",
    surfaceOptions: [
      "Single storey",
      "Double storey",
      "Shopfront / office",
      "Interior only",
      "Exterior only",
      "Other",
    ],
    servicesSectionTitle: "What window cleaning covers",
    servicesSectionDescription:
      "Residential and commercial glass — inside, outside, and the details most people miss.",
    gallerySectionTitle: "Before & after",
    gallerySectionDescription:
      "Real results from professional window cleaning — streak-free glass and clean frames.",
    theme: WINDOW_CLEANING_THEME,
    updatedAt: now,
  };
}
