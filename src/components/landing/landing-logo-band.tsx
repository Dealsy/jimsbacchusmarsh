import Image from "next/image";

import type { PublishedLandingPage } from "@/lib/types/landing-page";

type LandingLogoBandProps = {
  readonly page: PublishedLandingPage;
};

export function LandingLogoBand({ page }: LandingLogoBandProps) {
  const { hero, businessName } = page;

  if (!hero.logoUrl) {
    return null;
  }

  return (
    <div
      className="flex justify-center px-4 py-8 md:py-10"
      style={{
        background: `linear-gradient(to bottom, var(--landing-hero-from), var(--landing-hero-to))`,
      }}
    >
      <Image
        key={hero.logoUrl}
        src={hero.logoUrl}
        alt={businessName}
        width={480}
        height={128}
        unoptimized
        className="h-16 w-auto max-w-[min(100%,24rem)] object-contain md:h-20 lg:h-24 lg:max-w-[28rem]"
        loading="lazy"
      />
    </div>
  );
}
