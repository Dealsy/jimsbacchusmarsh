import { LandingSection } from "@/components/landing/shell/landing-section";
import { Reveal } from "@/components/landing/shell/reveal";
import { SectionHeading } from "@/components/landing/shell/section-heading";
import { resolveHowItWorksSection } from "@/lib/landing-page-content";
import type { PublishedLandingPage } from "@/lib/types/landing-page";
import { cn } from "@/lib/utils";

type HowItWorksProps = {
  readonly page: PublishedLandingPage;
};

export function HowItWorks({ page }: HowItWorksProps) {
  const section = resolveHowItWorksSection(page);
  const sorted = [...page.howItWorks].sort((a, b) => a.step - b.step);

  return (
    <LandingSection tone="dark" containerClassName="space-y-12 md:space-y-16">
      <Reveal>
        <SectionHeading
          eyebrow="The process"
          title={section.title}
          description={section.description}
        />
      </Reveal>
      <ol className="relative grid gap-0 md:grid-cols-3 md:gap-6">
        {sorted.map((step, index) => (
          <li key={step.step} className="relative">
            <Reveal
              delay={index * 120}
              className={cn(
                "relative grid h-full grid-cols-[3rem_1fr] gap-x-5 md:block md:rounded-3xl md:bg-white/[0.04] md:p-8 md:ring-1 md:ring-white/10 md:backdrop-blur-sm",
                index < sorted.length - 1 && "pb-10",
              )}
            >
              {index < sorted.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute top-12 bottom-0 left-6 w-px bg-linear-to-b from-white/30 to-white/5 md:hidden"
                />
              ) : null}
              <span className="relative z-10 flex size-12 items-center justify-center rounded-full bg-white/10 font-heading text-lg font-bold ring-1 ring-white/20 backdrop-blur-md md:hidden">
                {step.step}
              </span>
              <span
                aria-hidden
                className="mb-6 hidden font-heading text-7xl leading-none font-bold text-transparent md:block"
                style={{
                  WebkitTextStroke:
                    "1.5px color-mix(in srgb, var(--landing-primary) 55%, white)",
                }}
              >
                {String(step.step).padStart(2, "0")}
              </span>
              <div className="space-y-2 pt-2 md:pt-0">
                <h3 className="font-heading text-xl font-semibold md:text-2xl">
                  {step.title}
                </h3>
                <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </LandingSection>
  );
}
