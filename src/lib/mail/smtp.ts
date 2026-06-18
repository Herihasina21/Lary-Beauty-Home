import nodemailer from "nodemailer";
import { getMailFrom, getMailReplyTo, isMailConfigured } from "@/lib/mail/config";

export type SendMailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendMail(input: SendMailInput): Promise<boolean> {
  if (!isMailConfigured()) {
    return false;
  }

  const host = process.env.SMTP_HOST?.trim() || "smtp.ionos.com";
  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER!.trim();
  const pass = process.env.SMTP_PASS!.trim();

  try {
    const transport = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      ...(port === 587 && !secure ? { requireTLS: true } : {}),
    });

    await transport.sendMail({
      from: getMailFrom(),
      replyTo: getMailReplyTo(),
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });

    return true;
  } catch (err) {
    console.error("[mail] Envoi impossible:", err);
    return false;
  }
}
