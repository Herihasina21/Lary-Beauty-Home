import type { Service, ServiceCategory } from "@/types";

export type ContactCategoryId = "" | "ongles" | "epilations" | "soins" | "autre";

export type ContactFormStep = 1 | 2 | 3 | 4;

export type ContactFormValues = {
  step: ContactFormStep;
  categoryId: ContactCategoryId;
  serviceId: string;
  serviceLabel: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  message: string;
};

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

export var contactFormInitialValues: ContactFormValues = {
  step: 1,
  categoryId: "",
  serviceId: "",
  serviceLabel: "",
  name: "",
  phone: "",
  email: "",
  date: "",
  message: "",
};

export var contactFormSteps = [
  { num: 1, label: "Prestation" },
  { num: 2, label: "Détail" },
  { num: 3, label: "Coordonnées" },
  { num: 4, label: "Confirmation" },
] as const;

export function formatServicePrice(price: number | string, unit?: string) {
  if (typeof price === "number") return `${price} €`;
  if (unit) return `${price}${unit}`;
  return String(price);
}

export function formatServiceOption(service: Service) {
  var price = formatServicePrice(service.price, service.unit);
  if (service.duration) return `${service.name} — ${price} (${service.duration})`;
  return `${service.name} — ${price}`;
}

export function getCategoryServices(
  categoryId: ContactCategoryId,
  servicesData: ServiceCategory[],
) {
  if (!categoryId || categoryId === "autre") return [];
  return servicesData.find(function (c) {
    return c.id === categoryId;
  })?.services ?? [];
}

export type ServiceGroup = {
  name: string;
  services: Service[];
};

export function groupServicesByCategory(services: Service[]): ServiceGroup[] {
  var groups: ServiceGroup[] = [];
  var indexByName = new Map<string, number>();

  services.forEach(function (service) {
    var idx = indexByName.get(service.category);
    if (idx === undefined) {
      indexByName.set(service.category, groups.length);
      groups.push({ name: service.category, services: [service] });
      return;
    }
    groups[idx].services.push(service);
  });

  return groups;
}

export function getCategoryTitle(
  categoryId: ContactCategoryId,
  servicesData: ServiceCategory[],
) {
  if (categoryId === "autre") return "Autre / à discuter";
  if (!categoryId) return "";
  return servicesData.find(function (c) {
    return c.id === categoryId;
  })?.title ?? "";
}

export function resolveServiceLabel(
  categoryId: ContactCategoryId,
  serviceId: string,
  servicesData: ServiceCategory[],
) {
  if (categoryId === "autre") return "Autre / à discuter";
  var service = getCategoryServices(categoryId, servicesData).find(function (s) {
    return s.id === serviceId;
  });
  if (!service) return "";
  return formatServiceOption(service);
}

export function buildFormspreePayload(
  values: ContactFormValues,
  servicesData: ServiceCategory[],
) {
  var category = getCategoryTitle(values.categoryId, servicesData);
  var prestation =
    values.serviceLabel ||
    resolveServiceLabel(values.categoryId, values.serviceId, servicesData);

  return {
    name: values.name,
    phone: values.phone,
    email: values.email,
    date: values.date,
    message: values.message,
    category: category,
    prestation: prestation,
    categoryId: values.categoryId,
    serviceId: values.serviceId,
  };
}

function validateContactFields(v: ContactFormValues): ContactFormErrors {
  var e: ContactFormErrors = {};
  if (!v.name.trim()) e.name = "Veuillez indiquer votre nom";
  else if (v.name.trim().length < 2) e.name = "Nom trop court";

  if (!v.phone.trim()) e.phone = "Téléphone requis";
  else if (!/^[+\d\s().-]{8,}$/.test(v.phone.trim())) e.phone = "Numéro invalide";

  if (!v.email.trim()) e.email = "Email requis";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Email invalide";

  return e;
}

function validateDateAndMessage(v: ContactFormValues): ContactFormErrors {
  var e: ContactFormErrors = {};

  if (v.date) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var d = new Date(v.date);
    if (d < today) e.date = "Date passée";
  }

  if (v.categoryId === "autre" && !v.message.trim()) {
    e.message = "Précisez votre demande";
  }

  if (v.message && v.message.length > 1000) e.message = "Message trop long";
  return e;
}

export function validateContactStep(
  step: ContactFormStep,
  v: ContactFormValues,
): ContactFormErrors {
  var e: ContactFormErrors = {};

  if (step === 1 && !v.categoryId) {
    e.categoryId = "Choisissez une catégorie";
  }

  if (step === 2 && v.categoryId !== "autre" && !v.serviceId) {
    e.serviceId = "Choisissez une prestation";
  }

  if (step === 3) {
    Object.assign(e, validateContactFields(v));
  }

  if (step === 4) {
    Object.assign(e, validateDateAndMessage(v));
  }

  return e;
}

export function validateContactForm(v: ContactFormValues): ContactFormErrors {
  var e: ContactFormErrors = {};
  for (var step = 1 as ContactFormStep; step <= 4; step++) {
    Object.assign(e, validateContactStep(step, v));
  }
  return e;
}
