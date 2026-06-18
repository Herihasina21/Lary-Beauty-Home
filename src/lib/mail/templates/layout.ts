export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function emailLayout(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf7f5;font-family:Georgia,'Times New Roman',serif;color:#2d2d2d;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf7f5;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#ffffff;border:1px solid #e8d5a3;border-radius:16px;overflow:hidden;">
        <tr><td style="background:linear-gradient(135deg,#e8d5a3,#c9a96e);padding:24px;text-align:center;">
          <p style="margin:0;font-size:22px;letter-spacing:0.08em;color:#2d2d2d;">LARY BEAUTY HOME</p>
          <p style="margin:8px 0 0;font-size:13px;font-style:italic;color:#5c4a3a;">${title}</p>
        </td></tr>
        <tr><td style="padding:28px 24px;font-size:15px;line-height:1.6;">${bodyHtml}</td></tr>
        <tr><td style="padding:0 24px 24px;font-size:12px;color:#888;text-align:center;">
          Institut de beauté · La Rivière Saint Louis · La Réunion
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function emailButton(href: string, label: string): string {
  return `<p style="text-align:center;margin:28px 0;">
    <a href="${href}" style="display:inline-block;background:#c9a96e;color:#fff;text-decoration:none;padding:14px 28px;border-radius:999px;font-size:15px;font-weight:bold;">${label}</a>
  </p>`;
}
