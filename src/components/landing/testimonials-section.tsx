"use client";

import { CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ReviewCard } from "@/components/landing/testimonials/review-card";
import { ReviewsCarousel } from "@/components/landing/testimonials/reviews-carousel";
import { landingSectionSurfaceClass } from "@/lib/landing-section-surface";
import { testimonialsSubtitle } from "@/lib/testimonial-display";
import type { PublishedLandingPage } from "@/lib/types/landing-page";
import { cn } from "@/lib/utils";

type TestimonialsSectionProps = {
  readonly page: PublishedLandingPage;
};

export function TestimonialsSection({ page }: TestimonialsSectionProps) {
  const googleReviewUrl = page.googleReviewUrl?.trim();
  const visibleReviews = page.testimonials.filter(
    (item) => !item.quote.includes("PLACEHOLDER"),
  );

  if (visibleReviews.length === 0) {
    return null;
  }

  return (
    <section
      id="reviews"
      className={cn(
        landingSectionSurfaceClass("band"),
        "scroll-mt-4 pt-24 pb-16 md:pt-32 md:pb-20 min-[2237px]:pt-72!",
      )}
    >
      <div className="mx-auto max-w-[100rem] space-y-10 px-4">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            What locals say
          </h2>
          <p className="text-lg text-muted-foreground">
            {testimonialsSubtitle(page.serviceAreas)}
          </p>
        </div>
        <ReviewsCarousel slideCount={visibleReviews.length}>
          <CarouselContent className="ml-0 items-start px-4 py-3">
            {visibleReviews.map((testimonial, index) => (
              <CarouselItem
                key={`${index}-${testimonial.author}-${testimonial.quote}`}
                className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6"
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
        {googleReviewUrl ? (
          <p className="text-center">
            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              View more
            </a>
          </p>
        ) : null}
        <div
          className="h-24 md:h-32 min-[2000px]:h-56 min-[2237px]:h-72"
          aria-hidden
        />
      </div>
    </section>
  );
}
