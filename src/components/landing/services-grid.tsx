import { BuildingIcon, Fence, HomeIcon, LayersIcon } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  resolveServiceSlug,
  resolveServicesSection,
} from "@/lib/landing-page-content";
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
      <div className="bg-muted/30 py-16 md:py-20">
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
              return (
                <Link
                  key={service.title}
                  href={`/${page.slug}/${serviceSlug}`}
                  className="rounded-2xl text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <Card className="h-full bg-background transition-shadow hover:shadow-md">
                    <CardHeader>
                      <Icon className="mb-2 size-8 text-primary" />
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {service.description}
                      </p>
                      <p className="mt-3 text-sm font-medium text-primary">
                        Learn more
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
