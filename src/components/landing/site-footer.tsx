import { formatPhoneHref, isPlaceholderPhone } from "@/lib/phone";

type SiteFooterProps = {
  readonly businessName: string;
  readonly phone: string;
};

export function SiteFooter({ businessName, phone }: SiteFooterProps) {
  const showPhoneLink = !isPlaceholderPhone(phone);

  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 py-3 text-center text-sm text-muted-foreground backdrop-blur supports-backdrop-filter:backdrop-blur">
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
