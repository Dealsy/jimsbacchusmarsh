import { formatPhoneHref, isPlaceholderPhone } from "@/lib/phone";
import { cn } from "@/lib/utils";

type SiteFooterProps = {
  readonly businessName: string;
  readonly phone: string;
  readonly hideOnMobile?: boolean;
};

export function SiteFooter({
  businessName,
  phone,
  hideOnMobile = false,
}: SiteFooterProps) {
  const showPhoneLink = !isPlaceholderPhone(phone);

  return (
    <footer
      className={cn(
        "fixed bottom-4 left-1/2 z-40 max-w-[calc(100%-1.5rem)] -translate-x-1/2 truncate rounded-full bg-background/85 px-5 py-2 text-center text-sm text-muted-foreground shadow-elevated ring-1 ring-black/10 backdrop-blur-xl",
        hideOnMobile && "hidden md:block",
      )}
    >
      <p>
        {businessName}
        {" · "}
        {showPhoneLink ? (
          <a
            href={formatPhoneHref(phone)}
            className="font-medium text-foreground hover:underline"
          >
            {phone}
          </a>
        ) : (
          phone
        )}
      </p>
    </footer>
  );
}
