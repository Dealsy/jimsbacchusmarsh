import {
  ArrowUpRightIcon,
  BuildingIcon,
  Fence,
  HomeIcon,
  LayersIcon,
} from "lucide-react";
import Link from "next/link";

import { LandingSection } from "@/components/landing/shell/landing-section";
import { Reveal } from "@/components/landing/shell/reveal";
import { SectionHeading } from "@/components/landing/shell/section-heading";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import {
  resolveServiceSlug,
  resolveServicesSection,
} from "@/lib/landing-page-content";
import { serviceQuoteHref } from "@/lib/match-surface-option";
import type { PublishedLandingPage } from "@/lib/types/landing-page";
import { cn } from "@/lib/utils";

import { LandingLogoBand } from "./landing-logo-band";

const iconMap = {
  home: HomeIcon,
  building: BuildingIcon,
  fence: Fence,
  layers: LayersIcon,
} as const;

/** Four services form a 2-1 / 1-2 bento on large screens. */
const BENTO_SPANS = ["lg:col-span-2", "", "", "lg:col-span-2"] as const;

type ServicesGridProps = {
  readonly page: PublishedLandingPage;
};

export function ServicesGrid({ page }: ServicesGridProps) {
  const section = resolveServicesSection(page);
  const useBento = page.services.length === 4;

  return (
    <section>
      <LandingLogoBand page={page} />
      <LandingSection tone="light" containerClassName="space-y-12">
        <Reveal>
          <SectionHeading
            eyebrow="Services"
            title={section.title}
            description={section.description}
          />
        </Reveal>
        <div
          className={cn(
            "grid gap-5 sm:grid-cols-2",
            useBento ? "lg:grid-cols-3" : "lg:grid-cols-4",
          )}
        >
          {page.services.map((service, index) => {
            const Icon =
              iconMap[service.icon as keyof typeof iconMap] ?? HomeIcon;
            const serviceSlug = resolveServiceSlug(service);
            const quoteHref = serviceQuoteHref(
              page.slug,
              service.title,
              page.surfaceOptions,
            );
            return (
              <Reveal
                key={service.title}
                delay={index * 80}
                className={cn(useBento && BENTO_SPANS[index])}
              >
                <Card className="group relative h-full rounded-3xl bg-card py-7 shadow-elevated ring-border transition-[translate,box-shadow] duration-300 md:hover:-translate-y-1 md:hover:shadow-float">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-primary/8 blur-2xl transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100"
                  />
                  <CardHeader className="gap-4 px-7">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                      <Icon className="size-6" />
                    </span>
                    <CardTitle className="font-heading text-xl font-semibold">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 px-7">
                    <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                  </CardContent>
                  <CardFooter className="mt-auto flex-col items-stretch gap-3 px-7 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                      href={`/${page.slug}/${serviceSlug}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary after:absolute after:inset-0 after:rounded-3xl"
                    >
                      Learn more
                      <ArrowUpRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                    <LinkButton
                      href={quoteHref}
                      landingCtaLocation="services"
                      size="sm"
                      className="relative z-10 h-9 px-4"
                    >
                      Get a quote for this
                    </LinkButton>
                  </CardFooter>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </LandingSection>
    </section>
  );
}
