import type { LucideIcon } from "lucide-react";
import {
  BadgeCheckIcon,
  MapPinIcon,
  ShieldCheckIcon,
  WrenchIcon,
} from "lucide-react";

const TRUST_ICON_RULES: readonly {
  readonly pattern: RegExp;
  readonly icon: LucideIcon;
}[] = [
  { pattern: /insur|licen|guarantee|bond/i, icon: ShieldCheckIcon },
  { pattern: /equip|commercial|grade|tool/i, icon: WrenchIcon },
  { pattern: /local|operator|suburb|area|marsh|region/i, icon: MapPinIcon },
  { pattern: /verified|check|rated/i, icon: BadgeCheckIcon },
];

export function trustStripIcon(item: string): LucideIcon {
  const match = TRUST_ICON_RULES.find((rule) => rule.pattern.test(item));
  return match?.icon ?? ShieldCheckIcon;
}
