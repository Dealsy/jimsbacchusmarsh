"use client";

import { GoogleRatingSummary } from "@/components/landing/google-reviews-badge";
import { LandingSection } from "@/components/landing/shell/landing-section";
import { Reveal } from "@/components/landing/shell/reveal";
import { SectionHeading } from "@/components/landing/shell/section-heading";
import { ReviewCard } from "@/components/landing/testimonials/review-card";
import { ReviewsCarousel } from "@/components/landing/testimonials/reviews-carousel";
import { CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { testimonialsSubtitle } from "@/lib/testimonial-display";
import type { PublishedLandingPage } from "@/lib/types/landing-page";

type TestimonialsSectionProps = {
  readonly page: PublishedLandingPage;
};

export function TestimonialsSection({ page }: TestimonialsSectionProps) {
  const visibleReviews = page.testimonials.filter(
    (item) => !item.quote.includes("PLACEHOLDER"),
  );

  if (visibleReviews.length === 0) {
    return null;
  }

  return (
    <LandingSection
      id="reviews"
      tone="band"
      width="full"
      className="scroll-mt-4 pt-16 pb-16 md:pt-32 md:pb-24 min-[2237px]:pt-72!"
      containerClassName="space-y-10 px-0 md:px-0"
    >
      <Reveal className="space-y-6 px-5">
        <SectionHeading
          eyebrow="Reviews"
          title="What locals say"
          description={testimonialsSubtitle(page.serviceAreas)}
        />
        <GoogleRatingSummary
          page={page}
          className="mx-auto w-fit justify-center rounded-full bg-background px-4 py-2 text-foreground shadow-elevated ring-1 ring-border"
        />
      </Reveal>
      <Reveal delay={120}>
        <ReviewsCarousel slideCount={visibleReviews.length}>
          <CarouselContent className="ml-0 items-stretch px-1 py-4">
            {visibleReviews.map((testimonial, index) => (
              <CarouselItem
                key={`${index}-${testimonial.author}-${testimonial.quote}`}
                className="basis-[88%] pl-3 sm:basis-1/2 md:basis-1/3 md:pl-4 lg:basis-1/4 xl:basis-1/5"
              >
                <ReviewCard
                  quote={testimonial.quote}
                  author={testimonial.author}
                  location={testimonial.location}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </ReviewsCarousel>
      </Reveal>
      <div
        className="hidden md:block md:h-32 min-[2000px]:h-56 min-[2237px]:h-72"
        aria-hidden
      />
    </LandingSection>
  );
}
