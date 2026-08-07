import { Skeleton } from "@/components/ui/skeleton";

const HUB_CARD_KEYS = ["one", "two", "three", "four"] as const;

export function ServiceHubSkeleton() {
  return (
    <main
      className="min-h-screen bg-muted/20"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading services</span>
      <div className="mx-auto max-w-4xl space-y-10 px-4 py-16 md:py-24">
        <div className="space-y-4 text-center">
          <Skeleton className="mx-auto h-12 w-80 max-w-full" />
          <Skeleton className="mx-auto h-6 w-96 max-w-full" />
          <Skeleton className="mx-auto h-6 w-full max-w-2xl" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {HUB_CARD_KEYS.map((key) => (
            <div
              key={key}
              className="space-y-4 rounded-2xl border bg-background p-6"
            >
              <Skeleton className="h-7 w-2/3" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
