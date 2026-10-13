import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

// ---------------------------------------------------------------------------
// 1. Singleton Transporter with Connection Pooling & Rate Limiting
// ---------------------------------------------------------------------------

declare global {
  // Prevent duplicate transporter pools during Next.js Hot Module Replacement (HMR) in dev mode
  // eslint-disable-next-line no-var
  var __nodemailerTransporter: Transporter | undefined;
}

function createTransporter(): Transporter {
  // In automated test environments, use jsonTransport to prevent network I/O
  if (env.NODE_ENV === "test") {
    return nodemailer.createTransport({
      jsonTransport: true,
    });
  }

  const isSecure = env.SMTP_SECURE || env.SMTP_PORT === 465;

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: isSecure, // true for port 465 (SSL), false for port 587 (STARTTLS)
    pool: true,       // Maintain a pooled connection
    maxConnections: 1, // Single connection for Gmail to prevent rate/concurrency flags
    maxMessages: 10,   // Recreate connection after 10 messages to avoid stale sockets
    rateLimit: 5,      // Max 5 messages per second to comply with Gmail anti-burst policy
    auth: env.SMTP_USER
      ? {
          user: env.SMTP_USER,
          pass: env.SMTP_PASSWORD,
        }
      : undefined,
    tls: {
      rejectUnauthorized: true, // Strict certificate validation
    },
  });
}

export const transporter: Transporter =
  global.__nodemailerTransporter ?? (global.__nodemailerTransporter = createTransporter());

// ---------------------------------------------------------------------------
// 2. Persian (RTL) Email Template Generator
// ---------------------------------------------------------------------------

export interface PersianEmailTemplateProps {
  title: string;
  message: string;
  actionButton?: {
    label: string;
    url: string;
  };
  recipientName?: string;
  adminResponse?: {
    title: string;
    content: string;
    type?: "success" | "danger" | "warning" | "info";
  };
}

/**
 * Generates an email-client compatible inline-styled HTML document in Persian RTL.
 */
export function renderPersianEmailTemplate({
  title,
  message,
  actionButton,
  recipientName,
  adminResponse,
}: PersianEmailTemplateProps): string {
  // Convert newlines in the message to paragraph tags safely
  const formattedMessage = message
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => `<p style="margin: 0 0 14px 0; line-height: 1.85; color: #334155;">${line}</p>`)
    .join("");

  let adminResponseHtml = "";
  if (adminResponse && adminResponse.content) {
    let borderClr = "#0f172a";
    let bgClr = "#f8fafc";
    let titleClr = "#0f172a";

    if (adminResponse.type === "success") {
      borderClr = "#10b981";
      bgClr = "#f0fdf4";
      titleClr = "#065f46";
    } else if (adminResponse.type === "danger") {
      borderClr = "#ef4444";
      bgClr = "#fef2f2";
      titleClr = "#991b1b";
    } else if (adminResponse.type === "warning") {
      borderClr = "#f59e0b";
      bgClr = "#fffbeb";
      titleClr = "#92400e";
    } else if (adminResponse.type === "info") {
      borderClr = "#3b82f6";
      bgClr = "#eff6ff";
      titleClr = "#1e40af";
    }

    adminResponseHtml = `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="
        margin: 22px 0 26px 0;
        background-color: ${bgClr};
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        border-right: 4px solid ${borderClr};
      ">
        <tr>
          <td style="padding: 18px 20px;">
            <div style="font-size: 13px; font-weight: 700; color: ${titleClr}; margin-bottom: 8px;">
              ${adminResponse.title}
            </div>
            <div style="font-size: 14px; line-height: 1.85; color: #0f172a; font-weight: 500; white-space: pre-wrap;">
              ${adminResponse.content}
            </div>
          </td>
        </tr>
      </table>
    `;
  }

  const ctaButtonHtml = actionButton
    ? `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 28px 0 20px 0;">
        <tr>
          <td align="center">
            <a href="${actionButton.url}" target="_blank" rel="noopener noreferrer" style="
              display: inline-block;
              background-color: #0f172a;
              color: #ffffff;
              font-family: Tahoma, -apple-system, 'Segoe UI', Roboto, sans-serif;
              font-size: 14px;
              font-weight: 600;
              text-decoration: none;
              padding: 12px 28px;
              border-radius: 8px;
              letter-spacing: -0.2px;
            ">
              ${actionButton.label}
            </a>
          </td>
        </tr>
      </table>
    `
    : "";

  return `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${title}</title>
  <!--[if mso]>
  <style>
    body,table,td { font-family: Tahoma, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="
  margin: 0;
  padding: 0;
  background-color: #f8fafc;
  direction: rtl;
  text-align: right;
  font-family: Tahoma, 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container (max-width: 580px) -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="
          max-width: 580px;
          background-color: #ffffff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        ">
          <!-- Header / Branding -->
          <tr>
            <td style="
              padding: 32px 36px 20px 36px;
              border-bottom: 1px solid #f1f5f9;
              background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
            ">
              <span style="
                display: inline-block;
                font-size: 20px;
                font-weight: 700;
                color: #0f172a;
                letter-spacing: -0.5px;
              ">
                دیجیونچرز
              </span>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 36px;">
              ${
                recipientName
                  ? `<p style="font-size: 15px; font-weight: 600; color: #1e293b; margin: 0 0 16px 0;">سلام ${recipientName} عزیز،</p>`
                  : ""
              }

              <h1 style="
                font-size: 18px;
                font-weight: 700;
                color: #0f172a;
                margin: 0 0 18px 0;
                line-height: 1.6;
              ">
                ${title}
              </h1>

              <div style="font-size: 14px;">
                ${formattedMessage}
              </div>

              ${adminResponseHtml}

              ${ctaButtonHtml}

              <p style="
                margin: 28px 0 0 0;
                font-size: 13px;
                color: #64748b;
                line-height: 1.7;
              ">
                با احترام،<br />
                <strong>تیم دیجیونچرز</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="
              background-color: #f8fafc;
              padding: 20px 36px;
              border-top: 1px solid #f1f5f9;
              text-align: center;
              font-size: 12px;
              color: #94a3b8;
              line-height: 1.8;
            ">
              <p style="margin: 0 0 4px 0;">
                این پیام به صورت خودکار از طرف سیستم <strong>دیجیونچرز</strong> ارسال شده است.
              </p>
              <p style="margin: 0;">
                © ${new Date().getFullYear()} دیجیونچرز. تمامی حقوق محفوظ است.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ---------------------------------------------------------------------------
// 3. High-Level Email Dispatch Function
// ---------------------------------------------------------------------------

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: SendMailOptions): Promise<{ messageId: string }> {
  // When sending via Gmail SMTP, Google strictly enforces that the 'From' address
  // matches the authenticated account (SMTP_USER). If From is a different domain (e.g. digiventures.ir),
  // recipient mail servers fail SPF/DMARC alignment and drop the email or send it to Spam.
  let from = env.SMTP_FROM || `"دیجیونچرز" <${env.SMTP_USER}>`;
  if (env.SMTP_HOST.includes("gmail") && env.SMTP_USER) {
    from = `"دیجیونچرز" <${env.SMTP_USER}>`;
  }

  // Fallback plain-text conversion if none was provided
  const plainText = text || html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text: plainText,
    html,
    replyTo: replyTo || (env.SMTP_FROM.includes("@") ? env.SMTP_FROM : undefined),
  });

  logger.info("Transactional email sent via transporter", {
    to,
    subject,
    messageId: info.messageId,
  });

  return { messageId: info.messageId || "mock_id" };
}
