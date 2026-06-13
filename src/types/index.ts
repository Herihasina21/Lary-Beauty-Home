import type { LucideIcon } from "lucide-react";

export interface Service {
  id: string;
  category: string;
  name: string;
  price: number | string;
  unit?: string;
  duration?: string;
  description?: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  services: Service[];
}

export interface BookingRule {
  id: string;
  icon: LucideIcon;
  text: string;
  highlight?: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  instagramUrl: string;
  instagramDmUrl: string;
  facebookUrl: string;
}
