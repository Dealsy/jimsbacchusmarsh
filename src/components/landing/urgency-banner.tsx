import { ClockIcon } from "lucide-react";

type UrgencyBannerProps = {
  readonly message: string;
};

export function UrgencyBanner({ message }: UrgencyBannerProps) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
      <p className="flex items-start gap-2">
        <ClockIcon className="mt-0.5 size-4 shrink-0" />
        <span>{message}</span>
      </p>
    </div>
  );
}
