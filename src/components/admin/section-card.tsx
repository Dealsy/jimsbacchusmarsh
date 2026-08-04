import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SectionCardProps = {
  readonly title: string;
  readonly description?: string;
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly action?: React.ReactNode;
};

export function SectionCard({
  title,
  description,
  children,
  className,
  action,
}: SectionCardProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle className="font-heading text-lg">{title}</CardTitle>
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </div>
        {action}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

type TabIntroProps = {
  readonly title: string;
  readonly description: string;
};

export function TabIntro({ title, description }: TabIntroProps) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-primary/5 px-5 py-4">
      <h2 className="font-heading text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
