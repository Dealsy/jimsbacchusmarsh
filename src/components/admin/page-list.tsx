"use client";

import { useMutation, useQuery } from "convex/react";
import {
  ExternalLinkIcon,
  FilePlusIcon,
  PencilIcon,
  SparklesIcon,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { api } from "convex/_generated/api";

const STARTER_PAGES = [
  {
    label: "Softwashing",
    mutation: "seedSoftwashing" as const,
  },
  {
    label: "Pressure washing",
    mutation: "seedPressureWashing" as const,
  },
  {
    label: "Window cleaning",
    mutation: "seedWindowCleaning" as const,
  },
] as const;

export function PageList() {
  const pages = useQuery(api.landingPages.listAll);
  const seedSoftwashing = useMutation(api.landingPages.seedSoftwashing);
  const seedPressureWashing = useMutation(api.landingPages.seedPressureWashing);
  const seedWindowCleaning = useMutation(api.landingPages.seedWindowCleaning);
  const [seedingKey, setSeedingKey] = useState<string | null>(null);
  const [seedError, setSeedError] = useState<string | null>(null);

  const seedMutations = {
    seedSoftwashing,
    seedPressureWashing,
    seedWindowCleaning,
  };

  async function handleSeed(mutation: keyof typeof seedMutations) {
    setSeedingKey(mutation);
    setSeedError(null);

    const result = await seedMutations[mutation]({});
    if (!result.success) {
      setSeedError(result.error);
    }

    setSeedingKey(null);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Landing pages
          </h1>
          <p className="max-w-xl text-muted-foreground">
            Edit content, photos, and FAQs — no technical setup. Pick a page to
            get started.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {STARTER_PAGES.map((starter) => (
            <Button
              key={starter.mutation}
              type="button"
              variant="outline"
              size="sm"
              disabled={seedingKey !== null}
              onClick={() => handleSeed(starter.mutation)}
            >
              <FilePlusIcon className="size-4" />
              {seedingKey === starter.mutation
                ? "Creating…"
                : starter.label}
            </Button>
          ))}
        </div>
      </div>

      {seedError ? (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="py-4 text-sm text-destructive">
            {seedError}
          </CardContent>
        </Card>
      ) : null}

      {pages === undefined ? (
        <p className="text-muted-foreground">Loading pages…</p>
      ) : pages.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <SparklesIcon className="size-7" />
            </div>
            <div className="space-y-1">
              <p className="font-heading text-lg font-semibold">No pages yet</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Create a starter page for each service — softwashing, pressure
                washing, or window cleaning — then edit and publish.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {STARTER_PAGES.map((starter) => (
                <Button
                  key={starter.mutation}
                  type="button"
                  disabled={seedingKey !== null}
                  onClick={() => handleSeed(starter.mutation)}
                >
                  <FilePlusIcon className="size-4" />
                  {starter.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {pages.map((page) => (
            <Card key={page._id} className="shadow-sm transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="font-heading">{page.name}</CardTitle>
                    <CardDescription>/{page.slug}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      page.status === "published" ? "default" : "secondary"
                    }
                  >
                    {page.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <LinkButton href={`/admin/${page.slug}`} size="sm">
                  <PencilIcon className="size-4" />
                  Edit content
                </LinkButton>
                <LinkButton
                  href={`/${page.slug}`}
                  size="sm"
                  variant="outline"
                  target="_blank"
                >
                  <ExternalLinkIcon className="size-4" />
                  View live
                </LinkButton>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
