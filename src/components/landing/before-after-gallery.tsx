"use client";

import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import Image from "next/image";
import { type ReactNode, useState } from "react";

import { BeforeAfterSlider } from "@/components/landing/before-after-slider";
import { LandingSection } from "@/components/landing/shell/landing-section";
import { Reveal } from "@/components/landing/shell/reveal";
import { SectionHeading } from "@/components/landing/shell/section-heading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LinkButton } from "@/components/ui/link-button";
import { resolveGallerySection } from "@/lib/landing-page-content";
import type {
  GalleryItem,
  PublishedLandingPage,
} from "@/lib/types/landing-page";
import { cn } from "@/lib/utils";

const GALLERY_SECTION_ID = "gallery";
const GALLERY_LEGACY_ID = "before-after";
const GALLERY_LIGHTBOX_SIZES = "90vw";

type GalleryLightboxSide = "before" | "after";

type BeforeAfterGalleryProps = {
  readonly page: PublishedLandingPage;
  readonly items: readonly GalleryItem[];
  readonly selectedCategory: string | null;
  readonly onSelectCategory: (category: string | null) => void;
  readonly hideCategoryFilters?: boolean;
};

type GalleryPhotoEntry = {
  readonly itemId: GalleryItem["_id"];
  readonly url: string | null;
  readonly side: GalleryLightboxSide;
  readonly caption: string | undefined;
};

function galleryPhotosFromItems(
  items: readonly GalleryItem[],
): GalleryPhotoEntry[] {
  const photos: GalleryPhotoEntry[] = [];
  for (const item of items) {
    photos.push({
      itemId: item._id,
      url: item.beforeUrl,
      side: "before",
      caption: item.label,
    });
    photos.push({
      itemId: item._id,
      url: item.afterUrl,
      side: "after",
      caption: item.label,
    });
  }
  return photos;
}

type OpenableGalleryPhoto = GalleryPhotoEntry & {
  readonly url: string;
};

function openableGalleryPhotos(
  photos: readonly GalleryPhotoEntry[],
): OpenableGalleryPhoto[] {
  return photos.filter((photo): photo is OpenableGalleryPhoto =>
    Boolean(photo.url),
  );
}

function lightboxTitleFor(side: GalleryLightboxSide): string {
  return side === "after" ? "After" : "Before";
}

function galleryCategories(
  items: readonly GalleryItem[],
  services: PublishedLandingPage["services"],
): string[] {
  const present = new Set<string>();
  for (const item of items) {
    const category = item.category?.trim();
    if (category) {
      present.add(category);
    }
  }

  const fromServices = services
    .map((service) => service.title.trim())
    .filter((title) => title && present.has(title));
  const extras = [...present]
    .filter((category) => !fromServices.includes(category))
    .sort((a, b) => a.localeCompare(b));

  return [...fromServices, ...extras];
}

export function BeforeAfterGallery({
  page,
  items,
  selectedCategory,
  onSelectCategory,
  hideCategoryFilters = false,
}: BeforeAfterGalleryProps) {
  const section = resolveGallerySection(page);
  const categories = galleryCategories(items, page.services);
  const visibleItems =
    selectedCategory === null
      ? items
      : items.filter((item) => item.category === selectedCategory);
  const visiblePhotos = galleryPhotosFromItems(visibleItems);
  const lightboxPhotos = openableGalleryPhotos(visiblePhotos);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxPhoto =
    lightboxIndex === null ? undefined : lightboxPhotos[lightboxIndex];
  const lightboxTitle = lightboxPhoto
    ? lightboxTitleFor(lightboxPhoto.side)
    : "Photo";
  const canBrowseLightbox = lightboxPhotos.length > 1;

  if (items.length === 0) {
    return null;
  }

  function openLightbox(photo: GalleryPhotoEntry) {
    if (!photo.url) {
      return;
    }
    const index = lightboxPhotos.findIndex(
      (candidate) =>
        candidate.itemId === photo.itemId && candidate.side === photo.side,
    );
    if (index < 0) {
      return;
    }
    setLightboxIndex(index);
  }

  function openPairLightbox(item: GalleryItem) {
    const preferred = item.afterUrl
      ? visiblePhotos.find(
          (photo) => photo.itemId === item._id && photo.side === "after",
        )
      : visiblePhotos.find(
          (photo) => photo.itemId === item._id && photo.side === "before",
        );
    if (preferred) {
      openLightbox(preferred);
    }
  }

  function stepLightbox(delta: number) {
    setLightboxIndex((current) => {
      if (current === null || lightboxPhotos.length === 0) {
        return current;
      }
      return (current + delta + lightboxPhotos.length) % lightboxPhotos.length;
    });
  }

  const featureFirst = visibleItems.length >= 3;

  return (
    <LandingSection
      id={GALLERY_SECTION_ID}
      tone="band"
      width="wide"
      className="scroll-mt-4"
      containerClassName="space-y-10"
    >
      <div id={GALLERY_LEGACY_ID} className="scroll-mt-4" aria-hidden />
      <Reveal>
        <SectionHeading
          eyebrow="Real results"
          title={section.title}
          description={section.description}
        />
      </Reveal>
      {categories.length > 0 && !hideCategoryFilters ? (
        <div className="no-scrollbar -mx-5 flex overflow-x-auto px-5 md:mx-0 md:justify-center md:px-0">
          <div className="mx-auto inline-flex shrink-0 gap-1 rounded-full bg-background p-1 shadow-elevated ring-1 ring-border">
            <GalleryFilterButton
              active={selectedCategory === null}
              onClick={() => onSelectCategory(null)}
            >
              All
            </GalleryFilterButton>
            {categories.map((category) => (
              <GalleryFilterButton
                key={category}
                active={selectedCategory === category}
                onClick={() => onSelectCategory(category)}
              >
                {category}
              </GalleryFilterButton>
            ))}
          </div>
        </div>
      ) : null}
      {visibleItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed bg-background/60 p-12 text-center text-muted-foreground">
          <p className="font-medium">
            No photos for {selectedCategory} yet. Choose All to see every before
            and after.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {visibleItems.map((item, index) => {
            const featured = featureFirst && index === 0;
            return (
              <Reveal
                key={item._id}
                delay={Math.min(index, 5) * 60}
                className={cn(
                  featured && "md:col-span-2 lg:row-span-2 lg:flex lg:flex-col",
                )}
              >
                <figure
                  className={cn(
                    "space-y-3",
                    featured && "lg:flex lg:flex-1 lg:flex-col",
                  )}
                >
                  <BeforeAfterSlider
                    beforeUrl={item.beforeUrl}
                    afterUrl={item.afterUrl}
                    beforeAlt={`Before — ${item.label ?? page.name}`}
                    afterAlt={`After — ${item.label ?? page.name}`}
                    onOpenLightbox={() => openPairLightbox(item)}
                    className={cn(
                      featured &&
                        "md:aspect-16/10 lg:aspect-auto lg:min-h-0 lg:flex-1",
                    )}
                  />
                  {item.label ? (
                    <figcaption className="px-1 text-sm font-medium text-muted-foreground">
                      {item.label}
                    </figcaption>
                  ) : null}
                </figure>
              </Reveal>
            );
          })}
        </div>
      )}
      <div className="flex justify-center">
        <LinkButton
          href="#quote-form"
          landingCtaLocation="gallery"
          size="lg"
          className="h-12 px-7 text-base shadow-lg shadow-primary/25"
        >
          {page.ctaLabel}
          <ArrowRightIcon data-icon="inline-end" />
        </LinkButton>
      </div>

      <Dialog
        open={lightboxPhoto !== undefined}
        onOpenChange={(open) => {
          if (!open) {
            setLightboxIndex(null);
          }
        }}
      >
        <DialogContent
          className="max-h-[90vh] w-full gap-3 p-4 sm:max-w-[min(96vw,80rem)]"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              stepLightbox(-1);
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              stepLightbox(1);
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {lightboxPhoto?.caption
                ? `${lightboxTitle} — ${lightboxPhoto.caption}`
                : lightboxTitle}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Full-size gallery photo
            </DialogDescription>
          </DialogHeader>
          {lightboxPhoto ? (
            <div className="relative h-[min(75vh,70vw)] w-full overflow-hidden rounded-xl bg-black">
              <Image
                key={lightboxPhoto.url}
                src={lightboxPhoto.url}
                alt={`${lightboxTitle}${lightboxPhoto.caption ? ` — ${lightboxPhoto.caption}` : ""}`}
                fill
                unoptimized
                className="object-contain"
                sizes={GALLERY_LIGHTBOX_SIZES}
              />
              {canBrowseLightbox ? (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-background/90"
                    aria-label="Previous photo"
                    onClick={() => stepLightbox(-1)}
                  >
                    <ChevronLeftIcon />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-background/90"
                    aria-label="Next photo"
                    onClick={() => stepLightbox(1)}
                  >
                    <ChevronRightIcon />
                  </Button>
                </>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </LandingSection>
  );
}

function GalleryFilterButton({
  active,
  onClick,
  children,
}: {
  readonly active: boolean;
  readonly onClick: () => void;
  readonly children: ReactNode;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant={active ? "default" : "ghost"}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "h-9 rounded-full px-4",
        active ? "shadow-md" : "text-muted-foreground",
      )}
    >
      {children}
    </Button>
  );
}
