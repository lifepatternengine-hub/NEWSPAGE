import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const { email, source = "footer" } = await request.json();

    // Validate
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // ── 1. Save to Notion ────────────────────────────────────────────────────
    if (process.env.NOTION_TOKEN && process.env.NOTION_NEWSLETTER_DB_ID) {
      const notionRes = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({
          parent: { database_id: process.env.NOTION_NEWSLETTER_DB_ID },
          properties: {
            Email: { email },
            Date: { date: { start: new Date().toISOString() } },
            Source: { rich_text: [{ text: { content: source } }] },
          },
        }),
      });

      // Detect duplicate (Notion doesn't enforce uniqueness natively, but
      // you can add a Unique index via formula — for now we just log)
      if (!notionRes.ok) {
        const err = await notionRes.json();
        console.error("Notion error:", err);
        // Don't fail the whole request — still send the email
      }
    }

    // ── 2. Send confirmation email ───────────────────────────────────────────
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM ?? "The Pattern <hello@the-pattern.xyz>",
        to: email,
        subject: "You're in — The Pattern",
        html: confirmationEmail(email),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

// ── Email template ───────────────────────────────────────────────────────────
function confirmationEmail(email: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>You're in — The Pattern</title>
</head>
<body style="margin:0;padding:0;background:#faf9f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#faf9f7;padding:48px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;width:100%;">

          <!-- ── Logo bar ── -->
          <tr>
            <td style="background:#1a1510;border-radius:16px 16px 0 0;padding:28px 40px;text-align:center;">
              <span style="font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#f0ece4;letter-spacing:-0.3px;">
                The <em style="font-style:italic;color:#a885d4;">Pattern</em>
              </span>
            </td>
          </tr>

          <!-- ── Body ── -->
          <tr>
            <td style="background:#ffffff;border:1px solid #e8e3dc;border-top:none;border-radius:0 0 16px 16px;padding:40px 40px 36px;">

              <h1 style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:28px;color:#1a1510;line-height:1.25;font-weight:400;">
                You're in.
              </h1>

              <p style="margin:0 0 18px;font-size:15px;color:#6b6460;line-height:1.75;">
                Welcome to The Pattern — honest writing for professionals navigating midlife reinvention.
                No noise, no cheerleading. Just the full arc.
              </p>

              <p style="margin:0 0 32px;font-size:15px;color:#6b6460;line-height:1.75;">
                You'll hear from us weekly. In the meantime, the latest pieces are waiting for you.
              </p>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="border-radius:100px;background:#a885d4;">
                    <a href="https://the-pattern.xyz"
                       style="display:inline-block;padding:14px 30px;font-size:14px;font-weight:500;color:#ffffff;text-decoration:none;border-radius:100px;letter-spacing:0.01em;">
                      Read the latest →
                    </a>
                  </td>
                </tr>
              </table>

              <hr style="margin:36px 0;border:none;border-top:1px solid #e8e3dc;">

              <p style="margin:0;font-size:12px;color:#9b9286;line-height:1.7;">
                You subscribed with <strong style="color:#6b6460;">${email}</strong>.
                If this wasn't you, ignore this — you won't receive anything else.
              </p>
            </td>
          </tr>

          <!-- ── Footer ── -->
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#9b9286;line-height:1.8;">
                © 2026 The Pattern &nbsp;·&nbsp;
                <a href="https://the-pattern.xyz/privacy" style="color:#9b9286;text-decoration:none;">Privacy</a>
                &nbsp;·&nbsp;
                <a href="https://the-pattern.xyz" style="color:#9b9286;text-decoration:none;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
