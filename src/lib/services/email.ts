import { Resend } from "resend";
import fs from "fs";
import path from "path";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export interface EmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  from = "CutoutStuff <orders@cutoutstuff.com>",
}: EmailParams): Promise<{ id: string }> {
  const isMock = process.env.USE_LOCAL_MOCKS === "true" || !resend;

  if (isMock) {
    const emailId = `mock_email_${Math.random().toString(36).substring(2, 12)}`;
    const logEntry = {
      id: emailId,
      timestamp: new Date().toISOString(),
      to,
      from,
      subject,
      html,
    };

    console.log(`[Email Service Mock] Sending email to ${to}: ${subject}`);

    // Append to public/uploads/email_logs.json for local UI visibility
    const logDir = path.join(process.cwd(), "public", "uploads");
    const logFile = path.join(logDir, "email_logs.json");

    try {
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      let logs = [];
      if (fs.existsSync(logFile)) {
        const fileContent = fs.readFileSync(logFile, "utf-8");
        logs = JSON.parse(fileContent);
      }

      logs.unshift(logEntry); // Add to the top
      fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
    } catch (err) {
      console.error("Failed to write to mock email logs", err);
    }

    return { id: emailId };
  }

  // Real Resend integration
  const response = await resend!.emails.send({
    from,
    to,
    subject,
    html,
  });

  if (response.error) {
    throw new Error(`Resend failed: ${response.error.message}`);
  }

  return { id: response.data?.id || "" };
}
