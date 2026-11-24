"use client";

import { type ReactNode, useEffect, useState } from "react";

import {
  Carousel,
  type CarouselApi,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type ReviewsCarouselProps = {
  readonly children: ReactNode;
  readonly slideCount: number;
};

const AUTOPLAY_INTERVAL_MS = 4500;

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

export function ReviewsCarousel({
  children,
  slideCount,
}: ReviewsCarouselProps) {
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
      opts={{ align: "start", loop: true }}
      className="w-full px-5 md:px-16"
    >
      {children}
      {canLoop ? (
        <div className="mt-2 flex justify-center gap-3 md:contents">
          <CarouselPrevious
            disabled={false}
            className="static size-11 rounded-full border-0 bg-background shadow-elevated ring-1 ring-border hover:bg-background hover:text-primary md:absolute md:left-3"
            onClick={() => scrollReviews(api, "prev")}
          />
          <CarouselNext
            disabled={false}
            className="static size-11 rounded-full border-0 bg-background shadow-elevated ring-1 ring-border hover:bg-background hover:text-primary md:absolute md:right-3"
            onClick={() => scrollReviews(api, "next")}
          />
        </div>
      ) : null}
    </Carousel>
  );
}
