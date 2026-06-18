import { emailButton, emailLayout, escapeHtml } from "@/lib/mail/templates/layout";

export function bookingReceivedEmail(input: {
  name: string;
  serviceLabel: string;
  slotLabel: string;
  trackingUrl: string;
}) {
  const firstName = escapeHtml(input.name.trim().split(/\s+/)[0] || input.name);

  const bodyHtml = `
    <p>Bonjour ${firstName},</p>
    <p>Votre demande de rendez-vous a bien été enregistrée. Merci pour votre confiance ♥</p>
    <table style="width:100%;margin:20px 0;background:#faf7f5;border-radius:12px;padding:16px;">
      <tr><td style="padding:4px 0;"><strong style="color:#c9a96e;">Prestation</strong><br>${escapeHtml(input.serviceLabel)}</td></tr>
      <tr><td style="padding:4px 0;"><strong style="color:#c9a96e;">Créneau choisi</strong><br>${escapeHtml(input.slotLabel)}</td></tr>
    </table>
    <p><em>Statut : en attente de confirmation.</em> Je vous confirmerai très bientôt votre rendez-vous.</p>
    ${emailButton(input.trackingUrl, "Suivre mon rendez-vous")}
    <p style="font-size:13px;color:#666;">Conservez ce lien pour suivre l'état de votre réservation à tout moment.</p>
  `;

  const text = `Bonjour ${firstName},

Votre demande de rendez-vous a bien été enregistrée.

Prestation : ${input.serviceLabel}
Créneau : ${input.slotLabel}

Statut : en attente de confirmation.

Suivez votre rendez-vous : ${input.trackingUrl}

Lary Beauty Home`;

  return {
    subject: "Demande de rendez-vous reçue — Lary Beauty Home",
    html: emailLayout("Demande enregistrée", bodyHtml),
    text,
  };
}
