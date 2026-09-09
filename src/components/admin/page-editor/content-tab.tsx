import { FaqEditor } from "@/components/admin/fields/faq-editor";
import { HowItWorksEditor } from "@/components/admin/fields/how-it-works-editor";
import { OfferValueItemsEditor } from "@/components/admin/fields/offer-value-items-editor";
import { ServicesEditor } from "@/components/admin/fields/services-editor";
import { StringListEditor } from "@/components/admin/fields/string-list-editor";
import { TestimonialsEditor } from "@/components/admin/fields/testimonials-editor";
import type {
  EditorState,
  UpdateEditorField,
} from "@/components/admin/page-editor-types";
import { SectionCard, TabIntro } from "@/components/admin/section-card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type ContentTabProps = {
  readonly state: EditorState;
  readonly updateField: UpdateEditorField;
};

export function ContentTab({ state, updateField }: ContentTabProps) {
  return (
    <div className="space-y-6 pt-6">
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

          <SectionCard title="Web booking discount">
            <Field>
              <FieldLabel>Discount percent (optional)</FieldLabel>
              <Input
                type="number"
                min={1}
                max={100}
                value={state.offer.webBookingDiscountPercent ?? ""}
                onChange={(event) => {
                  const raw = event.target.value;
                  updateField("offer", {
                    ...state.offer,
                    webBookingDiscountPercent:
                      raw === "" ? undefined : Number.parseInt(raw, 10),
                  });
                }}
                placeholder="e.g. 10"
              />
              <FieldDescription>
                Shown on the offer card and stamped on leads. Leave blank to
                hide. 10 means 10% off the job when booked from this page.
              </FieldDescription>
            </Field>
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
                    updateField(
                      "urgency",
                      checked === true
                        ? {
                            enabled: true,
                            message: state.urgency.message,
                          }
                        : {
                            enabled: false,
                            message: state.urgency.message,
                          },
                    )
                  }
                />
                <div className="space-y-1">
                  <FieldLabel htmlFor="urgency-enabled">
                    Show urgency banner
                  </FieldLabel>
                  <p className="text-xs text-muted-foreground">
                    Only use genuine limits — e.g. spots available this week.
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
                        enabled: true,
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
          <SectionCard
            title="Google reviews badge"
            description="Used for the View more link under the Google reviews section below Sound familiar. Hidden until a review URL is set."
          >
            <FieldGroup>
              <Field>
                <FieldLabel>Google reviews URL</FieldLabel>
                <Input
                  value={state.googleReviewUrl}
                  onChange={(event) =>
                    updateField("googleReviewUrl", event.target.value)
                  }
                  placeholder="https://maps.google.com/..."
                />
              </Field>
              <Field>
                <FieldLabel>Rating</FieldLabel>
                <Input
                  value={state.googleRating}
                  onChange={(event) =>
                    updateField("googleRating", event.target.value)
                  }
                  placeholder="e.g. 5"
                  inputMode="decimal"
                />
                <p className="text-xs text-muted-foreground">
                  Number from 0 to 5. Leave blank to show the link without a
                  score.
                </p>
              </Field>
              <Field>
                <FieldLabel>Review count</FieldLabel>
                <Input
                  value={state.googleReviewCount}
                  onChange={(event) =>
                    updateField("googleReviewCount", event.target.value)
                  }
                  placeholder="e.g. 12"
                  inputMode="numeric"
                />
              </Field>
            </FieldGroup>
          </SectionCard>
          <TestimonialsEditor
            values={state.testimonials}
            onChange={(values) => updateField("testimonials", values)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
