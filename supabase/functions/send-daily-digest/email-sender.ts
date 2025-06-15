
import { ActivitySummary } from "./activity.ts";
import { generateEmailTemplate } from "./email-templates.ts";

const brevoApiKey = Deno.env.get("BREVO_API_KEY") as string;

/**
 * Send an email using Brevo API
 */
export async function sendBrevoEmail(email: string, activity: ActivitySummary, appUrl = "https://dap.lovable.app/") {
  if (!brevoApiKey) {
    throw new Error("BREVO_API_KEY is not set. Unable to send email.");
  }
  
  try {
    console.log(`Attempting to send digest email to ${email}`);
    
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        sender: {
          name: "DIP notification",
          email: "notifications@dapsince2025.com",
        },
        to: [{ email }],
        subject: "Daily DIP Notification",
        htmlContent: generateEmailTemplate(activity, appUrl),
      }),
    });
    
    const responseBody = await response.text();
    console.log(`Brevo API response status: ${response.status}`);
    console.log(`Brevo API response body: ${responseBody}`);
    
    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.status} ${responseBody}`);
    }
    
    return JSON.parse(responseBody);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
