"use client";

import { useMutation, useQuery } from "convex/react";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
  type CloseFields,
  type FaqItem,
  type GuaranteeFields,
  type HowItWorksStep,
  type OfferFields,
  type OfferValueItem,
  type ServiceItem,
  type TestimonialItem,
  type UrgencyFields,
} from "@/components/admin/fields/editor-types";
import { EditorLivePreview } from "@/components/admin/editor-live-preview";
import { FaqEditor } from "@/components/admin/fields/faq-editor";
import { HowItWorksEditor } from "@/components/admin/fields/how-it-works-editor";
import { OfferValueItemsEditor } from "@/components/admin/fields/offer-value-items-editor";
import { ServicesEditor } from "@/components/admin/fields/services-editor";
import { StringListEditor } from "@/components/admin/fields/string-list-editor";
import { TestimonialsEditor } from "@/components/admin/fields/testimonials-editor";
import { ThemeEditor } from "@/components/admin/fields/theme-editor";
import { EditorToolbar } from "@/components/admin/editor-toolbar";
import { AdminPageEditorSkeleton } from "@/components/admin/admin-skeletons";
import { ImageUpload } from "@/components/admin/image-upload";
import type { EditorState, LoadedPage } from "@/components/admin/page-editor-types";
import {
  SectionCard,
  TabIntro,
} from "@/components/admin/section-card";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import {
  DEFAULT_LANDING_THEME,
  normalizeHexColor,
  type LandingTheme,
} from "@/lib/landing-theme";

type PageEditorProps = {
  readonly slug: string;
};

function trimStringList(values: readonly string[]): string[] {
  return values.map((value) => value.trim()).filter(Boolean);
}

function sanitizeServices(values: readonly ServiceItem[]): ServiceItem[] {
  return values
    .map((item) => ({
      title: item.title.trim(),
      description: item.description.trim(),
      icon: item.icon?.trim() || undefined,
    }))
    .filter((item) => item.title || item.description);
}

function sanitizeHowItWorks(
  values: readonly HowItWorksStep[],
): HowItWorksStep[] {
  return values
    .map((item, index) => ({
      step: index + 1,
      title: item.title.trim(),
      description: item.description.trim(),
    }))
    .filter((item) => item.title || item.description);
}

function sanitizeFaq(values: readonly FaqItem[]): FaqItem[] {
  return values
    .map((item) => ({
      question: item.question.trim(),
      answer: item.answer.trim(),
    }))
    .filter((item) => item.question || item.answer);
}

function sanitizeTestimonials(
  values: readonly TestimonialItem[],
): TestimonialItem[] {
  return values
    .map((item) => ({
      quote: item.quote.trim(),
      author: item.author.trim(),
      location: item.location?.trim() || undefined,
    }))
    .filter((item) => item.quote || item.author);
}

function sanitizeOfferValueItems(
  values: readonly OfferValueItem[],
): OfferValueItem[] {
  return values
    .map((item) => ({
      label: item.label.trim(),
      value: item.value?.trim() || undefined,
    }))
    .filter((item) => item.label);
}

function sanitizeOffer(offer: OfferFields): OfferFields {
  return {
    headline: offer.headline.trim(),
    reasonWhy: offer.reasonWhy.trim(),
    valueItems: sanitizeOfferValueItems(offer.valueItems),
    bonuses: trimStringList(offer.bonuses),
  };
}

function sanitizeGuarantee(
  guarantee: GuaranteeFields,
): GuaranteeFields | undefined {
  const headline = guarantee.headline.trim();
  const body = guarantee.body.trim();
  if (!headline && !body) {
    return undefined;
  }
  return { headline, body };
}

function sanitizeUrgency(urgency: UrgencyFields): UrgencyFields | undefined {
  const message = urgency.message.trim();
  if (!urgency.enabled || !message) {
    return undefined;
  }
  return { enabled: true, message };
}

function sanitizeClose(close: CloseFields): CloseFields | undefined {
  const ps = close.ps.trim();
  if (!ps) {
    return undefined;
  }
  return {
    ps,
    warning: close.warning?.trim() || undefined,
  };
}

function sanitizeTheme(theme: LandingTheme): LandingTheme {
  return {
    primary:
      normalizeHexColor(theme.primary) ?? DEFAULT_LANDING_THEME.primary,
    heroFrom:
      normalizeHexColor(theme.heroFrom) ?? DEFAULT_LANDING_THEME.heroFrom,
    heroTo: normalizeHexColor(theme.heroTo) ?? DEFAULT_LANDING_THEME.heroTo,
    accent: normalizeHexColor(theme.accent) ?? DEFAULT_LANDING_THEME.accent,
  };
}

function optionalTrim(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed || undefined;
}

function pageToEditorState(page: LoadedPage): EditorState {
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
    },
    guarantee: {
      headline: page.guarantee?.headline ?? "",
      body: page.guarantee?.body ?? "",
    },
    urgency: {
      enabled: page.urgency?.enabled ?? false,
      message: page.urgency?.message ?? "",
    },
    close: {
      warning: page.close?.warning ?? "",
      ps: page.close?.ps ?? "",
    },
    services: page.services.map((item) => ({ ...item })),
    howItWorks: page.howItWorks.map((item) => ({ ...item })),
    faq: page.faq.map((item) => ({ ...item })),
    testimonials: page.testimonials.map((item) => ({
      ...item,
      location: item.location ?? "",
    })),
    metaPixelId: page.metaPixelId ?? "",
    googleAdsId: page.googleAdsId ?? "",
    googleConversionLabel: page.googleConversionLabel ?? "",
    leadServiceType: page.leadServiceType,
    surfaceOptions: [...page.surfaceOptions],
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

export function PageEditor({ slug }: PageEditorProps) {
  const page = useQuery(api.landingPages.getBySlug, { slug });
  const gallery = useQuery(
    api.landingPageGallery.listByPageId,
    page ? { pageId: page._id } : "skip",
  );
  const updatePage = useMutation(api.landingPages.update);
  const publishPage = useMutation(api.landingPages.publish);
  const unpublishPage = useMutation(api.landingPages.unpublish);
  const upsertGallery = useMutation(api.landingPageGallery.upsert);
  const removeGallery = useMutation(api.landingPageGallery.remove);

  const [state, setState] = useState<EditorState | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeUploads, setActiveUploads] = useState(0);
  const [newBeforeId, setNewBeforeId] = useState<Id<"_storage"> | undefined>();
  const [newAfterId, setNewAfterId] = useState<Id<"_storage"> | undefined>();
  const [newGalleryLabel, setNewGalleryLabel] = useState("");

  const handleUploadingChange = useCallback((uploading: boolean) => {
    setActiveUploads((count) => {
      if (uploading) {
        return count + 1;
      }
      return Math.max(0, count - 1);
    });
  }, []);

  useEffect(() => {
    if (!page || state) {
      return;
    }

    setState(pageToEditorState(page));
  }, [page, state]);

  if (page === undefined || !state) {
    return <AdminPageEditorSkeleton />;
  }

  if (page === null) {
    return (
      <p className="text-muted-foreground">
        Page not found.{" "}
        <Link href="/admin" className="underline">
          Back to admin
        </Link>
      </p>
    );
  }

  const pageId = page._id;

  function updateField<K extends keyof EditorState>(
    key: K,
    value: EditorState[K],
  ) {
    setState((current) => (current ? { ...current, [key]: value } : current));
  }

  async function handleSave() {
    if (!state) {
      return;
    }

    const currentState = state;
    setSaving(true);
    setMessage(null);

    const result = await updatePage({
      slug,
      updates: {
        name: currentState.name.trim(),
        seoTitle: currentState.seoTitle.trim(),
        seoDescription: currentState.seoDescription.trim(),
        businessName: currentState.businessName.trim(),
        phone: currentState.phone.trim(),
        serviceAreas: trimStringList(currentState.serviceAreas),
        offerText: sanitizeOffer(currentState.offer).headline,
        ctaLabel: currentState.ctaLabel.trim(),
        hero: {
          headline: currentState.heroHeadline.trim(),
          subheadline: currentState.heroSubheadline.trim(),
          trustStrip: trimStringList(currentState.trustStrip),
          imageStorageId: currentState.heroImageStorageId,
          logoStorageId: currentState.heroLogoStorageId,
          audienceCallout: currentState.heroAudienceCallout.trim() || undefined,
          intrigueBullets: trimStringList(currentState.heroIntrigueBullets),
        },
        problem: { body: currentState.problemBody.trim() },
        wedge: {
          headline: optionalTrim(currentState.wedgeHeadline),
          description: optionalTrim(currentState.wedgeDescription),
          negativeTitle: optionalTrim(currentState.wedgeNegativeTitle),
          positiveTitle: optionalTrim(currentState.wedgePositiveTitle),
          pressureWashPoints: trimStringList(currentState.pressurePoints),
          softwashPoints: trimStringList(currentState.softwashPoints),
        },
        offer: sanitizeOffer(currentState.offer),
        guarantee: sanitizeGuarantee(currentState.guarantee),
        urgency: sanitizeUrgency(currentState.urgency),
        close: sanitizeClose(currentState.close),
        services: sanitizeServices(currentState.services),
        howItWorks: sanitizeHowItWorks(currentState.howItWorks),
        faq: sanitizeFaq(currentState.faq),
        testimonials: sanitizeTestimonials(currentState.testimonials),
        metaPixelId: currentState.metaPixelId.trim() || undefined,
        googleAdsId: currentState.googleAdsId.trim() || undefined,
        googleConversionLabel:
          currentState.googleConversionLabel.trim() || undefined,
        leadServiceType: currentState.leadServiceType.trim(),
        surfaceOptions: trimStringList(currentState.surfaceOptions),
        servicesSectionTitle: optionalTrim(currentState.servicesSectionTitle),
        servicesSectionDescription: optionalTrim(
          currentState.servicesSectionDescription,
        ),
        gallerySectionTitle: optionalTrim(currentState.gallerySectionTitle),
        gallerySectionDescription: optionalTrim(
          currentState.gallerySectionDescription,
        ),
        theme: sanitizeTheme(currentState.theme),
      },
    });

    setSaving(false);
    setMessage(result.success ? "Saved." : (result.error ?? "Save failed."));
  }

  async function handlePublish() {
    const result = await publishPage({ slug });
    setMessage(result.success ? "Published." : (result.error ?? "Failed."));
  }

  async function handleUnpublish() {
    const result = await unpublishPage({ slug });
    setMessage(result.success ? "Unpublished." : (result.error ?? "Failed."));
  }

  async function handleAddGalleryItem() {
    if (!newBeforeId || !newAfterId) {
      setMessage("Upload both before and after images.");
      return;
    }

    const sortOrder = gallery?.length ?? 0;
    await upsertGallery({
      pageId,
      sortOrder,
      label: newGalleryLabel.trim() || undefined,
      beforeStorageId: newBeforeId,
      afterStorageId: newAfterId,
    });

    setNewBeforeId(undefined);
    setNewAfterId(undefined);
    setNewGalleryLabel("");
    setMessage("Gallery item added.");
  }

  return (
    <div className="space-y-4">
      <LinkButton href="/admin" variant="ghost" size="sm" className="-ml-2">
        <ArrowLeftIcon className="size-4" />
        All pages
      </LinkButton>

      <EditorToolbar
        pageName={state.name}
        slug={slug}
        status={page.status}
        saving={saving}
        uploading={activeUploads > 0}
        message={message}
        onSave={handleSave}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
      />

      <Tabs defaultValue="general" className="pt-2">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-muted/40 p-1">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="preview">Live preview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 pt-6">
          <TabIntro
            title="Business details"
            description="Contact info, service areas, and quote form settings."
          />

          <SectionCard title="Basics">
            <FieldGroup>
              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel>Page name</FieldLabel>
                  <Input
                    value={state.name}
                    onChange={(event) => updateField("name", event.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel>Business name</FieldLabel>
                  <Input
                    value={state.businessName}
                    onChange={(event) =>
                      updateField("businessName", event.target.value)
                    }
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel>Phone number</FieldLabel>
                <Input
                  value={state.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder="e.g. 0400 000 000"
                />
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel>Quote button text</FieldLabel>
                  <Input
                    value={state.ctaLabel}
                    onChange={(event) =>
                      updateField("ctaLabel", event.target.value)
                    }
                    placeholder="e.g. Get a free quote"
                  />
                </Field>
                <Field>
                  <FieldLabel>Service type (for leads)</FieldLabel>
                  <Input
                    value={state.leadServiceType}
                    onChange={(event) =>
                      updateField("leadServiceType", event.target.value)
                    }
                    placeholder="e.g. Softwashing"
                  />
                </Field>
              </div>
            </FieldGroup>
          </SectionCard>

          <StringListEditor
            label="Service areas"
            description="Suburbs or regions you service."
            values={state.serviceAreas}
            onChange={(values) => updateField("serviceAreas", values)}
            placeholder="e.g. Bacchus Marsh"
            addLabel="Add area"
          />

          <StringListEditor
            label="Surface options"
            description="Choices on the quote form — roof, driveway, etc."
            values={state.surfaceOptions}
            onChange={(values) => updateField("surfaceOptions", values)}
            placeholder="e.g. Roof"
            addLabel="Add option"
          />
        </TabsContent>

        <TabsContent value="seo" className="space-y-6 pt-6">
          <TabIntro
            title="Search & sharing"
            description="How your page appears in Google and when shared on social."
          />

          <SectionCard title="Meta tags">
            <FieldGroup>
              <Field>
                <FieldLabel>Page title</FieldLabel>
                <Input
                  value={state.seoTitle}
                  onChange={(event) =>
                    updateField("seoTitle", event.target.value)
                  }
                />
                <p className="text-xs text-muted-foreground">
                  {state.seoTitle.length} characters — aim for under 60
                </p>
              </Field>
              <Field>
                <FieldLabel>Description</FieldLabel>
                <Textarea
                  value={state.seoDescription}
                  onChange={(event) =>
                    updateField("seoDescription", event.target.value)
                  }
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  {state.seoDescription.length} characters — aim for 120–160
                </p>
              </Field>
            </FieldGroup>
          </SectionCard>
        </TabsContent>

        <TabsContent value="hero" className="space-y-6 pt-6">
          <TabIntro
            title="Top of page"
            description="The first thing visitors see — headline, trust badges, and hero photo."
          />

          <SectionCard title="Headline & intro">
            <FieldGroup>
              <Field>
                <FieldLabel>Audience callout</FieldLabel>
                <Input
                  value={state.heroAudienceCallout}
                  onChange={(event) =>
                    updateField("heroAudienceCallout", event.target.value)
                  }
                  placeholder="e.g. For Bacchus Marsh homeowners"
                />
                <p className="text-xs text-muted-foreground">
                  Eyebrow text above the headline — who this page is for. Leave
                  blank to show service areas instead.
                </p>
              </Field>
              <Field>
                <FieldLabel>Main headline</FieldLabel>
                <Input
                  value={state.heroHeadline}
                  onChange={(event) =>
                    updateField("heroHeadline", event.target.value)
                  }
                />
              </Field>
              <Field>
                <FieldLabel>Supporting text</FieldLabel>
                <Textarea
                  value={state.heroSubheadline}
                  onChange={(event) =>
                    updateField("heroSubheadline", event.target.value)
                  }
                  rows={3}
                />
              </Field>
            </FieldGroup>
          </SectionCard>

          <StringListEditor
            label="Intrigue bullets"
            description="5–6 scannable hooks that mix pain, curiosity, and secrets — shown below the sub-headline."
            values={state.heroIntrigueBullets}
            onChange={(values) => updateField("heroIntrigueBullets", values)}
            placeholder="e.g. Why pressure washing brings mould back…"
            addLabel="Add bullet"
          />

          <StringListEditor
            label="Trust badges"
            description="Short proof points under the headline — e.g. Fully insured."
            values={state.trustStrip}
            onChange={(values) => updateField("trustStrip", values)}
            placeholder="e.g. Fully insured"
            addLabel="Add badge"
          />

          <SectionCard
            title="Logo"
            description="Shown above the services section as visitors scroll — reinforces that they're on the right site. Use a light/white logo on the brand gradient (PNG with transparent background)."
          >
            <ImageUpload
              label="Upload logo"
              currentUrl={page.hero.logoUrl}
              storageId={state.heroLogoStorageId}
              onUploadingChange={handleUploadingChange}
              onUploaded={(storageId) =>
                updateField("heroLogoStorageId", storageId)
              }
            />
          </SectionCard>

          <SectionCard title="Hero photo">
            <ImageUpload
              label="Upload hero image"
              currentUrl={page.hero.imageUrl}
              storageId={state.heroImageStorageId}
              onUploadingChange={handleUploadingChange}
              onUploaded={(storageId) =>
                updateField("heroImageStorageId", storageId)
              }
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="content" className="space-y-6 pt-6">
          <TabIntro
            title="Page content"
            description="Tell your story, list services, and answer common questions. Everything saves as structured data — no technical input needed."
          />

          <Tabs defaultValue="story">
            <TabsList className="mb-4 flex h-auto flex-wrap gap-1 bg-muted/30 p-1">
              <TabsTrigger value="story">Story</TabsTrigger>
              <TabsTrigger value="sections">Services & steps</TabsTrigger>
              <TabsTrigger value="offer">Offer & close</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="reviews">Testimonials</TabsTrigger>
            </TabsList>

            <TabsContent value="story" className="space-y-6">
              <SectionCard title="Problem section">
                <Field>
                  <FieldLabel>What problem does your customer have?</FieldLabel>
                  <Textarea
                    value={state.problemBody}
                    onChange={(event) =>
                      updateField("problemBody", event.target.value)
                    }
                    rows={6}
                    placeholder="Describe the pain point your service solves…"
                  />
                </Field>
              </SectionCard>

              <SectionCard title="Comparison section">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Section headline</FieldLabel>
                    <Input
                      value={state.wedgeHeadline}
                      onChange={(event) =>
                        updateField("wedgeHeadline", event.target.value)
                      }
                      placeholder="e.g. Why pressure washing alone doesn't fix it"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Section description</FieldLabel>
                    <Textarea
                      value={state.wedgeDescription}
                      onChange={(event) =>
                        updateField("wedgeDescription", event.target.value)
                      }
                      rows={2}
                      placeholder="Short intro under the headline…"
                    />
                  </Field>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field>
                      <FieldLabel>Left column title</FieldLabel>
                      <Input
                        value={state.wedgeNegativeTitle}
                        onChange={(event) =>
                          updateField("wedgeNegativeTitle", event.target.value)
                        }
                        placeholder="e.g. DIY / wrong approach"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Right column title</FieldLabel>
                      <Input
                        value={state.wedgePositiveTitle}
                        onChange={(event) =>
                          updateField("wedgePositiveTitle", event.target.value)
                        }
                        placeholder="e.g. Professional service"
                      />
                    </Field>
                  </div>
                </FieldGroup>
              </SectionCard>

              <StringListEditor
                label="Left column points"
                description="Drawbacks of the alternative approach."
                values={state.pressurePoints}
                onChange={(values) => updateField("pressurePoints", values)}
                placeholder="Add a point…"
                addLabel="Add"
              />

              <StringListEditor
                label="Right column points"
                description="Benefits of your approach."
                values={state.softwashPoints}
                onChange={(values) => updateField("softwashPoints", values)}
                placeholder="Add a point…"
                addLabel="Add"
              />
            </TabsContent>

            <TabsContent value="sections" className="space-y-6">
              <SectionCard title="Services section headings">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Section title</FieldLabel>
                    <Input
                      value={state.servicesSectionTitle}
                      onChange={(event) =>
                        updateField("servicesSectionTitle", event.target.value)
                      }
                      placeholder="e.g. What we cover"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Section description</FieldLabel>
                    <Textarea
                      value={state.servicesSectionDescription}
                      onChange={(event) =>
                        updateField(
                          "servicesSectionDescription",
                          event.target.value,
                        )
                      }
                      rows={2}
                    />
                  </Field>
                </FieldGroup>
              </SectionCard>
              <ServicesEditor
                values={state.services}
                onChange={(values) => updateField("services", values)}
              />
              <HowItWorksEditor
                values={state.howItWorks}
                onChange={(values) => updateField("howItWorks", values)}
              />
            </TabsContent>

            <TabsContent value="offer" className="space-y-6">
              <SectionCard title="Godfather offer">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Offer headline</FieldLabel>
                    <Input
                      value={state.offer.headline}
                      onChange={(event) =>
                        updateField("offer", {
                          ...state.offer,
                          headline: event.target.value,
                        })
                      }
                      placeholder="e.g. Free On-Site Softwash Assessment"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Reason why (optional)</FieldLabel>
                    <Textarea
                      value={state.offer.reasonWhy}
                      onChange={(event) =>
                        updateField("offer", {
                          ...state.offer,
                          reasonWhy: event.target.value,
                        })
                      }
                      rows={3}
                      placeholder="Explain why you're offering this for free…"
                    />
                  </Field>
                </FieldGroup>
              </SectionCard>

              <OfferValueItemsEditor
                values={state.offer.valueItems}
                onChange={(valueItems) =>
                  updateField("offer", { ...state.offer, valueItems })
                }
              />

              <StringListEditor
                label="Bonuses"
                description="Extra sweeteners stacked on top of the main offer."
                values={state.offer.bonuses}
                onChange={(bonuses) =>
                  updateField("offer", { ...state.offer, bonuses })
                }
                placeholder="e.g. Priority booking this week"
                addLabel="Add bonus"
              />

              <SectionCard title="Urgency">
                <FieldGroup>
                  <Field className="flex flex-row items-start gap-3 space-y-0">
                    <Checkbox
                      id="urgency-enabled"
                      checked={state.urgency.enabled}
                      onCheckedChange={(checked) =>
                        updateField("urgency", {
                          ...state.urgency,
                          enabled: checked === true,
                        })
                      }
                    />
                    <div className="space-y-1">
                      <FieldLabel htmlFor="urgency-enabled">
                        Show urgency banner
                      </FieldLabel>
                      <p className="text-xs text-muted-foreground">
                        Only use genuine limits — e.g. spots available this
                        week.
                      </p>
                    </div>
                  </Field>
                  {state.urgency.enabled ? (
                    <Field>
                      <FieldLabel>Urgency message</FieldLabel>
                      <Textarea
                        value={state.urgency.message}
                        onChange={(event) =>
                          updateField("urgency", {
                            ...state.urgency,
                            message: event.target.value,
                          })
                        }
                        rows={2}
                        placeholder="e.g. Booking 8 assessments this week…"
                      />
                    </Field>
                  ) : null}
                </FieldGroup>
              </SectionCard>

              <SectionCard title="Guarantee">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Headline</FieldLabel>
                    <Input
                      value={state.guarantee.headline}
                      onChange={(event) =>
                        updateField("guarantee", {
                          ...state.guarantee,
                          headline: event.target.value,
                        })
                      }
                      placeholder="e.g. No-pressure guarantee"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Body</FieldLabel>
                    <Textarea
                      value={state.guarantee.body}
                      onChange={(event) =>
                        updateField("guarantee", {
                          ...state.guarantee,
                          body: event.target.value,
                        })
                      }
                      rows={3}
                      placeholder="Risk reversal — insured, no obligation, etc."
                    />
                  </Field>
                </FieldGroup>
              </SectionCard>

              <SectionCard title="Close (warning & P.S.)">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Warning (optional)</FieldLabel>
                    <Textarea
                      value={state.close.warning}
                      onChange={(event) =>
                        updateField("close", {
                          ...state.close,
                          warning: event.target.value,
                        })
                      }
                      rows={3}
                      placeholder="What happens if they don't act…"
                    />
                  </Field>
                  <Field>
                    <FieldLabel>P.S.</FieldLabel>
                    <Textarea
                      value={state.close.ps}
                      onChange={(event) =>
                        updateField("close", {
                          ...state.close,
                          ps: event.target.value,
                        })
                      }
                      rows={3}
                      placeholder="Final reminder — benefit + restate the offer"
                    />
                  </Field>
                </FieldGroup>
              </SectionCard>
            </TabsContent>

            <TabsContent value="faq" className="space-y-6">
              <FaqEditor
                values={state.faq}
                onChange={(values) => updateField("faq", values)}
              />
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <TestimonialsEditor
                values={state.testimonials}
                onChange={(values) => updateField("testimonials", values)}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="theme" className="space-y-6 pt-6">
          <TabIntro
            title="Colours & branding"
            description="Customise the look of this landing page — hero banner, buttons, and accent highlights."
          />
          <SectionCard title="Page theme">
            <ThemeEditor
              value={state.theme}
              onChange={(theme) => updateField("theme", theme)}
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6 pt-6">
          <TabIntro
            title="Before & after photos"
            description="Show real results. Each pair appears on the landing page."
          />

          <SectionCard title="Gallery section headings">
            <FieldGroup>
              <Field>
                <FieldLabel>Section title</FieldLabel>
                <Input
                  value={state.gallerySectionTitle}
                  onChange={(event) =>
                    updateField("gallerySectionTitle", event.target.value)
                  }
                  placeholder="e.g. Before & after"
                />
              </Field>
              <Field>
                <FieldLabel>Section description</FieldLabel>
                <Textarea
                  value={state.gallerySectionDescription}
                  onChange={(event) =>
                    updateField("gallerySectionDescription", event.target.value)
                  }
                  rows={2}
                />
              </Field>
            </FieldGroup>
          </SectionCard>

          {gallery && gallery.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {gallery.map((item) => (
                <SectionCard
                  key={item._id}
                  title={item.label ?? "Before / after"}
                  action={
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeGallery({ itemId: item._id })}
                    >
                      Remove
                    </Button>
                  }
                >
                  <div className="grid grid-cols-2 gap-3">
                    {item.beforeUrl ? (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Before
                        </p>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.beforeUrl}
                          alt="Before"
                          className="aspect-video w-full rounded-lg object-cover"
                        />
                      </div>
                    ) : null}
                    {item.afterUrl ? (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          After
                        </p>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.afterUrl}
                          alt="After"
                          className="aspect-video w-full rounded-lg object-cover"
                        />
                      </div>
                    ) : null}
                  </div>
                </SectionCard>
              ))}
            </div>
          ) : (
            <SectionCard title="No photos yet">
              <p className="text-sm text-muted-foreground">
                Add your first before/after pair below.
              </p>
            </SectionCard>
          )}

          <SectionCard
            title="Add new before/after"
            description="Upload two photos, then click add."
          >
            <Field>
              <FieldLabel>Label (optional)</FieldLabel>
              <Input
                value={newGalleryLabel}
                onChange={(event) => setNewGalleryLabel(event.target.value)}
                placeholder="e.g. Roof clean — Bacchus Marsh"
              />
            </Field>
            <div className="grid gap-6 md:grid-cols-2">
              <ImageUpload
                label="Before"
                storageId={newBeforeId}
                onUploadingChange={handleUploadingChange}
                onUploaded={setNewBeforeId}
              />
              <ImageUpload
                label="After"
                storageId={newAfterId}
                onUploadingChange={handleUploadingChange}
                onUploaded={setNewAfterId}
              />
            </div>
            <Button type="button" onClick={handleAddGalleryItem}>
              Add to gallery
            </Button>
          </SectionCard>
        </TabsContent>

        <TabsContent value="preview" className="space-y-0 pt-6">
          <EditorLivePreview
            page={page}
            state={state}
            gallery={gallery ?? []}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 pt-6">
          <TabIntro
            title="Tracking & ads"
            description="Optional — leave blank to use site-wide defaults."
          />

          <SectionCard title="Ad & pixel IDs">
            <FieldGroup>
              <Field>
                <FieldLabel>Meta (Facebook) Pixel ID</FieldLabel>
                <Input
                  value={state.metaPixelId}
                  onChange={(event) =>
                    updateField("metaPixelId", event.target.value)
                  }
                  placeholder="Optional"
                />
              </Field>
              <Field>
                <FieldLabel>Google Ads ID</FieldLabel>
                <Input
                  value={state.googleAdsId}
                  onChange={(event) =>
                    updateField("googleAdsId", event.target.value)
                  }
                  placeholder="Optional"
                />
              </Field>
              <Field>
                <FieldLabel>Google conversion label</FieldLabel>
                <Input
                  value={state.googleConversionLabel}
                  onChange={(event) =>
                    updateField("googleConversionLabel", event.target.value)
                  }
                  placeholder="Optional"
                />
              </Field>
            </FieldGroup>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
