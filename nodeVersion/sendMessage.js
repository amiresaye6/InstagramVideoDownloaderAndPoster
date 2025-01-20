// sendMessage.js
const axios = require('axios');
require('dotenv').config();

/**
 * Sends a message to Telegram using the bot API.
 * @param {string} message - The message to send.
 */
const sendMessage = async (message) => {
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    try {
        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        await axios.post(telegramUrl, {
            chat_id: CHAT_ID,
            text: message,
        });
        console.log('Message sent to Telegram:', message);
    } catch (error) {
        console.error('Failed to send message to Telegram:', error.message);
    }
};

module.exports = sendMessage;