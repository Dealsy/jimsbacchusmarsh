import { EquipmentPhotoCard } from "@/components/landing/equipment-photo-card";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import type { PublishedLandingPage } from "@/lib/types/landing-page";

type ReviewsBlockProps = {
  readonly page: PublishedLandingPage;
};

export function ReviewsBlock({ page }: ReviewsBlockProps) {
  const photoUrl = page.equipmentPhotoUrl;
  const photoAlt = `${page.businessName} equipment`;

  return (
    <div>
      <TestimonialsSection page={page} />
      {photoUrl ? (
        <div className="mx-auto w-full max-w-lg px-4 py-6">
          <EquipmentPhotoCard url={photoUrl} alt={photoAlt} />
        </div>
      ) : null}
    </div>
  );
}
