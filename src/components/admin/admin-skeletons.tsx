import { Skeleton } from "@/components/ui/skeleton";

const PAGE_CARD_KEYS = ["softwashing", "pressure", "window"] as const;
const EDITOR_FIELD_KEYS = [
  "title",
  "slug",
  "phone",
  "headline",
  "subheadline",
  "cta",
] as const;

export function AdminPageListSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading pages</span>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-9 w-32 rounded-full" />
          <Skeleton className="h-9 w-40 rounded-full" />
          <Skeleton className="h-9 w-36 rounded-full" />
        </div>
      </div>

      <div className="grid gap-4">
        {PAGE_CARD_KEYS.map((key) => (
          <div
            key={key}
            className="rounded-2xl border bg-background p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-5 w-56" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-20 rounded-full" />
                <Skeleton className="h-9 w-24 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminPageEditorSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading page editor</span>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-9 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
      </div>

      <Skeleton className="h-10 w-full max-w-3xl rounded-full" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border bg-background p-6">
          {EDITOR_FIELD_KEYS.map((key) => (
            <div key={key} className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full rounded-full" />
            </div>
          ))}
        </div>
        <Skeleton className="min-h-[720px] rounded-2xl" />
      </div>
    </div>
  );
}
