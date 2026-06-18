import {
  Clock,
  Flower2,
  Gem,
  Hand,
  HelpCircle,
  Home,
  Info,
  Mail,
  MessageCircle,
  ShieldCheck,
  Leaf,
  Star,
  UserX,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Gem,
  Flower2,
  Star,
  MessageCircle,
  Mail,
  Clock,
  Home,
  Wallet,
  UserX,
  Hand,
  Info,
  HelpCircle,
  ShieldCheck,
  Leaf,
};

export function resolveIcon(name: string): LucideIcon {
  return iconMap[name] ?? HelpCircle;
}

export function iconNameFromComponent(icon: LucideIcon): string {
  for (const entry of Object.entries(iconMap)) {
    if (entry[1] === icon) return entry[0];
  }
  return "HelpCircle";
}

export const iconOptions = Object.keys(iconMap);
