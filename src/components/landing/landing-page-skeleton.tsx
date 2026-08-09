import { Skeleton } from "@/components/ui/skeleton";

const TRUST_STRIP_KEYS = ["one", "two", "three", "four", "five"] as const;
const TRIPLE_KEYS = ["one", "two", "three"] as const;
const GRID_SIX_KEYS = ["one", "two", "three", "four", "five", "six"] as const;
const FAQ_KEYS = GRID_SIX_KEYS;

function SectionBlock({
  children,
  className,
}: {
  readonly children: React.ReactNode;
  readonly className?: string;
}) {
  return (
    <section className={className}>
      <div className="mx-auto max-w-6xl space-y-8 px-4">{children}</div>
    </section>
  );
}

export function LandingPageSkeleton() {
  return (
    <main className="pb-32 md:pb-14" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading page</span>

      <section className="bg-muted/70">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:items-stretch md:py-24 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-6 lg:col-span-5">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full max-w-xl" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-11 w-56 rounded-full" />
            <div className="flex flex-wrap gap-3 pt-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
          <Skeleton className="min-h-[280px] rounded-2xl sm:min-h-[320px] md:min-h-[400px] md:h-full lg:col-span-7" />
        </div>
      </section>

      <section className="border-b bg-muted/40 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 px-4">
          {TRUST_STRIP_KEYS.map((key) => (
            <Skeleton key={key} className="h-5 w-24" />
          ))}
        </div>
      </section>

      <SectionBlock className="py-16 md:py-20">
        <Skeleton className="mx-auto h-10 w-72 max-w-full" />
        <Skeleton className="mx-auto h-20 w-full max-w-3xl" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </SectionBlock>

      <SectionBlock className="bg-muted/20 py-16 md:py-20">
        <Skeleton className="mx-auto h-10 w-80 max-w-full" />
        <div className="grid gap-4 md:grid-cols-3">
          {TRIPLE_KEYS.map((key) => (
            <Skeleton key={key} className="h-36 rounded-2xl" />
          ))}
        </div>
      </SectionBlock>

      <SectionBlock className="py-16 md:py-20">
        <Skeleton className="mx-auto h-10 w-64 max-w-full" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GRID_SIX_KEYS.map((key) => (
            <Skeleton key={key} className="h-40 rounded-2xl" />
          ))}
        </div>
      </SectionBlock>

      <section className="bg-muted/30 py-16 md:py-20">
        <div className="mx-auto max-w-3xl space-y-10 px-4">
          <Skeleton className="mx-auto h-10 w-56" />
          <div className="overflow-hidden rounded-2xl border bg-background">
            {FAQ_KEYS.map((key) => (
              <Skeleton
                key={key}
                className="h-16 w-full rounded-none border-b last:border-b-0"
              />
            ))}
          </div>
        </div>
      </section>

      <SectionBlock className="py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </div>
          <Skeleton className="h-[28rem] rounded-2xl" />
        </div>
      </SectionBlock>

      <div className="h-12" aria-hidden />

      <footer className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 py-3 backdrop-blur">
        <Skeleton className="mx-auto h-5 w-64" />
      </footer>
    </main>
  );
}
