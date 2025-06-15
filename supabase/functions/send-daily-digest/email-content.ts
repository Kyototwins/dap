
import { ActivitySummary } from "./activity.ts";

/**
 * Generate available events section for email
 */
export function generateAvailableEventsSection(activity: ActivitySummary, appUrl: string): string {
  const availableEventsText = activity.availableEvents.length > 0
    ? activity.availableEvents.map(event => {
        const eventDate = new Date(event.date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        const spotsLeft = event.maxParticipants - event.currentParticipants;
        return `📍 ${eventDate} - ${event.title}<br>&nbsp;&nbsp;&nbsp;&nbsp;📍 ${event.location} (${spotsLeft} spots left)`;
      }).join('<br>')
    : "No upcoming events available at the moment";

  return activity.availableEvents.length > 0
    ? `
      <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
        <h3 style="color: #2196f3; margin: 0 0 15px 0;">🎊 Events You Can Join Right Now!</h3>
        <p style="margin: 0 0 15px 0; color: #444;">
          Don't miss out on these exciting upcoming events! Join now before spots fill up:
        </p>
        <div style="font-size: 14px; line-height: 1.8; color: #333;">
          ${availableEventsText}
        </div>
        <p style="margin: 15px 0 0 0; color: #2196f3; font-weight: bold;">
          <a href="${appUrl}events" style="color: #2196f3; text-decoration: none;">👆 Click here to join these events!</a>
        </p>
      </div>
    `
    : '';
}

/**
 * Generate Instagram follow section
 */
export function generateInstagramSection(): string {
  return `
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
}

/**
 * Generate picnic event announcement section
 */
export function generatePicnicEventSection(): string {
  return `
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
}

/**
 * Generate daily encouragement section
 */
export function generateDailyEncouragementSection(): string {
  return `
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
}

/**
 * Generate apology message section
 */
export function generateApologySection(): string {
  return `
    <div style="background-color: #ffeaa7; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #fdcb6e;">
      <p style="margin: 0; color: #6c5ce7; font-size: 14px;">
        <em>If this is your second notification today, we apologize for the duplicate message. We're working to improve our notification system!</em>
      </p>
    </div>
  `;
}

/**
 * Generate activity summary section
 */
export function generateActivitySummarySection(activity: ActivitySummary): string {
  return `
    <div style="background-color: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p><strong>📩 Unreplied conversations:</strong> ${activity.unreadMessages}</p>
      <p><strong>🤝 Your total current matches:</strong> ${activity.totalMatches}</p>
      <p><strong>👍 New likes received:</strong> ${activity.likesReceived}</p>
      <p><strong>💬 New messages received:</strong> ${activity.messagesReceived}</p>
      <p><strong>👥 New participants in your events:</strong> ${activity.eventParticipations}</p>
      <p><strong>🆕 New accounts created yesterday:</strong> ${activity.newAccounts}</p>
    </div>
  `;
}
