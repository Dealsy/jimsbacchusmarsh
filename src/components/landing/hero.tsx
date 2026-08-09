import { MapPinIcon, ShieldCheckIcon, SparklesIcon } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import type { PublishedLandingPage } from "@/lib/types/landing-page";

type HeroProps = {
  readonly page: PublishedLandingPage;
};

export function Hero({ page }: HeroProps) {
  const { hero, ctaLabel } = page;

  return (
    <section
      className="relative overflow-hidden text-white"
      style={{
        background: `linear-gradient(to bottom, var(--landing-hero-from), var(--landing-hero-to))`,
      }}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:items-stretch md:py-24 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col justify-center space-y-6 lg:col-span-5">
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
          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            {hero.headline}
          </h1>
          <p className="text-lg text-white/90 md:text-xl">{hero.subheadline}</p>
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
          <LinkButton
            href="#quote-form"
            size="lg"
            className="h-auto px-8 py-3.5 text-lg font-semibold md:text-xl"
          >
            {ctaLabel}
          </LinkButton>
          <ul className="flex flex-wrap gap-3 pt-2">
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
        <div
          className="relative aspect-[4/3] min-h-[280px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl sm:min-h-[320px] md:aspect-auto md:h-full md:min-h-[400px] lg:col-span-7"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--landing-hero-from) 50%, transparent)",
          }}
        >
          {hero.imageUrl ? (
            <Image
              key={hero.imageUrl}
              src={hero.imageUrl}
              alt={`${page.name} — before and after`}
              fill
              unoptimized
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 58vw"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center text-white/60">
              <SparklesIcon className="size-10 opacity-50" />
              <p className="text-sm">
                [PLACEHOLDER — Matt to supply hero before/after photo]
              </p>
            </div>
          )}
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
