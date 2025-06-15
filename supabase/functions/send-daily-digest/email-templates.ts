
import { ActivitySummary } from "./activity.ts";
import {
  generateAvailableEventsSection,
  generateInstagramSection,
  generatePicnicEventSection,
  generateDailyEncouragementSection,
  generateApologySection,
  generateActivitySummarySection
} from "./email-content.ts";

/**
 * Generate complete email HTML template
 */
export function generateEmailTemplate(activity: ActivitySummary, appUrl: string): string {
  const availableEventsSection = generateAvailableEventsSection(activity, appUrl);
  const instagramSection = generateInstagramSection();
  const picnicEventSection = generatePicnicEventSection();
  const dailyEncouragement = generateDailyEncouragementSection();
  const apologyMessage = generateApologySection();
  const activitySummary = generateActivitySummarySection(activity);
  
  return `
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h2 style="color: #5640AA; font-size: 18px;">Your Daily DIP Summary</h2>
      <p>Hello! Here's what happened in DIP yesterday:</p>
      
      ${activitySummary}
      ${availableEventsSection}
      ${instagramSection}
      ${picnicEventSection}
      ${dailyEncouragement}
      ${apologyMessage}
      
      <p>Stay engaged with your language exchange community!</p>
      <p><a href="${appUrl}" style="display: inline-block; background-color: #5640AA; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit DIP and connect!</a></p>
      
      <p style="margin-top: 30px; font-size: 14px; color: #777;">
        If you encounter any issues with the links, please return to the site and log in directly. The system should work for you!
      </p>
      <p style="font-size: 14px; color: #777;">
        If you continue to experience issues, please contact us via DIP Instagram DM.
      </p>
      
      <p style="font-size: 12px; color: #999; margin-top: 30px;">
        To manage your email preferences, visit your profile settings in the DIP app.
      </p>
    </body>
    </html>
  `;
}
