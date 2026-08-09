import type { Doc } from "../_generated/dataModel";
import { createSoftwashingSeed } from "./seedSoftwashingData";

type LandingPageInsert = Omit<Doc<"landingPages">, "_id" | "_creationTime">;

export function createPageFromTemplate(
  slug: string,
  name: string,
  now: number,
): LandingPageInsert {
  const base = createSoftwashingSeed(now);
  const serviceLabel = name.trim() || slug.replace(/-/g, " ");

  return {
    ...base,
    slug,
    name: name.trim(),
    status: "draft",
    seoTitle: `${serviceLabel} | Jim's Window & Pressure Cleaning`,
    seoDescription: `Professional ${serviceLabel.toLowerCase()} in Bacchus Marsh, Melton & Ballan. Edit this description in admin.`,
    leadServiceType: slug.replace(/-/g, " "),
    offerText: `Free on-site ${serviceLabel.toLowerCase()} assessment & quote — no obligation.`,
    hero: {
      ...base.hero,
      headline: `Your ${serviceLabel} headline here`,
      subheadline: `Edit this subheadline to describe your ${serviceLabel.toLowerCase()} offer.`,
      intrigueBullets: [
        "Edit intrigue bullet 1 in admin",
        "Edit intrigue bullet 2 in admin",
        "Edit intrigue bullet 3 in admin",
        "Edit intrigue bullet 4 in admin",
      ],
    },
    problem: {
      body: "Describe the problem your customers face here. Edit this section in admin to match your service.",
    },
    wedge: {
      headline: "Why choose us over the alternative",
      description:
        "Explain your unique approach here. Edit this comparison section in admin.",
      negativeTitle: "The usual approach",
      positiveTitle: serviceLabel,
      pressureWashPoints: [
        "Edit negative comparison point 1 in admin",
        "Edit negative comparison point 2 in admin",
        "Edit negative comparison point 3 in admin",
      ],
      softwashPoints: [
        "Edit positive comparison point 1 in admin",
        "Edit positive comparison point 2 in admin",
        "Edit positive comparison point 3 in admin",
      ],
    },
    services: base.services.map((service, index) => ({
      ...service,
      title: `Service ${index + 1}`,
      description: "Edit this service description in admin.",
    })),
    faq: base.faq.map((_item, index) => ({
      question: `FAQ question ${index + 1} — edit in admin`,
      answer: "Edit this FAQ answer in admin.",
    })),
    testimonials: base.testimonials.map((item) => ({
      ...item,
      quote: "Edit this testimonial quote in admin.",
      author: "Customer name",
    })),
    offer: {
      ...base.offer,
      headline: `Free On-Site ${serviceLabel} Assessment & Quote`,
      reasonWhy: `Edit this offer explanation in admin for ${serviceLabel.toLowerCase()}.`,
      valueItems: base.offer.valueItems.map((item) => ({
        ...item,
        label: "Edit value item in admin",
      })),
      bonuses: ["Edit bonus 1 in admin", "Edit bonus 2 in admin"],
    },
    close: {
      warning: "Edit urgency warning in admin.",
      ps: `P.S. Edit this closing message in admin for ${serviceLabel.toLowerCase()}.`,
    },
    servicesSectionTitle: `What ${serviceLabel.toLowerCase()} covers`,
    servicesSectionDescription:
      "Edit this services section description in admin.",
    gallerySectionTitle: "Before & after",
    gallerySectionDescription:
      "Edit gallery section description in admin. Upload before/after photos in the Gallery tab.",
    updatedAt: now,
  };
}
