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
import {
  DEFAULT_REASON_OPTIONS,
  DEFAULT_REASON_QUESTION,
} from "./reasonQuestionDefaults";

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

export const PRESSURE_WASHING_THEME: Theme = {
  primary: "#ea580c",
  heroFrom: "#1e3a5f",
  heroTo: "#2563eb",
  accent: "#f97316",
};

import { createDefaultThankYou } from "./defaultThankYou";

export const PRESSURE_WASHING_SLUG = "pressure-washing";

export function createPressureWashingSeed(now: number) {
  const hero: Hero = {
    audienceCallout: "For Bacchus Marsh, Melton & Ballan homeowners",
    headline: "Driveways, Paths & Decks — Restored Without the DIY Hassle",
    subheadline:
      "Professional pressure washing for Bacchus Marsh, Melton & Ballan. Blast away years of grime, oil stains, and weathered buildup — done properly, first time.",
    intrigueBullets: [
      "Why hiring the cheapest guy on Facebook often costs more in the long run",
      "The #1 mistake that strips paint and gouges concrete",
      "How to tell if your driveway needs pressure washing or something else",
      "What pro equipment does that a Bunnings washer can't",
    ],
    trustStrip: [
      "Fully Insured",
      "Commercial-Grade Equipment",
      "Local Bacchus Marsh Operator",
    ],
  };

  const problem: Problem = {
    body: "Oil stains on the driveway. Green slime on the path. A deck that's gone grey and slippery — and every time you look at it, you think \"I should get that done.\"\n\nYou know a clean exterior makes the whole property feel looked-after. The hard part is finding someone who shows up, does it properly, and doesn't leave streaks or damage behind.",
  };

  const wedge: Wedge = {
    headline: "Why DIY or cheap operators fall short",
    description:
      "A quick blast might look okay from the street — until the streaks show, the paint chips, or the mould comes back because nothing was treated properly.",
    negativeTitle: "DIY / cheap operators",
    positiveTitle: "Professional Jim's pressure washing",
    pressureWashPoints: [
      "Consumer-grade washers lack the flow and control for even, deep cleaning",
      "Wrong nozzle or pressure strips paint, etches concrete, and splinters timber",
      "No insurance if something gets damaged — and no comeback when it does",
    ],
    softwashPoints: [
      "Commercial equipment with correct pressure for each surface type",
      "Experienced operators who protect gardens, seals, and coatings",
      "Fully insured, clear quote upfront — you know the scope before we start",
    ],
  };

  const services: ServiceItem[] = [
    {
      title: "Driveways & Paths",
      slug: "driveways-paths",
      description:
        "Concrete, exposed aggregate, and pavers — oil stains, tyre marks, and years of grime lifted without damage.",
      icon: "layers",
    },
    {
      title: "Decks & Timber",
      slug: "decks-timber",
      description:
        "Timber decks and pergolas cleaned at safe pressure to restore colour without splintering boards.",
      icon: "home",
    },
    {
      title: "House Exteriors",
      slug: "house-exteriors",
      description:
        "Brick, render, and cladding where high-pressure cleaning is the right tool — not mould treatment.",
      icon: "building",
    },
    {
      title: "Fences & Gates",
      slug: "fences-gates",
      description:
        "Colorbond, timber, and picket fences — grime and mildew removed evenly across the whole run.",
      icon: "fence",
    },
  ];

  const howItWorks: HowItWorksStep[] = [
    {
      step: 1,
      title: "Free On-Site Quote",
      description:
        "We inspect the surfaces, confirm pressure washing is right, and give you a clear price — no obligation.",
    },
    {
      step: 2,
      title: "Scope Confirmed",
      description:
        "You know exactly what's included before we start. No surprise add-ons on the day.",
    },
    {
      step: 3,
      title: "Professional Clean",
      description:
        "Commercial equipment, correct technique, and a finish you can see from the kerb.",
    },
  ];

  const faq: FaqItem[] = [
    {
      question: "Will pressure washing damage my driveway or paint?",
      answer:
        "Not when it's done properly. We match pressure and technique to the surface — concrete, pavers, and Colorbond are different jobs. That's why we assess on-site first rather than quoting blind.",
    },
    {
      question: "How is this different from softwashing?",
      answer:
        "Pressure washing is for hard surfaces — driveways, paths, decks — where you need mechanical cleaning power. Softwashing is low-pressure with treatment for roofs and walls with live mould. We'll tell you honestly which your property needs.",
    },
    {
      question: "Do you need access to water and power?",
      answer:
        "We bring commercial equipment and can work with your outdoor tap. We'll confirm any site requirements at the quote.",
    },
    {
      question: "How long does a typical driveway take?",
      answer:
        "Most residential driveways and paths are a half-day job. We'll give you a time estimate with your quote.",
    },
    {
      question: "Do you service my suburb?",
      answer:
        "We cover Bacchus Marsh, Melton, Ballan and surrounding areas. Submit the form with your suburb and we'll confirm.",
    },
    {
      question: "Are you insured?",
      answer:
        "Yes — fully insured. You're covered if anything unexpected happens on your property.",
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
    headline: "Free On-Site Pressure Washing Quote",
    reasonWhy:
      "We're building our local portfolio across Bacchus Marsh, Melton & Ballan — so we're offering free on-site quotes to homeowners who want a proper clean without the DIY gamble.",
    valueItems: [
      { label: "On-site surface inspection", value: "$120" },
      { label: "Written quote with scope confirmed", value: "$95" },
      { label: "Surface-type assessment", value: "$75" },
    ],
    bonuses: [
      "Priority booking for quotes confirmed this week",
      "Honest advice — we'll tell you if pressure washing isn't the right fit",
    ],
    webBookingDiscountPercent: 10,
  };

  const guarantee: Guarantee = {
    headline: "No-surprises guarantee",
    body: "Fully insured · Clear quote before any work starts · If you're not happy with our assessment, you owe nothing.",
  };

  const urgency: Urgency = {
    enabled: true,
    message:
      "We're booking a limited number of free quotes each week — submit the form to secure your spot.",
  };

  const close: Close = {
    warning:
      "Driveway grime and slippery decks only get worse with weather and traffic. The longer you leave it, the harder — and more expensive — the job becomes.",
    ps: "P.S. A clean driveway is the fastest kerb-appeal upgrade you can make. Book your free quote and we'll tell you exactly what's involved — no obligation.",
  };

  return {
    slug: PRESSURE_WASHING_SLUG,
    name: "Pressure Washing — Bacchus Marsh",
    status: "draft" as const,
    template: "service-landing" as const,
    seoTitle:
      "Pressure Washing Bacchus Marsh | Driveways & Paths — Jim's Window & Pressure Cleaning",
    seoDescription:
      "Professional pressure washing in Bacchus Marsh, Melton & Ballan. Driveways, paths, decks and fences — commercial equipment, fully insured. Free on-site quote.",
    businessName: "Jim's Window & Pressure Cleaning",
    phone: "[PLACEHOLDER — Matt to supply]",
    serviceAreas: ["Bacchus Marsh", "Melton", "Ballan"],
    offerText:
      "Free on-site pressure washing quote — driveways, paths, decks and more. Clear scope, no obligation.",
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
    leadServiceType: "pressure-washing",
    surfaceOptions: [
      "Driveway",
      "Paths / pavers",
      "Deck / timber",
      "Fence",
      "House exterior",
      "Other",
    ],
    reasonQuestion: DEFAULT_REASON_QUESTION,
    reasonOptions: [...DEFAULT_REASON_OPTIONS],
    servicesSectionTitle: "What pressure washing covers",
    servicesSectionDescription:
      "Hard surfaces where grime, oil, and weathering build up — restored with commercial-grade equipment.",
    gallerySectionTitle: "Before & after",
    gallerySectionDescription:
      "Real results from professional pressure washing — driveways, paths, and outdoor surfaces restored.",
    theme: PRESSURE_WASHING_THEME,
    updatedAt: now,
  };
}
