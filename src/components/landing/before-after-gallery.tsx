import Image from "next/image";

import { Button } from "@/components/ui/button";
import { resolveGallerySection } from "@/lib/landing-page-content";
import type {
  GalleryItem,
  PublishedLandingPage,
} from "@/lib/types/landing-page";

const GALLERY_SECTION_ID = "before-after";

type BeforeAfterGalleryProps = {
  readonly page: PublishedLandingPage;
  readonly items: readonly GalleryItem[];
  readonly selectedCategory: string | null;
  readonly onSelectCategory: (category: string | null) => void;
};

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
}: BeforeAfterGalleryProps) {
  const section = resolveGallerySection(page);
  const categories = galleryCategories(items, page.services);
  const visibleItems =
    selectedCategory === null
      ? items
      : items.filter((item) => item.category === selectedCategory);

  return (
    <section id={GALLERY_SECTION_ID} className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl space-y-10 px-4">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            {section.title}
          </h2>
          <p className="text-muted-foreground">{section.description}</p>
        </div>
        {categories.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => onSelectCategory(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                type="button"
                size="sm"
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => onSelectCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        ) : null}
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-muted/20 p-12 text-center text-muted-foreground">
            <p className="font-medium">
              [PLACEHOLDER — Matt to supply 3+ before/after photo pairs via
              admin]
            </p>
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-muted/20 p-12 text-center text-muted-foreground">
            <p className="font-medium">
              No photos for {selectedCategory} yet. Choose All to see every
              before and after.
            </p>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-1 lg:grid-cols-2">
            {visibleItems.map((item) => (
              <figure key={item._id} className="space-y-4">
                {item.label ? (
                  <figcaption className="text-base font-medium">
                    {item.label}
                  </figcaption>
                ) : null}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-muted shadow-sm">
                    {item.beforeUrl ? (
                      <Image
                        key={item.beforeUrl}
                        src={item.beforeUrl}
                        alt={`Before — ${page.name}`}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="(max-width: 1024px) 45vw, 480px"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        Before
                      </div>
                    )}
                    <span className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2.5 py-1 text-sm font-medium text-white">
                      Before
                    </span>
                  </div>
                  <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-muted shadow-sm">
                    {item.afterUrl ? (
                      <Image
                        key={item.afterUrl}
                        src={item.afterUrl}
                        alt={`After — ${page.name}`}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="(max-width: 1024px) 45vw, 480px"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        After
                      </div>
                    )}
                    <span
                      className="absolute bottom-3 left-3 rounded-md px-2.5 py-1 text-sm font-medium text-white"
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--landing-accent) 90%, black)",
                      }}
                    >
                      After
                    </span>
                  </div>
                </div>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
