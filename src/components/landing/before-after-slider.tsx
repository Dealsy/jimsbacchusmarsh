"use client";

import { ChevronsLeftRightIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

const SLIDER_IMAGE_SIZES = "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw";

type BeforeAfterSliderProps = {
  readonly beforeUrl: string | null;
  readonly afterUrl: string | null;
  readonly beforeAlt: string;
  readonly afterAlt: string;
  readonly onOpenLightbox: () => void;
};

export function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  beforeAlt,
  afterAlt,
  onOpenLightbox,
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
      className="relative aspect-6/5 overflow-hidden rounded-2xl bg-muted shadow-md"
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

      <span className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-black/60 px-2.5 py-1 text-sm font-medium text-white">
        Before
      </span>
      <span
        className="pointer-events-none absolute bottom-3 right-3 rounded-md px-2.5 py-1 text-sm font-medium text-white"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--landing-accent) 90%, black)",
        }}
      >
        After
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-white shadow-sm"
        style={{ left: `${position}%` }}
      />

      {showHint ? (
        <span className="pointer-events-none absolute top-3 left-1/2 z-30 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white shadow-sm">
          Drag to compare
        </span>
      ) : null}

      <button
        type="button"
        className="absolute top-1/2 z-20 flex size-11 -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center rounded-full border-2 border-white bg-white text-foreground shadow-md"
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
