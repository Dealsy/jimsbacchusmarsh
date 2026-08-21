import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LinkButtonProps = {
  readonly href: string;
  readonly children: React.ReactNode;
  readonly landingCtaLocation?: string;
  readonly variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive"
    | "link";
  readonly size?:
    | "default"
    | "xs"
    | "sm"
    | "lg"
    | "icon"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg";
  readonly className?: string;
  readonly target?: string;
};

export function LinkButton({
  href,
  children,
  landingCtaLocation,
  variant = "default",
  size = "default",
  className,
  target,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      target={target}
      data-landing-cta={landingCtaLocation}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {children}
    </Link>
  );
}

export { Button, buttonVariants };
