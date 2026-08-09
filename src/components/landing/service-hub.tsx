"use client";

import type { api } from "convex/_generated/api";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ServiceHubProps = {
  readonly preloadedPages: Preloaded<typeof api.landingPages.listPublished>;
};

export function ServiceHub({ preloadedPages }: ServiceHubProps) {
  const pages = usePreloadedQuery(preloadedPages);

  const businessName =
    pages[0]?.businessName ?? "Jim's Window & Pressure Cleaning";
  const serviceAreas = pages[0]?.serviceAreas ?? [];

  return (
    <main className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-4xl space-y-10 px-4 py-16 md:py-24">
        <div className="space-y-4 text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl">
            {businessName}
          </h1>
          {serviceAreas.length > 0 ? (
            <p className="text-lg text-muted-foreground">
              Serving {serviceAreas.join(" · ")}
            </p>
          ) : null}
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Choose a service below to learn more and request a free quote.
          </p>
        </div>

        {pages.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center text-muted-foreground">
              <p>No services published yet. Check back soon.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {pages.map((page) => (
              <Link key={page.slug} href={`/${page.slug}`} className="group">
                <Card className="h-full transition-shadow group-hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="font-heading group-hover:text-primary">
                      {page.name}
                    </CardTitle>
                    <CardDescription>{page.heroHeadline}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {page.seoDescription}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
