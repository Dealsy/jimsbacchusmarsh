import { MapPinIcon, ShieldCheckIcon } from "lucide-react";
import Image from "next/image";
import { LeadForm } from "@/components/landing/lead-form";
import { Badge } from "@/components/ui/badge";
import {
  HERO_REVIEW_LOOM_ASPECT_PADDING,
  HERO_REVIEW_LOOM_EMBED_SRC,
} from "@/lib/hero-review-video";
import type { PublishedLandingPage } from "@/lib/types/landing-page";

type HeroProps = {
  readonly page: PublishedLandingPage;
};

export function Hero({ page }: HeroProps) {
  const { hero } = page;

  return (
    <div className="relative">
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
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, color-mix(in srgb, var(--landing-hero-from) 82%, transparent) 0%, color-mix(in srgb, var(--landing-hero-from) 58%, transparent) 38%, color-mix(in srgb, var(--landing-hero-from) 22%, transparent) 58%, color-mix(in srgb, var(--landing-hero-to) 10%, transparent) 100%)",
              }}
            />
          </div>
        ) : null}
        <div className="relative z-10 mx-auto grid min-h-0 max-w-7xl gap-8 px-4 py-8 md:min-h-[38rem] md:grid-cols-12 md:items-start md:gap-8 md:pt-14 md:pb-24 lg:gap-10">
          <div className="relative flex flex-col justify-center space-y-5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] md:col-span-6 md:space-y-6">
            {hero.audienceCallout ? (
              <p className="text-sm font-semibold uppercase tracking-wide text-white/90">
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
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              {hero.headline}
            </h1>
            <p className="text-lg text-white md:text-2xl">{hero.subheadline}</p>
            {hero.intrigueBullets && hero.intrigueBullets.length > 0 ? (
              <ul className="space-y-2 text-left text-sm text-white/95 md:text-base">
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
          <div className="rounded-2xl bg-card p-5 text-card-foreground shadow-lg md:col-span-6 md:p-6">
            <LeadForm page={page} idPrefix="hero" formLocation="hero" />
          </div>
        </div>
      </section>
      <div className="relative z-20 mx-auto max-w-7xl">
        <HeroReviewVideo />
      </div>
    </div>
  );
}

function HeroReviewVideo() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 min-[2237px]:absolute min-[2237px]:top-10 min-[2237px]:-left-140 min-[2237px]:mx-0 min-[2237px]:max-w-none min-[2237px]:w-[48rem] min-[2237px]:-translate-y-1/2 min-[2237px]:px-0 min-[2237px]:py-0">
      <div className="overflow-hidden rounded-2xl border-2 border-white bg-black/70 shadow-xl">
        <div
          className="relative h-0 w-full"
          style={{ paddingBottom: HERO_REVIEW_LOOM_ASPECT_PADDING }}
        >
          <iframe
            src={HERO_REVIEW_LOOM_EMBED_SRC}
            title="Customer review"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </div>
    </div>
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
