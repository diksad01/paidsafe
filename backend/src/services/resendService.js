import { Resend } from "resend";

let resend = null;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn("[resend] RESEND_API_KEY is not set — emails will be skipped.");
}

export const sendEmail = async (to, subject, html) => {
  if (!resend) {
    console.warn(`[resend] Skipping email to ${to}: "${subject}"`);
    return;
  }
  try {
    const { error } = await resend.emails.send({
      from: "PaidSafe <noreply@paidsafe.io>",
      to,
      subject,
      html,
    });
    if (error) {
      console.error("[resend] Failed to send email:", error);
    }
  } catch (err) {
    console.error("[resend] Exception sending email:", err.message);
  }
};
