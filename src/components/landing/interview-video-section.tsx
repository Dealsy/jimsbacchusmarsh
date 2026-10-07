import { resolveInterviewVideo } from "@/lib/interview-video";
import { landingSectionSurfaceClass } from "@/lib/landing-section-surface";
import type { PublishedLandingPage } from "@/lib/types/landing-page";

type InterviewVideoSectionProps = {
  readonly page: PublishedLandingPage;
};

export function InterviewVideoSection({ page }: InterviewVideoSectionProps) {
  const video = resolveInterviewVideo(page.interviewVideoUrl);
  if (!video) {
    return null;
  }

  return (
    <section
      className={`${landingSectionSurfaceClass("plain")} py-16 md:py-20`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
          <div className="relative aspect-video w-full">
            <iframe
              src={video.embedUrl}
              title="Interview"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 size-full border-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
