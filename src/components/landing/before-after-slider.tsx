"use client";

import { ChevronsLeftRightIcon } from "lucide-react";
import Image from "next/image";
import { type KeyboardEvent, type PointerEvent, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const SLIDER_IMAGE_SIZES =
  "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw";

type BeforeAfterSliderProps = {
  readonly beforeUrl: string | null;
  readonly afterUrl: string | null;
  readonly beforeAlt: string;
  readonly afterAlt: string;
  readonly onOpenLightbox: () => void;
  readonly className?: string;
};

export function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  beforeAlt,
  afterAlt,
  onOpenLightbox,
  className,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const [showHint, setShowHint] = useState(true);
  const frameRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  function dismissHint(): void {
    setShowHint(false);
  }

  function updateFromClientX(clientX: number): void {
    const frame = frameRef.current;
    if (!frame) {
      return;
    }

    const rect = frame.getBoundingClientRect();
    if (rect.width <= 0) {
      return;
    }

    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>): void {
    event.preventDefault();
    event.stopPropagation();
    dismissHint();
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromClientX(event.clientX);
  }

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>): void {
    if (!draggingRef.current) {
      return;
    }
    updateFromClientX(event.clientX);
  }

  function handlePointerUp(event: PointerEvent<HTMLButtonElement>): void {
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    dismissHint();
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPosition((current) => Math.max(0, current - 5));
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setPosition((current) => Math.min(100, current + 5));
    }
    if (event.key === "Home") {
      event.preventDefault();
      setPosition(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      setPosition(100);
    }
  }

  const clipRight = 100 - position;

  return (
    <div
      ref={frameRef}
      className={cn(
        "relative aspect-6/5 overflow-hidden rounded-3xl bg-muted shadow-elevated ring-1 ring-black/5",
        className,
      )}
    >
      {afterUrl ? (
        <Image
          src={afterUrl}
          alt={afterAlt}
          fill
          unoptimized
          className="object-cover"
          sizes={SLIDER_IMAGE_SIZES}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          After
        </div>
      )}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${clipRight}% 0 0)` }}
      >
        {beforeUrl ? (
          <Image
            src={beforeUrl}
            alt={beforeAlt}
            fill
            unoptimized
            className="object-cover"
            sizes={SLIDER_IMAGE_SIZES}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted text-sm text-muted-foreground">
            Before
          </div>
        )}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/45 to-transparent"
      />
      <span className="pointer-events-none absolute bottom-3.5 left-3.5 rounded-full bg-black/55 px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.12em] text-white uppercase ring-1 ring-white/15 backdrop-blur-md">
        Before
      </span>
      <span
        className="pointer-events-none absolute right-3.5 bottom-3.5 rounded-full px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.12em] text-white uppercase ring-1 ring-white/20 backdrop-blur-md"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--landing-accent) 85%, black)",
        }}
      >
        After
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 z-10 w-[3px] -translate-x-1/2 bg-white shadow-[0_0_12px_rgb(0_0_0/0.35)]"
        style={{ left: `${position}%` }}
      />

      {showHint ? (
        <span className="pointer-events-none absolute top-3.5 left-1/2 z-30 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/15 backdrop-blur-md">
          Drag to compare
        </span>
      ) : null}

      <button
        type="button"
        className="absolute top-1/2 z-20 flex size-12 -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center rounded-full bg-white text-foreground shadow-float ring-4 ring-white/35 transition-transform active:scale-95"
        style={{ left: `${position}%` }}
        aria-label="Compare before and after"
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        onClick={(event) => event.stopPropagation()}
      >
        <ChevronsLeftRightIcon className="size-5" aria-hidden />
      </button>

      <button
        type="button"
        className="absolute inset-0 z-5 cursor-zoom-in"
        aria-label="View full-size photos"
        onClick={onOpenLightbox}
      />
    </div>
  );
}
