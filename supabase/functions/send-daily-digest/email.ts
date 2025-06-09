
import { ActivitySummary } from "./activity.ts";

const brevoApiKey = Deno.env.get("BREVO_API_KEY") as string;

/**
 * Generate email HTML content based on activity data
 */
export function generateEmailContent(activity: ActivitySummary, appUrl = "https://dap.lovable.app/"): string {
  const newEventsText = activity.newEvents.length > 0 
    ? activity.newEvents.map(event => {
        const eventDate = new Date(event.date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        return `📅 ${eventDate} - ${event.title}`;
      }).join('<br>')
    : "No new events were added yesterday";
  
  const eventInvitation = activity.newEvents.length > 0 
    ? `
      <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #28a745;">
        <h3 style="color: #28a745; margin: 0 0 10px 0;">🎉 Join the new events!</h3>
        <p style="margin: 0; color: #2c5530;">
          New events have been added! Let's have a great time with wonderful friends.
          <br>Check them out now and don't forget to register!
        </p>
      </div>
    `
    : '';

  const instagramSection = `
    <div style="background-color: #f8f0ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6;">
      <h3 style="color: #8b5cf6; margin: 0 0 15px 0;">📸 Follow us on Instagram!</h3>
      <p style="margin: 0 0 10px 0; color: #444;">
        Don't miss out on event updates! Follow our Instagram for the latest news!<br>
        イベント情報を見逃さないように、インスタのフォローも忘れないで！
      </p>
      <p style="margin: 0; color: #8b5cf6; font-weight: bold;">
        Instagram: @creator_dap
      </p>
    </div>
  `;

  const picnicEventSection = `
    <div style="background-color: #fff8e1; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffa726;">
      <h3 style="color: #ffa726; margin: 0 0 15px 0;">🌸 Upcoming Picnic Event!</h3>
      <p style="margin: 0 0 10px 0; color: #444;">
        We're planning a picnic event on the weekend at the end of this month!<br>
        月末の土日にピクニックイベントをしようと考えています！
      </p>
      <p style="margin: 0; color: #e65100; font-weight: bold;">
        Have ideas for events? Send us a DM!<br>
        こんなイベントしたいってのがある人はDMして！
      </p>
    </div>
  `;
  
  const dailyEncouragement = `
    <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #5640AA;">
      <h3 style="color: #5640AA; margin: 0 0 15px 0;">🌟 Please check the app daily!</h3>
      <p style="margin: 0 0 10px 0; color: #444;">
        There might be new matches and messages that are not included in this digest.
        <strong>Please open the app daily to check for updates!</strong>
      </p>
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 6px; margin: 15px 0; border: 1px solid #ffeaa7;">
        <h4 style="color: #856404; margin: 0 0 10px 0;">📈 The number of users is growing!</h4>
        <p style="margin: 0; color: #856404; font-weight: bold;">
          Please actively send likes and exchange messages!<br>
          是非積極的にいいねして、メッセージを送り合ってください！<br>
          Wonderful encounters are waiting for you✨
        </p>
      </div>
    </div>
  `;

  const apologyMessage = `
    <div style="background-color: #ffeaa7; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #fdcb6e;">
      <p style="margin: 0; color: #6c5ce7; font-size: 14px;">
        <em>If this is your second notification today, we apologize for the duplicate message. We're working to improve our notification system!</em>
      </p>
    </div>
  `;
  
  return `
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h1 style="color: #5640AA;">Your Daily Activity Summary</h1>
      <p>Hello! Here's what happened in DIP yesterday:</p>
      
      <div style="background-color: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>📩 Unreplied conversations:</strong> ${activity.unreadMessages}</p>
        <p><strong>🤝 Your total current matches:</strong> ${activity.totalMatches}</p>
        <p><strong>👍 New likes received:</strong> ${activity.likesReceived}</p>
        <p><strong>💬 New messages received:</strong> ${activity.messagesReceived}</p>
        <p><strong>🎉 New events added:</strong> ${activity.newEvents.length}</p>
        ${activity.newEvents.length > 0 ? `
          <div style="margin: 15px 0; padding: 15px; background-color: white; border-radius: 5px; border: 1px solid #ddd;">
            <h4 style="margin: 0 0 10px 0; color: #5640AA;">New Events:</h4>
            <div style="font-size: 14px; line-height: 1.6;">
              ${newEventsText}
            </div>
          </div>
        ` : ''}
        <p><strong>👥 New participants in your events:</strong> ${activity.eventParticipations}</p>
        <p><strong>💬 New comments on your events:</strong> ${activity.eventComments}</p>
        <p><strong>🆕 New accounts created yesterday:</strong> ${activity.newAccounts}</p>
      </div>
      
      ${eventInvitation}
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

/**
 * Send an email using Brevo API
 */
export async function sendBrevoEmail(email: string, activity: ActivitySummary) {
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
          name: "DIP - Domestic × International Pals",
          email: "notifications@dapsince2025.com",
        },
        to: [{ email }],
        subject: "Your Daily DIP Summary",
        htmlContent: generateEmailContent(activity),
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
