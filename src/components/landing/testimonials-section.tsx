"use client";

import { StarIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { PublishedLandingPage } from "@/lib/types/landing-page";
import { cn } from "@/lib/utils";

type TestimonialsSectionProps = {
  readonly page: PublishedLandingPage;
};

const STAR_KEYS = ["one", "two", "three", "four", "five"] as const;
const AUTOPLAY_INTERVAL_MS = 4500;
const AVATAR_COLORS = [
  "bg-rose-400",
  "bg-sky-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-orange-500",
] as const;

function FiveStarRating() {
  return (
    <div
      className="flex gap-0.5 text-amber-400"
      aria-label="5 out of 5 stars"
      role="img"
    >
      {STAR_KEYS.map((key) => (
        <StarIcon key={key} className="size-4 fill-current" aria-hidden />
      ))}
    </div>
  );
}

function authorInitials(author: string): string {
  const parts = author.trim().split(/\s+/).filter(Boolean);
  const first = parts[0];
  if (!first) {
    return "?";
  }
  const last = parts.length > 1 ? parts[parts.length - 1] : undefined;
  const initials = last
    ? `${first[0] ?? ""}${last[0] ?? ""}`
    : first.slice(0, 2);
  return initials.toUpperCase() || "?";
}

function avatarColorClass(author: string): string {
  let hash = 0;
  for (const character of author) {
    hash = (hash + character.charCodeAt(0)) % AVATAR_COLORS.length;
  }
  return AVATAR_COLORS[hash] ?? "bg-rose-400";
}

function GoogleMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5 shrink-0"
      aria-hidden
      focusable="false"
    >
      <title>Google</title>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

type ReviewsCarouselProps = {
  readonly children: ReactNode;
  readonly slideCount: number;
};

function scrollReviews(api: CarouselApi, direction: "next" | "prev") {
  if (!api) {
    return;
  }
  if (direction === "next") {
    if (api.canScrollNext()) {
      api.scrollNext();
      return;
    }
    api.scrollTo(0);
    return;
  }
  if (api.canScrollPrev()) {
    api.scrollPrev();
    return;
  }
  const lastIndex = api.scrollSnapList().length - 1;
  if (lastIndex >= 0) {
    api.scrollTo(lastIndex);
  }
}

function ReviewsCarousel({ children, slideCount }: ReviewsCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const canLoop = slideCount > 1;

  useEffect(() => {
    if (!api || !canLoop) {
      return;
    }
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      return;
    }

    let paused = false;
    const rootNode = api.rootNode();
    const pause = () => {
      paused = true;
    };
    const resume = () => {
      paused = false;
    };
    rootNode.addEventListener("mouseenter", pause);
    rootNode.addEventListener("mouseleave", resume);
    rootNode.addEventListener("focusin", pause);
    rootNode.addEventListener("focusout", resume);

    const intervalId = window.setInterval(() => {
      if (!paused) {
        scrollReviews(api, "next");
      }
    }, AUTOPLAY_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
      rootNode.removeEventListener("mouseenter", pause);
      rootNode.removeEventListener("mouseleave", resume);
      rootNode.removeEventListener("focusin", pause);
      rootNode.removeEventListener("focusout", resume);
    };
  }, [api, canLoop]);

  return (
    <Carousel
      setApi={setApi}
      opts={{ align: "center", loop: true }}
      className="w-full px-12"
    >
      {children}
      {canLoop ? (
        <>
          <CarouselPrevious
            disabled={false}
            className="left-0 size-10 border bg-background shadow-md"
            onClick={() => scrollReviews(api, "prev")}
          />
          <CarouselNext
            disabled={false}
            className="right-0 size-10 border bg-background shadow-md"
            onClick={() => scrollReviews(api, "next")}
          />
        </>
      ) : null}
    </Carousel>
  );
}

export function TestimonialsSection({ page }: TestimonialsSectionProps) {
  const googleReviewUrl = page.googleReviewUrl?.trim();
  const visibleReviews = page.testimonials.filter(
    (item) => !item.quote.includes("PLACEHOLDER"),
  );
  const hasRealQuotes = visibleReviews.length > 0;

  return (
    <section className="bg-muted/30 py-16 md:py-20">
      <div className="mx-auto max-w-6xl space-y-10 px-4">
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            What locals say
          </h2>
          {hasRealQuotes ? (
            <p className="text-lg text-muted-foreground">
              Real feedback from homeowners across{" "}
              {page.serviceAreas.slice(0, 3).join(", ")}
              {page.serviceAreas.length > 3 ? " and surrounds" : ""}.
            </p>
          ) : null}
        </div>
        {!hasRealQuotes ? (
          <div className="rounded-2xl border border-dashed bg-background p-12 text-center text-muted-foreground">
            [PLACEHOLDER — Matt to supply 2–3 real customer quotes via admin]
          </div>
        ) : (
          <>
            <ReviewsCarousel slideCount={visibleReviews.length}>
              <CarouselContent className="ml-0 px-4 py-3">
                {visibleReviews.map((testimonial) => (
                  <CarouselItem
                    key={`${testimonial.author}-${testimonial.quote.slice(0, 20)}`}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="py-2">
                      <Card className="rounded-2xl border-border/80 bg-background shadow-sm">
                        <CardContent className="flex flex-col gap-4 p-6">
                          <FiveStarRating />
                          <blockquote className="flex-1 text-base leading-relaxed text-foreground">
                            {testimonial.quote}
                          </blockquote>
                          <footer className="mt-auto flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <span
                                className={cn(
                                  "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white",
                                  avatarColorClass(testimonial.author),
                                )}
                                aria-hidden
                              >
                                {authorInitials(testimonial.author)}
                              </span>
                              <p className="truncate font-semibold">
                                {testimonial.author}
                              </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              {testimonial.location ? (
                                <p className="max-w-28 truncate text-sm text-muted-foreground">
                                  {testimonial.location}
                                </p>
                              ) : null}
                              <GoogleMark />
                              <span className="sr-only">Google review</span>
                            </div>
                          </footer>
                        </CardContent>
                      </Card>
                    </div>
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
          </>
        )}
      </div>
    </section>
  );
}
