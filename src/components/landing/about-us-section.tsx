import Image from "next/image";

import { hasAboutUsContent } from "@/lib/landing-page-content";
import { landingSectionSurfaceClass } from "@/lib/landing-section-surface";
import type { PublishedLandingPage } from "@/lib/types/landing-page";

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
  const hasStats = Boolean(founderName || yearsLocal || jobsCompleted);

  return (
    <section
      data-landing-section="about"
      className={`${landingSectionSurfaceClass("plain")} py-16 md:py-20`}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2">
        {photoUrl ? (
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-muted shadow-md">
            <Image
              src={photoUrl}
              alt={`${page.businessName} team`}
              fill
              unoptimized
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        ) : null}
        <div
          className={
            photoUrl
              ? "space-y-4"
              : "mx-auto max-w-2xl space-y-4 text-center md:col-span-2"
          }
        >
          <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            {headline}
          </h2>
          {hasStats ? (
            <dl
              className={
                photoUrl
                  ? "flex flex-wrap gap-x-6 gap-y-3 text-sm"
                  : "flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm"
              }
            >
              {founderName ? (
                <div>
                  <dt className="text-muted-foreground">Founder</dt>
                  <dd className="font-medium">{founderName}</dd>
                </div>
              ) : null}
              {yearsLocal ? (
                <div>
                  <dt className="text-muted-foreground">Years local</dt>
                  <dd className="font-medium">{yearsLocal}</dd>
                </div>
              ) : null}
              {jobsCompleted ? (
                <div>
                  <dt className="text-muted-foreground">Jobs completed</dt>
                  <dd className="font-medium">{jobsCompleted}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}
          {body ? (
            <p className="text-lg leading-relaxed whitespace-pre-line text-muted-foreground">
              {body}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
