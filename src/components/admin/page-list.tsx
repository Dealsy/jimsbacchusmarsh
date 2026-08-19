"use client";

import { api } from "convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import {
  ExternalLinkIcon,
  FilePlusIcon,
  PencilIcon,
  PlusIcon,
  SparklesIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminPageListSkeleton } from "@/components/admin/admin-skeletons";
import { capturePostHogEvent } from "@/components/analytics/posthog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LinkButton } from "@/components/ui/link-button";
import { describeSlugError, slugify } from "@/lib/slug";

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
  const router = useRouter();
  const pages = useQuery(api.landingPages.listAll);
  const createPage = useMutation(api.landingPages.createPage);
  const seedSoftwashing = useMutation(api.landingPages.seedSoftwashing);
  const seedPressureWashing = useMutation(api.landingPages.seedPressureWashing);
  const seedWindowCleaning = useMutation(api.landingPages.seedWindowCleaning);
  const [seedingKey, setSeedingKey] = useState<string | null>(null);
  const [seedError, setSeedError] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [pageName, setPageName] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const seedMutations = {
    seedSoftwashing,
    seedPressureWashing,
    seedWindowCleaning,
  };

  function resetAddDialog() {
    setPageName("");
    setPageSlug("");
    setSlugTouched(false);
    setCreateError(null);
  }

  function handleNameChange(value: string) {
    setPageName(value);
    if (!slugTouched) {
      setPageSlug(slugify(value));
    }
  }

  function handleSlugChange(value: string) {
    setSlugTouched(true);
    setPageSlug(slugify(value));
  }

  async function handleCreatePage(event: React.FormEvent) {
    event.preventDefault();
    setCreateError(null);

    const trimmedName = pageName.trim();
    if (!trimmedName) {
      setCreateError("Page name is required.");
      return;
    }

    const slug = pageSlug.trim().toLowerCase();
    const slugError = describeSlugError(slug);
    if (slugError) {
      setCreateError(slugError);
      return;
    }

    setIsCreating(true);
    const result = await createPage({ name: trimmedName, slug });
    setIsCreating(false);

    if (!result.success) {
      setCreateError(result.error);
      return;
    }

    capturePostHogEvent("landing_page_created", { page_slug: result.slug });
    setAddDialogOpen(false);
    resetAddDialog();
    router.push(`/admin/${result.slug}`);
  }

  async function handleSeed(mutation: keyof typeof seedMutations) {
    setSeedingKey(mutation);
    setSeedError(null);

    const result = await seedMutations[mutation]({});
    if (!result.success) {
      setSeedError(result.error);
    } else {
      capturePostHogEvent("landing_page_template_seeded", {
        template: mutation,
      });
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
          <Button type="button" onClick={() => setAddDialogOpen(true)}>
            <PlusIcon className="size-4" />
            Add page
          </Button>
          {STARTER_PAGES.map((starter) => (
            <Button
              key={starter.mutation}
              type="button"
              variant="outline"
              size="sm"
              disabled={seedingKey !== null || isCreating}
              onClick={() => handleSeed(starter.mutation)}
            >
              <FilePlusIcon className="size-4" />
              {seedingKey === starter.mutation ? "Creating…" : starter.label}
            </Button>
          ))}
        </div>
      </div>

      <Dialog
        open={addDialogOpen}
        onOpenChange={(open) => {
          setAddDialogOpen(open);
          if (!open) {
            resetAddDialog();
          }
        }}
      >
        <DialogContent>
          <form onSubmit={handleCreatePage}>
            <DialogHeader>
              <DialogTitle>Add landing page</DialogTitle>
              <DialogDescription>
                Creates a draft page with the same layout as your other service
                pages. Choose a URL slug — the live page will be at /{"{slug}"}.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="page-name">Page name</Label>
                <Input
                  id="page-name"
                  placeholder="Gutter cleaning"
                  value={pageName}
                  onChange={(event) => handleNameChange(event.target.value)}
                  autoFocus
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="page-slug">URL slug</Label>
                <Input
                  id="page-slug"
                  placeholder="gutter-cleaning"
                  value={pageSlug}
                  onChange={(event) => handleSlugChange(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {pageSlug
                    ? `Live URL: /${pageSlug}`
                    : "Lowercase letters, numbers, and hyphens only"}
                </p>
              </div>
              {createError ? (
                <p className="text-sm text-destructive">{createError}</p>
              ) : null}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={isCreating}
                onClick={() => setAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating…" : "Create page"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {seedError ? (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="py-4 text-sm text-destructive">
            {seedError}
          </CardContent>
        </Card>
      ) : null}

      {pages === undefined ? (
        <AdminPageListSkeleton />
      ) : pages.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <SparklesIcon className="size-7" />
            </div>
            <div className="space-y-1">
              <p className="font-heading text-lg font-semibold">No pages yet</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Add a custom page or create a starter page for softwashing,
                pressure washing, or window cleaning — then edit and publish.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button type="button" onClick={() => setAddDialogOpen(true)}>
                <PlusIcon className="size-4" />
                Add page
              </Button>
              {STARTER_PAGES.map((starter) => (
                <Button
                  key={starter.mutation}
                  type="button"
                  variant="outline"
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
            <Card
              key={page._id}
              className="shadow-sm transition-shadow hover:shadow-md"
            >
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
                {page.status === "published" ? (
                  <LinkButton
                    href={`/${page.slug}`}
                    size="sm"
                    variant="outline"
                    target="_blank"
                  >
                    <ExternalLinkIcon className="size-4" />
                    View live
                  </LinkButton>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
