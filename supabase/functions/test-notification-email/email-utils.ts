
/**
 * Generate email HTML content for test
 */
export function generateTestEmailContent(username: string, emailAddress: string): string {
  return `
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h1 style="color: #5640AA;">Test Notification Email</h1>
      <p>Hello ${username}!</p>
      
      <div style="background-color: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p>This is a <strong>test notification email</strong> from Language Connect.</p>
        <p>If you received this email, it means that your notification email settings are working correctly.</p>
        <p>Time sent: ${new Date().toISOString()}</p>
        <p>Target email address: ${emailAddress}</p>
      </div>
      
      <p>Your notification email settings:</p>
      <ul>
        <li>Email delivery: <strong>Enabled</strong></li>
        <li>You're receiving this at: <strong>${emailAddress}</strong></li>
      </ul>
      
      <p style="margin-top: 30px; font-size: 14px; color: #777;">
        This is a test email to verify that notifications are working correctly.<br>
        これはテストメールで、通知が正しく動作していることを確認するためのものです。
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
export async function sendBrevoEmail(email: string, username: string, brevoApiKey: string) {
  if (!brevoApiKey) {
    throw new Error("BREVO_API_KEY is not set. Unable to send email.");
  }

  try {
    console.log(`Attempting to send test email to ${email} for user ${username}`);
    
    const emailData = {
      sender: {
        name: "DAP",
        email: "notifications@dapsince2025.com",
      },
      to: [{ email }],
      subject: "Test Notification - Language Connect",
      htmlContent: generateTestEmailContent(username, email),
    };
    
    console.log("Email payload prepared:", JSON.stringify(emailData));
    
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify(emailData),
    });
    
    const responseStatus = response.status;
    const responseBody = await response.text();
    
    console.log(`Brevo API response status: ${responseStatus}`);
    console.log(`Brevo API response body: ${responseBody}`);
    
    // Check if response is in expected format
    let parsedBody;
    try {
      if (responseBody) {
        parsedBody = JSON.parse(responseBody);
      }
    } catch (e) {
      console.error("Failed to parse response body:", e);
      console.log("Raw response body:", responseBody);
    }
    
    if (!response.ok) {
      throw new Error(`Failed to send email: ${responseStatus} ${responseBody}`);
    }
    
    return parsedBody || { message: "Email sent successfully but no response body" };
  } catch (error) {
    console.error("Error sending test email:", error);
    throw error;
  }
}
