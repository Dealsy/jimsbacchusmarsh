import type { Infer } from "convex/values";
import { createDefaultThankYou } from "./defaultThankYou";
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

export const DEFAULT_THEME: Theme = {
  primary: "#059669",
  heroFrom: "#022c22",
  heroTo: "#064e3b",
  accent: "#047857",
};

export const SOFTWASHING_SLUG = "softwashing";

export function createSoftwashingSeed(now: number) {
  const hero: Hero = {
    audienceCallout: "For Bacchus Marsh, Melton & Ballan homeowners",
    headline: "Mould & Algae Gone — Without Damaging Your Roof or Walls",
    subheadline:
      "Safe low-pressure softwashing for Bacchus Marsh, Melton & Ballan homes. Kills mould at the root — not just a surface blast.",
    intrigueBullets: [
      "Why pressure washing brings mould back within months",
      "The #1 mistake homeowners make with roof cleaning",
      "How to tell if softwashing is right for your roof or walls",
      "What actually kills mould at the root — not just the surface",
    ],
    trustStrip: [
      "Fully Insured",
      "Safe on Render & Colorbond",
      "Local Bacchus Marsh Operator",
    ],
  };

  const problem: Problem = {
    body: "Black streaks creeping across your roof. Green algae climbing the fence. That grubby, ageing look spreading over walls you know should look better.\n\nIf you're noticing it every time you pull into the driveway — you're not alone, and it doesn't have to stay that way.",
  };

  const wedge: Wedge = {
    headline: "Why pressure washing alone doesn't fix it",
    description:
      "High pressure might look good for a few weeks — but if the roots are still alive, the mould comes straight back.",
    negativeTitle: "Pressure washing alone",
    positiveTitle: "Softwashing",
    pressureWashPoints: [
      "Blasts off visible growth but leaves mould and algae roots behind — so it comes back in months",
      "High pressure can strip paint, crack render, dislodge roof pointing, and damage seals",
      "Looks clean for a few weeks, then the black streaks and green tinge return",
    ],
    softwashPoints: [
      "Low pressure plus a biocide treatment that kills mould and algae at the root",
      "Safe on paint, render, Colorbond, and roof coatings — nothing gets damaged",
      "Results last longer because the spores are dead, not just rinsed off the surface",
    ],
  };

  const services: ServiceItem[] = [
    {
      title: "Roofs",
      description:
        "Tiled and metal roofs with black streaks, lichen, and algae — treated safely without dislodging tiles or pointing.",
      icon: "home",
    },
    {
      title: "House Exteriors",
      description:
        "Rendered and painted walls, including south-facing and shaded areas where mould loves to grow.",
      icon: "building",
    },
    {
      title: "Colorbond Fencing & Cladding",
      description:
        "Green algae and grime on fences and cladding — cleaned without scratching or stripping the coating.",
      icon: "fence",
    },
    {
      title: "Retaining Walls",
      description:
        "Mould and algae on concrete and timber retaining walls — restored without damage from high pressure.",
      icon: "layers",
    },
  ];

  const howItWorks: HowItWorksStep[] = [
    {
      step: 1,
      title: "Free On-Site Assessment",
      description:
        "We inspect your roof, walls, or fence and confirm softwashing is the right approach — no obligation.",
    },
    {
      step: 2,
      title: "Scope & Price Confirmed",
      description:
        "You get a clear quote for the work before anything starts. No surprises on the day.",
    },
    {
      step: 3,
      title: "Softwash Treatment Applied",
      description:
        "Low-pressure application with proper treatment — mould and algae killed at the root for a result that lasts.",
    },
  ];

  const faq: FaqItem[] = [
    {
      question: "Will this damage my roof, paint, or render?",
      answer:
        "No — that's the whole point of softwashing. We use low pressure and a treatment designed for delicate surfaces. High-pressure blasting is what strips paint and cracks render. Softwashing is specifically chosen because it's safe on coatings, seals, and pointing.",
    },
    {
      question: "How long does the result last compared to pressure washing?",
      answer:
        "Pressure washing typically gives you a few months before mould and algae return, because the roots stay alive. Softwashing kills the spores, so results last significantly longer — often 12 months or more depending on shade and exposure.",
    },
    {
      question: "Is it safe for pets, plants, and the garden?",
      answer:
        "We take precautions around gardens and outdoor areas. Plants are rinsed before and after treatment, and pets should be kept inside during application. We'll walk you through anything specific to your property at the assessment.",
    },
    {
      question: "How long until I see results?",
      answer:
        "You'll often see improvement within days as the treatment works. Full results develop over 1–4 weeks as dead organic matter washes away naturally with rain — no need for another visit.",
    },
    {
      question: "Do you service my suburb?",
      answer:
        "We cover Bacchus Marsh, Melton, Ballan and surrounding areas. Not sure if you're in range? Submit the form with your suburb and we'll confirm.",
    },
    {
      question: "Are you insured?",
      answer:
        "Yes — fully insured. We use proper softwash-specific equipment and treatment, not just a pressure washer turned down low.",
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
    headline: "Free On-Site Softwash Assessment & Quote",
    reasonWhy:
      "We're building our local portfolio in Bacchus Marsh, Melton & Ballan — so we're offering free on-site assessments to homeowners who want an honest answer on whether softwashing is right for their property.",
    valueItems: [
      { label: "On-site roof & exterior inspection", value: "$150" },
      { label: "Written quote with scope confirmed upfront", value: "$95" },
      { label: "Softwash suitability assessment", value: "$75" },
    ],
    bonuses: [
      "Priority booking for assessments booked this week",
      "Honest advice — we'll tell you if softwashing isn't the right fit",
    ],
    webBookingDiscountPercent: 10,
  };

  const guarantee: Guarantee = {
    headline: "No-pressure guarantee",
    body: "Fully insured · Clear quote before any work starts · If you're not happy with our assessment, you owe nothing.",
  };

  const urgency: Urgency = {
    enabled: true,
    message:
      "We're booking a limited number of free assessments each week — submit the form to secure your spot.",
  };

  const close: Close = {
    warning:
      "Mould and algae spread quickly in shaded, damp areas. The longer roots stay alive, the worse it gets — and pressure washing alone won't fix it.",
    ps: "P.S. Mould comes back fast if roots aren't killed. Book your free assessment and we'll tell you honestly whether softwashing is right for your roof or walls.",
  };

  return {
    slug: SOFTWASHING_SLUG,
    name: "Softwashing — Bacchus Marsh",
    status: "draft" as const,
    template: "service-landing" as const,
    seoTitle:
      "Softwashing Bacchus Marsh | Roof Mould Removal — Jim's Window & Pressure Cleaning",
    seoDescription:
      "Safe softwashing in Bacchus Marsh, Melton & Ballan. Kill mould and algae on roofs, render, Colorbond & fences without damage. Free on-site assessment.",
    businessName: "Jim's Window & Pressure Cleaning",
    phone: "[PLACEHOLDER — Matt to supply]",
    serviceAreas: ["Bacchus Marsh", "Melton", "Ballan"],
    offerText:
      "Free on-site softwash assessment & quote — find out if softwashing is right for your roof or walls, no obligation.",
    ctaLabel: "Get My Free Assessment",
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
    leadServiceType: "softwashing",
    surfaceOptions: ["Roof", "Walls", "Fence", "Retaining wall", "Other"],
    servicesSectionTitle: "What softwashing covers",
    servicesSectionDescription:
      "Low-pressure treatment for the surfaces where mould and algae do the most damage.",
    gallerySectionTitle: "Before & after",
    gallerySectionDescription:
      "Real results from softwash treatments — mould and algae gone, surfaces protected.",
    theme: DEFAULT_THEME,
    updatedAt: now,
  };
}
