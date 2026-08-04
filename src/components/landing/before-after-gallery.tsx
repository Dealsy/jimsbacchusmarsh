import Image from "next/image";

import { resolveGallerySection } from "@/lib/landing-page-content";
import type { GalleryItem, PublishedLandingPage } from "@/lib/types/landing-page";

type BeforeAfterGalleryProps = {
  readonly page: PublishedLandingPage;
  readonly items: readonly GalleryItem[];
};

export function BeforeAfterGallery({ page, items }: BeforeAfterGalleryProps) {
  const section = resolveGallerySection(page);

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl space-y-10 px-4">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            {section.title}
          </h2>
          <p className="text-muted-foreground">{section.description}</p>
        </div>
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-muted/20 p-12 text-center text-muted-foreground">
            <p className="font-medium">
              [PLACEHOLDER — Matt to supply 3+ before/after photo pairs via
              admin]
            </p>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-1 lg:grid-cols-2">
            {items.map((item) => (
              <figure key={item._id} className="space-y-4">
                {item.label ? (
                  <figcaption className="text-base font-medium">
                    {item.label}
                  </figcaption>
                ) : null}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted shadow-sm">
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
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted shadow-sm">
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
