"use client";

import { BadgeCheckIcon, StarIcon } from "lucide-react";
import { startTransition, useState, ViewTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  authorInitials,
  avatarColorClass,
  reviewQuoteNeedsToggle,
} from "@/lib/testimonial-display";
import { cn } from "@/lib/utils";

type ReviewCardProps = {
  readonly quote: string;
  readonly author: string;
  readonly location?: string;
};

const STAR_KEYS = ["one", "two", "three", "four", "five"] as const;

function FiveStarRating() {
  return (
    <div
      className="flex items-center gap-1 text-amber-400"
      aria-label="5 out of 5 stars"
      role="img"
    >
      <span className="flex gap-0.5">
        {STAR_KEYS.map((key) => (
          <StarIcon key={key} className="size-3.5 fill-current" aria-hidden />
        ))}
      </span>
      <BadgeCheckIcon
        className="size-3.5 fill-[#1a73e8] text-white"
        aria-label="Verified Google review"
      />
    </div>
  );
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

export function ReviewCard({ quote, author, location }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const canToggle = reviewQuoteNeedsToggle(quote);

  return (
    <ViewTransition default="none" update="review-expand">
      <Card className="h-full rounded-2xl border-border/80 bg-background py-4 shadow-md">
        <CardContent className="flex h-full flex-col gap-3 px-4">
          <header className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white",
                  avatarColorClass(author),
                )}
                aria-hidden
              >
                {authorInitials(author)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold leading-tight">
                  {author}
                </p>
                {location ? (
                  <p className="truncate text-xs text-muted-foreground">
                    {location}
                  </p>
                ) : null}
              </div>
            </div>
            <GoogleMark />
          </header>
          <FiveStarRating />
          <div className="flex min-h-0 flex-1 flex-col">
            <div
              className={cn(
                "overflow-hidden text-sm leading-5 text-foreground",
                canToggle && "min-h-20",
                !expanded && canToggle && "line-clamp-4",
              )}
            >
              <blockquote>{quote}</blockquote>
            </div>
            {canToggle ? (
              <Button
                type="button"
                variant="link"
                size="xs"
                aria-expanded={expanded}
                className="mt-1 h-5 justify-start px-0 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  startTransition(() => {
                    setExpanded((current) => !current);
                  });
                }}
              >
                {expanded ? "Hide" : "Read more"}
              </Button>
            ) : (
              <div className="mt-1 h-5" aria-hidden />
            )}
          </div>
        </CardContent>
      </Card>
    </ViewTransition>
  );
}
