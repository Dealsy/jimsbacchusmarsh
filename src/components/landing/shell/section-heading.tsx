import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  readonly eyebrow?: string;
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly align?: "center" | "start";
  readonly className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "max-w-2xl space-y-4",
        centered && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow centered={centered}>{eyebrow}</Eyebrow> : null}
      <h2 className="font-heading text-3xl leading-[1.1] font-bold tracking-tight text-balance md:text-5xl md:leading-[1.05]">
        {title}
      </h2>
      {description ? (
        <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function Eyebrow({
  children,
  centered = true,
  className,
}: {
  readonly children: ReactNode;
  readonly centered?: boolean;
  readonly className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-[var(--landing-eyebrow,var(--primary))] uppercase",
        centered && "justify-center",
        className,
      )}
    >
      <span aria-hidden className="h-px w-6 bg-current opacity-60" />
      {children}
      {centered ? (
        <span aria-hidden className="h-px w-6 bg-current opacity-60" />
      ) : null}
    </p>
  );
}
