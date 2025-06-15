
import { ActivitySummary } from "./activity.ts";
import { generateEmailTemplate } from "./email-templates.ts";
import { sendBrevoEmail } from "./email-sender.ts";

/**
 * Generate email HTML content based on activity data
 * @deprecated Use generateEmailTemplate from email-templates.ts instead
 */
export function generateEmailContent(activity: ActivitySummary, appUrl = "https://dap.lovable.app/"): string {
  return generateEmailTemplate(activity, appUrl);
}

// Re-export the sendBrevoEmail function for backward compatibility
export { sendBrevoEmail };
