import { BuildingIcon, Fence, HomeIcon, LayersIcon } from "lucide-react";
import Link from "next/link";

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
import { landingSectionSurfaceClass } from "@/lib/landing-section-surface";
import { serviceQuoteHref } from "@/lib/match-surface-option";
import type { PublishedLandingPage } from "@/lib/types/landing-page";

import { LandingLogoBand } from "./landing-logo-band";

const iconMap = {
  home: HomeIcon,
  building: BuildingIcon,
  fence: Fence,
  layers: LayersIcon,
} as const;

type ServicesGridProps = {
  readonly page: PublishedLandingPage;
};

export function ServicesGrid({ page }: ServicesGridProps) {
  const section = resolveServicesSection(page);

  return (
    <section>
      <LandingLogoBand page={page} />
      <div className={`${landingSectionSurfaceClass("band")} py-16 md:py-20`}>
        <div className="mx-auto max-w-6xl space-y-10 px-4">
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
              {section.title}
            </h2>
            <p className="text-muted-foreground">{section.description}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {page.services.map((service) => {
              const Icon =
                iconMap[service.icon as keyof typeof iconMap] ?? HomeIcon;
              const serviceSlug = resolveServiceSlug(service);
              const quoteHref = serviceQuoteHref(
                page.slug,
                service.title,
                page.surfaceOptions,
              );
              return (
                <Card key={service.title} className="h-full bg-background">
                  <CardHeader>
                    <Icon className="mb-2 size-8 text-primary" />
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                  </CardContent>
                  <CardFooter className="mt-auto flex-col items-stretch gap-3">
                    <Link
                      href={`/${page.slug}/${serviceSlug}`}
                      className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Learn more
                    </Link>
                    <LinkButton
                      href={quoteHref}
                      landingCtaLocation="services"
                      size="sm"
                      className="w-full"
                    >
                      Get a quote for this
                    </LinkButton>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
