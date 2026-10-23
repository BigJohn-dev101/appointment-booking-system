import { Resend } from "resend";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendVerificationEmail(
  to: string,
  firstName: string,
  code: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;


  if (!apiKey || !from) {
    throw new Error("Email is not configured");
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to,
    subject: "Your verification code",
    text: `Hi ${firstName}, your verification code is ${code}. It expires in 10 minutes.`,
    html: `
      <p>Hi ${escapeHtml(firstName)},</p>
      <p>Your verification code is:</p>
      <p style="font-size:28px;font-weight:bold;letter-spacing:6px;">${code}</p>
      <p>It expires in 10 minutes. If you didn't create an account, you can ignore this email.</p>
    `,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}