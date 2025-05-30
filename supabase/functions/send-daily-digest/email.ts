
import { ActivitySummary } from "./activity.ts";

const brevoApiKey = Deno.env.get("BREVO_API_KEY") as string;

/**
 * Generate email HTML content based on activity data
 */
export function generateEmailContent(activity: ActivitySummary, appUrl = "https://dap.lovable.app/"): string {
  const newEventsText = activity.newEvents.length > 0 
    ? activity.newEvents.map(event => {
        const eventDate = new Date(event.date).toLocaleDateString('ja-JP', {
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        return `📅 ${eventDate} - ${event.title}`;
      }).join('<br>')
    : "昨日は新しいイベントはありませんでした";
  
  const eventInvitation = activity.newEvents.length > 0 
    ? `
      <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #28a745;">
        <h3 style="color: #28a745; margin: 0 0 10px 0;">🎉 新しいイベントに参加しませんか？</h3>
        <p style="margin: 0; color: #2c5530;">
          新しいイベントが追加されました！素晴らしい仲間と一緒に楽しい時間を過ごしましょう。
          <br>今すぐチェックして参加登録をお忘れなく！
        </p>
      </div>
    `
    : '';
  
  return `
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h1 style="color: #5640AA;">Your Daily Activity Summary</h1>
      <p>Hello! Here's what happened in Language Connect yesterday:</p>
      
      <div style="background-color: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
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
      </div>
      
      ${eventInvitation}
      
      <p>Stay engaged with your language exchange community!</p>
      <p><a href="${appUrl}" style="display: inline-block; background-color: #5640AA; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit DAP and connect!</a></p>
      
      <p style="margin-top: 30px; font-size: 14px; color: #777;">
        If you encounter any issues with the links, please return to the site and log in directly. The system should work for you!<br>
        リンクに問題がある場合は、サイトに戻ってログインしてみてください。システムは正常に動作するはずです！
      </p>
      <p style="font-size: 14px; color: #777;">
        If you continue to experience issues, please contact us via DAP Instagram DM.<br>
        問題が解決しない場合は、DAPのインスタグラムのDMでご連絡ください。
      </p>
      
      <p style="font-size: 12px; color: #999; margin-top: 30px;">
        To manage your email preferences, visit your profile settings in the Language Connect app.
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
          name: "Language Connect",
          email: "notifications@dapsince2025.com",
        },
        to: [{ email }],
        subject: "Your Daily Language Connect Summary",
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
