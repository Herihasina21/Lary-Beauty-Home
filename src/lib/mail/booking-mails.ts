import { formatAppointmentDate } from "@/lib/appointments";
import { formatSlotLabelFromIso } from "@/lib/availability";
import { getOwnerEmail, getSiteUrl, isMailConfigured } from "@/lib/mail/config";
import { sendMail } from "@/lib/mail/smtp";
import { bookingConfirmedEmail } from "@/lib/mail/templates/booking-confirmed";
import { bookingReceivedEmail } from "@/lib/mail/templates/booking-received";
import { ownerNewBookingEmail } from "@/lib/mail/templates/owner-notification";
import { fetchContactInfo } from "@/lib/site-data";

function trackingUrl(token: string): string {
  return `${getSiteUrl()}/rdv/suivi/${token}`;
}

export async function sendBookingReceivedEmails(input: {
  name: string;
  phone: string;
  email: string;
  serviceLabel: string;
  slotStartAt: string;
  slotLabel: string;
  message: string | null;
  trackingToken: string;
}) {
  if (!isMailConfigured()) return;

  const tracking = trackingUrl(input.trackingToken);
  const clientMail = bookingReceivedEmail({
    name: input.name,
    serviceLabel: input.serviceLabel,
    slotLabel: input.slotLabel,
    trackingUrl: tracking,
  });

  await sendMail({
    to: input.email,
    subject: clientMail.subject,
    html: clientMail.html,
    text: clientMail.text,
  });

  const owner = getOwnerEmail();
  if (!owner) return;

  const ownerMail = ownerNewBookingEmail({
    name: input.name,
    phone: input.phone,
    email: input.email,
    serviceLabel: input.serviceLabel,
    slotLabel: input.slotLabel,
    message: input.message,
    adminUrl: `${getSiteUrl()}/admin/messages`,
  });

  await sendMail({
    to: owner,
    subject: ownerMail.subject,
    html: ownerMail.html,
    text: ownerMail.text,
  });
}

export async function sendBookingConfirmedEmail(input: {
  name: string;
  email: string;
  serviceLabel: string;
  confirmedAt: Date | null;
  slotStartAt: Date | null;
  preferredDate: string | null;
  adminNotes: string | null;
  trackingToken: string;
}) {
  if (!isMailConfigured()) return;

  const contact = await fetchContactInfo();
  const slotLabel =
    (input.confirmedAt && formatAppointmentDate(input.confirmedAt)) ||
    (input.slotStartAt && formatSlotLabelFromIso(input.slotStartAt.toISOString())) ||
    input.preferredDate ||
    "À confirmer";

  const mail = bookingConfirmedEmail({
    name: input.name,
    serviceLabel: input.serviceLabel,
    slotLabel,
    address: contact.address,
    adminNotes: input.adminNotes,
    trackingUrl: trackingUrl(input.trackingToken),
  });

  await sendMail({
    to: input.email,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
  });
}
