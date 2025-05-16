
/*
 * This is a helper script that demonstrates how to send FCM notifications
 * You can run this with Node.js after replacing the values below
 */

const axios = require('axios');

// Replace these values with your own
const FCM_SERVER_KEY = 'YOUR_FCM_SERVER_KEY'; // From Firebase Console > Project Settings > Cloud Messaging
const FCM_TOKEN = 'DEVICE_TOKEN_TO_SEND_TO'; // The token received from the client

// Send notification function
async function sendNotification() {
  try {
    const response = await axios.post(
      'https://fcm.googleapis.com/fcm/send',
      {
        to: FCM_TOKEN,
        notification: {
          title: 'New Message',
          body: 'You received a new message!',
          icon: 'https://dap.lovable.app/favicon.ico',
          click_action: 'https://dap.lovable.app/messages'
        },
        data: {
          type: 'new_message',
          sender: 'user123',
          url: '/messages'
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `key=${FCM_SERVER_KEY}`
        }
      }
    );
    
    console.log('Successfully sent notification:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending notification:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Execute the function if this script is run directly
if (require.main === module) {
  sendNotification()
    .then(() => console.log('Done!'))
    .catch(err => console.error('Failed:', err));
}

module.exports = { sendNotification };

