"use server";

import { saveContactMessageAction } from "@/app/admin/actions";
import { buildFormspreePayload } from "@/lib/contact-form";
import { formatSlotLabelFromIso } from "@/lib/availability";
import { fetchAvailableSlots } from "@/lib/site-data";
import type { ContactFormValues } from "@/lib/contact-form";
import type { AvailableSlot, SerializedServiceCategory } from "@/types";

export async function fetchAvailableSlotsAction(): Promise<AvailableSlot[]> {
  return fetchAvailableSlots();
}

export async function submitContactFormAction(
  values: ContactFormValues,
  servicesData: SerializedServiceCategory[],
  formspreeFormId: string,
) {
  const saved = await saveContactMessageAction({
    name: values.name,
    phone: values.phone,
    email: values.email,
    categoryId: values.categoryId,
    serviceId: values.serviceId,
    serviceLabel: values.serviceLabel,
    slotStartAt: values.date,
    message: values.message,
  });

  if (!saved.success) {
    if (saved.error === "slot_taken") {
      return { success: false, error: "Ce créneau vient d'être réservé. Choisissez un autre horaire." };
    }
    return { success: false, error: "Impossible d'enregistrer la demande." };
  }

  const id = formspreeFormId?.trim();
  if (!id || id === "XXXX") {
    return { success: true, trackingToken: saved.trackingToken };
  }

  try {
    const payload = buildFormspreePayload(values, servicesData);
    const body = new FormData();
    Object.entries(payload).forEach(function ([key, value]) {
      if (value != null) body.append(key, String(value));
    });
    if (values.date) {
      body.set("date", formatSlotLabelFromIso(values.date));
    }

    const res = await fetch(`https://formspree.io/f/${id}`, {
      method: "POST",
      body,
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return { success: false, error: "Erreur Formspree" };
    }
  } catch {
    return { success: false, error: "Erreur réseau" };
  }

  return { success: true, trackingToken: saved.trackingToken };
}
