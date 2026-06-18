export function isMailConfigured(): boolean {
  if (process.env.MAIL_ENABLED === "false") return false;
  return Boolean(process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim());
}

export function getSiteUrl(): string {
  const url = process.env.SITE_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (url) return url.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function getMailFrom(): string {
  return process.env.MAIL_FROM?.trim() || process.env.SMTP_USER?.trim() || "noreply@localhost";
}

export function getMailReplyTo(): string | undefined {
  const reply = process.env.MAIL_REPLY_TO?.trim();
  return reply || process.env.SMTP_USER?.trim() || undefined;
}

export function getOwnerEmail(): string | undefined {
  return process.env.MAIL_OWNER?.trim() || process.env.SMTP_USER?.trim() || undefined;
}
