import { EquipmentPhotoCard } from "@/components/landing/equipment-photo-card";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { WedgeSection } from "@/components/landing/wedge-section";
import type { PublishedLandingPage } from "@/lib/types/landing-page";

type ReviewsWedgeBlockProps = {
  readonly page: PublishedLandingPage;
};

export function ReviewsWedgeBlock({ page }: ReviewsWedgeBlockProps) {
  const photoUrl = page.equipmentPhotoUrl;
  const photoAlt = `${page.businessName} equipment`;

  return (
    <div>
      <TestimonialsSection page={page} />
      {photoUrl ? (
        <div className="mx-auto w-full max-w-lg px-4 py-6 min-[2000px]:hidden">
          <EquipmentPhotoCard url={photoUrl} alt={photoAlt} />
        </div>
      ) : null}
      <div className="relative">
        {photoUrl ? (
          <div className="pointer-events-none absolute top-0 right-8 z-10 hidden w-96 translate-y-[-50%] min-[2000px]:block min-[2237px]:right-40 min-[2237px]:w-lg">
            <EquipmentPhotoCard url={photoUrl} alt={photoAlt} />
          </div>
        ) : null}
        <WedgeSection page={page} />
      </div>
    </div>
  );
}
