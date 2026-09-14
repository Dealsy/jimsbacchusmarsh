"use client";

import { useEffect, useState, type ReactNode } from "react";

import {
  type CarouselApi,
  Carousel,
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

export function ReviewsCarousel({ children, slideCount }: ReviewsCarouselProps) {
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
