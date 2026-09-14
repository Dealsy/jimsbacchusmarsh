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
        "fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 py-3 text-center text-sm text-muted-foreground backdrop-blur supports-backdrop-filter:backdrop-blur",
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
