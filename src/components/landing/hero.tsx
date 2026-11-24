import { PhoneIcon } from "lucide-react";
import Image from "next/image";
import { GoogleRatingSummary } from "@/components/landing/google-reviews-badge";
import { LeadForm } from "@/components/landing/lead-form";
import { LeadFormHeading } from "@/components/landing/lead-form-heading";
import { LinkButton } from "@/components/ui/link-button";
import {
  HERO_REVIEW_LOOM_ASPECT_PADDING,
  HERO_REVIEW_LOOM_EMBED_SRC,
} from "@/lib/hero-review-video";
import { formatPhoneHref, HERO_CALL_MOBILE } from "@/lib/phone";
import { trustStripIcon } from "@/lib/trust-strip-icon";
import type { PublishedLandingPage } from "@/lib/types/landing-page";
import { cn } from "@/lib/utils";

type HeroProps = {
  readonly page: PublishedLandingPage;
};

const HERO_MEDIA_CLASS =
  "object-contain object-[10%_50%] scale-[1.45] origin-[22%_80%]";

const HERO_MOBILE_OVERLAY_STYLE = {
  background:
    "linear-gradient(to bottom, color-mix(in srgb, var(--landing-hero-from) 92%, transparent) 0%, color-mix(in srgb, var(--landing-hero-from) 72%, transparent) 45%, color-mix(in srgb, var(--landing-hero-to) 55%, transparent) 100%)",
} as const;

const HERO_OVERLAY_STYLE = {
  background:
    "linear-gradient(to right, color-mix(in srgb, var(--landing-hero-from) 82%, transparent) 0%, color-mix(in srgb, var(--landing-hero-from) 58%, transparent) 38%, color-mix(in srgb, var(--landing-hero-from) 22%, transparent) 58%, color-mix(in srgb, var(--landing-hero-to) 10%, transparent) 100%)",
} as const;

function HeroBackgroundMedia({
  hero,
}: {
  readonly hero: PublishedLandingPage["hero"];
}) {
  const showVideo = hero.backgroundKind === "video" && Boolean(hero.videoUrl);
  const desktopMediaUrl = showVideo ? hero.videoUrl : hero.imageUrl;
  const mobileImageUrl = hero.imageUrl;

  if (!desktopMediaUrl && !mobileImageUrl) {
    return null;
  }

  return (
    <>
      {mobileImageUrl ? (
        <div className="pointer-events-none absolute inset-0 md:hidden">
          <Image
            src={mobileImageUrl}
            alt=""
            fill
            unoptimized
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0" style={HERO_MOBILE_OVERLAY_STYLE} />
        </div>
      ) : null}
      {desktopMediaUrl ? (
        <div className="pointer-events-none absolute inset-0 hidden md:block">
          {showVideo ? (
            <video
              key={desktopMediaUrl}
              src={desktopMediaUrl}
              className={cn("absolute inset-0 h-full w-full", HERO_MEDIA_CLASS)}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden
            />
          ) : (
            <Image
              key={desktopMediaUrl}
              src={desktopMediaUrl}
              alt=""
              fill
              unoptimized
              className={HERO_MEDIA_CLASS}
              priority
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0" style={HERO_OVERLAY_STYLE} />
        </div>
      ) : null}
    </>
  );
}

export function Hero({ page }: HeroProps) {
  const { hero } = page;
  const kicker =
    hero.audienceCallout?.trim() ||
    page.serviceAreas.filter((area) => area.trim()).join(" · ");

  return (
    <div className="relative">
      <section
        data-landing-section="hero"
        className="relative isolate overflow-hidden text-white"
        style={{
          background: `linear-gradient(to bottom, var(--landing-hero-from), var(--landing-hero-to))`,
        }}
      >
        <HeroBackgroundMedia hero={hero} />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 landing-grid-texture"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-[-10%] size-[36rem] rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--landing-primary), transparent 65%)",
          }}
        />
        <div className="relative z-10 mx-auto grid min-h-0 max-w-7xl gap-8 px-5 pt-8 pb-10 md:min-h-[40rem] md:grid-cols-12 md:items-center md:gap-10 md:px-6 md:pt-24 md:pb-28 lg:gap-14">
          <div className="relative flex flex-col space-y-5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] md:col-span-6 md:space-y-7 lg:col-span-7">
            {kicker ? (
              <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-white/90 backdrop-blur-md">
                <span
                  aria-hidden
                  className="landing-pulse-dot size-1.5 rounded-full"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--landing-primary) 60%, white)",
                  }}
                />
                {kicker}
              </p>
            ) : null}
            <h1 className="font-heading text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[1.02]">
              {hero.headline}
            </h1>
            <GoogleRatingSummary
              page={page}
              className="w-fit rounded-full bg-black/25 px-3 py-1.5 backdrop-blur-md"
              countClassName="text-white/90"
            />
            <p className="max-w-xl text-lg leading-relaxed text-pretty text-white/85 md:text-xl">
              {hero.subheadline}
            </p>
            <LinkButton
              href={formatPhoneHref(HERO_CALL_MOBILE)}
              landingCtaLocation="hero_call_now"
              size="lg"
              className="hidden h-14 w-fit border-white/20 bg-white/10 px-7 text-lg text-white shadow-lg backdrop-blur-md hover:bg-white/20 md:inline-flex [&_svg:not([class*='size-'])]:size-5"
            >
              <PhoneIcon />
              {HERO_CALL_MOBILE}
            </LinkButton>
          </div>
          <div className="tone-light relative overflow-hidden rounded-3xl bg-card p-5 text-card-foreground shadow-float ring-1 ring-white/20 md:col-span-6 md:p-7 lg:col-span-5">
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-(--landing-primary) to-(--landing-accent)"
            />
            <LeadFormHeading page={page} />
            <LeadForm page={page} idPrefix="hero" formLocation="hero" />
          </div>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-b from-transparent to-background/15"
        />
      </section>
      <div className="relative z-20 mx-auto hidden max-w-7xl md:block">
        <HeroReviewVideo />
      </div>
    </div>
  );
}

export function HeroReviewVideo() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-8 min-[2237px]:absolute min-[2237px]:top-10 min-[2237px]:-left-140 min-[2237px]:mx-0 min-[2237px]:max-w-none min-[2237px]:w-[48rem] min-[2237px]:-translate-y-1/2 min-[2237px]:px-0 min-[2237px]:py-0">
      <div className="overflow-hidden rounded-3xl bg-black/70 shadow-float ring-1 ring-white/20">
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
  if (page.hero.trustStrip.length === 0) {
    return null;
  }

  return (
    <section className="border-y bg-background py-4 md:py-6">
      <ul className="no-scrollbar mx-auto flex max-w-6xl snap-x scroll-px-5 gap-2.5 overflow-x-auto px-5 md:flex-wrap md:justify-center md:gap-3 md:overflow-visible md:px-6">
        {page.hero.trustStrip.map((item) => {
          const Icon = trustStripIcon(item);
          return (
            <li
              key={item}
              className="flex shrink-0 snap-start items-center gap-2.5 rounded-full border bg-card py-1.5 pr-4 pl-1.5 text-sm font-medium shadow-xs"
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-3.5" />
              </span>
              {item}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
