import { ClockIcon } from "lucide-react";

type UrgencyBannerProps = {
  readonly message: string;
};

export function UrgencyBanner({ message }: UrgencyBannerProps) {
  return (
    <div className="mx-auto flex w-fit max-w-full items-start gap-2.5 rounded-2xl border border-amber-300/70 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-950 shadow-xs dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
      <span className="relative mt-0.5 flex size-4 shrink-0 items-center justify-center">
        <span
          aria-hidden
          className="landing-pulse-dot absolute size-4 rounded-full bg-amber-400/40"
        />
        <ClockIcon className="relative size-4" />
      </span>
      <span>{message}</span>
    </div>
  );
}
