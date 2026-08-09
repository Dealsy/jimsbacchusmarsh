import { CheckIcon } from "lucide-react";

import { LandingPageTheme } from "@/components/landing/landing-page-theme";
import { SiteFooter } from "@/components/landing/site-footer";
import { LinkButton } from "@/components/ui/link-button";
import { resolveThankYou } from "@/lib/landing-page-content";
import { formatPhoneHref, isPlaceholderPhone } from "@/lib/phone";
import type { PublishedLandingPage } from "@/lib/types/landing-page";

type LeadSuccessViewProps = {
  readonly page: PublishedLandingPage;
};

export function LeadSuccessView({ page }: LeadSuccessViewProps) {
  const thankYou = resolveThankYou(page);
  const showPhone = !isPlaceholderPhone(page.phone);

  return (
    <LandingPageTheme theme={page.theme}>
      <main className="flex min-h-[100dvh] flex-col pb-14">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
          <div
            className="mb-8 flex size-16 items-center justify-center rounded-full"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--landing-accent) 12%, white)",
              color: "var(--landing-accent)",
            }}
          >
            <CheckIcon className="size-8 stroke-[2.5]" aria-hidden />
          </div>

          <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            {thankYou.headline}
          </h1>
          <p className="mt-4 max-w-lg text-lg text-muted-foreground">
            {thankYou.body}
          </p>

          {showPhone ? (
            <div className="mt-8 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {thankYou.phonePrompt}
              </p>
              <LinkButton
                href={formatPhoneHref(page.phone)}
                size="lg"
                className="min-w-48"
              >
                Call {page.phone}
              </LinkButton>
            </div>
          ) : null}

          <div className="mt-12 w-full text-left">
            <h2 className="text-center font-heading text-xl font-semibold">
              {thankYou.nextStepsTitle}
            </h2>
            <ol className="mt-6 space-y-4">
              {thankYou.nextSteps.map((step) => (
                <li
                  key={step.step}
                  className="flex gap-4 rounded-xl border bg-card p-4 shadow-sm"
                >
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: "var(--landing-accent)" }}
                  >
                    {step.step}
                  </div>
                  <div className="space-y-1">
                    <p className="font-heading font-semibold">{step.title}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <p className="mt-10 text-sm text-muted-foreground">
            {page.businessName} · {page.serviceAreas.join(", ")}
          </p>
        </div>
      </main>
      <SiteFooter businessName={page.businessName} phone={page.phone} />
    </LandingPageTheme>
  );
}
