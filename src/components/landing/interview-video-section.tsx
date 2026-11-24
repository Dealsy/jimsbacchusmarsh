import { LandingSection } from "@/components/landing/shell/landing-section";
import { Reveal } from "@/components/landing/shell/reveal";
import { resolveInterviewVideo } from "@/lib/interview-video";
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
    <LandingSection tone="dark" width="wide" className="max-md:pt-6">
      <Reveal>
        <div
          className="overflow-hidden rounded-3xl bg-black ring-1 ring-white/15"
          style={{
            boxShadow:
              "0 40px 120px -30px color-mix(in srgb, var(--landing-primary) 55%, transparent), 0 24px 48px -16px rgb(0 0 0 / 0.5)",
          }}
        >
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
      </Reveal>
    </LandingSection>
  );
}
