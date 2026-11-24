import Image from "next/image";

import { LandingSection } from "@/components/landing/shell/landing-section";
import { Reveal } from "@/components/landing/shell/reveal";
import { Eyebrow } from "@/components/landing/shell/section-heading";
import { hasAboutUsContent } from "@/lib/landing-page-content";
import type { PublishedLandingPage } from "@/lib/types/landing-page";
import { cn } from "@/lib/utils";

type AboutUsSectionProps = {
  readonly page: PublishedLandingPage;
};

export function AboutUsSection({ page }: AboutUsSectionProps) {
  if (!hasAboutUsContent(page) || !page.about) {
    return null;
  }

  const headline = page.about.headline.trim() || "About us";
  const body = page.about.body.trim();
  const photoUrl = page.about.photoUrl;
  const founderName = page.about.founderName?.trim();
  const yearsLocal = page.about.yearsLocal?.trim();
  const jobsCompleted = page.about.jobsCompleted?.trim();
  const stats = [
    { label: "Founder", value: founderName },
    { label: "Years local", value: yearsLocal },
    { label: "Jobs completed", value: jobsCompleted },
  ].filter((stat): stat is { label: string; value: string } =>
    Boolean(stat.value),
  );

  return (
    <LandingSection
      data-landing-section="about"
      tone="light"
      containerClassName="grid items-center gap-12 md:grid-cols-2 md:gap-16"
    >
      {photoUrl ? (
        <Reveal className="relative pr-4 pb-4 md:pr-6 md:pb-6">
          <div
            aria-hidden
            className="absolute inset-0 top-6 left-6 rounded-3xl md:top-8 md:left-8"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--landing-primary) 22%, transparent), color-mix(in srgb, var(--landing-accent) 12%, transparent))",
            }}
          />
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-muted shadow-float ring-1 ring-black/5">
            <Image
              src={photoUrl}
              alt={`${page.businessName} team`}
              fill
              unoptimized
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </Reveal>
      ) : null}
      <Reveal
        delay={100}
        className={cn(
          "space-y-6",
          !photoUrl && "mx-auto max-w-2xl text-center md:col-span-2",
        )}
      >
        <div className="space-y-4">
          <Eyebrow centered={!photoUrl}>About us</Eyebrow>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-balance md:text-5xl">
            {headline}
          </h2>
        </div>
        {stats.length > 0 ? (
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-(--landing-section-band) p-4 ring-1 ring-border"
              >
                <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {stat.label}
                </dt>
                <dd className="mt-1 font-heading text-xl font-bold text-foreground md:text-2xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
        {body ? (
          <p className="text-lg leading-relaxed whitespace-pre-line text-pretty text-muted-foreground">
            {body}
          </p>
        ) : null}
      </Reveal>
    </LandingSection>
  );
}
