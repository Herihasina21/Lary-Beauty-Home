import { emailButton, emailLayout, escapeHtml } from "@/lib/mail/templates/layout";

export function bookingConfirmedEmail(input: {
  name: string;
  serviceLabel: string;
  slotLabel: string;
  address: string;
  adminNotes: string | null;
  trackingUrl: string;
}) {
  const firstName = escapeHtml(input.name.trim().split(/\s+/)[0] || input.name);

  const noteBlock = input.adminNotes
    ? `<p style="background:#fff8f0;border-left:4px solid #c9a96e;padding:12px 16px;border-radius:8px;"><strong>Message :</strong><br>${escapeHtml(input.adminNotes)}</p>`
    : "";

  const bodyHtml = `
    <p>Bonjour ${firstName},</p>
    <p><strong>Votre rendez-vous est confirmé !</strong> J'ai hâte de vous accueillir.</p>
    <table style="width:100%;margin:20px 0;background:#f0faf4;border-radius:12px;padding:16px;">
      <tr><td style="padding:4px 0;"><strong style="color:#2d6a4f;">Prestation</strong><br>${escapeHtml(input.serviceLabel)}</td></tr>
      <tr><td style="padding:4px 0;"><strong style="color:#2d6a4f;">Date et heure</strong><br>${escapeHtml(input.slotLabel)}</td></tr>
      <tr><td style="padding:4px 0;"><strong style="color:#2d6a4f;">Adresse</strong><br>${escapeHtml(input.address)}</td></tr>
    </table>
    ${noteBlock}
    <p style="font-size:14px;">Pensez à arriver à l'heure. En cas d'empêchement, prévenez-moi le plus tôt possible.</p>
    ${emailButton(input.trackingUrl, "Voir mon rendez-vous")}
  `;

  const text = `Bonjour ${firstName},

Votre rendez-vous est confirmé !

Prestation : ${input.serviceLabel}
Date et heure : ${input.slotLabel}
Adresse : ${input.address}
${input.adminNotes ? `\nMessage : ${input.adminNotes}\n` : ""}
Détails : ${input.trackingUrl}

Lary Beauty Home`;

  return {
    subject: "Rendez-vous confirmé — Lary Beauty Home",
    html: emailLayout("Rendez-vous confirmé", bodyHtml),
    text,
  };
}
