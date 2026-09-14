import { resolveOffer } from "@/lib/landing-page-content";
import type { PublishedLandingPage } from "@/lib/types/landing-page";

type LeadFormHeadingProps = {
  readonly page: PublishedLandingPage;
};

export function LeadFormHeading({ page }: LeadFormHeadingProps) {
  const offer = resolveOffer(page);
  const payoff =
    offer.webBookingDiscountPercent !== null
      ? `No obligation — book from this page and save ${offer.webBookingDiscountPercent}% on the job.`
      : "No obligation. We'll look at the surfaces and call you back with a clear price.";

  return (
    <div className="mb-5 space-y-1">
      <p className="font-heading text-lg font-semibold tracking-tight">
        Get a free on-site quote
      </p>
      <p className="text-sm text-muted-foreground">{payoff}</p>
    </div>
  );
}
