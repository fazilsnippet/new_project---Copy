import axios from 'axios';

export const sendWebhookNotification = async (url, payload) => {
  try {
    await axios.post(url, payload);
  } catch (error) {
    console.error('Error sending webhook notification:', error);
  }
};