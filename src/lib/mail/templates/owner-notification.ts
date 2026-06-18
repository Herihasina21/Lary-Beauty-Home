import { emailLayout, escapeHtml } from "@/lib/mail/templates/layout";

export function ownerNewBookingEmail(input: {
  name: string;
  phone: string;
  email: string;
  serviceLabel: string;
  slotLabel: string;
  message: string | null;
  adminUrl: string;
}) {
  const bodyHtml = `
    <p>Nouvelle demande de rendez-vous sur le site :</p>
    <table style="width:100%;margin:16px 0;background:#faf7f5;border-radius:12px;padding:16px;font-size:14px;">
      <tr><td style="padding:4px 0;"><strong>Cliente</strong><br>${escapeHtml(input.name)}</td></tr>
      <tr><td style="padding:4px 0;"><strong>Téléphone</strong><br>${escapeHtml(input.phone)}</td></tr>
      <tr><td style="padding:4px 0;"><strong>Email</strong><br>${escapeHtml(input.email)}</td></tr>
      <tr><td style="padding:4px 0;"><strong>Prestation</strong><br>${escapeHtml(input.serviceLabel)}</td></tr>
      <tr><td style="padding:4px 0;"><strong>Créneau</strong><br>${escapeHtml(input.slotLabel)}</td></tr>
      ${input.message ? `<tr><td style="padding:4px 0;"><strong>Message</strong><br>${escapeHtml(input.message)}</td></tr>` : ""}
    </table>
    <p><a href="${input.adminUrl}" style="color:#c9a96e;">Ouvrir dans l'admin →</a></p>
  `;

  const text = `Nouvelle demande de rendez-vous

${input.name} — ${input.phone} — ${input.email}
Prestation : ${input.serviceLabel}
Créneau : ${input.slotLabel}
${input.message ? `Message : ${input.message}` : ""}

Admin : ${input.adminUrl}`;

  return {
    subject: `Nouveau RDV — ${input.name}`,
    html: emailLayout("Nouvelle réservation", bodyHtml),
    text,
  };
}
