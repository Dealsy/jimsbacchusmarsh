import { MapPinIcon, ShieldCheckIcon } from "lucide-react";
import Image from "next/image";
import { LeadForm } from "@/components/landing/lead-form";
import { Badge } from "@/components/ui/badge";
import type { PublishedLandingPage } from "@/lib/types/landing-page";

type HeroProps = {
  readonly page: PublishedLandingPage;
};

export function Hero({ page }: HeroProps) {
  const { hero } = page;

  return (
    <section
      data-landing-section="hero"
      className="relative overflow-hidden text-white"
      style={{
        background: `linear-gradient(to bottom, var(--landing-hero-from), var(--landing-hero-to))`,
      }}
    >
      {hero.imageUrl ? (
        <div className="pointer-events-none absolute inset-0 hidden md:block">
          <Image
            key={hero.imageUrl}
            src={hero.imageUrl}
            alt=""
            fill
            unoptimized
            className="object-contain object-[10%_50%] scale-[1.45] origin-[22%_80%]"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/25" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, color-mix(in srgb, var(--landing-hero-from) 62%, transparent) 0%, color-mix(in srgb, var(--landing-hero-from) 32%, transparent) 42%, color-mix(in srgb, var(--landing-hero-to) 12%, transparent) 100%)",
            }}
          />
        </div>
      ) : null}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 md:grid md:min-h-[38rem] md:grid-cols-12 md:items-center md:gap-10 md:py-24 lg:gap-12">
        <div className="flex flex-col justify-center space-y-5 md:col-span-6 md:space-y-6 md:drop-shadow-md">
          {hero.audienceCallout ? (
            <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
              {hero.audienceCallout}
            </p>
          ) : (
            <Badge
              variant="secondary"
              className="bg-white/10 text-white hover:bg-white/10"
            >
              {page.serviceAreas.join(" · ")}
            </Badge>
          )}
          <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight md:text-5xl">
            {hero.headline}
          </h1>
          <p className="text-base text-white/90 md:text-xl">{hero.subheadline}</p>
          {hero.intrigueBullets && hero.intrigueBullets.length > 0 ? (
            <ul className="space-y-2 text-left text-sm text-white/85 md:text-base">
              {hero.intrigueBullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-white/70" />
                  {bullet}
                </li>
              ))}
            </ul>
          ) : null}
          <ul className="hidden flex-wrap gap-3 pt-2 md:flex">
            {hero.trustStrip.map((item) => (
              <li
                key={item}
                className="flex items-center gap-1.5 text-sm text-white/80"
              >
                <ShieldCheckIcon className="size-4 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-card p-5 text-card-foreground shadow-lg md:col-span-5 md:col-start-8 md:p-6">
          <LeadForm page={page} idPrefix="hero" formLocation="hero" />
        </div>
      </div>
    </section>
  );
}

export function TrustStrip({ page }: HeroProps) {
  return (
    <section className="border-b bg-muted/40 py-4">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 px-4 text-sm text-muted-foreground">
        {page.hero.trustStrip.map((item) => (
          <span key={item} className="flex items-center gap-2">
            <MapPinIcon className="size-4 text-primary" />
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
