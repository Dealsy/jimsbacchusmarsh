import Image from "next/image";

type EquipmentPhotoCardProps = {
  readonly url: string;
  readonly alt: string;
};

export function EquipmentPhotoCard({ url, alt }: EquipmentPhotoCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl border-2 border-white bg-muted shadow-xl">
      <div className="relative aspect-square w-full">
        <Image
          src={url}
          alt={alt}
          fill
          unoptimized
          className="object-cover"
          sizes="(min-width: 2237px) 32rem, (min-width: 2000px) 24rem, 20rem"
        />
      </div>
    </div>
  );
}
