import Image from "next/image";

import { DarkSectionDecor } from "@/components/landing/shell/landing-section";
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
    <div className="landing-dark-surface relative isolate flex justify-center overflow-hidden px-5 py-10 md:py-14">
      <DarkSectionDecor />
      <Image
        key={hero.logoUrl}
        src={hero.logoUrl}
        alt={businessName}
        width={480}
        height={128}
        unoptimized
        className="h-16 w-auto max-w-[min(100%,24rem)] object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)] md:h-20 lg:h-24 lg:max-w-[28rem]"
        loading="lazy"
      />
    </div>
  );
}
